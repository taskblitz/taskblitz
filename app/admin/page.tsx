'use client'
import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { supabase } from '@/lib/supabase'
import { TrendingUp, Users, Briefcase, DollarSign, Activity, CheckCircle } from 'lucide-react'

interface PlatformStats {
  totalUsers: number
  totalTasks: number
  totalSubmissions: number
  totalVolume: number
  activeTasks: number
  completedTasks: number
  totalWorkers: number
  totalRequesters: number
  avgTaskPayment: number
  platformRevenue: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [recentTasks, setRecentTasks] = useState<any[]>([])

  useEffect(() => {
    fetchStats()
    fetchRecentTasks()
  }, [])

  const fetchStats = async () => {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      // Get total tasks
      const { count: totalTasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })

      // Get active tasks
      const { count: activeTasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open')

      // Get completed tasks
      const { count: completedTasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed')

      // Get total submissions
      const { count: totalSubmissions } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })

      // Get total volume and avg payment
      const { data: taskData } = await supabase
        .from('tasks')
        .select('payment_per_task, workers_needed, workers_completed')

      const totalVolume = taskData?.reduce((sum, task) => 
        sum + (task.payment_per_task * task.workers_completed), 0
      ) || 0

      const avgTaskPayment = taskData?.length 
        ? taskData.reduce((sum, task) => sum + task.payment_per_task, 0) / taskData.length
        : 0

      // Platform revenue (10% of total volume)
      const platformRevenue = totalVolume * 0.1

      // Get unique workers and requesters
      const { data: users } = await supabase
        .from('users')
        .select('role')

      const totalWorkers = users?.filter(u => u.role === 'worker' || u.role === 'both').length || 0
      const totalRequesters = users?.filter(u => u.role === 'requester' || u.role === 'both').length || 0

      setStats({
        totalUsers: totalUsers || 0,
        totalTasks: totalTasks || 0,
        totalSubmissions: totalSubmissions || 0,
        totalVolume,
        activeTasks: activeTasks || 0,
        completedTasks: completedTasks || 0,
        totalWorkers,
        totalRequesters,
        avgTaskPayment,
        platformRevenue
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentTasks = async () => {
    const { data } = await supabase
      .from('tasks')
      .select(`
        *,
        requester:users!tasks_requester_id_fkey(username)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    setRecentTasks(data || [])
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="h-32 bg-white/10 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-text-secondary">Platform analytics and insights</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold">{stats?.totalUsers}</span>
            </div>
            <p className="text-text-secondary text-sm">Total Users</p>
            <p className="text-xs text-text-muted mt-1">
              {stats?.totalWorkers} workers, {stats?.totalRequesters} requesters
            </p>
          </div>

          {/* Total Tasks */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <Briefcase className="w-8 h-8 text-cyan-400" />
              <span className="text-2xl font-bold">{stats?.totalTasks}</span>
            </div>
            <p className="text-text-secondary text-sm">Total Tasks</p>
            <p className="text-xs text-text-muted mt-1">
              {stats?.activeTasks} active, {stats?.completedTasks} completed
            </p>
          </div>

          {/* Total Volume */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold">${stats?.totalVolume.toFixed(2)}</span>
            </div>
            <p className="text-text-secondary text-sm">Total Volume</p>
            <p className="text-xs text-text-muted mt-1">
              Avg ${stats?.avgTaskPayment.toFixed(2)} per task
            </p>
          </div>

          {/* Platform Revenue */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-bold">${stats?.platformRevenue.toFixed(2)}</span>
            </div>
            <p className="text-text-secondary text-sm">Platform Revenue</p>
            <p className="text-xs text-text-muted mt-1">10% platform fee</p>
          </div>

          {/* Total Submissions */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold">{stats?.totalSubmissions}</span>
            </div>
            <p className="text-text-secondary text-sm">Total Submissions</p>
          </div>

          {/* Active Tasks */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-orange-400" />
              <span className="text-2xl font-bold">{stats?.activeTasks}</span>
            </div>
            <p className="text-text-secondary text-sm">Active Tasks</p>
          </div>

          {/* Completion Rate */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-pink-400" />
              <span className="text-2xl font-bold">
                {stats?.totalTasks ? ((stats.completedTasks / stats.totalTasks) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <p className="text-text-secondary text-sm">Completion Rate</p>
          </div>

          {/* Avg Workers per Task */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-indigo-400" />
              <span className="text-2xl font-bold">
                {stats?.totalTasks ? (stats.totalSubmissions / stats.totalTasks).toFixed(1) : 0}
              </span>
            </div>
            <p className="text-text-secondary text-sm">Avg Submissions/Task</p>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4">Recent Tasks</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Title</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Requester</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Payment</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Workers</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.map((task) => (
                  <tr key={task.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-sm">{task.title}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      @{task.requester?.username || 'Unknown'}
                    </td>
                    <td className="py-3 px-4 text-sm">${task.payment_per_task}</td>
                    <td className="py-3 px-4 text-sm">
                      {task.workers_completed}/{task.workers_needed}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.status === 'open' ? 'bg-green-400/20 text-green-300' :
                        task.status === 'completed' ? 'bg-purple-400/20 text-purple-300' :
                        'bg-gray-400/20 text-gray-300'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
