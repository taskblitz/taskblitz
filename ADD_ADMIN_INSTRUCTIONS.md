# How to Add Yourself as Admin

## Step 1: Run the Database Migration

Go to your Supabase dashboard → SQL Editor and run this:

```sql
-- Create admin tables
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'moderator', 'support')),
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES admin_users(id)
);

CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_bans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  banned_by UUID REFERENCES admin_users(id),
  reason TEXT NOT NULL,
  ban_type TEXT CHECK (ban_type IN ('permanent', 'temporary')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('info', 'warning', 'success', 'error')),
  created_by UUID REFERENCES admin_users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS refund_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  requester_id UUID REFERENCES users(id),
  reason TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  processed_by UUID REFERENCES admin_users(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_activity_admin ON admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_created ON admin_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_bans_user ON user_bans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bans_active ON user_bans(is_active);
CREATE INDEX IF NOT EXISTS idx_refund_status ON refund_requests(status);
```

## Step 2: Add Yourself as Admin

**IMPORTANT:** First, connect your wallet to TaskBlitz and make sure you have a user account.

Then run this SQL (replace YOUR_WALLET_ADDRESS with your actual Solana wallet address):

```sql
-- Add yourself as super admin
INSERT INTO admin_users (wallet_address, role)
VALUES ('YOUR_WALLET_ADDRESS', 'super_admin')
ON CONFLICT (wallet_address) DO NOTHING;
```

## Step 3: Verify

Run this to check if you're added:

```sql
SELECT * FROM admin_users WHERE wallet_address = 'YOUR_WALLET_ADDRESS';
```

## Step 4: Access Admin Panel

Now visit: https://taskblitz.click/admin

You should have full access!

## Troubleshooting

If you still can't access:

1. Check browser console for errors
2. Make sure your wallet is connected
3. Verify the wallet address matches exactly (case-sensitive)
4. Try refreshing the page after adding yourself

## Your Current Wallet Address

When you try to access /admin, you'll see an alert with your wallet address. Use that exact address in the SQL above.
