# Anti-Fraud System Setup Guide

## Quick Start (5 Minutes)

### Step 1: Run Database Migration

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy and paste the contents of `supabase-anti-fraud-schema.sql`
4. Click **Run**
5. Wait for success message: "✅ Anti-fraud schema installed successfully!"

### Step 2: Verify Installation

Run this query in SQL Editor to verify:

```sql
-- Check new columns exist
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'tasks' 
  AND column_name IN ('rejection_limit_percentage', 'workers_rejected', 'can_cancel', 'is_flagged');

-- Check disputes table exists
SELECT COUNT(*) FROM disputes;

-- Check functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name IN ('check_rejection_limit', 'update_requester_reputation');
```

Expected results:
- 4 columns found in tasks table
- 0 rows in disputes table (empty is good)
- 2 functions found

### Step 3: Test the System

#### Test 1: Create a Task
```typescript
// Your existing task creation flow works unchanged
// The system automatically sets:
// - rejection_limit_percentage = 20
// - workers_rejected = 0
// - can_cancel = true (until first submission)
```

#### Test 2: Submit Work
```typescript
// When first worker submits:
// - workers_completed increments
// - can_cancel automatically set to FALSE (escrow locked!)
```

#### Test 3: Reject a Submission
```typescript
// Try rejecting submissions:
// - First 20% of submissions: ✅ Allowed
// - After 20% limit: ❌ Blocked with error message
// - Remaining pending submissions: Auto-approved
```

#### Test 4: Check Reputation
```typescript
// After approving/rejecting submissions:
// - Requester approval_rate automatically calculated
// - Reputation badge shows on task cards
// - Color changes based on approval rate
```

#### Test 5: File a Dispute
```typescript
// As a worker with rejected submission:
// 1. Go to your submissions
// 2. Find rejected submission
// 3. Click "File Dispute"
// 4. Fill out form
// 5. Check /admin/disputes to see it
```

## Component Integration

### Show Reputation on Task Cards

Your task cards already show reputation if you pass the data:

```typescript
// In your task list component:
const tasks = await getAllTasks() // Already includes approval_rate

// TaskCard automatically shows reputation badge if data exists
<TaskCard 
  task={{
    ...task,
    requesterApprovalRate: task.requester.approval_rate,
    requesterTotalReviews: task.requester.total_approved + task.requester.total_rejections
  }} 
/>
```

### Enable Dispute Filing

Your SubmissionCard already has dispute functionality:

```typescript
// Just pass the rejection_reason from database:
<SubmissionCard 
  submission={{
    ...submission,
    rejectionReason: submission.rejection_reason // From database
  }}
  onDisputeCreated={() => {
    // Refresh submissions list
    loadSubmissions()
  }}
/>
```

### Show Rejection Warnings

Add to your task management page:

```typescript
import RejectionWarning from '@/components/RejectionWarning'

// In your task detail page:
<RejectionWarning
  workersCompleted={task.workers_completed}
  workersRejected={task.workers_rejected}
  rejectionLimitPercentage={task.rejection_limit_percentage}
/>
```

## Admin Dashboard Access

### Option 1: Make Yourself Admin

```sql
-- In Supabase SQL Editor:
UPDATE users 
SET is_admin = TRUE 
WHERE wallet_address = 'YOUR_WALLET_ADDRESS_HERE';
```

### Option 2: Use Service Role (Temporary)

For testing, you can access `/admin/disputes` without authentication. In production, add proper auth checks.

## Testing Checklist

- [ ] Database migration ran successfully
- [ ] New columns visible in Supabase table editor
- [ ] Disputes table created
- [ ] Functions and triggers working
- [ ] Task cards show reputation badges
- [ ] Rejected submissions show "File Dispute" button
- [ ] Dispute modal opens and submits
- [ ] Admin dashboard loads at `/admin/disputes`
- [ ] Rejection limit blocks after 20%
- [ ] Reputation updates after reviews

## Common Issues

### Issue: "Function check_rejection_limit does not exist"
**Solution:** Re-run the migration SQL. Make sure you ran the entire file.

### Issue: "Column rejection_limit_percentage does not exist"
**Solution:** The ALTER TABLE commands may have failed. Run them individually:
```sql
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS rejection_limit_percentage INT DEFAULT 20;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS workers_rejected INT DEFAULT 0;
-- etc.
```

### Issue: Reputation badge not showing
**Solution:** Make sure you're passing the requester data:
```typescript
// Check that getAllTasks includes approval_rate:
.select(`
  *,
  requester:users!tasks_requester_id_fkey(
    wallet_address, 
    username, 
    approval_rate,  // ← Make sure this is included
    total_approved, 
    total_rejections
  )
`)
```

### Issue: Dispute modal not opening
**Solution:** Check browser console for errors. Make sure DisputeModal is imported correctly.

### Issue: Admin dashboard shows "not authorized"
**Solution:** Either:
1. Set `is_admin = TRUE` for your user in database
2. Remove auth check temporarily for testing
3. Use Supabase service role key

## Next Steps

After basic testing works:

1. **Set up auto-approval cron job** (see ANTI_FRAUD_IMPLEMENTATION.md)
2. **Configure admin authentication** properly
3. **Add email notifications** for disputes
4. **Monitor platform metrics** (approval rates, dispute volume)
5. **Adjust rejection limit** if needed (default is 20%)

## Support

If you encounter issues:
1. Check Supabase logs for database errors
2. Check browser console for frontend errors
3. Verify all migration steps completed
4. Test with simple scenarios first

## Configuration Options

### Change Rejection Limit

Default is 20%. To change for all new tasks:

```sql
-- Change default to 30%
ALTER TABLE tasks 
ALTER COLUMN rejection_limit_percentage 
SET DEFAULT 30;
```

Or per-task when creating:

```typescript
await supabase.from('tasks').insert({
  // ... other fields
  rejection_limit_percentage: 30 // Custom limit
})
```

### Adjust Reputation Thresholds

Edit the `update_requester_reputation()` function:

```sql
-- Current thresholds:
-- 90%+ = 100 reputation (Trusted)
-- 70-89% = 75 reputation (Average)
-- 50-69% = 50 reputation (Risky)
-- <50% = 25 reputation (Flagged)

-- Modify in the function definition if needed
```

### Change Auto-Flag Threshold

Currently flags users with <60% approval rate and >5 reviews:

```sql
-- In update_requester_reputation function:
is_flagged = CASE 
  WHEN new_approval_rate < 60 AND total_reviews > 5 THEN TRUE
  ELSE is_flagged
END
```

## Production Checklist

Before going live:

- [ ] Test all scenarios thoroughly on devnet
- [ ] Set up proper admin authentication
- [ ] Implement 72-hour auto-approval cron
- [ ] Add email notifications
- [ ] Monitor initial metrics closely
- [ ] Have dispute resolution process documented
- [ ] Train admin team on dispute handling
- [ ] Set up alerting for high dispute volume
- [ ] Document escalation procedures
- [ ] Test with real users on testnet first

---

**You're all set!** The anti-fraud system is ready to protect your platform. 🛡️
