-- Fix usernames for all users (Simple version)
-- Run this in Supabase SQL Editor

-- Update users with simple random usernames
UPDATE users 
SET username = 'User' || FLOOR(RANDOM() * 9999 + 1000)::TEXT
WHERE username LIKE 'User%' OR username = 'TaskBlitz User' OR username IS NULL;