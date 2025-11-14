-- SECURE DELETE POLICIES
-- Remove the unsafe "USING (true)" policies and restrict deletions
-- Deletions should only happen through server-side API routes

-- Remove unsafe delete policies
DROP POLICY IF EXISTS "Allow task deletion" ON tasks;
DROP POLICY IF EXISTS "Allow submission deletion" ON submissions;
DROP POLICY IF EXISTS "Allow transaction deletion" ON transactions;
DROP POLICY IF EXISTS "Allow notification deletion" ON notifications;

-- Only allow deletions from server (you'll need to use service role key in API routes)
-- For now, we'll allow authenticated users but you should use service role in production
CREATE POLICY "Restrict task deletion"
ON tasks FOR DELETE
USING (false); -- No client-side deletions allowed

CREATE POLICY "Restrict submission deletion"
ON submissions FOR DELETE
USING (false); -- No client-side deletions allowed

CREATE POLICY "Restrict transaction deletion"
ON transactions FOR DELETE
USING (false); -- No client-side deletions allowed

CREATE POLICY "Restrict notification deletion"
ON notifications FOR DELETE
USING (false); -- No client-side deletions allowed
