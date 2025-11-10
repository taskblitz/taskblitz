use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("TaskB1itzProgram11111111111111111111111111");

#[program]
pub mod taskblitz {
    use super::*;

    /// Create a new task with escrow
    pub fn create_task(
        ctx: Context<CreateTask>,
        task_id: String,
        payment_per_worker: u64,
        workers_needed: u8,
        platform_fee_bps: u16, // basis points (100 = 1%)
    ) -> Result<()> {
        let task = &mut ctx.accounts.task;
        let clock = Clock::get()?;

        // Calculate total escrow amount (payment + platform fee)
        let total_payment = payment_per_worker
            .checked_mul(workers_needed as u64)
            .ok_or(ErrorCode::Overflow)?;
        
        let platform_fee = total_payment
            .checked_mul(platform_fee_bps as u64)
            .ok_or(ErrorCode::Overflow)?
            .checked_div(10000)
            .ok_or(ErrorCode::Overflow)?;
        
        let escrow_amount = total_payment
            .checked_add(platform_fee)
            .ok_or(ErrorCode::Overflow)?;

        // Transfer SOL to escrow
        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.requester.to_account_info(),
                    to: ctx.accounts.escrow.to_account_info(),
                },
            ),
            escrow_amount,
        )?;

        // Initialize task account
        task.task_id = task_id.clone();
        task.requester = ctx.accounts.requester.key();
        task.payment_per_worker = payment_per_worker;
        task.workers_needed = workers_needed;
        task.workers_completed = 0;
        task.platform_fee_bps = platform_fee_bps;
        task.escrow_amount = escrow_amount;
        task.created_at = clock.unix_timestamp;
        task.status = TaskStatus::Active;
        task.bump = ctx.bumps.task;

        msg!("Task created: {} with escrow: {} lamports", task_id, escrow_amount);
        Ok(())
    }

    /// Submit work for a task
    pub fn submit_work(
        ctx: Context<SubmitWork>,
        submission_id: String,
    ) -> Result<()> {
        let task = &ctx.accounts.task;
        let submission = &mut ctx.accounts.submission;
        let clock = Clock::get()?;

        // Verify task is still active
        require!(task.status == TaskStatus::Active, ErrorCode::TaskNotActive);
        require!(task.workers_completed < task.workers_needed, ErrorCode::TaskFull);

        // Initialize submission
        submission.submission_id = submission_id.clone();
        submission.task = ctx.accounts.task.key();
        submission.worker = ctx.accounts.worker.key();
        submission.submitted_at = clock.unix_timestamp;
        submission.status = SubmissionStatus::Pending;
        submission.bump = ctx.bumps.submission;

        msg!("Work submitted by: {}", ctx.accounts.worker.key());
        Ok(())
    }

    /// Approve submission and release payment
    pub fn approve_submission(
        ctx: Context<ApproveSubmission>,
    ) -> Result<()> {
        let task = &mut ctx.accounts.task;
        let submission = &mut ctx.accounts.submission;
        let clock = Clock::get()?;

        // Verify requester is approving
        require!(task.requester == ctx.accounts.requester.key(), ErrorCode::Unauthorized);
        require!(submission.status == SubmissionStatus::Pending, ErrorCode::InvalidStatus);

        // Calculate payment amounts
        let worker_payment = task.payment_per_worker;
        let platform_fee = worker_payment
            .checked_mul(task.platform_fee_bps as u64)
            .ok_or(ErrorCode::Overflow)?
            .checked_div(10000)
            .ok_or(ErrorCode::Overflow)?;

        // Transfer payment to worker
        **ctx.accounts.escrow.to_account_info().try_borrow_mut_lamports()? -= worker_payment;
        **ctx.accounts.worker.to_account_info().try_borrow_mut_lamports()? += worker_payment;

        // Transfer platform fee
        **ctx.accounts.escrow.to_account_info().try_borrow_mut_lamports()? -= platform_fee;
        **ctx.accounts.platform_wallet.to_account_info().try_borrow_mut_lamports()? += platform_fee;

        // Update submission status
        submission.status = SubmissionStatus::Approved;
        submission.reviewed_at = clock.unix_timestamp;

        // Update task progress
        task.workers_completed += 1;
        if task.workers_completed >= task.workers_needed {
            task.status = TaskStatus::Completed;
        }

        msg!("Submission approved. Payment: {} lamports", worker_payment);
        Ok(())
    }

    /// Reject submission
    pub fn reject_submission(
        ctx: Context<RejectSubmission>,
    ) -> Result<()> {
        let task = &ctx.accounts.task;
        let submission = &mut ctx.accounts.submission;
        let clock = Clock::get()?;

        // Verify requester is rejecting
        require!(task.requester == ctx.accounts.requester.key(), ErrorCode::Unauthorized);
        require!(submission.status == SubmissionStatus::Pending, ErrorCode::InvalidStatus);

        // Update submission status
        submission.status = SubmissionStatus::Rejected;
        submission.reviewed_at = clock.unix_timestamp;

        msg!("Submission rejected");
        Ok(())
    }

    /// Cancel task and refund escrow
    pub fn cancel_task(
        ctx: Context<CancelTask>,
    ) -> Result<()> {
        let task = &mut ctx.accounts.task;

        // Verify requester is canceling
        require!(task.requester == ctx.accounts.requester.key(), ErrorCode::Unauthorized);
        require!(task.status == TaskStatus::Active, ErrorCode::TaskNotActive);

        // Calculate refund (escrow minus completed payments)
        let completed_payment = task.payment_per_worker
            .checked_mul(task.workers_completed as u64)
            .ok_or(ErrorCode::Overflow)?;
        
        let completed_fees = completed_payment
            .checked_mul(task.platform_fee_bps as u64)
            .ok_or(ErrorCode::Overflow)?
            .checked_div(10000)
            .ok_or(ErrorCode::Overflow)?;
        
        let refund_amount = task.escrow_amount
            .checked_sub(completed_payment)
            .ok_or(ErrorCode::Overflow)?
            .checked_sub(completed_fees)
            .ok_or(ErrorCode::Overflow)?;

        // Refund remaining escrow to requester
        **ctx.accounts.escrow.to_account_info().try_borrow_mut_lamports()? -= refund_amount;
        **ctx.accounts.requester.to_account_info().try_borrow_mut_lamports()? += refund_amount;

        // Update task status
        task.status = TaskStatus::Cancelled;

        msg!("Task cancelled. Refund: {} lamports", refund_amount);
        Ok(())
    }
}

