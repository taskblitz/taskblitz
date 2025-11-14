-- Add username and username_last_changed columns to users table
-- Run this in Supabase SQL Editor

-- Add username column if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Add username_last_changed column to track when username was last changed
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS username_last_changed TIMESTAMP;

-- Add comments
COMMENT ON COLUMN users.username IS 'User display name, can be changed once every 7 days';
COMMENT ON COLUMN users.username_last_changed IS 'Timestamp of last username change for cooldown enforcement';

-- Create index for username lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Verify the columns were added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name IN ('username', 'username_last_changed');
