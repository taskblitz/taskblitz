'use client'
import { useState, useEffect } from 'react'
import { Users, CheckCircle, XCircle, Clock, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { getTaskApplications, approveApplication, rejectApplication } from '@/lib/applications'
import { getProfileUrl } from '@/lib/url-utils'
import Link from 'next/link'

interface ApplicationsManagerProps {
  taskId: string
  taskTitle: string
}

export function ApplicationsManager({ taskId, taskTitle }: ApplicationsManagerProps) {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  useEffect(() => {
    loadApplications()
  }, [taskId])

  const loadApplications = async () => {
    setLoading(true)
    try {
      const data = await getTaskApplications(taskId)
      setApplications(data)
    } catch (error) {
      console.error('Error loading applications:', error)
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (applicationId: string) => {
    try {
      await approveApplication(applicationId)
      toast.success('✅ Worker approved!')
      await loadApplications()
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve')
    }
  }

  const handleReject = async (applicationId: string) => {
    try {
      await rejectApplication(applicationId)
      toast.success('Application rejected')
      await loadApplications()
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject')
    }
  }

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true
    return app.status === filter
  })

  const pendingCount = applications.filter(a => a.status === 'pending').length
  const approvedCount = applications.filter(a => a.status === 'approved').length

  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/10 rounded w-1/3"></div>
          <div className="h-20 bg-white/10 rounded"></div>
          <div className="h-20 bg-white/10 rounded"></div>
        </div>
      </div>
    )
  }

  if (applications.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
        <p className="text-gray-400 text-sm">
          Workers will see an "Apply" button and can submit applications to work on this task.
        </p>
      </div>
    )
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Applications ({applications.length})
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            {pendingCount} pending • {approvedCount} approved
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              filter === 'all' ? 'bg-purple-500 text-white' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              filter === 'approved' ? 'bg-green-500 text-white' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            Approved ({approvedCount})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredApplications.map((app) => (
          <div key={app.id} className="glass-card p-4 border border-white/10">
            <div className="flex items-start justify-between gap-4">
              {/* Worker Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-sm font-bold">
                    {app.worker.username?.[0]?.toUpperCase() || app.worker.wallet_address[0]}
                  </div>
                  <div>
                    <Link 
                      href={getProfileUrl(app.worker.username, app.worker.wallet_address)}
                      className="font-semibold hover:text-purple-400 transition-colors"
                    >
                      {app.worker.username || `${app.worker.wallet_address.slice(0, 8)}...`}
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{app.worker.tasks_completed} tasks completed</span>
                      {app.worker.rating_as_worker > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {app.worker.rating_as_worker.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {app.message && (
                  <p className="text-sm text-gray-300 bg-white/5 p-3 rounded-lg mb-2">
                    "{app.message}"
                  </p>
                )}

                <div className="text-xs text-gray-500">
                  Applied {new Date(app.applied_at).toLocaleDateString()}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                {app.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(app.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(app.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
                {app.status === 'approved' && (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Approved
                  </div>
                )}
                {app.status === 'rejected' && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <XCircle className="w-4 h-4" />
                    Rejected
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
