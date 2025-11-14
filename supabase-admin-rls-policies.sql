-- Admin RLS Policies for TaskBlitz
-- Run this in your Supabase SQL Editor to allow admins to manage all data

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(wallet TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE wallet_address = wallet
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TASKS TABLE - Admin Policies
-- ============================================

-- Allow admins to delete any task
DROP POLICY IF EXISTS "Admins can delete any task" ON tasks;
CREATE POLICY "Admins can delete any task"
ON tasks FOR DELETE
TO authenticated
USING (
  is_admin(auth.jwt() ->> 'wallet_address')
);

-- Allow admins to update any task
DROP POLICY IF EXISTS "Admins can update any task" ON tasks;
CREATE POLICY "Admins can update any task"
ON tasks FOR UPDATE
TO authenticated
USING (
  is_admin(auth.jwt() ->> 'wallet_address')
);

-- Allow admins to view all tasks
DROP POLICY IF EXISTS "Admins can view all tasks" ON tasks;
CREATE POLICY "Admins can view all tasks"
ON tasks FOR SELECT
TO authenticated
USING (
  is_admin(auth.jwt() ->> 'wallet_address')
);

-- ============================================
-- SUBMISSIONS TABLE - Admin Policies
-- ============================================

-- Allow admins to delete any submission
DROP POLICY IF EXISTS "Admins can delete any submission" ON submissions;
CREATE POLICY "Admins can delete any submission"
ON submissions FOR DELETE
TO authenticated
USING (
  is_admin(auth.jwt() ->> 'wallet_address')
);

-- Allow admins to update any submission
DROP POLICY IF EXISTS "Admins can update any submission" ON submissions;
CREATE POLICY "Admins can update any submission"
ON submissions FOR UPDATE
TO authenticated
USING (
  is_admin(auth.jwt() ->> 'wallet_address')
);

-- ============================================
-- TRANSACTIONS TABLE - Admin Policies
-- ============================================

-- Allow admins to delete any transaction
DROP POLICY IF EXISTS "Admins can delete any transaction" ON transactions;
CREATE POLICY "Admins can delete any transaction"
ON transactions FOR DELETE
TO authenticated
USING (
  is_admin(auth.jwt() ->> 'wallet_address')
);

-- Allow admins to view all transactions
DROP POLICY IF EXISTS "Admins can view all transactions" ON transactions;
CREATE POLICY "Admins can view all transactions"
ON transactions FOR SELECT
TO authenticated
USING (
  is_admin(auth.jwt() ->> 'wallet_address')
);

-- ============================================
-- NOTIFICATIONS TABLE - Admin Policies
-- ============================================

-- Allow admins to delete any notification
DROP POLICY IF EXISTS "Admins can delete any notification" ON notifications;
CREATE POLICY "Admins can delete any notification"
ON notifications FOR DELETE
TO authenticated
USING (
  is_admin(auth.jwt() ->> 'wallet_address')
);

-- ============================================
-- USERS TABLE - Admin Policies
-- ============================================

-- Allow admins to view all users
DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users"
ON users FOR SELECT
TO authenticated
USING (
  is_admin(auth.jwt() ->> 'wallet_address')
);

-- Allow admins to update any user
DROP POLICY IF EXISTS "Admins can update any user" ON users;
CREATE POLICY "Admins can update any user"
ON users FOR UPDATE
TO authenticated
USING (
  is_admin(auth.jwt() ->> 'wallet_address')
);

-- ============================================
-- Enable RLS on admin tables
-- ============================================

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bans ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE refund_requests ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to check admin status (needed for isAdmin function to work)
DROP POLICY IF EXISTS "Authenticated users can view admin_users" ON admin_users;
CREATE POLICY "Authenticated users can view admin_users"
ON admin_users FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can view activity log" ON admin_activity_log;
CREATE POLICY "Admins can view activity log"
ON admin_activity_log FOR SELECT
TO authenticated
USING (
  is_admin(auth.jwt() ->> 'wallet_address')
);

DROP POLICY IF EXISTS "Admins can insert activity log" ON admin_activity_log;
CREATE POLICY "Admins can insert activity log"
ON admin_activity_log FOR INSERT
TO authenticated
WITH CHECK (
  is_admin(auth.jwt() ->> 'wallet_address')
);

DROP POLICY IF EXISTS "Admins can manage bans" ON user_bans;
CREATE POLICY "Admins can manage bans"
ON user_bans FOR ALL
TO authenticated
USING (
  is_admin(auth.jwt() ->> 'wallet_address')
);

DROP POLICY IF EXISTS "Admins can manage announcements" ON announcements;
CREATE POLICY "Admins can manage announcements"
ON announcements FOR ALL
TO authenticated
USING (
  is_admin(auth.jwt() ->> 'wallet_address')
);

DROP POLICY IF EXISTS "Everyone can view active announcements" ON announcements;
CREATE POLICY "Everyone can view active announcements"
ON announcements FOR SELECT
TO authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage refunds" ON refund_requests;
CREATE POLICY "Admins can manage refunds"
ON refund_requests FOR ALL
TO authenticated
USING (
  is_admin(auth.jwt() ->> 'wallet_address')
);

-- Grant necessary permissions
GRANT ALL ON admin_users TO authenticated;
GRANT ALL ON admin_activity_log TO authenticated;
GRANT ALL ON user_bans TO authenticated;
GRANT ALL ON announcements TO authenticated;
GRANT ALL ON refund_requests TO authenticated;
