/**
 * x402 Payment Flow Integration
 * Handles the complete payment lifecycle for TaskBlitz
 */

import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import { createClient } from '@supabase/supabase-js'

export interface PaymentFlowConfig {
  network: 'mainnet-beta' | 'devnet'
  platformWallet: string
  platformFeePercentage: number
}

export class X402PaymentFlow {
  private connection: Connection
  private config: PaymentFlowConfig
  private supabase: any

  constructor(config: PaymentFlowConfig) {
    this.config = config
    
    this.connection = new Connection(
      config.network === 'mainnet-beta'
        ? process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
        : 'https://api.devnet.solana.com',
      'confirmed'
    )

    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }

  /**
   * Process task creation payment
   */
  async processTaskCreationPayment(params: {
    taskId: string
    requesterId: string
    amount: number
    signature: string
  }): Promise<boolean> {
    const { taskId, requesterId, amount, signature } = params

    try {
      // Verify transaction
      const isValid = await this.verifyTransaction(signature, amount)
      
      if (!isValid) {
        console.error('Invalid transaction:', signature)
        return false
      }

      // Record transaction in database
      await this.supabase.from('transactions').insert({
        transaction_type: 'deposit',
        from_user_id: requesterId,
        task_id: taskId,
        amount,
        currency: 'SOL',
        solana_tx_hash: signature,
        status: 'completed',
      })

      // Update task status
      await this.supabase
        .from('tasks')
        .update({ status: 'open' })
        .eq('id', taskId)

      return true
    } catch (error) {
      console.error('Payment processing error:', error)
      return false
    }
  }

  /**
   * Process worker payment on approval
   */
  async processWorkerPayment(params: {
    submissionId: string
    workerId: string
    taskId: string
    amount: number
  }): Promise<string | null> {
    const { submissionId, workerId, taskId, amount } = params

    try {
      // Get worker wallet address
      const { data: worker } = await this.supabase
        .from('users')
        .select('wallet_address')
        .eq('id', workerId)
        .single()

      if (!worker) {
        throw new Error('Worker not found')
      }

      // Calculate platform fee
      const platformFee = (amount * this.config.platformFeePercentage) / 100
      const workerPayment = amount - platformFee

      // In a real implementation, you would:
      // 1. Transfer workerPayment to worker.wallet_address
      // 2. Transfer platformFee to this.config.platformWallet
      // 3. Get transaction signature

      // For now, we'll simulate this
      const signature = `simulated_${Date.now()}_${Math.random()}`

      // Record transactions
      await this.supabase.from('transactions').insert([
        {
          transaction_type: 'payment',
          to_user_id: workerId,
          task_id: taskId,
          amount: workerPayment,
          currency: 'SOL',
          solana_tx_hash: signature,
          status: 'completed',
        },
        {
          transaction_type: 'fee',
          task_id: taskId,
          amount: platformFee,
          currency: 'SOL',
          solana_tx_hash: signature,
          status: 'completed',
        },
      ])

      // Update submission
      await this.supabase
        .from('submissions')
        .update({
          status: 'approved',
          payment_transaction_hash: signature,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', submissionId)

      // Update user stats
      await this.supabase.rpc('increment_user_earnings', {
        user_id: workerId,
        amount: workerPayment,
      })

      return signature
    } catch (error) {
      console.error('Worker payment error:', error)
      return null
    }
  }

  /**
   * Verify Solana transaction
   */
  private async verifyTransaction(
    signature: string,
    expectedAmount: number
  ): Promise<boolean> {
    try {
      const tx = await this.connection.getTransaction(signature, {
        maxSupportedTransactionVersion: 0,
      })

      if (!tx || tx.meta?.err) {
        return false
      }

      // Verify amount and recipient
      const platformPubkey = new PublicKey(this.config.platformWallet)
      const accountIndex = tx.transaction.message.staticAccountKeys.findIndex(
        (key) => key.equals(platformPubkey)
      )

      if (accountIndex === -1) {
        return false
      }

      const preBalance = tx.meta?.preBalances[accountIndex] || 0
      const postBalance = tx.meta?.postBalances[accountIndex] || 0
      const receivedAmount = (postBalance - preBalance) / 1e9

      // Allow 1% variance
      const variance = 0.01
      return Math.abs(receivedAmount - expectedAmount) <= expectedAmount * variance
    } catch (error) {
      console.error('Transaction verification error:', error)
      return false
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(signature: string): Promise<{
    status: 'pending' | 'confirmed' | 'failed'
    confirmations: number
  }> {
    try {
      const status = await this.connection.getSignatureStatus(signature)
      
      if (!status.value) {
        return { status: 'pending', confirmations: 0 }
      }

      if (status.value.err) {
        return { status: 'failed', confirmations: 0 }
      }

      return {
        status: 'confirmed',
        confirmations: status.value.confirmations || 0,
      }
    } catch (error) {
      console.error('Status check error:', error)
      return { status: 'pending', confirmations: 0 }
    }
  }

  /**
   * Refund escrow on task cancellation
   */
  async refundEscrow(params: {
    taskId: string
    requesterId: string
    amount: number
  }): Promise<string | null> {
    const { taskId, requesterId, amount } = params

    try {
      // Get requester wallet
      const { data: requester } = await this.supabase
        .from('users')
        .select('wallet_address')
        .eq('id', requesterId)
        .single()

      if (!requester) {
        throw new Error('Requester not found')
      }

      // In real implementation, transfer funds back to requester
      const signature = `refund_${Date.now()}_${Math.random()}`

      // Record refund transaction
      await this.supabase.from('transactions').insert({
        transaction_type: 'refund',
        to_user_id: requesterId,
        task_id: taskId,
        amount,
        currency: 'SOL',
        solana_tx_hash: signature,
        status: 'completed',
      })

      // Update task status
      await this.supabase
        .from('tasks')
        .update({ status: 'cancelled' })
        .eq('id', taskId)

      return signature
    } catch (error) {
      console.error('Refund error:', error)
      return null
    }
  }
}

/**
 * Create payment flow instance
 */
export function createPaymentFlow(): X402PaymentFlow {
  return new X402PaymentFlow({
    network: (process.env.NEXT_PUBLIC_SOLANA_NETWORK as any) || 'devnet',
    platformWallet: process.env.NEXT_PUBLIC_PLATFORM_WALLET || '',
    platformFeePercentage: parseFloat(process.env.NEXT_PUBLIC_PLATFORM_FEE_PERCENTAGE || '10'),
  })
}
