'use client'
import { useState, useEffect, useCallback } from 'react'
import { TaskCard } from './TaskCard'
import { TaskGridSkeleton } from './LoadingSkeleton'
import { getAllTasks } from '@/lib/database'

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
      <div className="flex justify-between items-center">
        <p className="text-text-secondary">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''} found
          {searchQuery && <span className="text-purple-400"> for &quot;{searchQuery}&quot;</span>}
        </p>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="glass-card px-3 py-2 text-sm bg-transparent border-white/20 rounded-lg text-white focus:border-purple-400 focus:outline-none"
        >
          <option value="newest" className="bg-gray-800 text-white">Newest First</option>
          <option value="reward-high" className="bg-gray-800 text-white">Highest Reward</option>
          <option value="reward-low" className="bg-gray-800 text-white">Lowest Reward</option>
          <option value="deadline" className="bg-gray-800 text-white">Deadline Soon</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
      
      {tasks.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-text-secondary text-lg">No tasks match your current filters</p>
          <p className="text-text-muted text-sm mt-2">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  )
}