'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { TaskCard } from './TaskCard'
import { TaskGridSkeleton } from './LoadingSkeleton'
import { getAllTasks } from '@/lib/database'
import { ViewGridIcon, ListBulletIcon } from '@radix-ui/react-icons'

interface TaskGridProps {
  filters: {
    categories: string[]
    difficulty: string[]
    rewardRange: { min: string; max: string }
  }
  searchQuery?: string
}

export function TaskGrid({ filters, searchQuery = '' }: TaskGridProps) {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Load view preference from localStorage
  useEffect(() => {
    const savedView = localStorage.getItem('taskViewMode')
    if (savedView === 'list' || savedView === 'grid') {
      setViewMode(savedView)
    }
  }, [])

  // Save view preference to localStorage
  const handleViewChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
    localStorage.setItem('taskViewMode', mode)
  }

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      console.log('Fetching tasks with filters:', filters, 'sortBy:', sortBy)
      
      const data = await getAllTasks({
        categories: filters.categories,
        rewardRange: {
          min: filters.rewardRange.min ? parseFloat(filters.rewardRange.min) : undefined,
          max: filters.rewardRange.max ? parseFloat(filters.rewardRange.max) : undefined
        },
        sortBy
      })
      
      console.log('Raw data from database:', data)
      
      // Transform data to match component expectations
      const transformedTasks = data.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        paymentPerWorker: task.payment_per_task,
        category: task.category,
        difficulty: 'Easy', // We'll add this field later
        timeEstimate: '1-2 hours', // We'll add this field later
        postedBy: task.requester?.username || task.requester?.wallet_address || 'Unknown User',
        postedAt: new Date(task.created_at),
        deadline: new Date(task.deadline),
        status: task.status,
        workersNeeded: task.workers_needed,
        workersCompleted: task.workers_completed
      }))
      
      console.log('Transformed tasks:', transformedTasks)
      
      // Apply search filter
      let filteredTasks = transformedTasks
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        filteredTasks = transformedTasks.filter(task => 
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.category.toLowerCase().includes(query)
        )
      }
      
      setTasks(filteredTasks)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }, [filters, sortBy, searchQuery])

  useEffect(() => {
    fetchTasks()
  }, [filters, sortBy, searchQuery, fetchTasks])

  // Test connection on mount
  useEffect(() => {
    import('@/lib/test-connection').then(({ testSupabaseConnection }) => {
      testSupabaseConnection()
    })
  }, [])

  if (loading) {
    return <TaskGridSkeleton />
  }

  if (tasks.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold mb-2">No Tasks Found</h3>
        <p className="text-text-secondary mb-6">
          {searchQuery ? `No tasks match &quot;${searchQuery}&quot;` : 'No tasks match your current filters.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="gradient-primary text-white px-6 py-2 rounded-lg hover:scale-105 transition-transform"
        >
          Clear All Filters
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <p className="text-text-secondary">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''} found
          {searchQuery && <span className="text-purple-400"> for &quot;{searchQuery}&quot;</span>}
        </p>
        
        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex items-center glass-card rounded-lg p-1 h-[38px]">
            <button
              onClick={() => handleViewChange('grid')}
              className={`p-2 rounded transition-all ${
                viewMode === 'grid' 
                  ? 'bg-purple-500 text-white' 
                  : 'text-text-secondary hover:text-white'
              }`}
              title="Grid View"
            >
              <ViewGridIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleViewChange('list')}
              className={`p-2 rounded transition-all ${
                viewMode === 'list' 
                  ? 'bg-purple-500 text-white' 
                  : 'text-text-secondary hover:text-white'
              }`}
              title="List View"
            >
              <ListBulletIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="glass-card px-3 py-2 text-sm bg-transparent border-white/20 rounded-lg text-white focus:border-purple-400 focus:outline-none h-[38px]"
          >
            <option value="newest" className="bg-gray-800 text-white">Newest First</option>
            <option value="reward-high" className="bg-gray-800 text-white">Highest Reward</option>
            <option value="reward-low" className="bg-gray-800 text-white">Lowest Reward</option>
            <option value="deadline" className="bg-gray-800 text-white">Deadline Soon</option>
          </select>
        </div>
      </div>
      
      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {/* List View - Responsive Layout */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {tasks.map((task) => {
            const formatTimeAgo = (date: Date) => {
              const now = new Date()
              const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
              if (diffInHours < 1) return 'Just posted'
              if (diffInHours < 24) return `${diffInHours}h ago`
              const diffInDays = Math.floor(diffInHours / 24)
              return `${diffInDays}d ago`
            }

            return (
              <Link key={task.id} href={`/task/${task.id}`}>
                <div className="glass-card p-3 md:p-5 mb-4 hover:bg-white/10 transition-all cursor-pointer group border border-white/5">
                  {/* Mobile: Stacked Layout */}
                  <div className="md:hidden">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                          {task.category}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full text-green-400 bg-green-400/20">
                          {task.status}
                        </span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xl font-bold text-green-400 tabular-nums">
                          ${task.paymentPerWorker.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-text-muted">per completion</div>
                      </div>
                    </div>
                    
                    <h3 className="text-base font-semibold mb-1 group-hover:text-purple-300 transition-colors line-clamp-2">
                      {task.title}
                    </h3>
                    
                    <p className="text-xs text-text-secondary line-clamp-2 mb-2">
                      {task.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-text-muted mb-2">
                      <span>⏰ {formatTimeAgo(task.postedAt)}</span>
                      <span>👥 {task.workersCompleted}/{task.workersNeeded} spots</span>
                    </div>

                    <div className="w-full">
                      <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                        <span>Progress</span>
                        <span>{Math.round((task.workersCompleted / task.workersNeeded) * 100)}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-cyan-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${Math.min((task.workersCompleted / task.workersNeeded) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Desktop: Horizontal Layout */}
                  <div className="hidden md:flex items-start justify-between gap-6">
                    {/* Left Section */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                          {task.category}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full text-green-400 bg-green-400/20">
                          {task.difficulty}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full text-green-400 bg-green-400/20">
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
                        <span>⏰ {formatTimeAgo(task.postedAt)}</span>
                        <span>👥 {task.workersCompleted}/{task.workersNeeded} spots</span>
                        <span>by @{task.postedBy}</span>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col items-end justify-between min-w-[140px] text-right">
                      <div className="mb-3">
                        <div className="text-3xl font-bold text-green-400 tabular-nums">
                          ${task.paymentPerWorker.toFixed(2)}
                        </div>
                        <div className="text-xs text-text-muted">per completion</div>
                      </div>

                      <div className="w-full">
                        <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                          <span>Progress</span>
                          <span>{Math.round((task.workersCompleted / task.workersNeeded) * 100)}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-cyan-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${Math.min((task.workersCompleted / task.workersNeeded) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
      
      {tasks.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-text-secondary text-lg">No tasks match your current filters</p>
          <p className="text-text-muted text-sm mt-2">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  )
}