-- Fix Supabase Storage RLS Policies for File Uploads
-- Run this in Supabase SQL Editor

-- First, ensure the storage bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('task-submissions', 'task-submissions', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to upload files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to read files" ON storage.objects;

-- Create policy to allow anyone to upload files to task-submissions bucket
CREATE POLICY "Allow public uploads to task-submissions"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'task-submissions');

-- Create policy to allow anyone to read files from task-submissions bucket
CREATE POLICY "Allow public reads from task-submissions"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'task-submissions');

-- Create policy to allow users to update their own files
CREATE POLICY "Allow public updates to task-submissions"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'task-submissions')
WITH CHECK (bucket_id = 'task-submissions');

-- Create policy to allow users to delete files
CREATE POLICY "Allow public deletes from task-submissions"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'task-submissions');

-- Verify the policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects' AND policyname LIKE '%task-submissions%';
