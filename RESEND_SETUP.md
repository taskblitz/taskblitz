# Resend Email Setup - IMPORTANT! ⚠️

## Current Status

✅ API Key added to `.env.local`
✅ Email code activated in `lib/notifications.ts`
❌ **Domain verification needed**

---

## Problem

Your email is set to send from: `notifications@taskblitz.click`

But Resend requires domain verification before you can send emails from your custom domain.

---

## Quick Fix Options

### Option 1: Use Resend's Test Domain (Immediate)

Change the "from" address to use Resend's test domain:

```typescript
// In lib/notifications.ts, line ~50
from: 'TaskBlitz <onboarding@resend.dev>',  // ← Change this
```

**Pros:** Works immediately, no setup
**Cons:** Emails come from `@resend.dev` instead of your domain

---

### Option 2: Verify Your Domain (Recommended)

1. **Go to Resend Dashboard:**
   - https://resend.com/domains

2. **Add Domain:**
   - Click "Add Domain"
   - Enter: `taskblitz.click`

3. **Add DNS Records:**
   Resend will give you DNS records to add. Go to your domain registrar and add:
   
   ```
   Type: TXT
   Name: _resend
   Value: [provided by Resend]
   
   Type: CNAME
   Name: resend._domainkey
   Value: [provided by Resend]
   ```

4. **Wait for Verification:**
   - Usually takes 5-30 minutes
   - Resend will verify automatically

5. **Test:**
   ```bash
   # After verification, test sending an email
   ```

---

## Current Email Configuration

**From Address:** `TaskBlitz <notifications@taskblitz.click>`
**API Key:** ✅ Set in `.env.local`
**Status:** ⚠️ Will fail until domain verified

---

## Temporary Solution (Use Now)

Update `lib/notifications.ts`:

```typescript
from: 'TaskBlitz <onboarding@resend.dev>',
```

This will work immediately while you set up domain verification.

---

## Email Types Being Sent

1. **Submission Approved** → Worker
2. **Submission Rejected** → Worker  
3. **Task Completed** → Requester
4. **New Submission** → Requester
5. **Payment Received** → Worker
6. **Rating Received** → Both

All emails will be sent automatically when these events occur!

---

## Testing Emails

After setup, test by:

1. Creating a test task
2. Submitting work
3. Approving the submission
4. Check if email arrives

Or manually test:

```typescript
import { notifySubmissionApproved } from '@/lib/notifications'

await notifySubmissionApproved(
  'user-id',
  'Test Task',
  5.00,
  'task-id'
)
```

---

## What Happens Now

**Without domain verification:**
- ❌ Emails will fail to send
- ✅ In-app notifications still work
- ✅ Users can still use the platform

**With domain verification:**
- ✅ Emails send successfully
- ✅ Professional sender address
- ✅ Better deliverability

---

## Quick Start (Choose One)

### A. Use Test Domain (5 seconds)
```typescript
// lib/notifications.ts line ~50
from: 'TaskBlitz <onboarding@resend.dev>',
```

### B. Verify Domain (30 minutes)
1. Go to https://resend.com/domains
2. Add `taskblitz.click`
3. Add DNS records
4. Wait for verification
5. Done!

---

## Recommendation

**For testing now:** Use Option A (test domain)
**For production:** Use Option B (verify domain)

You can switch from A to B anytime by just changing one line of code!

---

## Need Help?

Resend docs: https://resend.com/docs/dashboard/domains/introduction
