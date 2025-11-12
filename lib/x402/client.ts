/**
 * x402 Client for AI Agents
 * Enables programmatic payments for API access
 */

import { Connection, Keypair, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js'
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token'

export interface X402ClientConfig {
  privateKey: string // Base58 encoded private key
  network?: 'mainnet-beta' | 'devnet'
  rpcUrl?: string
}

export interface X402PaymentRequest {
  recipient: string
  amount: string
  currency: string
  network: string
  endpoint: string
}

export class X402Client {
  private keypair: Keypair
  private connection: Connection
  private network: string

  constructor(config: X402ClientConfig) {
    // Parse private key
    this.keypair = Keypair.fromSecretKey(
      Buffer.from(config.privateKey, 'base64')
    )

    this.network = config.network || 'devnet'
    
    // Setup connection
    const rpcUrl = config.rpcUrl || (
      this.network === 'mainnet-beta'
        ? 'https://api.mainnet-beta.solana.com'
        : 'https://api.devnet.solana.com'
    )
    
    this.connection = new Connection(rpcUrl, 'confirmed')
  }

  /**
   * Make a paid API request
   */
  async request(url: string, options: RequestInit = {}): Promise<Response> {
    // First, try the request without payment
    const initialResponse = await fetch(url, options)

    // If 402, extract payment info and pay
    if (initialResponse.status === 402) {
      const paymentInfo = await initialResponse.json()
      
      if (!paymentInfo.payment) {
        throw new Error('Invalid 402 response: missing payment info')
      }

      // Make payment
      const signature = await this.pay(paymentInfo.payment)

      // Retry request with payment proof
      const paidResponse = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'X-Payment-Signature': signature,
          'X-Payment-Amount': paymentInfo.payment.amount,
          'X-Payment-Timestamp': Math.floor(Date.now() / 1000).toString(),
          'X-Payment-Proof': 'solana',
        },
      })

      return paidResponse
    }

    return initialResponse
  }

  /**
   * Make a payment
   */
  async pay(paymentRequest: X402PaymentRequest): Promise<string> {
    const { recipient, amount, currency } = paymentRequest

    if (currency === 'SOL') {
      return this.paySOL(recipient, parseFloat(amount))
    } else if (currency === 'USDC') {
      return this.payUSDC(recipient, parseFloat(amount))
    } else {
      throw new Error(`Unsupported currency: ${currency}`)
    }
  }

  /**
   * Pay with SOL
   */
  private async paySOL(recipient: string, amount: number): Promise<string> {
    const recipientPubkey = new PublicKey(recipient)
    const lamports = Math.floor(amount * 1e9) // Convert SOL to lamports

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: this.keypair.publicKey,
        toPubkey: recipientPubkey,
        lamports,
      })
    )

    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [this.keypair]
    )

    return signature
  }

  /**
   * Pay with USDC
   */
  private async payUSDC(recipient: string, amount: number): Promise<string> {
    const recipientPubkey = new PublicKey(recipient)
    
    // USDC mint address (devnet)
    const usdcMint = new PublicKey(
      this.network === 'mainnet-beta'
        ? 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' // Mainnet USDC
        : 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr' // Devnet USDC
    )

    // Get token accounts
    const fromTokenAccount = await getAssociatedTokenAddress(
      usdcMint,
      this.keypair.publicKey
    )

    const toTokenAccount = await getAssociatedTokenAddress(
      usdcMint,
      recipientPubkey
    )

    // Convert amount to token units (USDC has 6 decimals)
    const tokenAmount = Math.floor(amount * 1e6)

    const transaction = new Transaction().add(
      createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        this.keypair.publicKey,
        tokenAmount,
        [],
        TOKEN_PROGRAM_ID
      )
    )

    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [this.keypair]
    )

    return signature
  }

  /**
   * Get wallet address
   */
  getAddress(): string {
    return this.keypair.publicKey.toBase58()
  }

  /**
   * Get balance
   */
  async getBalance(): Promise<number> {
    const balance = await this.connection.getBalance(this.keypair.publicKey)
    return balance / 1e9 // Convert lamports to SOL
  }
}

/**
 * Helper function to create x402 client from environment
 */
export function createX402Client(privateKey?: string): X402Client {
  const key = privateKey || process.env.X402_PRIVATE_KEY
  
  if (!key) {
    throw new Error('X402_PRIVATE_KEY not found in environment')
  }

  return new X402Client({
    privateKey: key,
    network: (process.env.NEXT_PUBLIC_SOLANA_NETWORK as any) || 'devnet',
  })
}
