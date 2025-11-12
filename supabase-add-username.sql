-- Add username column to users table
-- Run each command ONE BY ONE in Supabase SQL Editor

-- Command 1: Add username column
ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT;

-- Command 2: Generate unique usernames (replace existing ones)
UPDATE users SET username = 'User' || REPLACE(id::TEXT, '-', '');