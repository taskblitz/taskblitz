import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, subject, message, walletAddress, timestamp } = body

    // Validate input
    if (!subject || !message || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // For now, we'll use Resend (you can also use SendGrid, Nodemailer, etc.)
    // Install: npm install resend
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    const YOUR_EMAIL = process.env.FEEDBACK_EMAIL || 'your-email@example.com'

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured')
      // Fallback: Log to console (for development)
      console.log('📧 FEEDBACK RECEIVED:', {
        type,
        subject,
        message,
        walletAddress,
        timestamp
      })
      
      return NextResponse.json({ 
        success: true,
        message: 'Feedback logged (email not configured)' 
      })
    }

    // Send email using Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'TaskBlitz Feedback <onboarding@resend.dev>', // Resend's test email
        to: YOUR_EMAIL,
        subject: `[TaskBlitz ${type.toUpperCase()}] ${subject}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(to right, #9333ea, #06b6d4); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
                .footer { background: #1f2937; color: #9ca3af; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
                .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
                .badge-suggestion { background: #fef3c7; color: #92400e; }
                .badge-bug { background: #fee2e2; color: #991b1b; }
                .badge-feature { background: #ede9fe; color: #5b21b6; }
                .badge-other { background: #cffafe; color: #155e75; }
                .info-box { background: white; padding: 15px; border-left: 4px solid #9333ea; margin: 15px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">TaskBlitz Feedback</h1>
                </div>
                <div class="content">
                  <div style="margin-bottom: 20px;">
                    <span class="badge badge-${type}">${type}</span>
                  </div>
                  
                  <h2 style="color: #1f2937; margin-top: 0;">${subject}</h2>
                  
                  <div class="info-box">
                    <p style="margin: 0;"><strong>From:</strong> ${walletAddress}</p>
                    <p style="margin: 5px 0 0 0;"><strong>Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
                  </div>
                  
                  <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
                    <h3 style="margin-top: 0; color: #4b5563;">Message:</h3>
                    <p style="white-space: pre-wrap; color: #1f2937;">${message}</p>
                  </div>
                </div>
                <div class="footer">
                  <p style="margin: 0;">TaskBlitz Feedback System</p>
                  <p style="margin: 5px 0 0 0;">Received at ${new Date(timestamp).toLocaleString()}</p>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Resend API error:', error)
      throw new Error('Failed to send email')
    }

    const data = await response.json()
    console.log('✅ Feedback email sent:', data)

    return NextResponse.json({ 
      success: true,
      message: 'Feedback sent successfully' 
    })

  } catch (error: any) {
    console.error('Error processing feedback:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send feedback' },
      { status: 500 }
    )
  }
}
