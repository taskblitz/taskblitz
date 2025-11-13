'use client'
import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { AdminLayout } from '@/components/AdminLayout'
import { deleteTask, pauseTask } from '@/lib/admin'
import { supabase } from '@/lib/supabase'
import { Briefcase, Trash2, Pause, Play, AlertTriangle } from 'lucide-react'

export default function AdminTasksPage() {
  const { publicKey } = useWallet()
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadTasks()
  }, [filter])

  const loadTasks = async () => {
    setLoading(true)
    let query = supabase
      .from('tasks')
      .select(`
        *,
        requester:users!tasks_requester_id_fkey(username, wallet_address)
      `)
      .order('created_at', { ascending: false })

    if (filter !== 'all') {
      query = query.eq('status', filter)
    }

    const { data } = await query
    setTasks(data || [])
    setLoading(false)
  }

  const handleDelete = async (taskId: string) => {
    if (!publicKey) return
    if (!confirm('Are you sure you want to delete this task?')) return

    const reason = prompt('Reason for deletion:')
    if (!reason) return

    await deleteTask(taskId, publicKey.toString(), reason)
    loadTasks()
  }

  const handlePause = async (taskId: string) => {
    if (!publicKey) return
    await pauseTask(taskId, publicKey.toString())
    loadTasks()
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Task Management</h1>
        <p className="text-text-secondary">Monitor and moderate platform tasks</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['all', 'open', 'in_progress', 'completed', 'paused'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
              filter === f
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Tasks Grid */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-white font-medium">No tasks found</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="glass-card p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{task.title}</h3>
                  <p className="text-text-secondary text-sm mb-3">{task.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="text-text-secondary">
                      By @{task.requester?.username}
                    </span>
                    <span className="text-green-400">
                      ${task.payment_per_task} per task
                    </span>
                    <span className="text-cyan-400">
                      {task.workers_completed}/{task.workers_needed} completed
                    </span>
                    {task.workers_rejected > 0 && (
                      <span className="text-red-400 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {task.workers_rejected} rejected
                      </span>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  task.status === 'open' ? 'bg-green-400/20 text-green-300' :
                  task.status === 'in_progress' ? 'bg-blue-400/20 text-blue-300' :
                  task.status === 'completed' ? 'bg-purple-400/20 text-purple-300' :
                  'bg-gray-400/20 text-gray-300'
                }`}>
                  {task.status}
                </span>
              </div>

              <div className="flex gap-2 pt-4 border-t border-white/10">
                {task.status !== 'paused' && (
                  <button
                    onClick={() => handlePause(task.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white text-sm font-medium"
                  >
                    <Pause className="w-4 h-4" />
                    Pause
                  </button>
                )}
                <button
                  onClick={() => handleDelete(task.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  )
}
