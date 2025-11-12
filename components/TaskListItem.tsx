'use client'
import Link from 'next/link'
import { ClockIcon, PersonIcon, RocketIcon } from '@radix-ui/react-icons'
import { UsernameLink } from './UsernameLink'

interface Task {
  id: string
  title: string
  description: string
  paymentPerWorker: number
  category: string
  difficulty: string
  timeEstimate: string
  postedBy: string
  requesterWallet?: string
  postedAt: Date
  deadline: Date
  status: string
  workersNeeded: number
  workersCompleted: number
}

interface TaskListItemProps {
  task: Task
}

export function TaskListItem({ task }: TaskListItemProps) {
  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just posted'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const difficultyColors = {
    Easy: 'text-green-400 bg-green-400/20',
    Medium: 'text-yellow-400 bg-yellow-400/20',
    Hard: 'text-red-400 bg-red-400/20'
  }

  const statusColors = {
    open: 'text-green-400 bg-green-400/20',
    completed: 'text-purple-400 bg-purple-400/20',
    expired: 'text-yellow-400 bg-yellow-400/20',
    cancelled: 'text-red-400 bg-red-400/20'
  }

  return (
    <Link href={`/task/${task.id}`}>
      <div className="glass-card p-5 hover:bg-white/10 transition-all cursor-pointer group border border-white/5">
        <div className="flex items-start justify-between gap-6">
          {/* Left Section - Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                {task.category}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[task.difficulty as keyof typeof difficultyColors] || difficultyColors.Easy}`}>
                {task.difficulty}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColors[task.status as keyof typeof statusColors] || statusColors.open}`}>
                {task.status}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-300 transition-colors truncate">
              {task.title}
            </h3>
            
            <p className="text-sm text-text-secondary line-clamp-1 mb-3">
              {task.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-text-muted">
              <div className="flex items-center">
                <ClockIcon className="w-3 h-3 mr-1" />
                <span>{formatTimeAgo(task.postedAt)}</span>
              </div>
              <div className="flex items-center">
                <PersonIcon className="w-3 h-3 mr-1" />
                <span>{task.workersCompleted}/{task.workersNeeded} spots</span>
              </div>
              <span>by <UsernameLink 
                username={task.postedBy}
                walletAddress={task.requesterWallet || task.postedBy}
              /></span>
            </div>
          </div>

          {/* Right Section - Payment & Progress */}
          <div className="flex flex-col items-end justify-between h-full min-w-[120px]">
            <div className="text-right mb-3">
              <div className="text-2xl font-bold text-green-400">
                ${task.paymentPerWorker}
              </div>
              <div className="text-xs text-text-muted">per completion</div>
            </div>

            {/* Progress Bar */}
            <div className="w-full">
              <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                <span>Progress</span>
                <span>{Math.round((task.workersCompleted / task.workersNeeded) * 100)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((task.workersCompleted / task.workersNeeded) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
