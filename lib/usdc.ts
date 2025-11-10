import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js'
import { 
  TOKEN_PROGRAM_ID, 
  getAssociatedTokenAddress, 
  createAssociatedTokenAccountInstruction,
  createTransferInstruction
} from '@solana/spl-token'
import { WalletContextState } from '@solana/wallet-adapter-react'

// USDC Mint Addresses
export const USDC_MINT_DEVNET = new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr') // Devnet USDC
export const USDC_MINT_MAINNET = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v') // Mainnet USDC

// Get USDC mint based on network
export function getUSDCMint(): PublicKey {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'
  return network === 'mainnet-beta' ? USDC_MINT_MAINNET : USDC_MINT_DEVNET
}

// USDC has 6 decimals
export const USDC_DECIMALS = 6

// Convert USD to USDC (1:1 ratio, but with 6 decimals)
export function usdToUSDC(usd: number): number {
  return Math.floor(usd * Math.pow(10, USDC_DECIMALS))
}

// Convert USDC to USD
export function usdcToUSD(usdc: number): number {
  return usdc / Math.pow(10, USDC_DECIMALS)
}

// Get or create associated token account
export async function getOrCreateAssociatedTokenAccount(
  connection: Connection,
  payer: PublicKey,
  mint: PublicKey,
  owner: PublicKey
): Promise<PublicKey> {
  const associatedToken = await getAssociatedTokenAddress(
    mint,
    owner,
    false,
    TOKEN_PROGRAM_ID
  )

  // Check if account exists
  const accountInfo = await connection.getAccountInfo(associatedToken)
  
  if (!accountInfo) {
    // Account doesn't exist, we'll need to create it
    console.log('Associated token account needs to be created:', associatedToken.toString())
  }

  return associatedToken
}

// Transfer USDC
export async function transferUSDC(
  wallet: WalletContextState,
  connection: Connection,
  toAddress: PublicKey,
  amount: number // in USDC (with decimals)
): Promise<string> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected')
  }

  const usdcMint = getUSDCMint()
  
  // Get sender's token account
  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    wallet.publicKey,
    usdcMint,
    wallet.publicKey
  )

  // Get receiver's token account
  const toTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    wallet.publicKey,
    usdcMint,
    toAddress
  )

  const transaction = new Transaction()

  // Check if receiver's token account exists, if not create it
  const toAccountInfo = await connection.getAccountInfo(toTokenAccount)
  if (!toAccountInfo) {
    transaction.add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey, // payer
        toTokenAccount, // associated token account
        toAddress, // owner
        usdcMint, // mint
        TOKEN_PROGRAM_ID
      )
    )
  }

  // Add transfer instruction
  transaction.add(
    createTransferInstruction(
      fromTokenAccount,
      toTokenAccount,
      wallet.publicKey,
      amount,
      [],
      TOKEN_PROGRAM_ID
    )
  )

  transaction.feePayer = wallet.publicKey
  const { blockhash } = await connection.getLatestBlockhash()
  transaction.recentBlockhash = blockhash

  // Sign and send
  const signed = await wallet.signTransaction(transaction)
  const signature = await connection.sendRawTransaction(signed.serialize())
  
  // Confirm
  await connection.confirmTransaction(signature)

  console.log('✅ USDC transfer complete! TX:', signature)
  return signature
}

// Get USDC balance
export async function getUSDCBalance(
  connection: Connection,
  walletAddress: PublicKey
): Promise<number> {
  try {
    const usdcMint = getUSDCMint()
    const tokenAccount = await getAssociatedTokenAddress(
      usdcMint,
      walletAddress,
      false,
      TOKEN_PROGRAM_ID
    )

    const accountInfo = await connection.getAccountInfo(tokenAccount)
    if (!accountInfo) {
      return 0
    }

    // Parse token account data
    const data = Buffer.from(accountInfo.data)
    const amount = data.readBigUInt64LE(64) // Amount is at offset 64

    return Number(amount)
  } catch (error) {
    console.error('Error getting USDC balance:', error)
    return 0
  }
}

// Check if user has USDC account
export async function hasUSDCAccount(
  connection: Connection,
  walletAddress: PublicKey
): Promise<boolean> {
  try {
    const usdcMint = getUSDCMint()
    const tokenAccount = await getAssociatedTokenAddress(
      usdcMint,
      walletAddress,
      false,
      TOKEN_PROGRAM_ID
    )

    const accountInfo = await connection.getAccountInfo(tokenAccount)
    return accountInfo !== null
  } catch (error) {
    return false
  }
}
