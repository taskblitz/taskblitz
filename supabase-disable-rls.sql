-- Temporarily disable RLS for testing
-- Run this in Supabase SQL Editor

-- Disable RLS on tasks table for testing
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;

-- Also make sure we can read users table
ALTER TABLE users DISABLE ROW LEVEL SECURITY;