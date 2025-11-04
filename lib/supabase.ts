import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (will be auto-generated later)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          wallet_address: string
          role: 'requester' | 'worker' | 'both'
          total_spent: number
          total_earned: number
          tasks_posted: number
          tasks_completed: number
          reputation_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          wallet_address: string
          role?: 'requester' | 'worker' | 'both'
          total_spent?: number
          total_earned?: number
          tasks_posted?: number
          tasks_completed?: number
          reputation_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          wallet_address?: string
          role?: 'requester' | 'worker' | 'both'
          total_spent?: number
          total_earned?: number
          tasks_posted?: number
          tasks_completed?: number
          reputation_score?: number
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          requester_id: string
          title: string
          description: string
          category: string
          payment_per_task: number
          workers_needed: number
          workers_completed: number
          deadline: string
          status: 'open' | 'completed' | 'expired' | 'cancelled'
          escrow_amount: number
          platform_fee_percentage: number
          submission_type: 'text' | 'file' | 'url'
          requirements: string[]
          example_submission: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          requester_id: string
          title: string
          description: string
          category: string
          payment_per_task: number
          workers_needed: number
          workers_completed?: number
          deadline: string
          status?: 'open' | 'completed' | 'expired' | 'cancelled'
          escrow_amount: number
          platform_fee_percentage?: number
          submission_type: 'text' | 'file' | 'url'
          requirements?: string[]
          example_submission?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          requester_id?: string
          title?: string
          description?: string
          category?: string
          payment_per_task?: number
          workers_needed?: number
          workers_completed?: number
          deadline?: string
          status?: 'open' | 'completed' | 'expired' | 'cancelled'
          escrow_amount?: number
          platform_fee_percentage?: number
          submission_type?: 'text' | 'file' | 'url'
          requirements?: string[]
          example_submission?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          task_id: string
          worker_id: string
          submission_type: 'text' | 'file' | 'url'
          submission_text: string | null
          submission_file_url: string | null
          submission_url: string | null
          status: 'pending' | 'approved' | 'rejected'
          submitted_at: string
          reviewed_at: string | null
          payment_transaction_hash: string | null
        }
        Insert: {
          id?: string
          task_id: string
          worker_id: string
          submission_type: 'text' | 'file' | 'url'
          submission_text?: string | null
          submission_file_url?: string | null
          submission_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          submitted_at?: string
          reviewed_at?: string | null
          payment_transaction_hash?: string | null
        }
        Update: {
          id?: string
          task_id?: string
          worker_id?: string
          submission_type?: 'text' | 'file' | 'url'
          submission_text?: string | null
          submission_file_url?: string | null
          submission_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          submitted_at?: string
          reviewed_at?: string | null
          payment_transaction_hash?: string | null
        }
      }
    }
  }
}