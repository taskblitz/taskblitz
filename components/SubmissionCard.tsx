'use client'
import { Clock, ExternalLink, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface Submission {
  id: string
  taskId: string
  taskTitle: string
  taskPayment: number
  taskPoster: string
  submittedAt: Date
  status: 'pending' | 'approved' | 'rejected'
  submissionType: 'text' | 'file' | 'url'
  submissionText?: string
  submissionUrl?: string
  submissionFileUrl?: string
}

interface SubmissionCardProps {
  submission: Submission
}

export function SubmissionCard({ submission }: SubmissionCardProps) {
  const statusConfig = {
    pending: {
      color: 'text-yellow-400 bg-yellow-400/20',
      icon: AlertCircle,
      message: 'Awaiting review...'
    },
    approved: {
      color: 'text-green-400 bg-green-400/20',
      icon: CheckCircle,
      message: 'Payment sent!'
    },
    rejected: {
      color: 'text-red-400 bg-red-400/20',
      icon: XCircle,
      message: 'Not approved'
    }
  }

  const config = statusConfig[submission.status]
  const StatusIcon = config.icon

  const formatTimeAgo = (date: Date | string | undefined) => {
    if (!date) return 'Unknown'
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return 'Unknown'
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just submitted'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <div className="glass-card p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold">{submission.taskTitle}</h3>
            <span className={`text-xs px-2 py-1 rounded-full flex items-center ${config.color}`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {submission.status}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-text-secondary mb-3">
            <span className="text-green-400 font-medium">${submission.taskPayment}</span>
            <span>by @{submission.taskPoster}</span>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>{formatTimeAgo(submission.submittedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-text-muted mb-2">Your submission:</p>
        <div className="text-sm text-text-secondary bg-white/5 p-3 rounded-lg">
          {submission.submissionType === 'text' && submission.submissionText && (
            <p>{submission.submissionText}</p>
          )}
          {submission.submissionType === 'url' && submission.submissionUrl && (
            <a 
              href={submission.submissionUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline flex items-center"
            >
              {submission.submissionUrl}
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          )}
          {submission.submissionType === 'file' && submission.submissionFileUrl && (
            <a 
              href={submission.submissionFileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline flex items-center"
            >
              View uploaded file
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex space-x-4">
          <Link 
            href={`/task/${submission.taskId}`}
            className="flex items-center text-purple-400 hover:text-purple-300 transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            View Task
          </Link>
        </div>

        <div className="flex items-center text-sm">
          <StatusIcon className={`w-4 h-4 mr-2 ${config.color.split(' ')[0]}`} />
          <span className="text-text-muted">{config.message}</span>
        </div>
      </div>
    </div>
  )
}