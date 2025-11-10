# 📧 Feedback System Setup Guide

## Overview
Users can submit feedback (suggestions, bug reports, feature requests) directly from the app, and you'll receive it via email.

## Features
- ✅ Beautiful feedback form with type selection
- ✅ Wallet-gated (only connected users can submit)
- ✅ Email notifications with formatted HTML
- ✅ Includes user's wallet address for follow-up
- ✅ Responsive design (mobile & desktop)
- ✅ Added to navigation menu (only for connected users)

## Setup Instructions

### Option 1: Resend (Recommended - Easiest)

1. **Sign up for Resend** (free tier available)
   - Go to https://resend.com
   - Sign up for a free account
   - Get 100 emails/day free

2. **Get your API key**
   - Go to API Keys section
   - Create a new API key
   - Copy the key

3. **Add to environment variables**
   ```bash
   RESEND_API_KEY=re_your_api_key_here
   FEEDBACK_EMAIL=your-email@example.com
   ```

4. **Verify domain (optional but recommended)**
   - Add your domain in Resend dashboard
   - Update the `from` field in `app/api/feedback/route.ts`:
   ```typescript
   from: 'TaskBlitz Feedback <feedback@yourdomain.com>'
   ```

### Option 2: SendGrid

1. **Sign up for SendGrid**
   - Go to https://sendgrid.com
   - Free tier: 100 emails/day

2. **Get API key**
   - Create API key in Settings → API Keys

3. **Update the API route** (`app/api/feedback/route.ts`):
   ```typescript
   const sgMail = require('@sendgrid/mail')
   sgMail.setApiKey(process.env.SENDGRID_API_KEY)
   
   await sgMail.send({
     to: YOUR_EMAIL,
     from: 'feedback@yourdomain.com',
     subject: `[TaskBlitz ${type.toUpperCase()}] ${subject}`,
     html: emailHtml
   })
   ```

### Option 3: Gmail SMTP (Free)

1. **Enable 2FA on Gmail**
2. **Create App Password**
   - Google Account → Security → 2-Step Verification → App passwords
   - Generate password for "Mail"

3. **Install nodemailer**
   ```bash
   npm install nodemailer
   ```

4. **Update API route**:
   ```typescript
   import nodemailer from 'nodemailer'
   
   const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
       user: process.env.SMTP_USER,
       pass: process.env.SMTP_PASS
     }
   })
   
   await transporter.sendMail({
     from: process.env.SMTP_USER,
     to: YOUR_EMAIL,
     subject: `[TaskBlitz ${type.toUpperCase()}] ${subject}`,
     html: emailHtml
   })
   ```

## Development Mode

Without email configured, feedback is logged to console:
```bash
📧 FEEDBACK RECEIVED: {
  type: 'suggestion',
  subject: 'Add dark mode toggle',
  message: 'Would love a dark mode option...',
  walletAddress: '7xKXt...',
  timestamp: '2024-01-15T10:30:00.000Z'
}
```

## Email Template

The email includes:
- **Type badge** (Suggestion, Bug, Feature, Other)
- **Subject line**
- **User's wallet address**
- **Timestamp**
- **Full message** (preserves formatting)
- **Branded header/footer**

## Testing

1. **Connect wallet** on the app
2. **Navigate to Feedback** (in menu)
3. **Fill out form**:
   - Select type (Suggestion, Bug, Feature, Other)
   - Enter subject
   - Write detailed message
4. **Submit**
5. **Check your email** (or console in dev mode)

## Files Created

- ✅ `app/feedback/page.tsx` - Feedback form page
- ✅ `app/api/feedback/route.ts` - API endpoint for sending emails
- ✅ `.env.example` - Environment variable template
- ✅ `components/Header.tsx` - Updated with Feedback link

## Environment Variables

Add to your `.env.local`:
```bash
# Email Configuration
RESEND_API_KEY=re_your_key_here
FEEDBACK_EMAIL=your-email@example.com
```

## Customization

### Change email styling
Edit the HTML template in `app/api/feedback/route.ts`

### Add more feedback types
Update the `feedbackTypes` array in `app/feedback/page.tsx`

### Change recipient email
Update `FEEDBACK_EMAIL` in `.env.local`

### Add auto-responses
Modify the API route to send a confirmation email to the user

## Security Notes

- ✅ Wallet connection required (prevents spam)
- ✅ Input validation on both client and server
- ✅ Rate limiting recommended (add middleware)
- ✅ API key stored in environment variables
- ✅ No sensitive data exposed to client

## Next Steps (Optional)

- [ ] Add rate limiting (1 feedback per user per hour)
- [ ] Store feedback in database for analytics
- [ ] Add admin dashboard to view all feedback
- [ ] Implement feedback voting system
- [ ] Add email notifications for feedback responses
- [ ] Create feedback categories/tags

## Troubleshooting

### Email not sending
1. Check API key is correct
2. Verify environment variables are loaded
3. Check console for error messages
4. Test with a simple email first

### "Email not configured" message
- Add `RESEND_API_KEY` to `.env.local`
- Restart development server

### Feedback form not showing
- Ensure wallet is connected
- Check browser console for errors

## Status: ✅ READY TO USE

The feedback system is fully functional and ready for production!
