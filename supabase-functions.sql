-- Additional SQL functions for TaskBlitz
-- Run this in Supabase SQL Editor after the main schema

-- Function to increment workers_completed count
CREATE OR REPLACE FUNCTION increment_workers_completed(task_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE tasks 
  SET workers_completed = workers_completed + 1,
      updated_at = NOW()
  WHERE id = task_id;
  
  -- Mark task as completed if all spots filled
  UPDATE tasks 
  SET status = 'completed'
  WHERE id = task_id 
    AND workers_completed >= workers_needed 
    AND status = 'open';
END;
$$ LANGUAGE plpgsql;

-- Function to decrement workers_completed count
CREATE OR REPLACE FUNCTION decrement_workers_completed(task_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE tasks 
  SET workers_completed = GREATEST(0, workers_completed - 1),
      updated_at = NOW()
  WHERE id = task_id;
  
  -- Reopen task if it was completed but now has spots available
  UPDATE tasks 
  SET status = 'open'
  WHERE id = task_id 
    AND workers_completed < workers_needed 
    AND status = 'completed'
    AND deadline > NOW();
END;
$$ LANGUAGE plpgsql;