-- Add User Profiles and Rating System
-- Run this migration in Supabase SQL Editor

-- 1. Add profile fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS rating_as_requester DECIMAL(3,2) DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS rating_as_worker DECIMAL(3,2) DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_ratings_received INTEGER DEFAULT 0;

-- 2. Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review_text TEXT,
  rating_type TEXT CHECK (rating_type IN ('requester', 'worker')) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(task_id, from_user_id, to_user_id)
);

-- 3. Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('submission_approved', 'submission_rejected', 'task_completed', 'new_submission', 'payment_received', 'rating_received')) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Add file storage fields to submissions
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS file_name TEXT;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS file_size INTEGER;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS file_type TEXT;

-- 5. Create indexes
CREATE INDEX IF NOT EXISTS idx_ratings_to_user ON ratings(to_user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_from_user ON ratings(from_user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_task ON ratings(task_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- 6. Enable RLS on new tables
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for ratings
CREATE POLICY "Anyone can view ratings" ON ratings FOR SELECT USING (true);
CREATE POLICY "Users can create ratings for completed tasks" ON ratings FOR INSERT WITH CHECK (
  from_user_id IN (SELECT id FROM users WHERE wallet_address = current_setting('app.current_user_wallet'))
  AND task_id IN (
    SELECT id FROM tasks WHERE status = 'completed'
  )
);

-- 8. RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (
  user_id IN (SELECT id FROM users WHERE wallet_address = current_setting('app.current_user_wallet'))
);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (
  user_id IN (SELECT id FROM users WHERE wallet_address = current_setting('app.current_user_wallet'))
);

-- 9. Function to update user ratings
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update rating for the rated user
  UPDATE users
  SET 
    rating_as_requester = CASE 
      WHEN NEW.rating_type = 'requester' THEN (
        SELECT AVG(rating)::DECIMAL(3,2) 
        FROM ratings 
        WHERE to_user_id = NEW.to_user_id AND rating_type = 'requester'
      )
      ELSE rating_as_requester
    END,
    rating_as_worker = CASE 
      WHEN NEW.rating_type = 'worker' THEN (
        SELECT AVG(rating)::DECIMAL(3,2) 
        FROM ratings 
        WHERE to_user_id = NEW.to_user_id AND rating_type = 'worker'
      )
      ELSE rating_as_worker
    END,
    total_ratings_received = (
      SELECT COUNT(*) 
      FROM ratings 
      WHERE to_user_id = NEW.to_user_id
    )
  WHERE id = NEW.to_user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Trigger to update ratings
DROP TRIGGER IF EXISTS trigger_update_user_rating ON ratings;
CREATE TRIGGER trigger_update_user_rating
AFTER INSERT ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_user_rating();

-- 11. Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_link TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, link)
  VALUES (p_user_id, p_type, p_title, p_message, p_link)
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql;

-- 12. Enable realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE ratings;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Done! New features added:
-- ✅ User profiles (username, bio, avatar, email)
-- ✅ Email notification preferences
-- ✅ Rating system (1-5 stars for requesters and workers)
-- ✅ Notifications table
-- ✅ File metadata in submissions
-- ✅ Auto-updating rating averages
