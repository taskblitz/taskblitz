'use client'
import { useState, useEffect, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Header } from '@/components/Header'
import { 
  DollarSign, 
  Briefcase, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Users,
  Calendar,
  Star,
  Edit3,
  Save,
  X
} from 'lucide-react'
import Link from 'next/link'
import { getTasksByRequester, getSubmissionsByWorker, getUserByWallet, updateUsername } from '@/lib/database'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { connected, publicKey } = useWallet()
  const [stats, setStats] = useState({
    totalEarned: 0,
    tasksPosted: 0,
    tasksCompleted: 0,
    pendingReviews: 0,
    successRate: 0,
    totalSpent: 0
  })
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [editingUsername, setEditingUsername] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [updatingUsername, setUpdatingUsername] = useState(false)

  const fetchDashboardData = useCallback(async () => {
    if (!publicKey) return
    
    try {
      setLoading(true)
      const walletAddress = publicKey.toString()
      
      // Fetch user data
      const userData = await getUserByWallet(walletAddress)
      setUser(userData)
      setNewUsername(userData?.username || '')
      
      // Fetch tasks posted by user
      const postedTasks = await getTasksByRequester(walletAddress)
      
      // Fetch submissions by user
      const submissions = await getSubmissionsByWorker(walletAddress)
      
      // Calculate stats
      const totalSpent = postedTasks.reduce((sum, task) => 
        sum + (task.payment_per_task * task.workers_completed), 0
      )
      
      const totalEarned = submissions
        .filter(sub => sub.status === 'approved')
        .reduce((sum, sub) => sum + (sub.task?.payment_per_task || 0), 0)
      
      const completedTasks = submissions.filter(sub => sub.status === 'approved').length
      const pendingReviews = submissions.filter(sub => sub.status === 'pending').length
      const successRate = submissions.length > 0 
        ? Math.round((completedTasks / submissions.length) * 100) 
        : 0

      setStats({
        totalEarned,
        tasksPosted: postedTasks.length,
        tasksCompleted: completedTasks,
        pendingReviews,
        successRate,
        totalSpent
      })
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [publicKey])

  const handleUpdateUsername = async () => {
    if (!publicKey || !newUsername.trim()) return
    
    try {
      setUpdatingUsername(true)
      await updateUsername(publicKey.toString(), newUsername.trim())
      
      // Update local user state
      setUser((prev: any) => ({ ...prev, username: newUsername.trim() }))
      setEditingUsername(false)
      toast.success('Username updated successfully!')
      
    } catch (error: any) {
      console.error('Error updating username:', error)
      toast.error(error.message || 'Failed to update username')
    } finally {
      setUpdatingUsername(false)
    }
  }

  const handleCancelEdit = () => {
    setNewUsername(user?.username || '')
    setEditingUsername(false)
  }

  useEffect(() => {
    setMounted(true)
    if (connected && publicKey) {
      fetchDashboardData()
    } else {
      setLoading(false)
    }
  }, [connected, publicKey, fetchDashboardData])

  if (!mounted) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded mb-4 w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="glass-card p-6">
                  <div className="h-4 bg-white/5 rounded mb-2"></div>
                  <div className="h-8 bg-white/10 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!connected) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="glass-card p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p className="text-text-secondary mb-6">
              Connect your wallet to view your TaskBlitz dashboard and earnings.
            </p>
            <WalletMultiButton />
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-text-secondary">Track your TaskBlitz activity and earnings</p>
            </div>
            
            {/* Username Editor */}
            <div className="glass-card p-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-text-muted">Username:</span>
                {editingUsername ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="bg-transparent border border-white/20 rounded px-2 py-1 text-sm focus:border-purple-400 focus:outline-none"
                      placeholder="Enter username"
                      maxLength={20}
                    />
                    <button
                      onClick={handleUpdateUsername}
                      disabled={updatingUsername || !newUsername.trim()}
                      className="p-1 text-green-400 hover:text-green-300 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={updatingUsername}
                      className="p-1 text-red-400 hover:text-red-300 disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">@{user?.username || 'Loading...'}</span>
                    <button
                      onClick={() => setEditingUsername(true)}
                      className="p-1 text-purple-400 hover:text-purple-300"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            <span className="ml-2 text-text-secondary">Loading dashboard...</span>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Earned */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-400" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-green-400">${stats.totalEarned.toFixed(2)}</p>
                  <p className="text-sm text-text-muted">Total Earned</p>
                </div>
              </div>

              {/* Tasks Posted */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Briefcase className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stats.tasksPosted}</p>
                  <p className="text-sm text-text-muted">Tasks Posted</p>
                </div>
              </div>

              {/* Tasks Completed */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stats.tasksCompleted}</p>
                  <p className="text-sm text-text-muted">Tasks Completed</p>
                </div>
              </div>

              {/* Success Rate */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-400" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stats.successRate}%</p>
                  <p className="text-sm text-text-muted">Success Rate</p>
                </div>
              </div>
            </div>

            {/* Activity Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {stats.pendingReviews > 0 && (
                    <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-yellow-400 mr-2" />
                        <span className="text-sm">Pending Reviews</span>
                      </div>
                      <span className="text-yellow-400 font-medium">{stats.pendingReviews}</span>
                    </div>
                  )}
                  
                  {stats.tasksCompleted > 0 && (
                    <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                        <span className="text-sm">Completed Tasks</span>
                      </div>
                      <span className="text-green-400 font-medium">{stats.tasksCompleted}</span>
                    </div>
                  )}

                  {stats.tasksPosted > 0 && (
                    <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg">
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 text-purple-400 mr-2" />
                        <span className="text-sm">Tasks Posted</span>
                      </div>
                      <span className="text-purple-400 font-medium">{stats.tasksPosted}</span>
                    </div>
                  )}

                  {stats.tasksPosted === 0 && stats.tasksCompleted === 0 && (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-text-muted mx-auto mb-4" />
                      <p className="text-text-muted">No activity yet</p>
                      <p className="text-sm text-text-secondary mt-2">
                        Start by posting a task or completing work to see your activity here.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-4">
                  <Link 
                    href="/post-task"
                    className="flex items-center justify-between p-4 glass-card hover:bg-white/10 transition-colors rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-500/20 rounded-lg mr-3">
                        <Briefcase className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium">Post New Task</p>
                        <p className="text-sm text-text-muted">Get work done by skilled freelancers</p>
                      </div>
                    </div>
                  </Link>

                  <Link 
                    href="/"
                    className="flex items-center justify-between p-4 glass-card hover:bg-white/10 transition-colors rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-cyan-500/20 rounded-lg mr-3">
                        <CheckCircle className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <p className="font-medium">Browse Tasks</p>
                        <p className="text-sm text-text-muted">Find tasks to complete and earn crypto</p>
                      </div>
                    </div>
                  </Link>

                  <Link 
                    href="/my-tasks"
                    className="flex items-center justify-between p-4 glass-card hover:bg-white/10 transition-colors rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-green-500/20 rounded-lg mr-3">
                        <Calendar className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">My Tasks</p>
                        <p className="text-sm text-text-muted">Manage your posted tasks and submissions</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Spending Overview (if user has posted tasks) */}
            {stats.tasksPosted > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4">Spending Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-400">${stats.totalSpent.toFixed(2)}</p>
                    <p className="text-sm text-text-muted">Total Spent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{stats.tasksPosted}</p>
                    <p className="text-sm text-text-muted">Tasks Posted</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">${stats.tasksPosted > 0 ? (stats.totalSpent / stats.tasksPosted).toFixed(2) : '0.00'}</p>
                    <p className="text-sm text-text-muted">Avg per Task</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}