-- Check current task data
-- Run this in Supabase SQL Editor to see what's in your tasks

SELECT 
  id,
  title,
  workers_needed,
  workers_completed,
  status
FROM tasks
ORDER BY created_at DESC
LIMIT 5;

-- If you want to fix the Elon Musk task to need only 23 workers instead of 100:
-- UPDATE tasks 
-- SET workers_needed = 23 
-- WHERE title LIKE '%elonmusk%' OR title LIKE '%Elon%';