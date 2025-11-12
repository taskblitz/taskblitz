/**
 * x402-enabled Task Creation API
 * Allows AI agents to post tasks programmatically with payment
 */

import { NextRequest, NextResponse } from 'next/server'
import { x402Middleware } from '@/lib/x402/middleware'
import { createClient } from '@supabase/supabase-js'

// x402 configuration
const X402_CONFIG = {
  recipientAddress: process.env.NEXT_PUBLIC_PLATFORM_WALLET || '',
  endpoints: {
    '/api/x402/tasks': '0.10', // $0.10 per task creation
  },
  network: (process.env.NEXT_PUBLIC_SOLANA_NETWORK as 'mainnet-beta' | 'devnet') || 'devnet',
}

export async function POST(req: NextRequest) {
  // Apply x402 middleware
  const middleware = x402Middleware(X402_CONFIG)
  const paymentCheck = await middleware(req)
  
  if (paymentCheck) {
    // Payment required or invalid
    return paymentCheck
  }

  // Payment verified, process task creation
  try {
    const body = await req.json()
    
    // Validate required fields
    const {
      title,
      description,
      category,
      payment_per_task,
      workers_needed,
      deadline,
      requester_wallet,
    } = body

    if (!title || !description || !category || !payment_per_task || !workers_needed || !deadline || !requester_wallet) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get or create user
    let { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', requester_wallet)
      .single()

    if (!user) {
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          wallet_address: requester_wallet,
          role: 'requester',
        })
        .select()
        .single()

      if (userError) {
        throw userError
      }
      user = newUser
    }

    // Calculate escrow amount
    const platformFee = parseFloat(process.env.NEXT_PUBLIC_PLATFORM_FEE_PERCENTAGE || '10')
    const taskPayment = parseFloat(payment_per_task)
    const totalWorkerPayment = taskPayment * parseInt(workers_needed)
    const feeAmount = (totalWorkerPayment * platformFee) / 100
    const escrowAmount = totalWorkerPayment + feeAmount

    // Create task
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert({
        requester_id: user.id,
        title,
        description,
        category,
        payment_per_task: taskPayment,
        workers_needed: parseInt(workers_needed),
        deadline: new Date(deadline).toISOString(),
        escrow_amount: escrowAmount,
        platform_fee_percentage: platformFee,
        status: 'open',
      })
      .select()
      .single()

    if (taskError) {
      throw taskError
    }

    // Return task details
    return NextResponse.json({
      success: true,
      task: {
        id: task.id,
        title: task.title,
        description: task.description,
        category: task.category,
        payment_per_task: task.payment_per_task,
        workers_needed: task.workers_needed,
        deadline: task.deadline,
        escrow_amount: task.escrow_amount,
        status: task.status,
      },
      message: 'Task created successfully via x402',
    })
  } catch (error) {
    console.error('Task creation error:', error)
    return NextResponse.json(
      {
        error: 'Task creation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  // Apply x402 middleware for listing tasks
  const middleware = x402Middleware({
    ...X402_CONFIG,
    endpoints: {
      '/api/x402/tasks': '0.01', // $0.01 per task list request
    },
  })
  
  const paymentCheck = await middleware(req)
  
  if (paymentCheck) {
    return paymentCheck
  }

  // Payment verified, return tasks
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      tasks,
      count: tasks.length,
    })
  } catch (error) {
    console.error('Task listing error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch tasks',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
