'use client'
import { useState, useEffect } from 'react'
import { TaskCard } from './TaskCard'
import { Loader2 } from 'lucide-react'
import { getAllTasks } from '@/lib/database'

interface TaskGridProps {
  filters: {
    categories: string[]
    difficulty: string[]
    rewardRange: { min: string; max: string }
  }
}

export function TaskGrid({ filters }: TaskGridProps) {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('newest')

  const fetchTasks = async () => {
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
        postedBy: 'TaskBlitz User', // Simplified for now
        postedAt: new Date(task.created_at),
        deadline: new Date(task.deadline),
        status: task.status,
        workersNeeded: task.workers_needed,
        workersCompleted: task.workers_completed
      }))
      
      console.log('Transformed tasks:', transformedTasks)
      setTasks(transformedTasks)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [filters, sortBy])

  // Test connection on mount
  useEffect(() => {
    import('@/lib/test-connection').then(({ testSupabaseConnection }) => {
      testSupabaseConnection()
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
        <span className="ml-2 text-text-secondary">Loading tasks...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-text-secondary">{tasks.length} tasks available</p>
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