-- Task Applications System
-- Run this in Supabase SQL Editor

-- Add task_mode column to tasks table
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS task_mode TEXT DEFAULT 'open' CHECK (task_mode IN ('open', 'application'));

COMMENT ON COLUMN tasks.task_mode IS 'Task mode: open (anyone can submit) or application (must be approved first)';

-- Create task_applications table
CREATE TABLE IF NOT EXISTS task_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  worker_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')) NOT NULL,
  message TEXT,
  applied_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  UNIQUE(task_id, worker_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_task_applications_task_id ON task_applications(task_id);
CREATE INDEX IF NOT EXISTS idx_task_applications_worker_id ON task_applications(worker_id);
CREATE INDEX IF NOT EXISTS idx_task_applications_status ON task_applications(status);

-- Enable RLS
ALTER TABLE task_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Anyone can view applications" ON task_applications;
DROP POLICY IF EXISTS "Workers can create applications" ON task_applications;
DROP POLICY IF EXISTS "Task owners can update applications" ON task_applications;

CREATE POLICY "Anyone can view applications"
ON task_applications
FOR SELECT
TO public
USING (true);

CREATE POLICY "Workers can create applications"
ON task_applications
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Task owners can update applications"
ON task_applications
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Add comment
COMMENT ON TABLE task_applications IS 'Worker applications for application-based tasks';

-- Verify tables
SELECT 
  table_name,
  column_name,
  data_type,
  column_default
FROM information_schema.columns
WHERE table_name IN ('tasks', 'task_applications')
  AND column_name IN ('task_mode', 'id', 'task_id', 'worker_id', 'status')
ORDER BY table_name, ordinal_position;
