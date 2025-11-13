'use client'
import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { AdminLayout } from '@/components/AdminLayout'
import { supabase } from '@/lib/supabase'
import { Settings, Shield, Users, Plus, Trash2 } from 'lucide-react'

export default function AdminSettingsPage() {
  const { publicKey } = useWallet()
  const [admins, setAdmins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newAdmin, setNewAdmin] = useState({
    wallet: '',
    role: 'moderator' as 'super_admin' | 'moderator' | 'support'
  })

  useEffect(() => {
    loadAdmins()
  }, [])

  const loadAdmins = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('admin_users')
      .select(`
        *,
        user:users(username)
      `)
      .order('created_at', { ascending: false })

    setAdmins(data || [])
    setLoading(false)
  }

  const handleAddAdmin = async () => {
    if (!publicKey) return

    // First, get or create user
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', newAdmin.wallet)
      .single()

    if (!user) {
      alert('User not found. They must sign up first.')
      return
    }

    // Add as admin
    const { error } = await supabase
      .from('admin_users')
      .insert({
        user_id: user.id,
        wallet_address: newAdmin.wallet,
        role: newAdmin.role
      })

    if (error) {
      alert('Error adding admin: ' + error.message)
      return
    }

    setShowAddModal(false)
    setNewAdmin({ wallet: '', role: 'moderator' })
    loadAdmins()
  }

  const handleRemoveAdmin = async (adminId: string) => {
    if (!confirm('Remove this admin?')) return

    await supabase
      .from('admin_users')
      .delete()
      .eq('id', adminId)

    loadAdmins()
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Settings</h1>
          <p className="text-text-secondary">Manage admin users and permissions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 gradient-primary text-white font-semibold px-6 py-3 rounded-lg hover:scale-105 transition-transform"
        >
          <Plus className="w-5 h-5" />
          Add Admin
        </button>
      </div>

      {/* Admin List */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Shield className="w-6 h-6 text-purple-400" />
          Admin Users
        </h2>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
            </div>
          ) : admins.length === 0 ? (
            <p className="text-center text-text-secondary py-8">No admins found</p>
          ) : (
            admins.map((admin) => (
              <div key={admin.id} className="bg-black/30 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-white">
                    {admin.user?.username || 'Unknown User'}
                  </p>
                  <p className="text-sm text-text-secondary">{admin.wallet_address}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                    admin.role === 'super_admin' ? 'bg-purple-400/20 text-purple-300' :
                    admin.role === 'moderator' ? 'bg-blue-400/20 text-blue-300' :
                    'bg-green-400/20 text-green-300'
                  }`}>
                    {admin.role.replace('_', ' ')}
                  </span>
                </div>
                {admin.wallet_address !== publicKey?.toString() && (
                  <button
                    onClick={() => handleRemoveAdmin(admin.id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-6">Add Admin User</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-2">Wallet Address</label>
                <input
                  type="text"
                  value={newAdmin.wallet}
                  onChange={(e) => setNewAdmin({ ...newAdmin, wallet: e.target.value })}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
                  placeholder="Solana wallet address..."
                />
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2">Role</label>
                <select
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value as any })}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
                >
                  <option value="support">Support</option>
                  <option value="moderator">Moderator</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleAddAdmin}
                  disabled={!newAdmin.wallet}
                  className="flex-1 gradient-primary text-white font-semibold px-4 py-3 rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
                >
                  Add Admin
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg"
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
