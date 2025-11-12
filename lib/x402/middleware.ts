/**
 * x402 Payment Middleware for TaskBlitz
 * Implements HTTP 402 Payment Required protocol
 * Based on Coinbase x402 specification
 */

import { NextRequest, NextResponse } from 'next/server'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'

export interface X402Config {
  recipientAddress: string
  endpoints: Record<string, string> // endpoint -> price mapping
  network?: 'mainnet-beta' | 'devnet'
}

export interface X402PaymentProof {
  signature: string
  amount: number
  timestamp: number
  endpoint: string
}

/**
 * x402 Middleware - Checks for payment before allowing access
 */
export function x402Middleware(config: X402Config) {
  return async (req: NextRequest) => {
    const pathname = req.nextUrl.pathname
    
    // Check if this endpoint requires payment
    const requiredPrice = config.endpoints[pathname]
    if (!requiredPrice) {
      // Endpoint doesn't require payment
      return null
    }

    // Check for x402 payment headers
    const paymentProof = req.headers.get('x-payment-proof')
    const paymentSignature = req.headers.get('x-payment-signature')
    const paymentAmount = req.headers.get('x-payment-amount')
    const paymentTimestamp = req.headers.get('x-payment-timestamp')

    if (!paymentProof || !paymentSignature || !paymentAmount || !paymentTimestamp) {
      // No payment provided, return 402
      return new NextResponse(
        JSON.stringify({
          error: 'Payment Required',
          message: 'This endpoint requires payment via x402 protocol',
          payment: {
            recipient: config.recipientAddress,
            amount: requiredPrice,
            currency: 'USDC',
            network: config.network || 'devnet',
            endpoint: pathname,
          },
          protocol: 'x402',
          documentation: 'https://x402.org',
        }),
        {
          status: 402,
          headers: {
            'Content-Type': 'application/json',
            'X-Payment-Required': 'true',
            'X-Payment-Amount': requiredPrice,
            'X-Payment-Currency': 'USDC',
            'X-Payment-Recipient': config.recipientAddress,
            'X-Payment-Network': config.network || 'devnet',
            'WWW-Authenticate': `x402 recipient="${config.recipientAddress}" amount="${requiredPrice}" currency="USDC"`,
          },
        }
      )
    }

    // Verify payment
    try {
      const isValid = await verifyPayment({
        signature: paymentSignature,
        amount: parseFloat(paymentAmount),
        timestamp: parseInt(paymentTimestamp),
        endpoint: pathname,
        recipient: config.recipientAddress,
        network: config.network || 'devnet',
      })

      if (!isValid) {
        return new NextResponse(
          JSON.stringify({
            error: 'Invalid Payment',
            message: 'Payment verification failed',
          }),
          {
            status: 402,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }

      // Payment verified, allow request to proceed
      return null
    } catch (error) {
      console.error('Payment verification error:', error)
      return new NextResponse(
        JSON.stringify({
          error: 'Payment Verification Failed',
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
        {
          status: 402,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
  }
}

/**
 * Verify Solana payment transaction
 */
async function verifyPayment(params: {
  signature: string
  amount: number
  timestamp: number
  endpoint: string
  recipient: string
  network: string
}): Promise<boolean> {
  const { signature, amount, recipient, network } = params

  // Connect to Solana
  const connection = new Connection(
    network === 'mainnet-beta'
      ? process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
      : 'https://api.devnet.solana.com'
  )

  try {
    // Get transaction details
    const tx = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    })

    if (!tx) {
      console.error('Transaction not found:', signature)
      return false
    }

    // Check if transaction was successful
    if (tx.meta?.err) {
      console.error('Transaction failed:', tx.meta.err)
      return false
    }

    // Verify recipient and amount
    // This is a simplified check - in production, you'd want more robust verification
    const recipientPubkey = new PublicKey(recipient)
    
    // Check post-balances to verify payment was received
    const accountIndex = tx.transaction.message.staticAccountKeys.findIndex(
      (key) => key.equals(recipientPubkey)
    )

    if (accountIndex === -1) {
      console.error('Recipient not found in transaction')
      return false
    }

    // Verify amount (convert from lamports to SOL/USDC)
    const preBalance = tx.meta?.preBalances[accountIndex] || 0
    const postBalance = tx.meta?.postBalances[accountIndex] || 0
    const receivedAmount = (postBalance - preBalance) / 1e9 // Convert lamports to SOL

    // Allow small variance for fees
    const expectedAmount = amount
    const variance = 0.01 // 1% variance allowed
    
    if (Math.abs(receivedAmount - expectedAmount) > expectedAmount * variance) {
      console.error('Amount mismatch:', { received: receivedAmount, expected: expectedAmount })
      return false
    }

    // Check timestamp (transaction should be recent - within 5 minutes)
    const txTimestamp = tx.blockTime || 0
    const now = Math.floor(Date.now() / 1000)
    const maxAge = 300 // 5 minutes

    if (now - txTimestamp > maxAge) {
      console.error('Transaction too old:', { txTimestamp, now, age: now - txTimestamp })
      return false
    }

    return true
  } catch (error) {
    console.error('Payment verification error:', error)
    return false
  }
}

/**
 * Helper to create x402 payment response
 */
export function createPaymentRequiredResponse(
  endpoint: string,
  amount: string,
  recipient: string,
  network: string = 'devnet'
): NextResponse {
  return new NextResponse(
    JSON.stringify({
      error: 'Payment Required',
      message: 'This endpoint requires payment via x402 protocol',
      payment: {
        recipient,
        amount,
        currency: 'USDC',
        network,
        endpoint,
      },
      protocol: 'x402',
      documentation: 'https://x402.org',
    }),
    {
      status: 402,
      headers: {
        'Content-Type': 'application/json',
        'X-Payment-Required': 'true',
        'X-Payment-Amount': amount,
        'X-Payment-Currency': 'USDC',
        'X-Payment-Recipient': recipient,
        'X-Payment-Network': network,
        'WWW-Authenticate': `x402 recipient="${recipient}" amount="${amount}" currency="USDC"`,
      },
    }
  )
}
