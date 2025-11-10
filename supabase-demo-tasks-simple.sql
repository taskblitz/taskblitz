-- Simple Demo Tasks for TaskBlitz
-- If the other script doesn't work, use this one

-- First, get your actual user ID by running:
-- SELECT id, username, wallet_address FROM users;
-- Then replace 'YOUR_USER_ID_HERE' below with your actual UUID

-- Or create a demo user and use that ID:
INSERT INTO users (wallet_address, username, role)
VALUES ('DemoWa11et1111111111111111111111111111111', 'TaskBlitzDemo', 'both')
ON CONFLICT (wallet_address) DO UPDATE SET username = 'TaskBlitzDemo';

-- Get the user ID (copy this from the result)
SELECT id, username FROM users WHERE wallet_address = 'DemoWa11et1111111111111111111111111111111';

-- After getting the ID, replace 'YOUR_USER_ID_HERE' in all INSERT statements below
-- Then run all the INSERT statements

-- Example: If your user ID is '123e4567-e89b-12d3-a456-426614174000'
-- Replace: requester_id = 'YOUR_USER_ID_HERE'
-- With: requester_id = '123e4567-e89b-12d3-a456-426614174000'
