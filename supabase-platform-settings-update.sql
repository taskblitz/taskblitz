-- Ensure platform_settings table exists with updated_at column
ALTER TABLE platform_settings 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Update existing records to have updated_at
UPDATE platform_settings 
SET updated_at = NOW() 
WHERE updated_at IS NULL;

-- Create or update the platform settings with current values
INSERT INTO platform_settings (setting_key, setting_value, updated_at) 
VALUES 
  ('platform_wallet_address', 'CHdQMw9x9gSiMWhV8ZCrkUN1uBRmYLAfWbuky6M1jiaG', NOW()),
  ('platform_fee_percentage', '10', NOW()),
  ('minimum_task_payment', '0.10', NOW())
ON CONFLICT (setting_key) 
DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = NOW();

-- Add RLS policies for platform_settings
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Allow admins to read platform settings
CREATE POLICY "Admins can read platform settings"
ON platform_settings
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.wallet_address = (
      SELECT wallet_address FROM users WHERE id = auth.uid()
    )
  )
);

-- Allow admins to update platform settings
CREATE POLICY "Admins can update platform settings"
ON platform_settings
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.wallet_address = (
      SELECT wallet_address FROM users WHERE id = auth.uid()
    )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.wallet_address = (
      SELECT wallet_address FROM users WHERE id = auth.uid()
    )
  )
);

-- Allow admins to insert platform settings
CREATE POLICY "Admins can insert platform settings"
ON platform_settings
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.wallet_address = (
      SELECT wallet_address FROM users WHERE id = auth.uid()
    )
  )
);
