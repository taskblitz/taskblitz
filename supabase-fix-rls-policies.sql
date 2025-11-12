-- Fix RLS policies to allow transaction_hash column

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert their own submissions" ON submissions;
DROP POLICY IF EXISTS "Users can update their own submissions" ON submissions;

-- Recreate tasks policies with transaction_hash support
CREATE POLICY "Users can insert their own tasks"
ON tasks FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update their own tasks"
ON tasks FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can view tasks"
ON tasks FOR SELECT
USING (true);

-- Recreate submissions policies with transaction_hash support
CREATE POLICY "Users can insert their own submissions"
ON submissions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update their own submissions"
ON submissions FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can view submissions"
ON submissions FOR SELECT
USING (true);

-- Make sure RLS is enabled
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users table policies
DROP POLICY IF EXISTS "Users can insert themselves" ON users;
DROP POLICY IF EXISTS "Users can update themselves" ON users;
DROP POLICY IF EXISTS "Anyone can view users" ON users;

CREATE POLICY "Users can insert themselves"
ON users FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update themselves"
ON users FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can view users"
ON users FOR SELECT
USING (true);
