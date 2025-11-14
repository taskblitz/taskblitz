-- Add currency column to tasks table
-- Run this in Supabase SQL Editor

ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'SOL' CHECK (currency IN ('SOL', 'USDC'));

-- Add comment
COMMENT ON COLUMN tasks.currency IS 'Payment currency: SOL or USDC';

-- Verify the column was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'tasks' AND column_name = 'currency';
