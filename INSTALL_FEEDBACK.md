# Quick Install: Feedback System

## 1. Install Resend (Recommended)

```bash
npm install resend
```

## 2. Get Resend API Key

1. Sign up at https://resend.com (free)
2. Get your API key from dashboard
3. Add to `.env.local`:

```bash
RESEND_API_KEY=re_your_api_key_here
FEEDBACK_EMAIL=your-email@example.com
```

## 3. Test It

1. Start dev server: `npm run dev`
2. Connect wallet
3. Click "Feedback" in menu
4. Submit test feedback
5. Check your email!

## Alternative: Development Mode (No Email)

If you don't configure email, feedback will be logged to console:

```bash
# Just run without RESEND_API_KEY
npm run dev

# Feedback will appear in terminal
📧 FEEDBACK RECEIVED: { ... }
```

## That's it! 🎉

The feedback system is now live and ready to collect user input.
