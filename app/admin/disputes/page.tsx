'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/navigation'
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  ExternalLink,
  User,
  FileText,
  TrendingDown
} from 'lucide-react'
import { getAllDisputes, resolveDispute, getFlaggedUsers, getFlaggedTasks } from '@/lib/database'

interface Dispute {
  id: string
  dispute_reason: string
  worker_evidence: string | null
  status: string
  created_at: string
  submission: {
    submission_text?: string
    submission_url?: string
    rejection_reason?: string
    submitted_at: string
  }
  task: {
    title: string
    payment_per_task: number
    workers_completed: number
    workers_rejected: number
  }
  worker: {
    username: string
    wallet_address: string
    reputation_score: number
  }
  requester: {
    username: string
    wallet_address: string
    approval_rate: number
    total_rejections: number
  }
}

export default function AdminDisputesPage() {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [flaggedUsers, setFlaggedUsers] = useState<any[]>([])
  const [flaggedTasks, setFlaggedTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('open')
  const [resolvingId, setResolvingId] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [filter])

  const loadData = async () => {
    setLoading(true)
    try {
      const statusFilter = filter === 'all' ? undefined : filter === 'open' ? 'open' : undefined
      const [disputesData, flaggedUsersData, flaggedTasksData] = await Promise.all([
        getAllDisputes(statusFilter as any),
        getFlaggedUsers(),
        getFlaggedTasks()
      ])
      
      setDisputes(disputesData as any)
      setFlaggedUsers(flaggedUsersData)
      setFlaggedTasks(flaggedTasksData)
    } catch (error) {
      console.error('Error loading admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResolve = async (
    disputeId: string, 
    resolution: 'resolved_worker' | 'resolved_requester' | 'dismissed',
    notes?: string
  ) => {
    if (!publicKey) return

    setResolvingId(disputeId)
    try {
      await resolveDispute(disputeId, resolution, notes, publicKey.toString())
      await loadData() // Reload data
    } catch (error) {
      console.error('Error resolving dispute:', error)
      alert('Failed to resolve dispute')
    } finally {
      setResolvingId(null)
    }
  }

  const openDisputes = disputes.filter(d => d.status === 'open')
  const resolvedDisputes = disputes.filter(d => d.status !== 'open')

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-cyan-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage disputes and monitor platform health</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Open Disputes</p>
                <p className="text-3xl font-bold text-orange-400">{openDisputes.length}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-400" />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Resolved</p>
                <p className="text-3xl font-bold text-green-400">{resolvedDisputes.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Flagged Users</p>
                <p className="text-3xl font-bold text-red-400">{flaggedUsers.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Flagged Tasks</p>
                <p className="text-3xl font-bold text-yellow-400">{flaggedTasks.length}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'open', 'resolved'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Disputes List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
            <p className="text-gray-400 mt-4">Loading disputes...</p>
          </div>
        ) : disputes.length === 0 ? (
          <div className="text-center py-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <p className="text-xl text-white font-medium">No disputes found</p>
            <p className="text-gray-400 mt-2">All clear! No disputes to review.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {disputes.map((dispute) => (
              <div
                key={dispute.id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">
                      {dispute.task.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Payment: ${dispute.task.payment_per_task.toFixed(2)} • 
                      Filed {new Date(dispute.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    dispute.status === 'open' 
                      ? 'bg-orange-500/20 text-orange-400'
                      : dispute.status === 'resolved_worker'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {dispute.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {/* Parties */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-xs text-blue-400 mb-1">Worker</p>
                    <p className="text-white font-medium">{dispute.worker.username}</p>
                    <p className="text-xs text-gray-400">Rep: {dispute.worker.reputation_score}</p>
                  </div>
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <p className="text-xs text-purple-400 mb-1">Requester</p>
                    <p className="text-white font-medium">{dispute.requester.username}</p>
                    <p className="text-xs text-gray-400">
                      Approval: {dispute.requester.approval_rate.toFixed(0)}% • 
                      Rejections: {dispute.requester.total_rejections}
                    </p>
                  </div>
                </div>

                {/* Task Stats */}
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-4">
                  <p className="text-xs text-yellow-400 mb-1">Task Rejection Rate</p>
                  <p className="text-white font-medium">
                    {dispute.task.workers_rejected} rejected out of {dispute.task.workers_completed} completed
                    {dispute.task.workers_completed > 0 && (
                      <span className="text-yellow-400 ml-2">
                        ({((dispute.task.workers_rejected / dispute.task.workers_completed) * 100).toFixed(1)}%)
                      </span>
                    )}
                  </p>
                </div>

                {/* Dispute Details */}
                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Rejection Reason:</p>
                    <p className="text-white">{dispute.submission.rejection_reason || 'No reason provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Worker&apos;s Dispute:</p>
                    <p className="text-white">{dispute.dispute_reason}</p>
                  </div>
                  {dispute.worker_evidence && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Evidence:</p>
                      <p className="text-cyan-400">{dispute.worker_evidence}</p>
                    </div>
                  )}
                  {dispute.submission.submission_url && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Submission:</p>
                      <a 
                        href={dispute.submission.submission_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                      >
                        View Submission <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {dispute.status === 'open' && (
                  <div className="flex gap-2 pt-4 border-t border-white/10">
                    <button
                      onClick={() => handleResolve(dispute.id, 'resolved_worker', 'Approved in favor of worker')}
                      disabled={resolvingId === dispute.id}
                      className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve Worker
                    </button>
                    <button
                      onClick={() => handleResolve(dispute.id, 'resolved_requester', 'Rejection upheld')}
                      disabled={resolvingId === dispute.id}
                      className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Uphold Rejection
                    </button>
                    <button
                      onClick={() => handleResolve(dispute.id, 'dismissed', 'Dispute dismissed')}
                      disabled={resolvingId === dispute.id}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 rounded-lg text-white font-medium transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
