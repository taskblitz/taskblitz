import { supabase } from './supabase'

export interface PlatformSettings {
  platformWallet: string
  platformFeePercentage: number
  minimumTaskPayment: number
}

/**
 * Get platform settings from database
 * Falls back to environment variables if database is unavailable
 */
export async function getPlatformSettings(): Promise<PlatformSettings> {
  try {
    const { data, error } = await supabase
      .from('platform_settings')
      .select('setting_key, setting_value')

    if (error) throw error

    const settings: any = {}
    data?.forEach(item => {
      settings[item.setting_key] = item.setting_value
    })

    return {
      platformWallet: settings.platform_wallet_address || process.env.NEXT_PUBLIC_PLATFORM_WALLET || '',
      platformFeePercentage: parseFloat(settings.platform_fee_percentage || process.env.NEXT_PUBLIC_PLATFORM_FEE_PERCENTAGE || '10'),
      minimumTaskPayment: parseFloat(settings.minimum_task_payment || process.env.NEXT_PUBLIC_MIN_TASK_PAYMENT || '0.10')
    }
  } catch (error) {
    console.error('Error fetching platform settings:', error)
    
    // Fallback to environment variables
    return {
      platformWallet: process.env.NEXT_PUBLIC_PLATFORM_WALLET || '',
      platformFeePercentage: parseFloat(process.env.NEXT_PUBLIC_PLATFORM_FEE_PERCENTAGE || '10'),
      minimumTaskPayment: parseFloat(process.env.NEXT_PUBLIC_MIN_TASK_PAYMENT || '0.10')
    }
  }
}

/**
 * Get platform wallet address
 */
export async function getPlatformWallet(): Promise<string> {
  const settings = await getPlatformSettings()
  return settings.platformWallet
}

/**
 * Get platform fee percentage
 */
export async function getPlatformFeePercentage(): Promise<number> {
  const settings = await getPlatformSettings()
  return settings.platformFeePercentage
}

/**
 * Calculate platform fee for a given amount
 */
export function calculatePlatformFee(amount: number, feePercentage: number): number {
  return (amount * feePercentage) / 100
}

/**
 * Calculate total cost including platform fee
 */
export function calculateTotalWithFee(amount: number, feePercentage: number): number {
  return amount + calculatePlatformFee(amount, feePercentage)
}
