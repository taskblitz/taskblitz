import { supabase } from './supabase'
import { getOrCreateUser } from './database'

/**
 * Apply to work on a task
 */
export async function applyToTask(
  taskId: string,
  workerWallet: string,
  message?: string
) {
  try {
    const worker = await getOrCreateUser(workerWallet)

    const { data, error } = await supabase
      .from('task_applications')
      .insert({
        task_id: taskId,
        worker_id: worker.id,
        message: message || null,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        throw new Error('You have already applied to this task')
      }
      throw error
    }

    return data
  } catch (error) {
    console.error('Error applying to task:', error)
    throw error
  }
}

/**
 * Get worker's application status for a task
 */
export async function getApplicationStatus(taskId: string, workerWallet: string) {
  try {
    const worker = await getOrCreateUser(workerWallet)

    const { data, error } = await supabase
      .from('task_applications')
      .select('*')
      .eq('task_id', taskId)
      .eq('worker_id', worker.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error getting application status:', error)
    return null
  }
}

/**
 * Get all applications for a task (for task owner)
 */
export async function getTaskApplications(taskId: string) {
  try {
    const { data, error } = await supabase
      .from('task_applications')
      .select(`
        *,
        worker:users!task_applications_worker_id_fkey(
          id,
          wallet_address,
          username,
          reputation_score,
          tasks_completed,
          rating_as_worker
        )
      `)
      .eq('task_id', taskId)
      .order('applied_at', { ascending: false })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error getting task applications:', error)
    return []
  }
}

/**
 * Approve a worker's application
 */
export async function approveApplication(applicationId: string) {
  try {
    const { data, error } = await supabase
      .from('task_applications')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString()
      })
      .eq('id', applicationId)
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error approving application:', error)
    throw error
  }
}

/**
 * Reject a worker's application
 */
export async function rejectApplication(applicationId: string) {
  try {
    const { data, error } = await supabase
      .from('task_applications')
      .update({
        status: 'rejected',
        reviewed_at: new Date().toISOString()
      })
      .eq('id', applicationId)
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error rejecting application:', error)
    throw error
  }
}

/**
 * Check if worker is approved to work on a task
 */
export async function isWorkerApproved(taskId: string, workerWallet: string) {
  try {
    const application = await getApplicationStatus(taskId, workerWallet)
    return application?.status === 'approved'
  } catch (error) {
    return false
  }
}
