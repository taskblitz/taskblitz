import { supabase } from './supabase'
import type { Database } from './supabase'

type Task = Database['public']['Tables']['tasks']['Row']
type TaskInsert = Database['public']['Tables']['tasks']['Insert']
type User = Database['public']['Tables']['users']['Row']
type Submission = Database['public']['Tables']['submissions']['Row']
type SubmissionInsert = Database['public']['Tables']['submissions']['Insert']

// Generate a random username
function generateUsername(): string {
  const adjectives = ['Cool', 'Smart', 'Fast', 'Bright', 'Bold', 'Swift', 'Clever', 'Sharp', 'Quick', 'Wise']
  const nouns = ['Trader', 'Worker', 'Builder', 'Creator', 'Hunter', 'Solver', 'Maker', 'Finder', 'Helper', 'Doer']
  const numbers = Math.floor(Math.random() * 999) + 1
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  
  return `${adjective}${noun}${numbers}`
}

// User Management
export async function getOrCreateUser(walletAddress: string): Promise<User> {
  try {
    // First try to get existing user
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single()

    if (existingUser) {
      console.log('Found existing user:', existingUser.wallet_address)
      return existingUser
    }

    // Only create if user doesn't exist and there was no other error
    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Error checking for user:', selectError)
      throw selectError
    }

    // Create new user if doesn't exist
    console.log('Creating new user for wallet:', walletAddress)
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        wallet_address: walletAddress,
        username: generateUsername(),
        role: 'both'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      // If user already exists (race condition), try to fetch again
      if (error.code === '23505') {
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('wallet_address', walletAddress)
          .single()
        
        if (existingUser) {
          return existingUser
        }
      }
      throw error
    }

    console.log('Created new user:', newUser.wallet_address)
    return newUser
  } catch (error) {
    console.error('Exception in getOrCreateUser:', error)
    throw error
  }
}

export async function updateUsername(walletAddress: string, newUsername: string): Promise<boolean> {
  try {
    // Get current user to check cooldown
    const { data: currentUser } = await supabase
      .from('users')
      .select('username_last_changed')
      .eq('wallet_address', walletAddress)
      .single()

    if (currentUser?.username_last_changed) {
      const lastChanged = new Date(currentUser.username_last_changed)
      const now = new Date()
      const daysSinceLastChange = (now.getTime() - lastChanged.getTime()) / (1000 * 60 * 60 * 24)
      
      if (daysSinceLastChange < 7) {
        const daysLeft = Math.ceil(7 - daysSinceLastChange)
        throw new Error(`You can only change your username once every 7 days. Try again in ${daysLeft} day${daysLeft > 1 ? 's' : ''}.`)
      }
    }

    // Check if username is already taken
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', newUsername)
      .neq('wallet_address', walletAddress)
      .single()

    if (existingUser) {
      throw new Error('Username is already taken')
    }

    // Update username and timestamp
    const { error } = await supabase
      .from('users')
      .update({ 
        username: newUsername,
        username_last_changed: new Date().toISOString()
      })
      .eq('wallet_address', walletAddress)

    if (error) {
      console.error('Error updating username:', error)
      throw error
    }

    console.log('Username updated successfully')
    return true
  } catch (error) {
    console.error('Exception in updateUsername:', error)
    throw error
  }
}

export async function getUserByWallet(walletAddress: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Exception in getUserByWallet:', error)
    return null
  }
}

// Task Management
export async function getAllTasks(filters?: {
  categories?: string[]
  difficulty?: string[]
  rewardRange?: { min?: number; max?: number }
  sortBy?: string
}) {
  try {
    let query = supabase
      .from('tasks')
      .select(`
        *,
        requester:users!tasks_requester_id_fkey(wallet_address, username)
      `)
      .eq('status', 'open')
      .gt('deadline', new Date().toISOString())

    // Apply filters
    if (filters?.categories && filters.categories.length > 0) {
      query = query.in('category', filters.categories)
    }

    if (filters?.rewardRange?.min) {
      query = query.gte('payment_per_task', filters.rewardRange.min)
    }

    if (filters?.rewardRange?.max) {
      query = query.lte('payment_per_task', filters.rewardRange.max)
    }

    // Apply sorting
    switch (filters?.sortBy) {
      case 'reward-high':
        query = query.order('payment_per_task', { ascending: false })
        break
      case 'reward-low':
        query = query.order('payment_per_task', { ascending: true })
        break
      case 'deadline':
        query = query.order('deadline', { ascending: true })
        break
      default: // newest
        query = query.order('created_at', { ascending: false })
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching tasks:', error)
      console.error('Error details:', error.details, error.hint, error.message)
      return []
    }

    console.log('Fetched tasks from database:', data?.length || 0)
    return data || []
  } catch (error) {
    console.error('Exception in getAllTasks:', error)
    return []
  }
}

