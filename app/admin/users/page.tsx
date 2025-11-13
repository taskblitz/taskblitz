'use client'
import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { AdminLayout } from '@/components/AdminLayout'
import { getAllUsers, banUser, unbanUser, updateUserReputation } from '@/lib/admin'
import { Search, Ban, Shield, TrendingUp, Filter } from 'lucide-react'

export default function AdminUsersPage() {
  const { publicKey } = useWallet()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [bannedFilter, setBannedFilter] = useState<boolean | undefined>()
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showBanModal, setShowBanModal] = useState(false)
  const [banReason, setBanReason] = useState('')
  const [banType, setBanType] = useState<'permanent' | 'temporary'>('permanent')

  useEffect(() => {
    loadUsers()
  }, [roleFilter, bannedFilter])

  const loadUsers = async () => {
    setLoading(true)
    const data = await getAllUsers({ role: roleFilter, banned: bannedFilter, search })
    setUsers(data || [])
    setLoading(false)
  }

  const handleBan = async () => {
    if (!publicKey || !selectedUser) return

    await banUser(selectedUser.id, publicKey.toString(), banReason, banType)
    setShowBanModal(false)
    setBanReason('')
    loadUsers()
  }

  const handleUnban = async (userId: string) => {
    if (!publicKey) return
    await unbanUser(userId, publicKey.toString())
    loadUsers()
  }

  const handleReputationUpdate = async (userId: string, newScore: number) => {
    if (!publicKey) return
    await updateUserReputation(userId, newScore, publicKey.toString())
    loadUsers()
  }


  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-text-secondary">Manage users, bans, and reputation</p>
      </div>

      {/* Filters */}
      <div className="glass-card p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
                placeholder="Username or wallet..."
                className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-2">Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
            >
              <option value="">All Roles</option>
              <option value="worker">Worker</option>
              <option value="requester">Requester</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-2">Status</label>
            <select
              value={bannedFilter === undefined ? '' : bannedFilter ? 'banned' : 'active'}
              onChange={(e) => setBannedFilter(e.target.value === '' ? undefined : e.target.value === 'banned')}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
            >
              <option value="">All Users</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={loadUsers}
              className="w-full gradient-primary text-white font-semibold px-4 py-2 rounded-lg hover:scale-105 transition-transform"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Role</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Reputation</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Tasks</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-text-secondary">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-text-secondary">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isBanned = user.bans?.some((b: any) => b.is_active)
                  return (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-white">{user.username}</p>
                          <p className="text-xs text-text-muted">{user.wallet_address.slice(0, 8)}...</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm capitalize">{user.role}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{user.reputation_score}</span>
                          <button
                            onClick={() => {
                              const newScore = prompt('New reputation score:', user.reputation_score.toString())
                              if (newScore) handleReputationUpdate(user.id, parseInt(newScore))
                            }}
                            className="text-xs text-cyan-400 hover:text-cyan-300"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {user.tasks_completed || 0} / {user.tasks_created || 0}
                      </td>
                      <td className="py-3 px-4">
                        {isBanned ? (
                          <span className="text-xs px-2 py-1 rounded-full bg-red-400/20 text-red-300">
                            Banned
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-400/20 text-green-300">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {isBanned ? (
                            <button
                              onClick={() => handleUnban(user.id)}
                              className="text-xs px-3 py-1 bg-green-500 hover:bg-green-600 rounded text-white"
                            >
                              Unban
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedUser(user)
                                setShowBanModal(true)
                              }}
                              className="text-xs px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-white"
                            >
                              Ban
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ban Modal */}
      {showBanModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Ban User</h3>
            <p className="text-text-secondary mb-4">
              Ban @{selectedUser?.username}?
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-2">Reason</label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
                  rows={3}
                  placeholder="Reason for ban..."
                />
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2">Type</label>
                <select
                  value={banType}
                  onChange={(e) => setBanType(e.target.value as any)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
                >
                  <option value="permanent">Permanent</option>
                  <option value="temporary">Temporary (7 days)</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleBan}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg"
                >
                  Ban User
                </button>
                <button
                  onClick={() => {
                    setShowBanModal(false)
                    setBanReason('')
                  }}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
