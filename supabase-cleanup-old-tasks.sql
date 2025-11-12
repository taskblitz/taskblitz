-- Clean up old test tasks
-- Run this FIRST before adding new demo tasks

-- Delete all tasks for your wallet
DELETE FROM tasks 
WHERE requester_id IN (
  SELECT id FROM users 
  WHERE wallet_address = '3NAsTFu71YSXzGr78XV6jLC4YaqdJB93Ep43LtVKkFxR'
);

-- Also delete any submissions for those tasks
DELETE FROM submissions 
WHERE task IN (
  SELECT id FROM tasks 
  WHERE requester_id IN (
    SELECT id FROM users 
    WHERE wallet_address = '3NAsTFu71YSXzGr78XV6jLC4YaqdJB93Ep43LtVKkFxR'
  )
);

-- Verify cleanup
SELECT 
  (SELECT COUNT(*) FROM tasks WHERE requester_id IN (
    SELECT id FROM users WHERE wallet_address = '3NAsTFu71YSXzGr78XV6jLC4YaqdJB93Ep43LtVKkFxR'
  )) as remaining_tasks,
  (SELECT COUNT(*) FROM submissions WHERE worker_id IN (
    SELECT id FROM users WHERE wallet_address = '3NAsTFu71YSXzGr78XV6jLC4YaqdJB93Ep43LtVKkFxR'
  )) as remaining_submissions;

-- Should show 0 tasks, 0 submissions