export async function getTaskById(taskId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      requester:users!tasks_requester_id_fkey(wallet_address, username),
      submissions(
        id,
        worker_id,
        submission_type,
        submission_text,
        submission_file_url,
        submission_url,
        status,
        submitted_at,
        reviewed_at,
        worker:users!submissions_worker_id_fkey(wallet_address, username)
      )
    `)
    .eq('id', taskId)
    .single()

  if (error) {
    console.error('Error fetching task:', error)
    throw error
  }

  return data
}

export async function createTask(
  taskData: {
    title: string
    description: string
    category: string
    paymentPerWorker: number
    workersNeeded: number
    timeEstimate: string
    submissionType: 'text' | 'file' | 'url'
    requirements: string[]
    exampleSubmission?: string
    requesterWallet: string
  },
  onChainCreation?: (taskId: string) => Promise<string>
) {
  try {
    // Get or create the requester user first
    const requester = await getOrCreateUser(taskData.requesterWallet)
    console.log('Creating task for requester:', requester.id, 'wallet:', taskData.requesterWallet)

    // Calculate escrow amount (payment + 10% platform fee)
    const totalPayment = taskData.paymentPerWorker * taskData.workersNeeded
    const escrowAmount = totalPayment * 1.1 // Add 10% platform fee

    // Create deadline (7 days from now for now)
    const deadline = new Date()
    deadline.setDate(deadline.getDate() + 7)

    const taskInsert = {
      requester_id: requester.id, // Use actual user ID
      title: taskData.title,
      description: taskData.description,
      category: taskData.category,
      payment_per_task: taskData.paymentPerWorker,
      workers_needed: taskData.workersNeeded,
      deadline: deadline.toISOString(),
      escrow_amount: escrowAmount,
      submission_type: taskData.submissionType,
      requirements: taskData.requirements,
      example_submission: taskData.exampleSubmission || null
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert(taskInsert)
      .select()
      .single()

    if (error) {
      console.error('Error creating task:', error)
      throw error
    }

    console.log('Task created in database:', data)

    // Execute on-chain task creation if callback provided
    let transactionHash: string | null = null
    if (onChainCreation && data.id) {
      try {
        console.log('Creating task on-chain with ID:', data.id)
        transactionHash = await onChainCreation(data.id)
        console.log('On-chain task creation successful:', transactionHash)
        
        // Update task with transaction hash
        await supabase
          .from('tasks')
          .update({ transaction_hash: transactionHash })
          .eq('id', data.id)
      } catch (error) {
        console.error('On-chain task creation failed:', error)
        // Rollback database task creation
        await supabase.from('tasks').delete().eq('id', data.id)
        throw new Error('Failed to lock funds in escrow. Task creation cancelled.')
      }
    }

    console.log('Task created successfully:', data)
    return data
  } catch (error) {
    console.error('Exception in createTask:', error)
    throw error
  }
}

export async function getTasksByRequester(walletAddress: string) {
  try {
    // First get the user ID for this wallet
    const user = await getOrCreateUser(walletAddress)
    
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        requester:users!tasks_requester_id_fkey(wallet_address, username),
        submissions(
          id,
          worker_id,
          submission_type,
          submission_text,
          submission_file_url,
          submission_url,
          status,
          submitted_at,
          reviewed_at,
          worker:users!submissions_worker_id_fkey(wallet_address, username)
        )
      `)
      .eq('requester_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching requester tasks:', error)
      throw error
    }

    console.log('Found tasks for requester:', data?.length || 0, 'wallet:', walletAddress)
    return data || []
  } catch (error) {
    console.error('Exception in getTasksByRequester:', error)
    return []
  }
}

