-- Seed data for TaskBlitz
-- Run this in Supabase SQL Editor after the main schema and functions

-- Insert some test users (you can replace with your actual wallet address)
INSERT INTO users (wallet_address, role, tasks_posted, total_spent) VALUES
('DemoRequester1234567890123456789012345678901234567890', 'requester', 3, 15.50),
('DemoWorker1234567890123456789012345678901234567890', 'worker', 0, 0),
('TaskBlitzTeam1234567890123456789012345678901234567890', 'both', 2, 8.75);

-- Insert some test tasks
INSERT INTO tasks (
  requester_id, 
  title, 
  description, 
  category, 
  payment_per_task, 
  workers_needed, 
  workers_completed,
  deadline, 
  escrow_amount, 
  submission_type, 
  requirements, 
  example_submission
) VALUES 
(
  (SELECT id FROM users WHERE wallet_address = 'TaskBlitzTeam1234567890123456789012345678901234567890'),
  'DM @elonmusk about TaskBlitz on X',
  'Send a direct message to @elonmusk on X (Twitter) telling him about TaskBlitz platform. Be polite and professional. Include the website: taskblitz.click

Message should include:
- Brief introduction of yourself
- Mention TaskBlitz as a new Solana-based micro-task platform
- Include the website: taskblitz.click
- Be respectful and professional
- Keep it under 280 characters',
  'Marketing',
  0.50,
  100,
  23,
  NOW() + INTERVAL '7 days',
  55.00,
  'url',
  ARRAY['Must have X (Twitter) account', 'Account must be at least 30 days old', 'Must not be spam account', 'Must actually send the DM'],
  'https://x.com/messages/compose?recipient_id=44196397'
),
(
  (SELECT id FROM users WHERE wallet_address = 'DemoRequester1234567890123456789012345678901234567890'),
  'Like and Retweet this specific tweet',
  'Go to this tweet: https://x.com/taskblitz/status/123456 and like + retweet it. Must be genuine engagement, no bots.',
  'Marketing',
  0.25,
  500,
  347,
  NOW() + INTERVAL '5 days',
  137.50,
  'url',
  ARRAY['Real X account (no bots)', 'Must have profile picture', 'Account older than 1 month'],
  'https://x.com/yourusername/status/retweet_id'
),
(
  (SELECT id FROM users WHERE wallet_address = 'TaskBlitzTeam1234567890123456789012345678901234567890'),
  'Take a photo with TaskBlitz sign',
  'Print out "TaskBlitz.click" on paper, take a selfie holding it, and post on your social media with #TaskBlitz hashtag.',
  'Marketing',
  2.00,
  50,
  12,
  NOW() + INTERVAL '6 days',
  110.00,
  'url',
  ARRAY['Must be real person (no AI/fake photos)', 'Clear photo quality', 'Must include #TaskBlitz hashtag'],
  'https://twitter.com/username/status/123456 or https://instagram.com/p/abc123'
),
(
  (SELECT id FROM users WHERE wallet_address = 'DemoRequester1234567890123456789012345678901234567890'),
  'Write a positive review for our app',
  'Download our app "CryptoTracker" from App Store, use it for 5 minutes, then write a genuine 4-5 star review.',
  'Reviews',
  1.50,
  200,
  89,
  NOW() + INTERVAL '4 days',
  330.00,
  'text',
  ARRAY['Must actually download and try the app', 'Honest review (4-5 stars)', 'At least 50 words'],
  'Screenshot of your review + App Store link'
),
(
  (SELECT id FROM users WHERE wallet_address = 'DemoRequester1234567890123456789012345678901234567890'),
  'Find email addresses of crypto influencers',
  'Research and find valid email addresses for crypto influencers with 10K+ followers. Provide name, handle, follower count, and email.',
  'Research',
  3.00,
  20,
  7,
  NOW() + INTERVAL '3 days',
  66.00,
  'text',
  ARRAY['Must verify email is valid', 'Influencer must have 10K+ followers', 'No duplicate submissions'],
  'Name: John Crypto, Handle: @johncrypto, Followers: 25K, Email: john@example.com'
);

-- Insert some test submissions
INSERT INTO submissions (
  task_id,
  worker_id,
  submission_type,
  submission_url,
  status,
  submitted_at
) VALUES 
(
  (SELECT id FROM tasks WHERE title = 'DM @elonmusk about TaskBlitz on X'),
  (SELECT id FROM users WHERE wallet_address = 'DemoWorker1234567890123456789012345678901234567890'),
  'url',
  'https://x.com/messages/44196397/conversation/12345',
  'approved',
  NOW() - INTERVAL '2 hours'
),
(
  (SELECT id FROM tasks WHERE title = 'Take a photo with TaskBlitz sign'),
  (SELECT id FROM users WHERE wallet_address = 'DemoWorker1234567890123456789012345678901234567890'),
  'url',
  'https://instagram.com/p/mypost123',
  'pending',
  NOW() - INTERVAL '1 hour'
);