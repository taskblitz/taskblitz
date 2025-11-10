-- Realistic Demo Tasks - 20 Tasks Total
-- For wallet: 3NAsTFu71YSXzGr78XV6jLC4YaqdJB93Ep43LtVKkFxR
-- 5 Funny + 7 Crypto + 8 General Micro-tasks

DO $$
DECLARE
  my_user_id UUID;
BEGIN
  SELECT id INTO my_user_id FROM users 
  WHERE wallet_address = '3NAsTFu71YSXzGr78XV6jLC4YaqdJB93Ep43LtVKkFxR';

  IF my_user_id IS NULL THEN
    INSERT INTO users (wallet_address, username, role)
    VALUES ('3NAsTFu71YSXzGr78XV6jLC4YaqdJB93Ep43LtVKkFxR', 'CryptoTasker', 'both')
    RETURNING id INTO my_user_id;
  END IF;

  -- ============================================
  -- FUNNY TASKS (5)
  -- ============================================

  -- Funny 1
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    '🎭 Explain NFTs to your grandma and record her reaction',
    'Try explaining NFTs to your grandma (or someone over 60). Record a 30-second video of their reaction. Bonus if they think you''re in a cult!',
    'Community',
    3.00,
    10,
    NOW() + INTERVAL '7 days',
    33.00,
    'url',
    ARRAY['Must be actual recording', 'Keep under 30 seconds', 'Family-friendly', 'Upload to YouTube/TikTok'],
    'open'
  );

  -- Funny 2
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    '🐕 Write a Yelp review of your local park from your dog''s perspective',
    'Pretend you''re your dog and write a detailed Yelp review of your local park. Rate the sniffs, squirrels, and overall ambiance. Be creative and funny!',
    'Reviews',
    2.50,
    15,
    NOW() + INTERVAL '7 days',
    41.25,
    'text',
    ARRAY['Must be funny/creative', 'Minimum 150 words', 'Include dog name and breed', 'Rate out of 5 bones'],
    'open'
  );

  -- Funny 3
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    '🎨 Draw the worst possible logo for a Fortune 500 company',
    'Use MS Paint (or similar) to create the absolute worst logo redesign for a major company. Make it hilariously bad on purpose. Bonus for Comic Sans!',
    'Marketing',
    4.00,
    10,
    NOW() + INTERVAL '5 days',
    44.00,
    'file',
    ARRAY['Must be intentionally terrible', 'Use basic tools only', 'Include company name', 'Minimum 800px width'],
    'open'
  );

  -- Funny 4
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    '📱 Text your ex "I miss you" and screenshot their response',
    'Just kidding! Don''t do that. Instead, write a fictional conversation of what would happen if you did. Make it funny and relatable.',
    'Content Creation',
    2.00,
    20,
    NOW() + INTERVAL '7 days',
    44.00,
    'text',
    ARRAY['Must be fictional', 'Format as text conversation', 'Minimum 10 messages', 'Keep it funny and appropriate'],
    'open'
  );

  -- Funny 5
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    '🎤 Rap battle: You vs. Your Job (write lyrics)',
    'Write rap battle lyrics where you diss your current job and your job disses you back. 16 bars each. Make it funny and therapeutic!',
    'Content Creation',
    3.50,
    10,
    NOW() + INTERVAL '7 days',
    38.50,
    'text',
    ARRAY['16 bars for you, 16 for job', 'Must rhyme', 'Keep it funny', 'No actual company names'],
    'open'
  );

  -- ============================================
  -- CRYPTO TASKS (7)
  -- ============================================

  -- Crypto 1
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Find 5 new Solana projects launched this month',
    'Research and list 5 Solana projects that launched in the last 30 days. Include project name, website, Twitter, and brief description.',
    'Research',
    3.00,
    10,
    NOW() + INTERVAL '3 days',
    33.00,
    'text',
    ARRAY['Must be launched in last 30 days', 'Include all social links', 'Brief description for each', 'Verify on Solana'],
    'open'
  );

  -- Crypto 2
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Compile list of 15 active crypto Discord servers',
    'Find 15 active cryptocurrency Discord servers with 1000+ members. Include server name, invite link, member count, and main focus.',
    'Data Entry',
    4.00,
    5,
    NOW() + INTERVAL '4 days',
    22.00,
    'text',
    ARRAY['Minimum 1000 members each', 'Verify invite links work', 'Include member count', 'Note main topic'],
    'open'
  );

  -- Crypto 3
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Write a beginner''s guide to DeFi yield farming',
    'Create a simple, jargon-free guide explaining yield farming to complete beginners. Include risks, benefits, and how to get started.',
    'Content Creation',
    8.00,
    5,
    NOW() + INTERVAL '5 days',
    44.00,
    'text',
    ARRAY['Minimum 500 words', 'Explain like I''m 5', 'Include risks', 'No financial advice'],
    'open'
  );

  -- Crypto 4
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Compare gas fees across 5 different blockchains',
    'Research and compare current gas fees for simple transactions on Ethereum, Solana, Polygon, Arbitrum, and BSC. Include USD estimates.',
    'Research',
    5.00,
    5,
    NOW() + INTERVAL '2 days',
    27.50,
    'text',
    ARRAY['Must be current data', 'Include USD estimates', 'Compare simple transfers', 'Cite sources'],
    'open'
  );

  -- Crypto 5
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'List 20 ways to earn crypto without investing money',
    'Compile a list of 20 legitimate ways to earn cryptocurrency without investing. Include difficulty level and potential earnings.',
    'Research',
    6.00,
    5,
    NOW() + INTERVAL '5 days',
    33.00,
    'text',
    ARRAY['Must be legitimate', 'Include difficulty rating', 'Estimate earnings', 'No scams or ponzis'],
    'open'
  );

  -- Crypto 6
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Create a meme about crypto market volatility',
    'Design a funny meme about crypto price swings. Should be relatable to anyone who''s checked their portfolio at 3 AM.',
    'Marketing',
    4.00,
    10,
    NOW() + INTERVAL '7 days',
    44.00,
    'file',
    ARRAY['Original creation', 'Must be funny', 'High quality image', 'Crypto-related'],
    'open'
  );

  -- Crypto 7
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Explain the difference between Layer 1 and Layer 2 in 100 words',
    'Write a clear, concise explanation of L1 vs L2 blockchains that a non-technical person can understand. Exactly 100 words.',
    'Content Creation',
    2.50,
    15,
    NOW() + INTERVAL '4 days',
    41.25,
    'text',
    ARRAY['Exactly 100 words', 'No technical jargon', 'Include examples', 'Must be accurate'],
    'open'
  );

  -- ============================================
  -- GENERAL MICRO-TASKS (8)
  -- ============================================

  -- General 1
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Transcribe 3-minute podcast clip',
    'Listen to a 3-minute podcast segment and transcribe it word-for-word. Include timestamps every 30 seconds.',
    'Data Entry',
    4.00,
    5,
    NOW() + INTERVAL '2 days',
    22.00,
    'text',
    ARRAY['Must be accurate', 'Include timestamps', 'Proper punctuation', 'Note unclear audio'],
    'open'
  );

  -- General 2
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Find 10 productivity apps launched in 2024',
    'Research and list 10 productivity apps that launched this year. Include app name, platform, price, and key features.',
    'Research',
    3.00,
    8,
    NOW() + INTERVAL '4 days',
    26.40,
    'text',
    ARRAY['Must be launched in 2024', 'Include pricing', 'List key features', 'Verify availability'],
    'open'
  );

  -- General 3
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Write a 200-word review of your favorite coffee shop',
    'Write an honest review of your favorite local coffee shop. Include atmosphere, coffee quality, prices, and why you recommend it.',
    'Reviews',
    2.00,
    20,
    NOW() + INTERVAL '7 days',
    44.00,
    'text',
    ARRAY['Exactly 200 words', 'Must be real place', 'Include location', 'Be honest and detailed'],
    'open'
  );

  -- General 4
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Create a 30-day workout plan for beginners',
    'Design a simple 30-day workout plan for complete beginners. No equipment needed. Include daily exercises and rest days.',
    'Content Creation',
    10.00,
    3,
    NOW() + INTERVAL '5 days',
    33.00,
    'text',
    ARRAY['30 days planned out', 'No equipment needed', 'Include rest days', 'Beginner-friendly'],
    'open'
  );

  -- General 5
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Test mobile app and report 5 bugs or improvements',
    'Download and test a mobile app for 15 minutes. Report 5 bugs, UI issues, or suggestions for improvement.',
    'Testing',
    5.00,
    10,
    NOW() + INTERVAL '3 days',
    55.00,
    'text',
    ARRAY['Must test for 15+ minutes', 'Include device info', 'Describe steps to reproduce', 'Screenshots helpful'],
    'open'
  );

  -- General 6
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Compile list of 25 free online courses for career development',
    'Find 25 free online courses that help with career development. Include course name, platform, duration, and topic.',
    'Research',
    5.00,
    5,
    NOW() + INTERVAL '4 days',
    27.50,
    'text',
    ARRAY['Must be completely free', 'Include all details', 'Verify links work', 'Diverse topics'],
    'open'
  );

  -- General 7
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Answer 10-question survey about remote work',
    'Complete a quick survey about your remote work experience. Questions about productivity, challenges, and preferences.',
    'Surveys',
    1.00,
    50,
    NOW() + INTERVAL '7 days',
    55.00,
    'text',
    ARRAY['Answer all 10 questions', 'Be honest', 'Minimum 20 words per answer', 'Must have remote work experience'],
    'open'
  );

  -- General 8
  INSERT INTO tasks (requester_id, title, description, category, payment_per_task, workers_needed, deadline, escrow_amount, submission_type, requirements, status)
  VALUES (
    my_user_id,
    'Proofread 500-word article for grammar and spelling',
    'Review a 500-word article and correct all grammar, spelling, and punctuation errors. Highlight changes made.',
    'Data Entry',
    3.00,
    10,
    NOW() + INTERVAL '2 days',
    33.00,
    'text',
    ARRAY['Correct all errors', 'Highlight changes', 'Explain major corrections', 'Maintain original meaning'],
    'open'
  );

  RAISE NOTICE '✅ Created 20 realistic demo tasks (5 funny + 7 crypto + 8 general)';
  
END $$;

-- Verify
SELECT 
  COUNT(*) as total_tasks,
  SUM(workers_needed) as total_spots,
  SUM(escrow_amount) as total_value
FROM tasks 
WHERE requester_id IN (
  SELECT id FROM users WHERE wallet_address = '3NAsTFu71YSXzGr78XV6jLC4YaqdJB93Ep43LtVKkFxR'
);