// Submission Management
export async function submitWork(submissionData: {
  taskId: string
  workerWallet: string
  submissionType: 'text' | 'file' | 'url'
  submissionText?: string
  submissionFileUrl?: string
  submissionUrl?: string
}) {
  try {
    console.log('Submitting work:', submissionData)

    // Get or create the worker user first
    const worker = await getOrCreateUser(submissionData.workerWallet)
    console.log('Using worker:', worker.id, 'for wallet:', submissionData.workerWallet)

    // Check if this worker already submitted for this task
    const { data: existingSubmission } = await supabase
      .from('submissions')
      .select('id')
      .eq('task_id', submissionData.taskId)
      .eq('worker_id', worker.id)
      .single()

    if (existingSubmission) {
      throw new Error('You have already submitted work for this task')
    }

    // Create submission
    const submissionInsert = {
      task_id: submissionData.taskId,
      worker_id: worker.id,
      submission_type: submissionData.submissionType,
      submission_text: submissionData.submissionText || null,
      submission_file_url: submissionData.submissionFileUrl || null,
      submission_url: submissionData.submissionUrl || null
    }

    console.log('Inserting submission:', submissionInsert)

    const { data, error } = await supabase
      .from('submissions')
      .insert(submissionInsert)
      .select()
      .single()

    if (error) {
      console.error('Error creating submission:', error)
      if (error.code === '23505') {
        throw new Error('You have already submitted work for this task')
      }
      throw new Error(`Failed to submit work: ${error.message}`)
    }

    console.log('Submission created successfully:', data)

    // Update task workers_completed count
    console.log('Updating task count for task:', submissionData.taskId)
    const { error: updateError } = await supabase.rpc('increment_workers_completed', {
      task_id: submissionData.taskId
    })

    if (updateError) {
      console.error('Error updating task count:', updateError)
    } else {
      console.log('Task count updated successfully')
    }

    return data
  } catch (error) {
    console.error('Exception in submitWork:', error)
    throw error
  }
}

export async function approveSubmission(
  submissionId: string, 
  taskId: string,
  onChainApproval?: (workerWallet: string) => Promise<string>
) {
  try {
    // Get submission details including worker wallet
    const { data: submission } = await supabase
      .from('submissions')
      .select(`
        *,
        worker:users!submissions_worker_id_fkey(wallet_address)
      `)
      .eq('id', submissionId)
      .single()

    if (!submission) {
      throw new Error('Submission not found')
    }

    // Execute on-chain payment if callback provided
    let transactionHash: string | null = null
    if (onChainApproval && submission.worker) {
      try {
        console.log('Executing on-chain payment to:', submission.worker.wallet_address)
        transactionHash = await onChainApproval(submission.worker.wallet_address)
        console.log('On-chain payment successful:', transactionHash)
      } catch (error) {
        console.error('On-chain payment failed:', error)
        throw new Error('Payment transaction failed. Please try again.')
      }
    }

    // Update submission status
    const { data, error } = await supabase
      .from('submissions')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        transaction_hash: transactionHash
      })
      .eq('id', submissionId)
      .select()
      .single()

    if (error) {
      console.error('Error approving submission:', error)
      throw error
    }

    // Check if task is now complete
    const { data: task } = await supabase
      .from('tasks')
      .select('workers_needed, workers_completed')
      .eq('id', taskId)
      .single()

    if (task && task.workers_completed >= task.workers_needed) {
      // Mark task as completed
      await supabase
        .from('tasks')
        .update({ status: 'completed' })
        .eq('id', taskId)
    }

    console.log('Submission approved successfully')
    return data
  } catch (error) {
    console.error('Exception in approveSubmission:', error)
    throw error
  }
}

export async function rejectSubmission(submissionId: string, taskId: string) {
  const { data, error } = await supabase
    .from('submissions')
    .update({
      status: 'rejected',
      reviewed_at: new Date().toISOString()
    })
    .eq('id', submissionId)
    .select()
    .single()

  if (error) {
    console.error('Error rejecting submission:', error)
    throw error
  }

  // Decrement workers_completed count to reopen the spot
  const { error: updateError } = await supabase.rpc('decrement_workers_completed', {
    task_id: taskId
  })

  if (updateError) {
    console.error('Error updating task count:', updateError)
  }

  return data
}

export async function getSubmissionsByWorker(walletAddress: string) {
  try {
    // First get the user ID for this wallet
    const user = await getOrCreateUser(walletAddress)
    
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        *,
        task:tasks(
          id,
          title,
          payment_per_task,
          requester:users!tasks_requester_id_fkey(wallet_address)
        )
      `)
      .eq('worker_id', user.id)
      .order('submitted_at', { ascending: false })

    if (error) {
      console.error('Error fetching worker submissions:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Exception in getSubmissionsByWorker:', error)
    return []
  }
}