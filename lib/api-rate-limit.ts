import { supabase } from './supabase'
import { ApiRateLimit, ApiUsage } from '@/types/advanced-features'
import crypto from 'crypto'

export async function generateApiKey(userId: string) {
  
  // Generate secure API key
  const apiKey = `tb_${crypto.randomBytes(32).toString('hex')}`
  
  const { data, error } = await supabase
    .from('api_rate_limits')
    .insert({
      user_id: userId,
      api_key: apiKey,
      requests_per_minute: 60,
      requests_per_hour: 1000,
      requests_per_day: 10000,
      is_active: true
    })
    .select()
    .single()
  
  if (error) throw error
  return data as ApiRateLimit
}

export async function getUserApiKeys(userId: string) {
  
  const { data, error } = await supabase
    .from('api_rate_limits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as ApiRateLimit[]
}

export async function revokeApiKey(apiKey: string) {
  
  const { error } = await supabase
    .from('api_rate_limits')
    .update({ is_active: false })
    .eq('api_key', apiKey)
  
  if (error) throw error
}

export async function checkRateLimit(apiKey: string): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  
  // Get rate limit config
  const { data: config, error: configError } = await supabase
    .from('api_rate_limits')
    .select('*')
    .eq('api_key', apiKey)
    .eq('is_active', true)
    .single()
  
  if (configError || !config) {
    return { allowed: false, remaining: 0, resetAt: new Date() }
  }
  
  const now = new Date()
  const oneMinuteAgo = new Date(now.getTime() - 60 * 1000)
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  
  // Count recent requests
  const { data: recentRequests, error: requestsError } = await supabase
    .from('api_usage')
    .select('created_at')
    .eq('api_key', apiKey)
    .gte('created_at', oneDayAgo.toISOString())
  
  if (requestsError) throw requestsError
  
  const minuteCount = recentRequests.filter((r: any) => new Date(r.created_at) > oneMinuteAgo).length
  const hourCount = recentRequests.filter((r: any) => new Date(r.created_at) > oneHourAgo).length
  const dayCount = recentRequests.length
  
  // Check limits
  if (minuteCount >= config.requests_per_minute) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(now.getTime() + 60 * 1000)
    }
  }
  
  if (hourCount >= config.requests_per_hour) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(now.getTime() + 60 * 60 * 1000)
    }
  }
  
  if (dayCount >= config.requests_per_day) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(now.getTime() + 24 * 60 * 60 * 1000)
    }
  }
  
  return {
    allowed: true,
    remaining: Math.min(
      config.requests_per_minute - minuteCount,
      config.requests_per_hour - hourCount,
      config.requests_per_day - dayCount
    ),
    resetAt: new Date(now.getTime() + 60 * 1000)
  }
}

export async function logApiUsage(usage: Omit<ApiUsage, 'id' | 'created_at'>) {
  
  const { error } = await supabase
    .from('api_usage')
    .insert(usage)
  
  if (error) throw error
}

export async function getApiUsageStats(userId: string, days = 7) {
  
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  const { data, error } = await supabase
    .from('api_usage')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as ApiUsage[]
}
