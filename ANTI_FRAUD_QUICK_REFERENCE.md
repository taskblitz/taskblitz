# 🛡️ Anti-Fraud System - Quick Reference Card

## 🚀 One-Command Setup

```sql
-- Run this in Supabase SQL Editor:
-- Copy/paste entire supabase-anti-fraud-schema.sql file
-- Click "Run"
-- Done! ✅
```

---

## 🔢 Key Numbers

| Metric | Value | Meaning |
|--------|-------|---------|
| Rejection Limit | 20% | Max rejections per task |
| Auto-Approval | 72 hours | Pending → Approved |
| Trusted Badge | 90%+ | Green badge |
| Flagged Threshold | <60% | Red flag |
| Min Reviews | 5 | Before flagging |

---

## 🎨 Reputation Colors

| Rate | Color | Badge | Status |
|------|-------|-------|--------|
| 90-100% | 🟢 Green | Trusted | Safe to work |
| 70-89% | 🟡 Yellow | Average | Normal |
| 50-69% | 🟠 Orange | Risky | Be careful |
| <50% | 🔴 Red | Flagged | Avoid |

---

## 🔐 Protection Mechanisms

### 1. Rejection Limit (20%)
```
✅ Can reject: 20 out of 100 submissions
❌ Cannot reject: 21st submission
🤖 Auto-action: Remaining 80 auto-approved
🚩 Result: Requester flagged
```

### 2. Escrow Lock
```
📝 Worker submits → 🔒 Escrow locked
❌ Cannot cancel task
❌ Cannot withdraw funds
✅ Can only pay workers
```

### 3. Reputation System
```
📊 Approval Rate = Approved / (Approved + Rejected)
🎯 Updates automatically after each review
👁️ Visible on all task cards
🚩 Flags if <60% with 5+ reviews
```

### 4. Dispute Resolution
```
👷 Worker files dispute
👨‍💼 Admin reviews (48h target)
✅ Approve worker → Payment released
❌ Uphold rejection → No payment
🗑️ Dismiss → Close without action
```

---

## 📱 UI Components

### ReputationBadge
```tsx
<ReputationBadge 
  approvalRate={94.5} 
  totalReviews={50}
  isCompact={true} 
/>
// Shows: 🟢 95%
```

### DisputeModal
```tsx
<DisputeModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  submission={submission}
  onDisputeCreated={handleRefresh}
/>
// Worker files dispute
```

### RejectionWarning
```tsx
<RejectionWarning
  workersCompleted={10}
  workersRejected={2}
  rejectionLimitPercentage={20}
/>
// Shows: "You can reject 0 more submissions"
```

---

## 🗄️ Database Queries

### Check Reputation
```sql
SELECT 
  username,
  approval_rate,
  total_approved,
  total_rejections,
  is_flagged
FROM users
WHERE wallet_address = 'WALLET_ADDRESS';
```

### View Disputes
```sql
SELECT * FROM disputes 
WHERE status = 'open'
ORDER BY created_at DESC;
```

### Check Rejection Rate
```sql
SELECT 
  title,
  workers_completed,
  workers_rejected,
  ROUND((workers_rejected::DECIMAL / workers_completed) * 100, 2) as rejection_rate
FROM tasks
WHERE workers_completed > 0
ORDER BY rejection_rate DESC;
```

### Find Flagged Users
```sql
SELECT * FROM flagged_users;
```

### Find Flagged Tasks
```sql
SELECT * FROM flagged_tasks;
```

---

## 🔧 Admin Actions

### Make User Admin
```sql
UPDATE users 
SET is_admin = TRUE 
WHERE wallet_address = 'WALLET_ADDRESS';
```

### Resolve Dispute (Approve Worker)
```typescript
await resolveDispute(
  disputeId,
  'resolved_worker',
  'Submission was valid, rejection unfair',
  adminWallet
)
```

### Resolve Dispute (Uphold Rejection)
```typescript
await resolveDispute(
  disputeId,
  'resolved_requester',
  'Rejection was justified',
  adminWallet
)
```

