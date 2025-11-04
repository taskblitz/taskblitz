'use client'
import { useState } from 'react'
import { Clock, Users, Eye, CheckCircle, XCircle, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { taskStore } from '@/lib/taskStore'
import toast from 'react-hot-toast'

interface Submission {
  id: string
  workerId: string
  workerName: string
  submissionType: 'text' | 'file' | 'url'
  submissionText?: string
  submissionFileUrl?: string
  submissionUrl?: string
  submittedAt: Date
  status: 'pending' | 'approved' | 'rejected'
  reviewedAt?: Date
}

interface Task {
  id: string
  title: string
  paymentPerWorker: number
  status: 'open' | 'completed' | 'expired' | 'cancelled'
  workersNeeded: number
  workersCompleted: number
  postedAt: Date
  deadline: Date
  category: string
  submissions: Submission[]
}

interface TaskManagementCardProps {
  task: Task
}

export function TaskManagementCard({ task }: TaskManagementCardProps) {
  const [showSubmissions, setShowSubmissions] = useState(false)

  const statusColors = {
    open: 'text-green-400 bg-green-400/20',
    completed: 'text-purple-400 bg-purple-400/20',
    expired: 'text-yellow-400 bg-yellow-400/20',
    cancelled: 'text-red-400 bg-red-400/20'
  }

  const pendingSubmissions = task.submissions.filter(sub => sub.status === 'pending')

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just posted'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const handleApproveSubmission = (submissionId: string) => {
    const success = taskStore.approveSubmission(task.id, submissionId)
    if (success) {
      const submission = task.submissions.find(sub => sub.id === submissionId)
      toast.success(`Approved submission from ${submission?.workerName}`)
    } else {
      toast.error('Failed to approve submission')
    }
  }

  const handleRejectSubmission = (submissionId: string) => {
    const success = taskStore.rejectSubmission(task.id, submissionId)
    if (success) {
      const submission = task.submissions.find(sub => sub.id === submissionId)
      toast.success(`Rejected submission from ${submission?.workerName}`)
    } else {
      toast.error('Failed to reject submission')
    }
  }

  return (
    <div className="glass-card p-6 space-y-4">
      {/* Task Header */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
              {task.category}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[task.status]}`}>
              {task.status.replace('-', ' ')}
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
          <div className="flex items-center space-x-4 text-sm text-text-secondary mb-3">
            <span>${task.paymentPerWorker} each</span>
            <div className="flex items-center">
              <Users className="w-3 h-3 mr-1" />
              <span>{task.workersCompleted}/{task.workersNeeded} completed</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>{formatTimeAgo(task.postedAt)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((task.workersCompleted / task.workersNeeded) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Reviews Alert */}
      {pendingSubmissions.length > 0 && (
        <div className="glass-card p-4 bg-yellow-500/10 border-yellow-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-300">
                {pendingSubmissions.length} submission{pendingSubmissions.length > 1 ? 's' : ''} awaiting review
              </p>
              <p className="text-xs text-text-muted">Review and approve/reject worker submissions</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex space-x-3">
          <Link 
            href={`/task/${task.id}`}
            className="flex items-center text-purple-400 hover:text-purple-300 transition-colors text-sm"
          >
            <Eye className="w-4 h-4 mr-1" />
            View Details
          </Link>
          {task.submissions.length > 0 && (
            <button
              onClick={() => setShowSubmissions(!showSubmissions)}
              className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
            >
              <Users className="w-4 h-4 mr-1" />
              {showSubmissions ? 'Hide' : 'Review'} Submissions ({task.submissions.length})
            </button>
          )}
        </div>
      </div>

      {/* Submissions List */}
      {showSubmissions && task.submissions.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-white/10">
          <h4 className="font-medium text-sm">Submissions:</h4>
          {task.submissions.map((submission) => (
            <div key={submission.id} className="glass-card p-4 bg-white/5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium">@{submission.workerName?.length > 15 ? submission.workerName.substring(0, 15) + '...' : submission.workerName}</p>
                  <p className="text-xs text-text-muted">
                    Submitted {formatTimeAgo(submission.submittedAt)}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  submission.status === 'pending' ? 'bg-yellow-400/20 text-yellow-300' :
                  submission.status === 'approved' ? 'bg-green-400/20 text-green-300' :
                  'bg-red-400/20 text-red-300'
                }`}>
                  {submission.status}
                </span>
              </div>
              
              <div className="text-sm text-text-secondary mb-3">
                <p className="text-xs text-text-muted mb-1">Submission:</p>
                {submission.submissionType === 'text' && submission.submissionText && (
                  <p className="bg-white/5 p-2 rounded">{submission.submissionText}</p>
                )}
                {submission.submissionType === 'url' && submission.submissionUrl && (
                  <a 
                    href={submission.submissionUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 underline bg-white/5 p-2 rounded block"
                  >
                    {submission.submissionUrl}
                  </a>
                )}
                {submission.submissionType === 'file' && submission.submissionFileUrl && (
                  <a 
                    href={submission.submissionFileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 underline bg-white/5 p-2 rounded block"
                  >
                    View uploaded file
                  </a>
                )}
              </div>

              {submission.status === 'pending' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApproveSubmission(submission.id)}
                    className="flex items-center text-green-400 hover:text-green-300 transition-colors text-sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve & Pay
                  </button>
                  <button
                    onClick={() => handleRejectSubmission(submission.id)}
                    className="flex items-center text-red-400 hover:text-red-300 transition-colors text-sm"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}