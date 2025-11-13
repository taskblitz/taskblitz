import { supabase } from './supabase'
import { BulkTaskJob } from '@/types/advanced-features'
import Papa from 'papaparse'

interface BulkTaskRow {
  title: string
  description: string
  category: string
  difficulty: string
  reward: number
  estimated_time?: number
  requirements?: string
  deliverables?: string
}

export async function createBulkTaskJob(userId: string, file: File) {
  
  // Upload CSV file
  const fileName = `bulk-tasks/${userId}/${Date.now()}-${file.name}`
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('task-files')
    .upload(fileName, file)
  
  if (uploadError) throw uploadError
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('task-files')
    .getPublicUrl(fileName)
  
  // Parse CSV to count tasks
  const text = await file.text()
  const parsed = Papa.parse(text, { header: true })
  
  // Create job record
  const { data, error } = await supabase
    .from('bulk_task_jobs')
    .insert({
      user_id: userId,
      file_url: publicUrl,
      total_tasks: parsed.data.length,
      status: 'pending'
    })
    .select()
    .single()
  
  if (error) throw error
  return data as BulkTaskJob
}

export async function processBulkTaskJob(jobId: string) {
  
  // Get job details
  const { data: job, error: jobError } = await supabase
    .from('bulk_task_jobs')
    .select('*')
    .eq('id', jobId)
    .single()
  
  if (jobError) throw jobError
  
  // Update status to processing
  await supabase
    .from('bulk_task_jobs')
    .update({ status: 'processing' })
    .eq('id', jobId)
  
  // Fetch and parse CSV
  const response = await fetch(job.file_url)
  const text = await response.text()
  const parsed = Papa.parse<BulkTaskRow>(text, { header: true })
  
  const errors: Array<{ row: number; error: string }> = []
  let successful = 0
  
  // Process each row
  for (let i = 0; i < parsed.data.length; i++) {
    const row = parsed.data[i]
    
    try {
      // Validate row
      if (!row.title || !row.description || !row.category || !row.difficulty || !row.reward) {
        throw new Error('Missing required fields')
      }
      
      // Create task
      const { error: taskError } = await supabase
        .from('tasks')
        .insert({
          title: row.title,
          description: row.description,
          category: row.category,
          difficulty: row.difficulty,
          reward_amount: row.reward,
          estimated_time: row.estimated_time || null,
          requirements: row.requirements || '',
          deliverables: row.deliverables || '',
          client_id: job.user_id,
          status: 'open'
        })
      
      if (taskError) throw taskError
      successful++
      
    } catch (error: any) {
      errors.push({ row: i + 1, error: error.message })
    }
    
    // Update progress
    await supabase
      .from('bulk_task_jobs')
      .update({
        processed_tasks: i + 1,
        successful_tasks: successful,
        failed_tasks: errors.length
      })
      .eq('id', jobId)
  }
  
  // Mark as completed
  await supabase
    .from('bulk_task_jobs')
    .update({
      status: errors.length === parsed.data.length ? 'failed' : 'completed',
      error_log: errors,
      completed_at: new Date().toISOString()
    })
    .eq('id', jobId)
}

export async function getUserBulkJobs(userId: string) {
  
  const { data, error } = await supabase
    .from('bulk_task_jobs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as BulkTaskJob[]
}