### Unflag User
```sql
UPDATE users 
SET is_flagged = FALSE 
WHERE id = 'USER_ID';
```

---

## 🧪 Testing Commands

### Test Rejection Limit
```typescript
// Reject submissions until limit hit
for (let i = 0; i < 3; i++) {
  await rejectSubmission(submissionIds[i], taskId, 'Test rejection')
}
// 3rd rejection should fail if limit is 20% and only 10 submissions
```

### Test Reputation Update
```typescript
// Approve/reject submissions
await approveSubmission(submissionId, taskId)
await rejectSubmission(submissionId, taskId, 'Reason')

// Check reputation updated
const user = await getUserByWallet(walletAddress)
console.log('Approval rate:', user.approval_rate)
```

### Test Dispute Filing
```typescript
await createDispute({
  submissionId: 'submission-id',
  taskId: 'task-id',
  workerWallet: 'worker-wallet',
  disputeReason: 'My work was correct',
  workerEvidence: 'https://proof.com/screenshot.png'
})
```

---

## 📊 Monitoring Queries

### Platform Health
```sql
-- Overall approval rate
SELECT AVG(approval_rate) as platform_approval_rate
FROM users
WHERE total_approved + total_rejections > 0;

-- Dispute volume
SELECT 
  status,
  COUNT(*) as count
FROM disputes
GROUP BY status;

-- Flagged users count
SELECT COUNT(*) FROM users WHERE is_flagged = TRUE;
```

### Top Requesters
```sql
SELECT 
  username,
  approval_rate,
  tasks_posted,
  total_approved,
  total_rejections
FROM users
WHERE tasks_posted > 0
ORDER BY approval_rate DESC
LIMIT 10;
```

### Problem Tasks
```sql
SELECT 
  t.title,
  u.username,
  t.workers_completed,
  t.workers_rejected,
  ROUND((t.workers_rejected::DECIMAL / t.workers_completed) * 100, 2) as rejection_rate
FROM tasks t
JOIN users u ON t.requester_id = u.id
WHERE t.workers_completed > 0
  AND (t.workers_rejected::DECIMAL / t.workers_completed) > 0.15
ORDER BY rejection_rate DESC;
```

---

## 🚨 Alert Thresholds

| Metric | Warning | Critical | Action |
|--------|---------|----------|--------|
| Platform Approval Rate | <90% | <85% | Review flagged users |
| Open Disputes | >10 | >25 | Add admin capacity |
| Flagged Users | >5% | >10% | Review flagging logic |
| Avg Resolution Time | >48h | >72h | Speed up reviews |

---

## 🔗 File Reference

| File | Purpose |
|------|---------|
| `supabase-anti-fraud-schema.sql` | Database migration |
| `lib/database.ts` | Backend functions |
| `components/ReputationBadge.tsx` | Show approval rate |
| `components/DisputeModal.tsx` | File disputes |
| `components/RejectionWarning.tsx` | Warn about limits |
| `app/admin/disputes/page.tsx` | Admin dashboard |
| `ANTI_FRAUD_COMPLETE.md` | Full documentation |
| `ANTI_FRAUD_SETUP.md` | Setup guide |

---

## 💡 Pro Tips

1. **Monitor Early:** Watch metrics closely first week
2. **Train Admins:** Ensure team knows dispute process
3. **Set Expectations:** Tell users about 20% limit upfront
4. **Be Consistent:** Apply rules fairly to all users
5. **Document Decisions:** Keep notes on dispute resolutions
6. **Adjust if Needed:** 20% limit can be changed per-task

---

## 🆘 Emergency Contacts

**Database Issues:**
- Check Supabase logs
- Verify migration completed
- Test functions manually

**Frontend Issues:**
- Check browser console
- Verify component imports
- Test with simple data

**Logic Issues:**
- Review trigger logs
- Check function execution
- Verify RLS policies

---

## ✅ Daily Checklist

- [ ] Check open disputes count
- [ ] Review new flagged users
- [ ] Monitor platform approval rate
- [ ] Resolve disputes <48h old
- [ ] Check for stuck submissions
- [ ] Review rejection rate trends

---

**Print this card and keep it handy!** 📋
