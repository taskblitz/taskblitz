'use client'
import { Clock, ExternalLink, MessageSquare } from 'lucide-react'
import Link from 'next/link'

interface Application {
  id: string
  taskId: string
  taskTitle: string
  taskReward: number
  taskPoster: string
  appliedAt: Date
  status: 'pending' | 'accepted' | 'rejected'
  proposal: string
}

interface ApplicationCardProps {
  application: Application
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const statusColors = {
    pending: 'text-yellow-400 bg-yellow-400/20',
    accepted: 'text-green-400 bg-green-400/20',
    rejected: 'text-red-400 bg-red-400/20'
  }

  const formatTimeAgo = (date: Date | string | undefined) => {
    if (!date) return 'Unknown'
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return 'Unknown'
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just applied'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <div className="glass-card p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold">{application.taskTitle}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[application.status]}`}>
              {application.status}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-text-secondary mb-3">
            <span className="text-green-400 font-medium">${application.taskReward}</span>
            <span>by @{application.taskPoster}</span>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>{formatTimeAgo(application.appliedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-text-muted mb-2">Your proposal:</p>
        <p className="text-sm text-text-secondary bg-white/5 p-3 rounded-lg">
          {application.proposal}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex space-x-4">
          <Link 
            href={`/task/${application.taskId}`}
            className="flex items-center text-purple-400 hover:text-purple-300 transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            View Task
          </Link>
          
          {application.status === 'accepted' && (
            <button className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors text-sm">
              <MessageSquare className="w-4 h-4 mr-1" />
              Message Poster
            </button>
          )}
        </div>

        {application.status === 'pending' && (
          <span className="text-xs text-text-muted">Waiting for response...</span>
        )}
        
        {application.status === 'accepted' && (
          <span className="text-xs text-green-400 font-medium">You got the job!</span>
        )}
        
        {application.status === 'rejected' && (
          <span className="text-xs text-red-400">Not selected this time</span>
        )}
      </div>
    </div>
  )
}