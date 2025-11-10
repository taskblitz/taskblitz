import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { WalletContextState } from '@solana/wallet-adapter-react'

// Program ID from deployment
const PROGRAM_ID_STRING = process.env.NEXT_PUBLIC_PROGRAM_ID || 'TaskB1itzProgram11111111111111111111111111'
export const PROGRAM_ID = new PublicKey(PROGRAM_ID_STRING)

// Platform wallet (for now, use the same as program ID - update this later with your actual wallet)
export const PLATFORM_WALLET = new PublicKey(PROGRAM_ID_STRING)

// Network configuration
const NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'
const RPC_ENDPOINT = NETWORK === 'mainnet-beta' 
  ? 'https://api.mainnet-beta.solana.com'
  : 'https://api.devnet.solana.com'

export const connection = new Connection(RPC_ENDPOINT, 'confirmed')

// Convert USD to SOL (simplified - in production, use oracle)
export function usdToLamports(usd: number): number {
  const SOL_PRICE_USD = 150 // Hardcoded for now
  const sol = usd / SOL_PRICE_USD
  return Math.floor(sol * LAMPORTS_PER_SOL)
}

// Convert lamports to USD
export function lamportsToUsd(lamports: number): number {
  const SOL_PRICE_USD = 150
  const sol = lamports / LAMPORTS_PER_SOL
  return sol * SOL_PRICE_USD
}

// Get task PDA
export function getTaskPDA(taskId: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('task'), Buffer.from(taskId)],
    PROGRAM_ID
  )
}

// Get escrow PDA
export function getEscrowPDA(taskPubkey: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('escrow'), taskPubkey.toBuffer()],
    PROGRAM_ID
  )
}

// Get submission PDA
export function getSubmissionPDA(submissionId: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('submission'), Buffer.from(submissionId)],
    PROGRAM_ID
  )
}

// Create task on-chain
export async function createTaskOnChain(
  wallet: WalletContextState,
  taskId: string,
  paymentPerWorker: number, // in USD
  workersNeeded: number
): Promise<string> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected')
  }

  const paymentLamports = usdToLamports(paymentPerWorker)
  const platformFeeBps = 1000 // 10%

  // Calculate total escrow amount
  const totalPayment = paymentLamports * workersNeeded
  const platformFee = Math.floor((totalPayment * platformFeeBps) / 10000)
  const escrowAmount = totalPayment + platformFee

  console.log('Creating task on-chain:', {
    taskId,
    paymentPerWorker: paymentLamports,
    workersNeeded,
    totalPayment,
    platformFee,
    escrowAmount,
    requester: wallet.publicKey.toString()
  })

  // For MVP: Transfer to platform wallet as escrow
  // In production: This would call the Anchor program to create task PDA and escrow
  const transaction = new Transaction()

  // Transfer funds to platform wallet (acting as escrow for now)
  const transferIx = SystemProgram.transfer({
    fromPubkey: wallet.publicKey,
    toPubkey: PLATFORM_WALLET,
    lamports: escrowAmount,
  })

  transaction.add(transferIx)
  transaction.feePayer = wallet.publicKey
  
  // Get recent blockhash
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed')
  transaction.recentBlockhash = blockhash

  // Sign and send transaction
  const signed = await wallet.signTransaction(transaction)
  const signature = await connection.sendRawTransaction(signed.serialize())
  
  // Confirm transaction
  await connection.confirmTransaction({
    signature,
    blockhash,
    lastValidBlockHeight
  }, 'confirmed')

  console.log('✅ Task created! Funds locked. TX:', signature)
  return signature
}

// Approve submission and release payment
export async function approveSubmissionOnChain(
  wallet: WalletContextState,
  taskId: string,
  submissionId: string,
  workerPubkey: PublicKey,
  paymentAmount: number // in lamports
): Promise<string> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected')
  }

  console.log('Approving submission on-chain:', {
    taskId,
    submissionId,
    worker: workerPubkey.toString(),
    paymentAmount,
    requester: wallet.publicKey.toString()
  })

  // For MVP: Requester pays worker directly
  // In production: This would call Anchor program to release from escrow
  const transaction = new Transaction()

  // Transfer payment to worker
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: workerPubkey,
      lamports: paymentAmount,
    })
  )

  transaction.feePayer = wallet.publicKey
  
  // Get recent blockhash
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed')
  transaction.recentBlockhash = blockhash

  // Sign and send
  const signed = await wallet.signTransaction(transaction)
  const signature = await connection.sendRawTransaction(signed.serialize())
  
  // Confirm
  await connection.confirmTransaction({
    signature,
    blockhash,
    lastValidBlockHeight
  }, 'confirmed')

  console.log('✅ Payment sent to worker! TX:', signature)
  return signature
}

// Get task account data
export async function getTaskAccount(taskId: string) {
  const [taskPDA] = getTaskPDA(taskId)
  
  try {
    const accountInfo = await connection.getAccountInfo(taskPDA)
    if (!accountInfo) return null
    
    // Parse account data (simplified)
    return {
      address: taskPDA.toString(),
      lamports: accountInfo.lamports,
      // In production, deserialize full account data
    }
  } catch (error) {
    console.error('Error fetching task account:', error)
    return null
  }
}