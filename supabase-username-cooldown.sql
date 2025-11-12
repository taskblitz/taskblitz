-- Add username edit cooldown
-- Run this in Supabase SQL Editor

-- Add column to track last username change
ALTER TABLE users ADD COLUMN IF NOT EXISTS username_last_changed TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing users to have a timestamp
UPDATE users 
SET username_last_changed = created_at 
WHERE username_last_changed IS NULL;