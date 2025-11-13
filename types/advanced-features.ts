export interface TaskTemplate {
  id: string
  user_id: string
  name: string
  description: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  reward_amount: number
  estimated_time: number
  requirements: string
  deliverables: string
  is_public: boolean
  use_count: number
  created_at: string
  updated_at: string
}

export interface BulkTaskJob {
  id: string
  user_id: string
  file_url: string
  total_tasks: number
  processed_tasks: number
  successful_tasks: number
  failed_tasks: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error_log: Array<{ row: number; error: string }>
  created_at: string
  completed_at?: string
}

export interface Webhook {
  id: string
  user_id: string
  name: string
  url: string
  secret_key: string
  events: string[]
  is_active: boolean
  retry_count: number
  timeout_seconds: number
  created_at: string
  last_triggered_at?: string
}

export interface WebhookDelivery {
  id: string
  webhook_id: string
  event_type: string
  payload: any
  response_status?: number
  response_body?: string
  attempt_number: number
  delivered_at: string
  success: boolean
}

export interface ApiRateLimit {
  id: string
  user_id: string
  api_key: string
  requests_per_minute: number
  requests_per_hour: number
  requests_per_day: number
  is_active: boolean
  created_at: string
}

export interface ApiUsage {
  id: string
  user_id: string
  api_key: string
  endpoint: string
  method: string
  status_code?: number
  response_time_ms?: number
  ip_address?: string
  created_at: string
}

export interface AnalyticsData {
  earnings_trend: {
    date: string
    amount: number
    task_count: number
  }[]
  task_performance: {
    category: string
    completed: number
    avg_time: number
    avg_reward: number
  }[]
  peak_hours: {
    hour: number
    earnings: number
    tasks: number
  }[]
  skill_analysis: {
    category: string
    success_rate: number
    avg_rating: number
    potential_earnings: number
  }[]
}
