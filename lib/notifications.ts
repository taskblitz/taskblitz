import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface NotificationData {
  userId: string
  type: 'submission_approved' | 'submission_rejected' | 'task_completed' | 'new_submission' | 'payment_received' | 'rating_received'
  title: string
  message: string
  link?: string
}

/**
 * Create an in-app notification for a user
 */
export async function createNotification(data: NotificationData) {
  try {
    const { error } = await supabase.from('notifications').insert({
      user_id: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      link: data.link,
      read: false,
    })

    if (error) throw error

    // Check if user has email notifications enabled
    const { data: user } = await supabase
      .from('users')
      .select('email, email_notifications')
      .eq('id', data.userId)
      .single()

    // Send email if enabled and email exists
    if (user?.email && user?.email_notifications) {
      await sendEmail({
        to: user.email,
        subject: data.title,
        body: data.message,
        link: data.link,
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Error creating notification:', error)
    return { success: false, error }
  }
}

/**
 * Send email notification via Resend
 */
async function sendEmail(data: {
  to: string
  subject: string
  body: string
  link?: string
}) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'TaskBlitz <notifications@taskblitz.click>',
        to: data.to,
        subject: data.subject,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(to right, #8b5cf6, #06b6d4); padding: 30px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">TaskBlitz</h1>
            </div>
            <div style="background: #1a1a1a; padding: 30px; border-radius: 0 0 12px 12px;">
              <h2 style="color: #8b5cf6; margin-top: 0;">${data.subject}</h2>
              <p style="color: #e5e7eb; line-height: 1.6;">${data.body}</p>
              ${data.link ? `
                <a href="${data.link}" style="display: inline-block; background: linear-gradient(to right, #8b5cf6, #06b6d4); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px; font-weight: 600;">
                  View Details →
                </a>
              ` : ''}
              <hr style="margin: 32px 0; border: none; border-top: 1px solid #333;" />
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                TaskBlitz - Complete micro-tasks & earn crypto instantly<br/>
                <a href="https://taskblitz.click" style="color: #06b6d4; text-decoration: none;">taskblitz.click</a>
              </p>
            </div>
          </div>
        `,
      }),
    })

    if (!response.ok) {
      throw new Error(`Resend API error: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('✅ Email sent successfully:', result.id)
    return { success: true, id: result.id }
  } catch (error) {
    console.error('❌ Failed to send email:', error)
    return { success: false, error }
  }
}

/**
 * Notify worker when submission is approved
 */
export async function notifySubmissionApproved(
  workerId: string,
  taskTitle: string,
  amount: number,
  taskId: string
) {
  return createNotification({
    userId: workerId,
    type: 'submission_approved',
    title: '✅ Submission Approved!',
    message: `Your submission for "${taskTitle}" has been approved. You earned $${amount.toFixed(2)}!`,
    link: `/dashboard`,
  })
}

/**
 * Notify worker when submission is rejected
 */
export async function notifySubmissionRejected(
  workerId: string,
  taskTitle: string,
  taskId: string
) {
  return createNotification({
    userId: workerId,
    type: 'submission_rejected',
    title: '❌ Submission Rejected',
    message: `Your submission for "${taskTitle}" was not approved. Please review the requirements and try again.`,
    link: `/task/${taskId}`,
  })
}

/**
 * Notify requester when new submission is received
 */
export async function notifyNewSubmission(
  requesterId: string,
  taskTitle: string,
  workerWallet: string,
  taskId: string
) {
  return createNotification({
    userId: requesterId,
    type: 'new_submission',
    title: '📝 New Submission Received',
    message: `${workerWallet.slice(0, 8)}... submitted work for "${taskTitle}". Review it now!`,
    link: `/dashboard`,
  })
}

/**
 * Notify requester when task is completed
 */
export async function notifyTaskCompleted(
  requesterId: string,
  taskTitle: string,
  taskId: string
) {
  return createNotification({
    userId: requesterId,
    type: 'task_completed',
    title: '🎉 Task Completed!',
    message: `All workers have completed "${taskTitle}". Great job!`,
    link: `/dashboard`,
  })
}

/**
 * Notify user when they receive a payment
 */
export async function notifyPaymentReceived(
  userId: string,
  amount: number,
  taskTitle: string
) {
  return createNotification({
    userId: userId,
    type: 'payment_received',
    title: '💰 Payment Received',
    message: `You received $${amount.toFixed(2)} for "${taskTitle}"`,
    link: `/transactions`,
  })
}

/**
 * Notify user when they receive a rating
 */
export async function notifyRatingReceived(
  userId: string,
  rating: number,
  ratingType: 'requester' | 'worker',
  taskTitle: string
) {
  return createNotification({
    userId: userId,
    type: 'rating_received',
    title: '⭐ New Rating',
    message: `You received a ${rating}-star rating as ${ratingType} for "${taskTitle}"`,
    link: `/profile/${userId}`,
  })
}

/**
 * Get unread notifications count for a user
 */
export async function getUnreadCount(userId: string) {
  const { count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false)

  return count || 0
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)

  return { success: !error, error }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)

  return { success: !error, error }
}
