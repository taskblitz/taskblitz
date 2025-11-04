import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format wallet address for display
export function formatWalletAddress(address: string, chars = 4): string {
  if (!address) return ''
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

// Format currency amounts
export function formatCurrency(amount: number, currency = 'SOL'): string {
  return `${amount.toFixed(2)} ${currency}`
}

// Format time remaining
export function formatTimeRemaining(deadline: string): string {
  const now = new Date()
  const end = new Date(deadline)
  const diff = end.getTime() - now.getTime()

  if (diff <= 0) return 'Expired'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`
  
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${minutes} minute${minutes > 1 ? 's' : ''} left`
}

// Calculate platform fee
export function calculatePlatformFee(amount: number, feePercentage = 10): number {
  return (amount * feePercentage) / 100
}

// Calculate total cost for requester
export function calculateTotalCost(paymentPerTask: number, workersNeeded: number, feePercentage = 10): number {
  const workerPayments = paymentPerTask * workersNeeded
  const platformFee = calculatePlatformFee(workerPayments, feePercentage)
  return workerPayments + platformFee
}

// Validate Solana wallet address
export function isValidSolanaAddress(address: string): boolean {
  try {
    // Basic validation - Solana addresses are base58 encoded and 32-44 characters
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)
  } catch {
    return false
  }
}

// Category display names
export const TASK_CATEGORIES = {
  crypto_marketing: 'Crypto Marketing',
  content: 'Content Creation',
  data: 'Data & AI Training',
  testing: 'Testing & QA',
  ecommerce: 'E-commerce',
  other: 'Other'
} as const

// Status colors
export const STATUS_COLORS = {
  open: 'text-green-400',
  in_progress: 'text-yellow-400',
  completed: 'text-blue-400',
  expired: 'text-red-400',
  cancelled: 'text-gray-400',
  pending: 'text-yellow-400',
  approved: 'text-green-400',
  rejected: 'text-red-400'
} as const