// Account Structures
#[derive(Accounts)]
#[instruction(task_id: String)]
pub struct CreateTask<'info> {
    #[account(
        init,
        payer = requester,
        space = 8 + Task::INIT_SPACE,
        seeds = [b"task", task_id.as_bytes()],
        bump
    )]
    pub task: Account<'info, Task>,
    
    #[account(
        mut,
        seeds = [b"escrow", task.key().as_ref()],
        bump
    )]
    /// CHECK: Escrow PDA
    pub escrow: AccountInfo<'info>,
    
    #[account(mut)]
    pub requester: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(submission_id: String)]
pub struct SubmitWork<'info> {
    #[account(
        init,
        payer = worker,
        space = 8 + Submission::INIT_SPACE,
        seeds = [b"submission", submission_id.as_bytes()],
        bump
    )]
    pub submission: Account<'info, Submission>,
    
    #[account(mut)]
    pub task: Account<'info, Task>,
    
    #[account(mut)]
    pub worker: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ApproveSubmission<'info> {
    #[account(mut)]
    pub task: Account<'info, Task>,
    
    #[account(mut)]
    pub submission: Account<'info, Submission>,
    
    #[account(
        mut,
        seeds = [b"escrow", task.key().as_ref()],
        bump
    )]
    /// CHECK: Escrow PDA
    pub escrow: AccountInfo<'info>,
    
    #[account(mut)]
    pub requester: Signer<'info>,
    
    /// CHECK: Worker receiving payment
    #[account(mut)]
    pub worker: AccountInfo<'info>,
    
    /// CHECK: Platform wallet receiving fees
    #[account(mut)]
    pub platform_wallet: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct RejectSubmission<'info> {
    #[account(mut)]
    pub task: Account<'info, Task>,
    
    #[account(mut)]
    pub submission: Account<'info, Submission>,
    
    pub requester: Signer<'info>,
}

#[derive(Accounts)]
pub struct CancelTask<'info> {
    #[account(mut)]
    pub task: Account<'info, Task>,
    
    #[account(
        mut,
        seeds = [b"escrow", task.key().as_ref()],
        bump
    )]
    /// CHECK: Escrow PDA
    pub escrow: AccountInfo<'info>,
    
    #[account(mut)]
    pub requester: Signer<'info>,
}

// Data Structures
#[account]
#[derive(InitSpace)]
pub struct Task {
    #[max_len(50)]
    pub task_id: String,
    pub requester: Pubkey,
    pub payment_per_worker: u64,
    pub workers_needed: u8,
    pub workers_completed: u8,
    pub platform_fee_bps: u16,
    pub escrow_amount: u64,
    pub created_at: i64,
    pub status: TaskStatus,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Submission {
    #[max_len(50)]
    pub submission_id: String,
    pub task: Pubkey,
    pub worker: Pubkey,
    pub submitted_at: i64,
    pub reviewed_at: i64,
    pub status: SubmissionStatus,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum TaskStatus {
    Active,
    Completed,
    Cancelled,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum SubmissionStatus {
    Pending,
    Approved,
    Rejected,
}

// Error Codes
#[error_code]
pub enum ErrorCode {
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Task is not active")]
    TaskNotActive,
    #[msg("Task is full")]
    TaskFull,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Invalid status")]
    InvalidStatus,
}