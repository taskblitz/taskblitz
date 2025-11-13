# 🚀 Setup Guide: Advanced Features

Follow these steps to activate all the new advanced features on your TaskBlitz platform.

## 📋 Prerequisites

- Supabase project set up
- Database access
- Admin privileges

---

## Step 1: Run Database Migration

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy the contents of `supabase-task-templates.sql`
4. Paste and run the SQL script

This will create:
- `task_templates` table
- `bulk_task_jobs` table
- `webhooks` table
- `webhook_deliveries` table
- `api_rate_limits` table
- `api_usage` table
- `analytics_cache` table

Plus all necessary indexes and RLS policies.

---

## Step 2: Verify Tables Created

Run this query to verify all tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'task_templates',
  'bulk_task_jobs',
  'webhooks',
  'webhook_deliveries',
  'api_rate_limits',
  'api_usage',
  'analytics_cache'
);
```

You should see all 7 tables listed.

---

## Step 3: Test Each Feature

### Task Templates
1. Go to `/templates`
2. Click "Create Template"
3. Fill in task details
4. Save and verify it appears in "My Templates"

### Bulk Tasks
1. Go to `/bulk-tasks`
2. Download the CSV template
3. Fill in a few test tasks
4. Upload and watch the processing

### Analytics
1. Go to `/analytics`
2. Toggle between Worker and Client views
3. Verify charts render (may be empty if no data yet)

### Webhooks
1. Go to `/settings/webhooks`
2. Create a test webhook (use https://webhook.site for testing)
3. Trigger an event and check delivery logs

### API Keys
1. Go to `/settings/api`
2. Generate an API key
3. Copy and save it securely
4. View usage stats

---

## Step 4: Update Navigation (Optional)

Add links to new pages in your header or dashboard:

```tsx
// In Header.tsx or Dashboard
<Link href="/templates">Templates</Link>
<Link href="/bulk-tasks">Bulk Tasks</Link>
<Link href="/analytics">Analytics</Link>
<Link href="/settings/webhooks">Webhooks</Link>
<Link href="/settings/api">API Keys</Link>
```

---

## Step 5: Configure Storage (For Bulk Tasks)

Bulk task uploads require file storage. In Supabase:

1. Go to **Storage**
2. Create a bucket named `task-files`
3. Set **File size limit** to **5MB** (5242880 bytes)
4. Make bucket **public**
5. Set policies:

```sql
-- Allow authenticated users to upload (max 5MB)
CREATE POLICY "Users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'task-files' 
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND octet_length(decode(encode(content, 'escape'), 'escape')) < 5242880
);

-- Allow public read access
CREATE POLICY "Public can read files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'task-files');
```

**Note**: The 5MB limit prevents abuse and keeps storage costs manageable. Most CSV files with 1000+ tasks are well under 1MB.

---

## Step 6: Test Webhook Delivery

To test webhooks work correctly:

1. Go to https://webhook.site
2. Copy your unique URL
3. Create a webhook in TaskBlitz with that URL
4. Subscribe to `task.created` event
5. Post a test task
6. Check webhook.site for the delivery

---

## Step 7: Generate Test Data (Optional)

To see analytics in action, generate some test data:

```sql
-- Insert test analytics cache
INSERT INTO analytics_cache (user_id, metric_type, time_period, data)
VALUES (
  'YOUR_USER_ID',
  'worker_analytics',
  'weekly',
  '{
    "earnings_trend": [
      {"date": "2024-01-01", "amount": 100, "task_count": 5},
      {"date": "2024-01-02", "amount": 150, "task_count": 7}
    ],
    "task_performance": [],
    "peak_hours": [],
    "skill_analysis": []
  }'::jsonb
);
```

---

## 🔧 Troubleshooting

### Templates not saving
- Check RLS policies are enabled
- Verify user is authenticated
- Check browser console for errors

### Bulk upload fails
- Ensure storage bucket exists
- Check CSV format matches template
- Verify file size is under 5MB limit
- Check you have storage quota available

### Webhooks not delivering
- Check URL is publicly accessible
- Verify HTTPS (not HTTP)
- Check webhook is marked as active
- Review delivery logs for errors

### API rate limit errors
- Check API key is active
- Verify not exceeding limits
- Check usage stats for current count

### Analytics not loading
- Ensure user has completed tasks
- Check date range
- Clear analytics cache if stale

---

## 📊 Feature Usage Tips

### Task Templates
- Create templates for your most common tasks
- Make popular templates public to help the community
- Use descriptive names for easy finding

### Bulk Tasks
- Keep CSV files under 5MB (usually 1000-2000 tasks)
- Test with small batches first (10-20 tasks)
- Review error logs if tasks fail
- Compress large files if needed

### Analytics
- Check analytics weekly to spot trends
- Use peak hours data to optimize posting times
- Track skill analysis to focus on profitable categories

### Webhooks
- Use webhooks for critical notifications
- Set up retry logic in your endpoint
- Monitor delivery success rates

### API Keys
- Keep keys secure - never commit to git
- Rotate keys periodically
- Monitor usage to detect anomalies

---

## 🎉 You're All Set!

All advanced features are now active. Your TaskBlitz platform is now enterprise-ready with:

✅ Task Templates for efficiency
✅ Bulk Creation for scale
✅ Advanced Analytics for insights
✅ Webhooks for integrations
✅ API Access for developers
✅ Rate Limiting for security

---

## 📚 Next Steps

1. **Documentation**: Share the `/docs` page with users
2. **Marketing**: Announce new features to your community
3. **Tutorials**: Create video guides for each feature
4. **Monitoring**: Set up alerts for webhook failures
5. **Optimization**: Monitor analytics cache performance

---

## 🆘 Need Help?

- Check `ADVANCED_FEATURES_COMPLETE.md` for detailed feature info
- Review code comments in lib files
- Test each feature thoroughly before production
- Monitor Supabase logs for errors

---

**Estimated Setup Time**: 15-30 minutes

**Status**: Ready for production! 🚀
