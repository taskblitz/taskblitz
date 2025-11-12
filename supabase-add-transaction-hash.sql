-- Add transaction_hash column to submissions table
ALTER TABLE submissions 
ADD COLUMN IF NOT EXISTS transaction_hash TEXT;

-- Add transaction_hash column to tasks table (for task creation tx)
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS transaction_hash TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_submissions_transaction_hash ON submissions(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_tasks_transaction_hash ON tasks(transaction_hash);

-- Add comments
COMMENT ON COLUMN submissions.transaction_hash IS 'Solana transaction hash for payment approval';
COMMENT ON COLUMN tasks.transaction_hash IS 'Solana transaction hash for task creation/escrow';
