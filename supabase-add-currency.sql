-- Add currency field to tasks table
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'SOL' CHECK (currency IN ('SOL', 'USDC'));

-- Add comment
COMMENT ON COLUMN tasks.currency IS 'Payment currency: SOL or USDC';
