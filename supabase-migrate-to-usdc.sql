-- Migration: Switch from SOL to USDC as default currency
-- Run this after deploying the code changes

-- Update existing tasks to use USDC
UPDATE tasks 
SET currency = 'USDC' 
WHERE currency = 'SOL' OR currency IS NULL;

-- Update existing transactions to use USDC
UPDATE transactions 
SET currency = 'USDC' 
WHERE currency = 'SOL' OR currency IS NULL;

-- Update the currency column constraints
ALTER TABLE tasks 
DROP CONSTRAINT IF EXISTS tasks_currency_check;

ALTER TABLE tasks 
ADD CONSTRAINT tasks_currency_check CHECK (currency IN ('USDC'));

ALTER TABLE transactions 
DROP CONSTRAINT IF EXISTS transactions_currency_check;

ALTER TABLE transactions 
ADD CONSTRAINT transactions_currency_check CHECK (currency IN ('USDC'));

-- Set default to USDC
ALTER TABLE tasks 
ALTER COLUMN currency SET DEFAULT 'USDC';

ALTER TABLE transactions 
ALTER COLUMN currency SET DEFAULT 'USDC';
