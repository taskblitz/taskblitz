import { supabase } from './supabase'

// Check if user is admin
export async function isAdmin(walletAddress: string): Promise<boolean> {
  console.log('Checking admin for wallet:', walletAddress)
  
  const { data, error } = await supabase
    .from('admin_users')
    .select('id')
    .eq('wallet_address', walletAddress)
    .maybeSingle()
  
  console.log('Admin check result:', { data, error, hasData: !!data })
  
  if (error) {
    console.error('Admin check error:', error)
    return false
  }
  
  return !!data
}

// Get admin role
export async function getAdminRole(walletAddress: string) {
  const { data } = await supabase
    .from('admin_users')
    .select('role, permissions')
    .eq('wallet_address', walletAddress)
    .single()
  
  return data
}

// Log admin activity
export async function logAdminActivity(
  adminWallet: string,
  action: string,
  targetType?: string,
  targetId?: string,
  details?: any
) {
  const { data: admin } = await supabase
    .from('admin_users')
    .select('id')
    .eq('wallet_address', adminWallet)
    .single()

  if (!admin) return

  await supabase.from('admin_activity_log').insert({
    admin_id: admin.id,
    action,
    target_type: targetType,
    target_id: targetId,
    details
  })
}


// User Management
export async function getAllUsers(filters?: {
  role?: string
  banned?: boolean
  search?: string
}) {
  let query = supabase
    .from('users')
    .select(`
      *,
      bans:user_bans!user_bans_user_id_fkey(
        id,
        reason,
        ban_type,
        expires_at,
        is_active
      )
    `)
    .order('created_at', { ascending: false })

  if (filters?.role) {
    query = query.eq('role', filters.role)
  }

  if (filters?.search) {
    query = query.or(`username.ilike.%${filters.search}%,wallet_address.ilike.%${filters.search}%`)
  }

  const { data, error } = await query

  if (filters?.banned !== undefined) {
    return data?.filter(user => 
      filters.banned ? user.bans?.some((b: any) => b.is_active) : !user.bans?.some((b: any) => b.is_active)
    )
  }

  return data
}

export async function banUser(
  userId: string,
  adminWallet: string,
  reason: string,
  banType: 'permanent' | 'temporary',
  expiresAt?: Date
) {
  const { data: admin } = await supabase
    .from('admin_users')
    .select('id')
    .eq('wallet_address', adminWallet)
    .single()

  const { data, error } = await supabase
    .from('user_bans')
    .insert({
      user_id: userId,
      banned_by: admin?.id,
      reason,
      ban_type: banType,
      expires_at: expiresAt?.toISOString()
    })
    .select()
    .single()

  await logAdminActivity(adminWallet, 'ban_user', 'user', userId, { reason, banType })

  return { data, error }
}


export async function unbanUser(userId: string, adminWallet: string) {
  const { error } = await supabase
    .from('user_bans')
    .update({ is_active: false })
    .eq('user_id', userId)
    .eq('is_active', true)

  await logAdminActivity(adminWallet, 'unban_user', 'user', userId)

  return { error }
}

export async function updateUserReputation(
  userId: string,
  newScore: number,
  adminWallet: string
) {
  const { error } = await supabase
    .from('users')
    .update({ reputation_score: newScore })
    .eq('id', userId)

  await logAdminActivity(adminWallet, 'update_reputation', 'user', userId, { newScore })

  return { error }
}

// Task Management
export async function deleteTask(taskId: string, adminWallet: string, reason: string) {
  try {
    // Delete related records first (these might have RLS issues too)
    const { error: submissionsError } = await supabase
      .from('submissions')
      .delete()
      .eq('task_id', taskId)

    if (submissionsError) {
      console.error('Delete submissions error:', submissionsError)
    }

    const { error: transactionsError } = await supabase
      .from('transactions')
      .delete()
      .eq('task_id', taskId)

    if (transactionsError) {
      console.error('Delete transactions error:', transactionsError)
    }

    const { error: notificationsError } = await supabase
      .from('notifications')
      .delete()
      .eq('task_id', taskId)

    if (notificationsError) {
      console.error('Delete notifications error:', notificationsError)
    }

    // Now delete the task
    const { error, data } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .select()

    console.log('Delete task result:', { error, data, taskId })

    if (error) {
      console.error('Delete task error:', error)
      return { success: false, error: `Database error: ${error.message}` }
    }

    if (!data || data.length === 0) {
      return { success: false, error: 'Task not found or RLS policy blocking deletion. Check Supabase RLS policies.' }
    }

    await logAdminActivity(adminWallet, 'delete_task', 'task', taskId, { reason })

    return { success: true, error: null }
  } catch (error: any) {
    console.error('Failed to delete task:', error)
    return { success: false, error: error.message || 'Failed to delete task' }
  }
}

