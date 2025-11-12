-- REPLACE ALL TASKS - Clean up old and add new realistic ones
-- For wallet: 3NAsTFu71YSXzGr78XV6jLC4YaqdJB93Ep43LtVKkFxR

DO $$
DECLARE
  my_user_id UUID;
BEGIN
  -- Get user ID
  SELECT id INTO my_user_id FROM users 
  WHERE wallet_address = '3NAsTFu71YSXzGr78XV6jLC4YaqdJB93Ep43LtVKkFxR';

  IF my_user_id IS NULL THEN
    INSERT INTO users (wallet_address, username, role)
    VALUES ('3NAsTFu71YSXzGr78XV6jLC4YaqdJB93Ep43LtVKkFxR', 'CryptoTasker', 'both')
    RETURNING id INTO my_user_id;
  END IF;

  -- DELETE ALL OLD TASKS AND SUBMISSIONS
  DELETE FROM submissions WHERE task IN (
    SELECT id FROM tasks WHERE requester_id = my_user_id
  );
  DELETE FROM tasks WHERE requester_id = my_user_id;

  RAISE NOTICE '🧹 Cleaned up old tasks';

  -- NOW ADD NEW TASKS
  -- (Copy all the INSERT statements from supabase-realistic-demo-tasks.sql here)
  
END $$;
