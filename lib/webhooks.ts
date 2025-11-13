import { supabase } from './supabase'
import { Webhook, WebhookDelivery } from '@/types/advanced-features'
import crypto from 'crypto'

export async function createWebhook(webhook: Omit<Webhook, 'id' | 'created_at' | 'last_triggered_at' | 'secret_key'>) {
  
  // Generate secret key for HMAC
  const secretKey = crypto.randomBytes(32).toString('hex')
  
  const { data, error } = await supabase
    .from('webhooks')
    .insert({
      ...webhook,
      secret_key: secretKey
    })
    .select()
    .single()
  
  if (error) throw error
  return data as Webhook
}

export async function getUserWebhooks(userId: string) {
  
  const { data, error } = await supabase
    .from('webhooks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as Webhook[]
}

export async function updateWebhook(id: string, updates: Partial<Webhook>) {
  
  const { data, error } = await supabase
    .from('webhooks')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteWebhook(id: string) {
  
  const { error } = await supabase
    .from('webhooks')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export async function triggerWebhook(webhookId: string, eventType: string, payload: any) {
  
  // Get webhook details
  const { data: webhook, error: webhookError } = await supabase
    .from('webhooks')
    .select('*')
    .eq('id', webhookId)
    .single()
  
  if (webhookError || !webhook || !webhook.is_active) return
  
  // Check if event is subscribed
  if (!webhook.events.includes(eventType)) return
  
  // Create HMAC signature
  const signature = crypto
    .createHmac('sha256', webhook.secret_key)
    .update(JSON.stringify(payload))
    .digest('hex')
  
  let attempt = 0
  let success = false
  let responseStatus: number | undefined
  let responseBody: string | undefined
  
  // Retry logic
  while (attempt < webhook.retry_count && !success) {
    attempt++
    
    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-TaskBlitz-Signature': signature,
          'X-TaskBlitz-Event': eventType
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(webhook.timeout_seconds * 1000)
      })
      
      responseStatus = response.status
      responseBody = await response.text()
      success = response.ok
      
    } catch (error: any) {
      responseBody = error.message
    }
    
    // Log delivery attempt
    await supabase
      .from('webhook_deliveries')
      .insert({
        webhook_id: webhookId,
        event_type: eventType,
        payload,
        response_status: responseStatus,
        response_body: responseBody,
        attempt_number: attempt,
        success
      })
    
    if (!success && attempt < webhook.retry_count) {
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    }
  }
  
  // Update last triggered time
  await supabase
    .from('webhooks')
    .update({ last_triggered_at: new Date().toISOString() })
    .eq('id', webhookId)
}

export async function getWebhookDeliveries(webhookId: string, limit = 50) {
  
  const { data, error } = await supabase
    .from('webhook_deliveries')
    .select('*')
    .eq('webhook_id', webhookId)
    .order('delivered_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data as WebhookDelivery[]
}
