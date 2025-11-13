-- Task Templates System

-- Task templates table
CREATE TABLE IF NOT EXISTS task_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  reward_amount DECIMAL(10, 2) NOT NULL,
  estimated_time INTEGER, -- in minutes
  requirements TEXT,
  deliverables TEXT,
  is_public BOOLEAN DEFAULT false, -- Allow sharing templates with community
  use_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bulk task creation jobs
CREATE TABLE IF NOT EXISTS bulk_task_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL, -- CSV file location
  total_tasks INTEGER NOT NULL,
  processed_tasks INTEGER DEFAULT 0,
  successful_tasks INTEGER DEFAULT 0,
  failed_tasks INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_log JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Webhooks configuration
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  secret_key TEXT NOT NULL, -- For HMAC signature verification
  events TEXT[] NOT NULL, -- ['task.completed', 'task.created', 'payment.received']
  is_active BOOLEAN DEFAULT true,
  retry_count INTEGER DEFAULT 3,
  timeout_seconds INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_triggered_at TIMESTAMP WITH TIME ZONE
);

-- Webhook delivery log
CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  webhook_id UUID REFERENCES webhooks(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  response_status INTEGER,
  response_body TEXT,
  attempt_number INTEGER DEFAULT 1,
  delivered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  success BOOLEAN DEFAULT false
);

-- API rate limiting
CREATE TABLE IF NOT EXISTS api_rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  api_key TEXT NOT NULL UNIQUE,
  requests_per_minute INTEGER DEFAULT 60,
  requests_per_hour INTEGER DEFAULT 1000,
  requests_per_day INTEGER DEFAULT 10000,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API usage tracking
CREATE TABLE IF NOT EXISTS api_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  api_key TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER,
  response_time_ms INTEGER,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Advanced analytics cache
CREATE TABLE IF NOT EXISTS analytics_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL, -- 'earnings_trend', 'task_performance', etc.
  time_period TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
  data JSONB NOT NULL,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 hour'
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_task_templates_user ON task_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_task_templates_public ON task_templates(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_bulk_jobs_user ON bulk_task_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_bulk_jobs_status ON bulk_task_jobs(status);
CREATE INDEX IF NOT EXISTS idx_webhooks_user ON webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_active ON webhooks(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_webhook ON webhook_deliveries(webhook_id);
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_key ON api_rate_limits(api_key);
CREATE INDEX IF NOT EXISTS idx_api_usage_user_created ON api_usage(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_cache_user_type ON analytics_cache(user_id, metric_type, time_period);

-- RLS Policies
ALTER TABLE task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_task_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_cache ENABLE ROW LEVEL SECURITY;

-- Task templates policies
CREATE POLICY "Users can view their own templates" ON task_templates FOR SELECT USING (user_id = auth.uid() OR is_public = true);
CREATE POLICY "Users can create templates" ON task_templates FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their templates" ON task_templates FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their templates" ON task_templates FOR DELETE USING (user_id = auth.uid());

-- Bulk jobs policies
CREATE POLICY "Users can view their bulk jobs" ON bulk_task_jobs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create bulk jobs" ON bulk_task_jobs FOR INSERT WITH CHECK (user_id = auth.uid());

-- Webhooks policies
CREATE POLICY "Users can manage their webhooks" ON webhooks FOR ALL USING (user_id = auth.uid());

-- Webhook deliveries policies
CREATE POLICY "Users can view their webhook deliveries" ON webhook_deliveries FOR SELECT USING (
  webhook_id IN (SELECT id FROM webhooks WHERE user_id = auth.uid())
);

-- API rate limits policies
CREATE POLICY "Users can view their API limits" ON api_rate_limits FOR SELECT USING (user_id = auth.uid());

-- API usage policies
CREATE POLICY "Users can view their API usage" ON api_usage FOR SELECT USING (user_id = auth.uid());

-- Analytics cache policies
CREATE POLICY "Users can view their analytics" ON analytics_cache FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can manage analytics cache" ON analytics_cache FOR ALL USING (true);
