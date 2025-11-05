// Re-export database types
import type { Database } from '@/lib/supabase'

export type User = Database['public']['Tables']['users']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type Submission = Database['public']['Tables']['submissions']['Row']

// Component prop types
export interface TaskCardProps {
  task: Task & {
    requester_wallet?: string
    spots_remaining?: number
  }
  onClick?: () => void
}

export interface SubmissionFormProps {
  taskId: string
  submissionType: 'text' | 'file' | 'url'
  onSubmit: (data: SubmissionData) => void
}

export interface SubmissionData {
  submission_text?: string
  submission_file_url?: string
  submission_url?: string
}

// Form types
export interface TaskFormData {
  title: string
  description: string
  category: string
  payment_per_task: number
  workers_needed: number
  deadline: string
  submission_type: 'text' | 'file' | 'url'
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

// Wallet context types
export interface WalletContextType {
  connected: boolean
  publicKey: string | null
  signMessage: (message: Uint8Array) => Promise<Uint8Array>
  signTransaction: (transaction: any) => Promise<any>
}

// Filter types for marketplace
export interface TaskFilters {
  category?: string[]
  minPayment?: number
  maxPayment?: number
  timeRemaining?: 'ending_soon' | '1_3_days' | '3_plus_days'
  search?: string
}

export interface TaskSort {
  field: 'payment_per_task' | 'created_at' | 'deadline'
  direction: 'asc' | 'desc'
}