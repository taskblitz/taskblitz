'use client'
import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { AdminLayout } from '@/components/AdminLayout'
import { createAnnouncement, getActiveAnnouncements } from '@/lib/admin'
import { Megaphone, Plus, X } from 'lucide-react'

export default function AdminAnnouncementsPage() {
  const { publicKey } = useWallet()
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'error',
    expiresInDays: 7
  })

  useEffect(() => {
    loadAnnouncements()
  }, [])

  const loadAnnouncements = async () => {
    setLoading(true)
    const data = await getActiveAnnouncements()
    setAnnouncements(data || [])
    setLoading(false)
  }

  const handleCreate = async () => {
    if (!publicKey) return

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + formData.expiresInDays)

    await createAnnouncement(
      formData.title,
      formData.message,
      formData.type,
      publicKey.toString(),
      expiresAt
    )

    setShowModal(false)
    setFormData({ title: '', message: '', type: 'info', expiresInDays: 7 })
    loadAnnouncements()
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Announcements</h1>
          <p className="text-text-secondary">Manage platform-wide announcements</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 gradient-primary text-white font-semibold px-6 py-3 rounded-lg hover:scale-105 transition-transform"
        >
          <Plus className="w-5 h-5" />
          New Announcement
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        ) : announcements.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Megaphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-white font-medium">No active announcements</p>
            <p className="text-text-secondary mt-2">Create your first announcement to notify users</p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className={`glass-card p-6 border-l-4 ${
                announcement.type === 'info' ? 'border-blue-400' :
                announcement.type === 'warning' ? 'border-yellow-400' :
                announcement.type === 'success' ? 'border-green-400' :
                'border-red-400'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Megaphone className={`w-5 h-5 ${
                      announcement.type === 'info' ? 'text-blue-400' :
                      announcement.type === 'warning' ? 'text-yellow-400' :
                      announcement.type === 'success' ? 'text-green-400' :
                      'text-red-400'
                    }`} />
                    <h3 className="text-xl font-bold text-white">{announcement.title}</h3>
                  </div>
                  <p className="text-text-secondary mb-3">{announcement.message}</p>
                  <p className="text-xs text-text-muted">
                    Created {new Date(announcement.created_at).toLocaleDateString()}
                    {announcement.expires_at && ` • Expires ${new Date(announcement.expires_at).toLocaleDateString()}`}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  announcement.type === 'info' ? 'bg-blue-400/20 text-blue-300' :
                  announcement.type === 'warning' ? 'bg-yellow-400/20 text-yellow-300' :
                  announcement.type === 'success' ? 'bg-green-400/20 text-green-300' :
                  'bg-red-400/20 text-red-300'
                }`}>
                  {announcement.type}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Create Announcement</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-text-secondary hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
                  placeholder="Announcement title..."
                />
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
                  rows={4}
                  placeholder="Announcement message..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                    <option value="error">Error</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-text-secondary mb-2">Expires In (Days)</label>
                  <input
                    type="number"
                    value={formData.expiresInDays}
                    onChange={(e) => setFormData({ ...formData, expiresInDays: parseInt(e.target.value) })}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
                    min="1"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleCreate}
                  disabled={!formData.title || !formData.message}
                  className="flex-1 gradient-primary text-white font-semibold px-4 py-3 rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Announcement
                </button>
                <button
                  onClick={() => setShowModal(false)}
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
