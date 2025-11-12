-- Add progress to some demo tasks so visitors can see the progress bars in action
-- This updates workers_completed for various tasks to show different progress levels

-- Update tasks to have some progress (25%, 50%, 75%, 90%)
UPDATE tasks 
SET workers_completed = FLOOR(workers_needed * 0.25)
WHERE title LIKE '%NFTs to your grandma%';

UPDATE tasks 
SET workers_completed = FLOOR(workers_needed * 0.50)
WHERE title LIKE '%Yelp review%dog%';

UPDATE tasks 
SET workers_completed = FLOOR(workers_needed * 0.75)
WHERE title LIKE '%worst possible logo%';

UPDATE tasks 
SET workers_completed = FLOOR(workers_needed * 0.90)
WHERE title LIKE '%Text your ex%';

UPDATE tasks 
SET workers_completed = FLOOR(workers_needed * 0.33)
WHERE title LIKE '%crypto Discord%';

UPDATE tasks 
SET workers_completed = FLOOR(workers_needed * 0.60)
WHERE title LIKE '%Solana meme%';

UPDATE tasks 
SET workers_completed = FLOOR(workers_needed * 0.40)
WHERE title LIKE '%DeFi protocol%';

UPDATE tasks 
SET workers_completed = FLOOR(workers_needed * 0.80)
WHERE title LIKE '%crypto Twitter%';

-- Show results
SELECT 
  title,
  workers_completed,
  workers_needed,
  ROUND((workers_completed::DECIMAL / workers_needed) * 100) as progress_percent
FROM tasks
WHERE workers_completed > 0
ORDER BY progress_percent DESC;
