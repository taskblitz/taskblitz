/**
 * x402-enabled Submission API
 * Allows AI agents to submit work programmatically
 */

import { NextRequest, NextResponse } from 'next/server'
import { x402Middleware } from '@/lib/x402/middleware'
import { createClient } from '@supabase/supabase-js'

const X402_CONFIG = {
  recipientAddress: process.env.NEXT_PUBLIC_PLATFORM_WALLET || '',
  endpoints: {
    '/api/x402/submissions': '0.05', // $0.05 per submission
  },
  network: (process.env.NEXT_PUBLIC_SOLANA_NETWORK as 'mainnet-beta' | 'devnet') || 'devnet',
}

export async function POST(req: NextRequest) {
  // Apply x402 middleware
  const middleware = x402Middleware(X402_CONFIG)
  const paymentCheck = await middleware(req)
  
  if (paymentCheck) {
    return paymentCheck
  }

  // Payment verified, process submission
  try {
    const body = await req.json()
    
    const {
      task_id,
      worker_wallet,
      submission_type,
      submission_text,
      submission_url,
    } = body

    if (!task_id || !worker_wallet || !submission_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get or create worker
    let { data: worker } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', worker_wallet)
      .single()

    if (!worker) {
      const { data: newWorker, error: workerError } = await supabase
        .from('users')
        .insert({
          wallet_address: worker_wallet,
          role: 'worker',
        })
        .select()
        .single()

      if (workerError) {
        throw workerError
      }
      worker = newWorker
    }

    // Check if task exists and is open
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', task_id)
      .single()

    if (taskError || !task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    if (task.status !== 'open') {
      return NextResponse.json(
        { error: 'Task is not accepting submissions' },
        { status: 400 }
      )
    }

    // Check if worker already submitted
    const { data: existingSubmission } = await supabase
      .from('submissions')
      .select('*')
      .eq('task_id', task_id)
      .eq('worker_id', worker.id)
      .single()

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'You have already submitted work for this task' },
        { status: 400 }
      )
    }

    // Create submission
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .insert({
        task_id,
        worker_id: worker.id,
        submission_type,
        submission_text,
        submission_url,
        status: 'pending',
      })
      .select()
      .single()

    if (submissionError) {
      throw submissionError
    }

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        task_id: submission.task_id,
        status: submission.status,
        submitted_at: submission.submitted_at,
      },
      message: 'Submission created successfully via x402',
    })
  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json(
      {
        error: 'Submission failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  // Apply x402 middleware
  const middleware = x402Middleware({
    ...X402_CONFIG,
    endpoints: {
      '/api/x402/submissions': '0.01', // $0.01 per query
    },
  })
  
  const paymentCheck = await middleware(req)
  
  if (paymentCheck) {
    return paymentCheck
  }

  // Get query parameters
  const { searchParams } = new URL(req.url)
  const taskId = searchParams.get('task_id')
  const workerWallet = searchParams.get('worker_wallet')

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    let query = supabase.from('submissions').select('*')

    if (taskId) {
      query = query.eq('task_id', taskId)
    }

    if (workerWallet) {
      const { data: worker } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', workerWallet)
        .single()

      if (worker) {
        query = query.eq('worker_id', worker.id)
      }
    }

    const { data: submissions, error } = await query
      .order('submitted_at', { ascending: false })
      .limit(50)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      submissions,
      count: submissions.length,
    })
  } catch (error) {
    console.error('Submission query error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch submissions',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
