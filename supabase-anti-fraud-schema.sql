-- TaskBlitz Anti-Fraud System Database Schema
-- Run this in Supabase SQL Editor to add anti-fraud features

-- ============================================
-- 1. ADD COLUMNS TO EXISTING TABLES
-- ============================================

-- Add anti-fraud columns to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS rejection_limit_percentage INT DEFAULT 20;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS workers_rejected INT DEFAULT 0;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS can_cancel BOOLEAN DEFAULT TRUE;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS is_flagged BOOLEAN DEFAULT FALSE;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS transaction_hash TEXT;

-- Add reputation and tracking columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS approval_rate DECIMAL(5,2) DEFAULT 100.00;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_approved INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_rejections INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_flagged BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS username_last_changed TIMESTAMP;

-- Add rejection reason and auto-approval tracking to submissions
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS auto_approved BOOLEAN DEFAULT FALSE;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS transaction_hash TEXT;

-- ============================================
-- 2. CREATE DISPUTES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES users(id) ON DELETE CASCADE,
  requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
  dispute_reason TEXT NOT NULL,
  worker_evidence TEXT,
  admin_notes TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'resolved_worker', 'resolved_requester', 'dismissed')),
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for disputes
CREATE INDEX IF NOT EXISTS idx_disputes_status ON disputes(status);
CREATE INDEX IF NOT EXISTS idx_disputes_worker ON disputes(worker_id);
CREATE INDEX IF NOT EXISTS idx_disputes_requester ON disputes(requester_id);
CREATE INDEX IF NOT EXISTS idx_disputes_submission ON disputes(submission_id);

-- ============================================
-- 3. CREATE HELPER FUNCTIONS
-- ============================================

