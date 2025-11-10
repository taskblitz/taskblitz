-- Demo Tasks for YOUR wallet: 3NAsTFu71YSXzGr78XV6jLC4YaqdJB93Ep43LtVKkFxR
-- Run this in Supabase SQL Editor

-- Get your user ID
DO $$
DECLARE
  my_user_id UUID;
BEGIN
  -- Get your user ID from your wallet address
  SELECT id INTO my_user_id FROM users 
  WHERE wallet_address = '3NAsTFu71YSXzGr78XV6jLC4YaqdJB93Ep43LtVKkFxR';

  -- If user doesn't exist, create it
  IF my_user_id IS NULL THEN
    INSERT INTO users (wallet_address, username, role)
    VALUES ('3NAsTFu71YSXzGr78XV6jLC4YaqdJB93Ep43LtVKkFxR', 'CryptoTasker', 'both')
    RETURNING id INTO my_user_id;
  END IF;

  -- Task 1: Social Media
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Follow us on Twitter and retweet our launch post',
    'Help us spread the word about TaskBlitz! Follow @TaskBlitz on Twitter, retweet our pinned post, and tag 3 friends who might be interested in crypto micro-tasks.',
    'Social Media',
    0.50,
    50,
    NOW() + INTERVAL '7 days',
    27.50,
    'url',
    ARRAY['Must follow @TaskBlitz', 'Retweet the pinned post', 'Tag 3 friends', 'Provide link to your retweet'],
    'open'
  );

  -- Task 2: Content Creation
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Write a 100-word review of TaskBlitz',
    'We need honest reviews! Try out TaskBlitz and write a 100-word review about your experience. Focus on what you liked, what could be improved, and who would benefit from using it.',
    'Content Creation',
    2.00,
    20,
    NOW() + INTERVAL '5 days',
    44.00,
    'text',
    ARRAY['Exactly 100 words', 'Must be original', 'Include at least one specific feature', 'Be honest and constructive'],
    'open'
  );

  -- Task 3: Research
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Find 5 Solana DeFi projects launched in 2024',
    'Research and list 5 DeFi projects that launched on Solana in 2024. Include project name, website, brief description, and current TVL if available.',
    'Research',
    3.00,
    10,
    NOW() + INTERVAL '3 days',
    33.00,
    'text',
    ARRAY['Must be launched in 2024', 'Include website links', 'Verify projects are on Solana', 'Include TVL or user count'],
    'open'
  );

  -- Task 4: Testing
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Test TaskBlitz on mobile and report bugs',
    'Open TaskBlitz on your mobile device, try creating a task, submitting work, and browsing the marketplace. Report any bugs, UI issues, or suggestions for improvement.',
    'Testing',
    1.50,
    15,
    NOW() + INTERVAL '4 days',
    24.75,
    'text',
    ARRAY['Must test on actual mobile device', 'Include device model and browser', 'List at least 3 observations', 'Include screenshots if possible'],
    'open'
  );

  -- Task 5: Marketing
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Create a meme about crypto freelancing',
    'Design a funny meme about the struggles or joys of crypto freelancing. Should be relatable to the Web3 community and mention TaskBlitz.',
    'Marketing',
    5.00,
    5,
    NOW() + INTERVAL '7 days',
    27.50,
    'file',
    ARRAY['Original creation only', 'Must be funny/relatable', 'Include TaskBlitz branding', 'High quality image (min 1080px width)'],
    'open'
  );

  -- Task 6: Data Entry
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Compile list of 20 Solana NFT projects with Discord links',
    'Create a spreadsheet with 20 active Solana NFT projects. Include: Project name, Twitter handle, Discord invite link, and floor price.',
    'Data Entry',
    4.00,
    5,
    NOW() + INTERVAL '2 days',
    22.00,
    'url',
    ARRAY['Must be active projects', 'Verify Discord links work', 'Include current floor prices', 'Format as Google Sheets'],
    'open'
  );

  -- Task 7: Community (Funny)
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    '🎭 Explain blockchain to your grandma (and record it)',
    'Try explaining blockchain technology to your grandma (or someone who knows nothing about crypto). Record a 30-second video of their reaction. Bonus points if they actually understand it!',
    'Community',
    3.00,
    10,
    NOW() + INTERVAL '7 days',
    33.00,
    'url',
    ARRAY['Must be actual recording', 'Keep it under 30 seconds', 'Must be family-friendly', 'Upload to YouTube/TikTok and share link'],
    'open'
  );

  -- Task 8: Reviews
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Compare TaskBlitz with 2 other freelance platforms',
    'Write a comparison between TaskBlitz and 2 other freelance/gig platforms (Fiverr, Upwork, etc.). Focus on fees, payment speed, and user experience.',
    'Reviews',
    6.00,
    5,
    NOW() + INTERVAL '5 days',
    33.00,
    'text',
    ARRAY['Compare at least 3 aspects', 'Be objective and fair', 'Include pros and cons', 'Minimum 200 words'],
    'open'
  );

  -- Task 9: Surveys
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Quick survey: What features do you want in TaskBlitz?',
    'Answer 5 quick questions about what features you would like to see added to TaskBlitz. Your feedback will directly influence our roadmap!',
    'Surveys',
    0.75,
    100,
    NOW() + INTERVAL '7 days',
    82.50,
    'text',
    ARRAY['Answer all 5 questions', 'Be specific and constructive', 'No generic answers', 'Minimum 50 words total'],
    'open'
  );

  -- Task 10: Content Creation
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Create a 30-second TikTok about earning crypto',
    'Make a short, engaging TikTok video about earning crypto through micro-tasks. Show TaskBlitz in action and make it fun!',
    'Content Creation',
    8.00,
    10,
    NOW() + INTERVAL '7 days',
    88.00,
    'url',
    ARRAY['Must be original content', 'Include TaskBlitz mention', 'Post on TikTok', 'Provide link to video'],
    'open'
  );

  -- Task 11: Research
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Find 10 active Solana developer communities',
    'Research and list 10 active Solana developer communities (Discord, Telegram, forums). Include member count and activity level.',
    'Research',
    2.50,
    8,
    NOW() + INTERVAL '4 days',
    22.00,
    'text',
    ARRAY['Must be active communities', 'Include invite links', 'Estimate member count', 'Note activity level (high/medium/low)'],
    'open'
  );

  -- Task 12: Social Media
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Share TaskBlitz in 3 relevant crypto Telegram groups',
    'Find 3 crypto/freelance Telegram groups and share TaskBlitz with a brief introduction. Must be relevant groups with 500+ members.',
    'Social Media',
    1.00,
    25,
    NOW() + INTERVAL '3 days',
    27.50,
    'text',
    ARRAY['Groups must have 500+ members', 'Must be relevant to crypto/freelancing', 'Include group names and member counts', 'Provide screenshots'],
    'open'
  );

  -- Task 13: Testing (Funny)
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    '🐛 Try to break TaskBlitz (ethically)',
    'Put on your hacker hat and try to find bugs, exploits, or weird edge cases in TaskBlitz. Report anything unusual you find. No actual hacking please!',
    'Testing',
    10.00,
    5,
    NOW() + INTERVAL '7 days',
    55.00,
    'text',
    ARRAY['Must be ethical testing only', 'Describe steps to reproduce', 'Include screenshots', 'No actual exploitation'],
    'open'
  );

  -- Task 14: Marketing
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Design a cool logo concept for TaskBlitz',
    'Create an alternative logo design for TaskBlitz. Should incorporate lightning/speed theme and work well at small sizes.',
    'Marketing',
    15.00,
    3,
    NOW() + INTERVAL '5 days',
    49.50,
    'file',
    ARRAY['Original design only', 'Provide PNG and SVG', 'Include color and black/white versions', 'Minimum 1000px width'],
    'open'
  );

  -- Task 15: Data Entry
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Transcribe 5-minute podcast clip about Solana',
    'Listen to a 5-minute podcast clip about Solana and transcribe it accurately. Include timestamps every minute.',
    'Data Entry',
    5.00,
    3,
    NOW() + INTERVAL '2 days',
    16.50,
    'text',
    ARRAY['Must be accurate transcription', 'Include timestamps', 'Proper punctuation and formatting', 'Note any unclear audio'],
    'open'
  );

  -- Task 16: Community
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Invite 5 friends to try TaskBlitz',
    'Invite 5 friends to sign up and try TaskBlitz. They must complete at least one task. Provide their usernames as proof.',
    'Community',
    4.00,
    10,
    NOW() + INTERVAL '7 days',
    44.00,
    'text',
    ARRAY['Must be real users', 'They must complete a task', 'Provide their usernames', 'No fake accounts'],
    'open'
  );

  -- Task 17: Reviews (Funny)
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    '⭐ Rate your experience: Would you recommend TaskBlitz to your dog?',
    'Write a humorous review of TaskBlitz from your pet''s perspective. Would they recommend it to other pets? Why or why not? Be creative!',
    'Reviews',
    2.00,
    15,
    NOW() + INTERVAL '7 days',
    33.00,
    'text',
    ARRAY['Must be funny/creative', 'Write from pet perspective', 'Minimum 100 words', 'Include pet name and species'],
    'open'
  );

  -- Task 18: Content Creation
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Write a Twitter thread about Web3 freelancing',
    'Create a 5-tweet thread about the future of freelancing in Web3. Include benefits, challenges, and mention TaskBlitz as an example.',
    'Content Creation',
    3.50,
    10,
    NOW() + INTERVAL '4 days',
    38.50,
    'text',
    ARRAY['Exactly 5 tweets', 'Each under 280 characters', 'Include relevant hashtags', 'Engaging and informative'],
    'open'
  );

  -- Task 19: Research
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'List 15 ways to earn crypto without investing',
    'Research and compile a list of 15 legitimate ways to earn cryptocurrency without investing money. Include brief descriptions and difficulty levels.',
    'Research',
    4.50,
    5,
    NOW() + INTERVAL '5 days',
    24.75,
    'text',
    ARRAY['Must be legitimate methods', 'Include difficulty rating', 'Brief description for each', 'No scams or referral schemes'],
    'open'
  );

  -- Task 20: Social Media
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Create an Instagram story showcasing TaskBlitz',
    'Make an engaging Instagram story showing how TaskBlitz works. Include screenshots, your experience, and a call-to-action.',
    'Social Media',
    2.50,
    20,
    NOW() + INTERVAL '7 days',
    55.00,
    'url',
    ARRAY['Must post on Instagram', 'Include TaskBlitz screenshots', 'Add engaging text/stickers', 'Provide story link or screenshot'],
    'open'
  );

  -- Show success message
  RAISE NOTICE '✅ Successfully created 20 demo tasks for wallet: 3NAsTFu71YSXzGr78XV6jLC4YaqdJB93Ep43LtVKkFxR';
  
END $$;

-- Verify tasks were created
SELECT COUNT(*) as total_tasks, 
       SUM(workers_needed) as total_worker_spots,
       SUM(escrow_amount) as total_escrow_value
FROM tasks 
WHERE requester_id IN (
  SELECT id FROM users WHERE wallet_address = '3NAsTFu71YSXzGr78XV6jLC4YaqdJB93Ep43LtVKkFxR'
);

-- Show all your tasks
SELECT title, category, payment_per_task, workers_needed, status
FROM tasks 
WHERE requester_id IN (
  SELECT id FROM users WHERE wallet_address = '3NAsTFu71YSXzGr78XV6jLC4YaqdJB93Ep43LtVKkFxR'
)
ORDER BY created_at DESC;