export async function pauseTask(taskId: string, adminWallet: string) {
  const { error } = await supabase
    .from('tasks')
    .update({ status: 'paused' })
    .eq('id', taskId)

  await logAdminActivity(adminWallet, 'pause_task', 'task', taskId)

  return { error }
}


// Financial Management
export async function getAllTransactions(filters?: {
  startDate?: Date
  endDate?: Date
  minAmount?: number
  type?: string
}) {
  let query = supabase
    .from('transactions')
    .select(`
      *,
      task:tasks(title),
      user:users(username, wallet_address)
    `)
    .order('created_at', { ascending: false })

  if (filters?.startDate) {
    query = query.gte('created_at', filters.startDate.toISOString())
  }

  if (filters?.endDate) {
    query = query.lte('created_at', filters.endDate.toISOString())
  }

  if (filters?.minAmount) {
    query = query.gte('amount', filters.minAmount)
  }

  if (filters?.type) {
    query = query.eq('transaction_type', filters.type)
  }

  return await query
}

export async function processRefund(
  refundId: string,
  adminWallet: string,
  approved: boolean,
  notes?: string
) {
  const { data: admin } = await supabase
    .from('admin_users')
    .select('id')
    .eq('wallet_address', adminWallet)
    .single()

  const { error } = await supabase
    .from('refund_requests')
    .update({
      status: approved ? 'approved' : 'rejected',
      processed_by: admin?.id,
      processed_at: new Date().toISOString(),
      notes
    })
    .eq('id', refundId)

  await logAdminActivity(adminWallet, 'process_refund', 'refund', refundId, { approved, notes })

  return { error }
}


// Analytics
export async function getGrowthMetrics(days: number = 30) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data: users } = await supabase
    .from('users')
    .select('created_at')
    .gte('created_at', startDate.toISOString())

  const { data: tasks } = await supabase
    .from('tasks')
    .select('created_at')
    .gte('created_at', startDate.toISOString())

  const { data: transactions } = await supabase
    .from('transactions')
    .select('created_at, amount')
    .gte('created_at', startDate.toISOString())

  return { users, tasks, transactions }
}

export async function getCategoryPerformance() {
  const { data } = await supabase
    .from('tasks')
    .select('category, payment_per_task, workers_completed, status')

  const categoryStats: any = {}

  data?.forEach(task => {
    if (!categoryStats[task.category]) {
      categoryStats[task.category] = {
        totalTasks: 0,
        completedTasks: 0,
        totalVolume: 0,
        avgPayment: 0
      }
    }

    categoryStats[task.category].totalTasks++
    if (task.status === 'completed') {
      categoryStats[task.category].completedTasks++
    }
    categoryStats[task.category].totalVolume += task.payment_per_task * task.workers_completed
  })

  return categoryStats
}

// Announcements
export async function createAnnouncement(
  title: string,
  message: string,
  type: 'info' | 'warning' | 'success' | 'error',
  adminWallet: string,
  expiresAt?: Date
) {
  const { data: admin } = await supabase
    .from('admin_users')
    .select('id')
    .eq('wallet_address', adminWallet)
    .single()

  const { data, error } = await supabase
    .from('announcements')
    .insert({
      title,
      message,
      type,
      created_by: admin?.id,
      expires_at: expiresAt?.toISOString()
    })
    .select()
    .single()

  await logAdminActivity(adminWallet, 'create_announcement', 'announcement', data?.id)

  return { data, error }
}

export async function getActiveAnnouncements() {
  const { data } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order('created_at', { ascending: false })

  return data
}