-- Function to increment workers_completed
CREATE OR REPLACE FUNCTION increment_workers_completed(task_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE tasks 
  SET workers_completed = workers_completed + 1,
      can_cancel = FALSE  -- Lock escrow once first worker submits
  WHERE id = task_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement workers_completed (when rejection happens)
CREATE OR REPLACE FUNCTION decrement_workers_completed(task_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE tasks 
  SET workers_completed = workers_completed - 1,
      workers_rejected = workers_rejected + 1
  WHERE id = task_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check rejection rate and auto-approve if limit reached
CREATE OR REPLACE FUNCTION check_rejection_limit(task_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  task_record RECORD;
  rejection_rate DECIMAL;
  auto_approved_count INT;
BEGIN
  -- Get task details
  SELECT workers_completed, workers_rejected, rejection_limit_percentage, workers_needed
  INTO task_record
  FROM tasks
  WHERE id = task_id;
  
  -- Calculate rejection rate
  IF task_record.workers_completed > 0 THEN
    rejection_rate := (task_record.workers_rejected::DECIMAL / task_record.workers_completed::DECIMAL) * 100;
  ELSE
    rejection_rate := 0;
  END IF;
  
  -- If rejection rate exceeds limit, auto-approve all pending submissions
  IF rejection_rate >= task_record.rejection_limit_percentage THEN
    -- Auto-approve all pending submissions for this task
    UPDATE submissions
    SET status = 'approved',
        reviewed_at = NOW(),
        auto_approved = TRUE
    WHERE task_id = check_rejection_limit.task_id 
      AND status = 'pending';
    
    GET DIAGNOSTICS auto_approved_count = ROW_COUNT;
    
    -- Flag the task and requester
    UPDATE tasks SET is_flagged = TRUE WHERE id = task_id;
    UPDATE users SET is_flagged = TRUE 
    WHERE id = (SELECT requester_id FROM tasks WHERE id = task_id);
    
    RAISE NOTICE 'Rejection limit reached! Auto-approved % pending submissions', auto_approved_count;
    
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Function to update user reputation after review
CREATE OR REPLACE FUNCTION update_requester_reputation(requester_id UUID)
RETURNS void AS $$
DECLARE
  total_reviews INT;
  approved_count INT;
  rejected_count INT;
  new_approval_rate DECIMAL;
  new_reputation INT;
BEGIN
  -- Count total reviews by this requester
  SELECT 
    COUNT(*) FILTER (WHERE status IN ('approved', 'rejected')),
    COUNT(*) FILTER (WHERE status = 'approved'),
    COUNT(*) FILTER (WHERE status = 'rejected')
  INTO total_reviews, approved_count, rejected_count
  FROM submissions s
  JOIN tasks t ON s.task_id = t.id
  WHERE t.requester_id = update_requester_reputation.requester_id;
  
  -- Calculate approval rate
  IF total_reviews > 0 THEN
    new_approval_rate := (approved_count::DECIMAL / total_reviews::DECIMAL) * 100;
  ELSE
    new_approval_rate := 100.00;
  END IF;
  
  -- Calculate reputation score
  IF new_approval_rate >= 90 THEN
    new_reputation := 100;
  ELSIF new_approval_rate >= 70 THEN
    new_reputation := 75;
  ELSIF new_approval_rate >= 50 THEN
    new_reputation := 50;
  ELSE
    new_reputation := 25;
  END IF;
  
  -- Update user record
  UPDATE users
  SET approval_rate = new_approval_rate,
      total_approved = approved_count,
      total_rejections = rejected_count,
      reputation_score = new_reputation,
      is_flagged = CASE 
        WHEN new_approval_rate < 60 AND total_reviews > 5 THEN TRUE
        ELSE is_flagged
      END
  WHERE id = update_requester_reputation.requester_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 4. CREATE TRIGGERS
-- ============================================

-- Trigger to update reputation after submission review
CREATE OR REPLACE FUNCTION trigger_update_reputation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('approved', 'rejected') AND OLD.status = 'pending' THEN
    -- Update requester reputation
    PERFORM update_requester_reputation(
      (SELECT requester_id FROM tasks WHERE id = NEW.task_id)
    );
    
    -- Check rejection limit if this was a rejection
    IF NEW.status = 'rejected' THEN
      PERFORM check_rejection_limit(NEW.task_id);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_reputation_on_review ON submissions;
CREATE TRIGGER update_reputation_on_review
  AFTER UPDATE ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_reputation();

-- ============================================
-- 5. ROW LEVEL SECURITY FOR DISPUTES
-- ============================================

ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

-- Workers can view their own disputes
CREATE POLICY "Workers can view own disputes" ON disputes FOR SELECT USING (
  worker_id IN (SELECT id FROM users WHERE wallet_address = current_setting('app.current_user_wallet', true))
);

-- Requesters can view disputes against them
CREATE POLICY "Requesters can view disputes against them" ON disputes FOR SELECT USING (
  requester_id IN (SELECT id FROM users WHERE wallet_address = current_setting('app.current_user_wallet', true))
);

-- Workers can create disputes for their rejected submissions
CREATE POLICY "Workers can create disputes" ON disputes FOR INSERT WITH CHECK (
  worker_id IN (SELECT id FROM users WHERE wallet_address = current_setting('app.current_user_wallet', true))
);

-- Only admins can update disputes (will be handled via service role)
-- No public UPDATE policy - disputes can only be resolved by admins

-- ============================================
-- 6. CREATE ADMIN ROLE (OPTIONAL)
-- ============================================

-- Add admin role to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create admin policy for disputes
CREATE POLICY "Admins can view all disputes" ON disputes FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE wallet_address = current_setting('app.current_user_wallet', true) 
    AND is_admin = TRUE
  )
);

-- ============================================
-- 7. CREATE VIEWS FOR ANALYTICS
-- ============================================

-- View for flagged users
CREATE OR REPLACE VIEW flagged_users AS
SELECT 
  u.id,
  u.wallet_address,
  u.username,
  u.approval_rate,
  u.total_approved,
  u.total_rejections,
  u.reputation_score,
  u.tasks_posted,
  COUNT(DISTINCT d.id) as dispute_count
FROM users u
LEFT JOIN disputes d ON u.id = d.requester_id AND d.status = 'open'
WHERE u.is_flagged = TRUE
GROUP BY u.id;

-- View for flagged tasks
CREATE OR REPLACE VIEW flagged_tasks AS
SELECT 
  t.id,
  t.title,
  t.requester_id,
  u.username as requester_username,
  u.approval_rate as requester_approval_rate,
  t.workers_completed,
  t.workers_rejected,
  CASE 
    WHEN t.workers_completed > 0 
    THEN ROUND((t.workers_rejected::DECIMAL / t.workers_completed::DECIMAL) * 100, 2)
    ELSE 0
  END as rejection_rate,
  t.rejection_limit_percentage,
  t.created_at
FROM tasks t
JOIN users u ON t.requester_id = u.id
WHERE t.is_flagged = TRUE;

-- ============================================
-- 8. INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_approval_rate ON users(approval_rate);
CREATE INDEX IF NOT EXISTS idx_users_is_flagged ON users(is_flagged);
CREATE INDEX IF NOT EXISTS idx_tasks_is_flagged ON tasks(is_flagged);
CREATE INDEX IF NOT EXISTS idx_submissions_auto_approved ON submissions(auto_approved);

-- ============================================
-- DONE! Anti-Fraud System Schema Complete
-- ============================================

-- Verify installation
DO $$
BEGIN
  RAISE NOTICE '✅ Anti-fraud schema installed successfully!';
  RAISE NOTICE '📊 New tables: disputes';
  RAISE NOTICE '🔧 New functions: check_rejection_limit, update_requester_reputation';
  RAISE NOTICE '🎯 New triggers: update_reputation_on_review';
  RAISE NOTICE '👁️ New views: flagged_users, flagged_tasks';
END $$;
