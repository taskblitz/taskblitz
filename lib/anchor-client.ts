import { AnchorProvider, Program, BN, Idl } from '@coral-xyz/anchor'
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js'
import { WalletContextState } from '@solana/wallet-adapter-react'
import idlJson from './idl/taskblitz.json'

// Cast IDL to proper type (bypass strict typing for now)
const idl = idlJson as unknown as Idl

// Type for our program
export type TaskBlitzProgram = Program<Idl>

// Network configuration
const NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'
const RPC_ENDPOINT = NETWORK === 'mainnet-beta' 
  ? 'https://api.mainnet-beta.solana.com'
  : 'https://api.devnet.solana.com'

export const connection = new Connection(RPC_ENDPOINT, 'confirmed')

// Program ID
const PROGRAM_ID_STRING = process.env.NEXT_PUBLIC_PROGRAM_ID || '11111111111111111111111111111111'
export const PROGRAM_ID = new PublicKey(PROGRAM_ID_STRING)

// Platform wallet - TODO: Update with actual platform wallet
export const PLATFORM_WALLET = new PublicKey(PROGRAM_ID_STRING)

// Get Anchor provider
export function getProvider(wallet: WalletContextState): AnchorProvider {
  if (!wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) {
    throw new Error('Wallet not connected')
  }

  return new AnchorProvider(
    connection,
    wallet as any,
    { commitment: 'confirmed' }
  )
}

// Get program instance
export function getProgram(wallet: WalletContextState): TaskBlitzProgram {
  const provider = getProvider(wallet)
  return new Program(idl, provider)
}

// Derive task PDA
export function getTaskPDA(taskId: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('task'), Buffer.from(taskId)],
    PROGRAM_ID
  )
}

// Derive escrow PDA
export function getEscrowPDA(taskPubkey: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('escrow'), taskPubkey.toBuffer()],
    PROGRAM_ID
  )
}

// Derive submission PDA
export function getSubmissionPDA(submissionId: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('submission'), Buffer.from(submissionId)],
    PROGRAM_ID
  )
}

// Convert USD to lamports (simplified)
export function usdToLamports(usd: number): number {
  const SOL_PRICE_USD = 150 // Hardcoded for now
  const sol = usd / SOL_PRICE_USD
  return Math.floor(sol * 1_000_000_000) // LAMPORTS_PER_SOL
}

// Convert lamports to USD
export function lamportsToUsd(lamports: number): number {
  const SOL_PRICE_USD = 150
  const sol = lamports / 1_000_000_000
  return sol * SOL_PRICE_USD
}

// Create task with escrow
export async function createTaskWithEscrow(
  wallet: WalletContextState,
  taskId: string,
  paymentPerWorker: number, // in USD
  workersNeeded: number
): Promise<string> {
  const program = getProgram(wallet)
  
  const paymentLamports = usdToLamports(paymentPerWorker)
  const platformFeeBps = 1000 // 10%

  const [taskPDA] = getTaskPDA(taskId)
  const [escrowPDA] = getEscrowPDA(taskPDA)

  console.log('Creating task with escrow:', {
    taskId,
    taskPDA: taskPDA.toString(),
    escrowPDA: escrowPDA.toString(),
    paymentLamports,
    workersNeeded
  })

  // Call the create_task instruction
  const tx = await program.methods
    .createTask(
      taskId,
      new BN(paymentLamports),
      workersNeeded,
      platformFeeBps
    )
    .accounts({
      task: taskPDA,
      escrow: escrowPDA,
      requester: wallet.publicKey!,
      systemProgram: SystemProgram.programId,
    })
    .rpc()

  console.log('✅ Task created with escrow! TX:', tx)
  return tx
}

// Approve submission and release payment
export async function approveSubmissionWithEscrow(
  wallet: WalletContextState,
  taskId: string,
  submissionId: string,
  workerPubkey: PublicKey
): Promise<string> {
  const program = getProgram(wallet)

  const [taskPDA] = getTaskPDA(taskId)
  const [escrowPDA] = getEscrowPDA(taskPDA)
  const [submissionPDA] = getSubmissionPDA(submissionId)

  console.log('Approving submission with escrow release:', {
    taskPDA: taskPDA.toString(),
    submissionPDA: submissionPDA.toString(),
    escrowPDA: escrowPDA.toString(),
    worker: workerPubkey.toString()
  })

  // Call the approve_submission instruction
  const tx = await program.methods
    .approveSubmission()
    .accounts({
      task: taskPDA,
      submission: submissionPDA,
      escrow: escrowPDA,
      requester: wallet.publicKey!,
      worker: workerPubkey,
      platformWallet: PLATFORM_WALLET,
    })
    .rpc()

  console.log('✅ Submission approved! Payment released from escrow. TX:', tx)
  return tx
}

// Submit work
export async function submitWorkOnChain(
  wallet: WalletContextState,
  taskId: string,
  submissionId: string
): Promise<string> {
  const program = getProgram(wallet)

  const [taskPDA] = getTaskPDA(taskId)
  const [submissionPDA] = getSubmissionPDA(submissionId)

  console.log('Submitting work on-chain:', {
    taskPDA: taskPDA.toString(),
    submissionPDA: submissionPDA.toString(),
    worker: wallet.publicKey!.toString()
  })

  const tx = await program.methods
    .submitWork(submissionId)
    .accounts({
      submission: submissionPDA,
      task: taskPDA,
      worker: wallet.publicKey!,
      systemProgram: SystemProgram.programId,
    })
    .rpc()

  console.log('✅ Work submitted on-chain! TX:', tx)
  return tx
}

// Cancel task and refund
export async function cancelTaskWithRefund(
  wallet: WalletContextState,
  taskId: string
): Promise<string> {
  const program = getProgram(wallet)

  const [taskPDA] = getTaskPDA(taskId)
  const [escrowPDA] = getEscrowPDA(taskPDA)

  console.log('Cancelling task with refund:', {
    taskPDA: taskPDA.toString(),
    escrowPDA: escrowPDA.toString()
  })

  const tx = await program.methods
    .cancelTask()
    .accounts({
      task: taskPDA,
      escrow: escrowPDA,
      requester: wallet.publicKey!,
    })
    .rpc()

  console.log('✅ Task cancelled! Refund processed. TX:', tx)
  return tx
}

// Reject submission
export async function rejectSubmissionOnChain(
  wallet: WalletContextState,
  taskId: string,
  submissionId: string
): Promise<string> {
  const program = getProgram(wallet)

  const [taskPDA] = getTaskPDA(taskId)
  const [submissionPDA] = getSubmissionPDA(submissionId)

  const tx = await program.methods
    .rejectSubmission()
    .accounts({
      task: taskPDA,
      submission: submissionPDA,
      requester: wallet.publicKey!,
    })
    .rpc()

  console.log('✅ Submission rejected. TX:', tx)
  return tx
}

// Get task account data
export async function getTaskAccount(taskId: string) {
  try {
    const [taskPDA] = getTaskPDA(taskId)
    const accountInfo = await connection.getAccountInfo(taskPDA)
    
    if (!accountInfo) return null
    
    return {
      address: taskPDA.toString(),
      lamports: accountInfo.lamports,
      data: accountInfo.data
    }
  } catch (error) {
    console.error('Error fetching task account:', error)
    return null
  }
}
