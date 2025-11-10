'use client'
import { Clock, Users, DollarSign, Calendar } from 'lucide-react'
import Link from 'next/link'
import { TaskStatusBadge } from './TaskStatusBadge'

interface Task {
  id: string
  title: string
  description: string
  paymentPerWorker: number
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  timeEstimate: string
  postedBy: string
  postedAt: Date
  deadline: Date
  status: 'open' | 'completed' | 'expired' | 'cancelled'
  workersNeeded: number
  workersCompleted: number
}

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const difficultyColors = {
    Easy: 'text-green-400 bg-green-400/20',
    Medium: 'text-yellow-400 bg-yellow-400/20',
    Hard: 'text-red-400 bg-red-400/20'
  }

  const formatTimeAgo = (date: Date | string | undefined) => {
    if (!date) return 'Unknown'
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return 'Unknown'
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just posted'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <div className="glass-card p-6 hover:bg-white/10 transition-all duration-200 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
            {task.category}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[task.difficulty]}`}>
            {task.difficulty}
          </span>
          <TaskStatusBadge 
            status={task.status}
            workersCompleted={task.workersCompleted}
            workersNeeded={task.workersNeeded}
          />
        </div>
        <div className="text-right ml-auto">
          <div className="text-2xl font-bold text-green-400 tabular-nums">
            ${task.paymentPerWorker.toFixed(2)}
          </div>
          <div className="text-xs text-text-muted whitespace-nowrap">
            per completion
          </div>
        </div>
      </div>

      <Link href={`/task/${task.id}`}>
        <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-300 transition-colors cursor-pointer">
          {task.title}
        </h3>
      </Link>
      
      <p className="text-text-secondary text-sm mb-4 line-clamp-2">
        {task.description}
      </p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-text-muted mb-2">
          <span>{task.workersCompleted}/{task.workersNeeded} completed</span>
          <span>{Math.round((task.workersCompleted / task.workersNeeded) * 100)}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((task.workersCompleted / task.workersNeeded) * 100, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-text-muted mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>{task.timeEstimate}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-3 h-3 mr-1" />
            <span>{task.workersNeeded - task.workersCompleted} spots left</span>
          </div>
        </div>
        <div className="flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          <span>{formatTimeAgo(task.postedAt)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-text-muted mr-2">
          by <span className="text-purple-300">@{task.postedBy}</span>
        </div>
        {task.status === 'open' && task.workersCompleted < task.workersNeeded ? (
          <Link 
            href={`/task/${task.id}`}
            className="gradient-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:scale-105 transition-transform"
          >
            View Task
          </Link>
        ) : task.status === 'completed' ? (
          <span className="text-green-400 text-sm font-medium px-4 py-2">
            Task Full
          </span>
        ) : (
          <span className="text-yellow-400 text-sm font-medium px-4 py-2">
            Expired
          </span>
        )}
      </div>
    </div>
  )
}