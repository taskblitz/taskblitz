import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin'

// Create admin client with service role (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: NextRequest) {
  try {
    const { taskId, adminWallet, reason } = await request.json()

    // Verify admin status using regular client
    if (!adminWallet || !await isAdmin(adminWallet)) {
      return NextResponse.json(
        { error: 'Unauthorized: Not an admin' },
        { status: 403 }
      )
    }

    // Use admin client for deletions (bypasses RLS)
    await supabaseAdmin.from('submissions').delete().eq('task_id', taskId)
    await supabaseAdmin.from('transactions').delete().eq('task_id', taskId)
    await supabaseAdmin.from('notifications').delete().eq('task_id', taskId)

    // Delete the task
    const { error, data } = await supabaseAdmin
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .select()

    if (error || !data || data.length === 0) {
      return NextResponse.json(
        { error: 'Failed to delete task' },
        { status: 500 }
      )
    }

    // Log activity
    const { data: admin } = await supabase
      .from('admin_users')
      .select('id')
      .eq('wallet_address', adminWallet)
      .single()

    if (admin) {
      await supabaseAdmin.from('admin_activity_log').insert({
        admin_id: admin.id,
        action: 'delete_task',
        target_type: 'task',
        target_id: taskId,
        details: { reason }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
