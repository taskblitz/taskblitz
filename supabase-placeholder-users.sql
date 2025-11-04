-- Add placeholder users for testing
-- Run this in Supabase SQL Editor

INSERT INTO users (id, wallet_address, role) VALUES 
('00000000-0000-0000-0000-000000000000', 'PlaceholderRequester', 'requester'),
('00000000-0000-0000-0000-000000000001', 'PlaceholderWorker', 'worker')
ON CONFLICT (id) DO NOTHING;