-- TaskBlitz Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('requester', 'worker', 'both')) DEFAULT 'both',
  total_spent DECIMAL(10,2) DEFAULT 0,
  total_earned DECIMAL(10,2) DEFAULT 0,
  tasks_posted INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  reputation_score DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tasks Table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Marketing', 'Social Media', 'Reviews', 'Research', 'Data Entry', 'Testing', 'Content Creation', 'Community', 'Surveys', 'Other')),
  payment_per_task DECIMAL(10,2) NOT NULL CHECK (payment_per_task >= 0.10),
  workers_needed INTEGER NOT NULL CHECK (workers_needed > 0),
  workers_completed INTEGER DEFAULT 0,
  deadline TIMESTAMP NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'completed', 'expired', 'cancelled')),
  escrow_amount DECIMAL(10,2) NOT NULL,
  platform_fee_percentage DECIMAL(5,2) DEFAULT 10.00,
  submission_type TEXT NOT NULL CHECK (submission_type IN ('text', 'file', 'url')),
  requirements TEXT[] DEFAULT '{}',
  example_submission TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Submissions Table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES users(id) ON DELETE CASCADE,
  submission_type TEXT CHECK (submission_type IN ('text', 'file', 'url')),
  submission_text TEXT,
  submission_file_url TEXT,
  submission_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  payment_transaction_hash TEXT,
  UNIQUE(task_id, worker_id)
);

-- Transactions Table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_type TEXT CHECK (transaction_type IN ('deposit', 'payment', 'fee', 'refund', 'withdrawal')),
  from_user_id UUID REFERENCES users(id),
  to_user_id UUID REFERENCES users(id),
  task_id UUID REFERENCES tasks(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'SOL' CHECK (currency IN ('SOL', 'USDC')),
  solana_tx_hash TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Platform Settings Table
CREATE TABLE platform_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default settings
INSERT INTO platform_settings (setting_key, setting_value) VALUES
('platform_fee_percentage', '10'),
('minimum_task_payment', '0.10'),
('platform_wallet_address', 'PLACEHOLDER_WALLET_ADDRESS');

-- Indexes for Performance
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_tasks_requester ON tasks(requester_id);
CREATE INDEX idx_submissions_task ON submissions(task_id);
CREATE INDEX idx_submissions_worker ON submissions(worker_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_transactions_user ON transactions(from_user_id);
CREATE INDEX idx_users_wallet ON users(wallet_address);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users can read all users but only update their own
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (wallet_address = current_setting('app.current_user_wallet'));
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (wallet_address = current_setting('app.current_user_wallet'));

-- Tasks are public for reading, but only owners can modify
CREATE POLICY "Anyone can view tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Users can create tasks" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (requester_id IN (SELECT id FROM users WHERE wallet_address = current_setting('app.current_user_wallet')));

-- Submissions can be viewed by task owner and submission owner
CREATE POLICY "Users can view relevant submissions" ON submissions FOR SELECT USING (
  worker_id IN (SELECT id FROM users WHERE wallet_address = current_setting('app.current_user_wallet'))
  OR 
  task_id IN (SELECT id FROM tasks WHERE requester_id IN (SELECT id FROM users WHERE wallet_address = current_setting('app.current_user_wallet')))
);
CREATE POLICY "Users can create submissions" ON submissions FOR INSERT WITH CHECK (
  worker_id IN (SELECT id FROM users WHERE wallet_address = current_setting('app.current_user_wallet'))
);
CREATE POLICY "Task owners can update submissions" ON submissions FOR UPDATE USING (
  task_id IN (SELECT id FROM tasks WHERE requester_id IN (SELECT id FROM users WHERE wallet_address = current_setting('app.current_user_wallet')))
);

-- Transactions can be viewed by involved parties
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (
  from_user_id IN (SELECT id FROM users WHERE wallet_address = current_setting('app.current_user_wallet'))
  OR 
  to_user_id IN (SELECT id FROM users WHERE wallet_address = current_setting('app.current_user_wallet'))
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE transactions;