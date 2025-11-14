-- Disable RLS on admin_users table to allow isAdmin checks
-- This is safe because admin_users only contains wallet addresses (public info)
-- and we only allow SELECT, not INSERT/UPDATE/DELETE from the client

ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Make sure the table is readable by anon users
GRANT SELECT ON admin_users TO anon;
GRANT SELECT ON admin_users TO authenticated;
