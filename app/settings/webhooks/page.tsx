'use client'
import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { useWallet } from '@solana/wallet-adapter-react'
import { getUserWebhooks, createWebhook, deleteWebhook, getWebhookDeliveries } from '@/lib/webhooks'
import { Webhook, WebhookDelivery } from '@/types/advanced-features'
import { Plus, Trash2, Eye, CheckCircle, XCircle, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

export default function WebhooksPage() {
  const { publicKey } = useWallet()
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [selectedWebhook, setSelectedWebhook] = useState<string | null>(null)
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (publicKey) {
      loadWebhooks()
    }
  }, [publicKey])

  async function loadWebhooks() {
    if (!publicKey) return
    
    try {
      setLoading(true)
      const data = await getUserWebhooks(publicKey.toString())
      setWebhooks(data)
    } catch (error) {
      console.error('Error loading webhooks:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!publicKey) return
    
    const formData = new FormData(e.currentTarget)
    const events = formData.getAll('events') as string[]
    
    try {
      await createWebhook({
        user_id: publicKey.toString(),
        name: formData.get('name') as string,
        url: formData.get('url') as string,
        events,
        is_active: true,
        retry_count: 3,
        timeout_seconds: 30
      })
      
      toast.success('Webhook created')
      setShowCreateModal(false)
      loadWebhooks()
    } catch (error) {
      toast.error('Failed to create webhook')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this webhook?')) return
    
    try {
      await deleteWebhook(id)
      toast.success('Webhook deleted')
      loadWebhooks()
    } catch (error) {
      toast.error('Failed to delete webhook')
    }
  }

  async function viewDeliveries(webhookId: string) {
    try {
      const data = await getWebhookDeliveries(webhookId)
      setDeliveries(data)
      setSelectedWebhook(webhookId)
    } catch (error) {
      toast.error('Failed to load deliveries')
    }
  }

  if (!publicKey) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="glass-card p-12 text-center">
            <h1 className="text-3xl font-bold mb-4">Webhooks</h1>
            <p className="text-text-secondary mb-6">Connect your wallet to manage webhooks</p>
          </div>
        </div>      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Webhooks
            </h1>
            <p className="text-text-secondary">Receive real-time notifications for task events</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Webhook
          </button>
        </div>

        {/* Info Box */}
        <div className="glass-card p-6 mb-8 bg-purple-500/10 border-purple-500/20">
          <div className="flex items-start gap-3">
            <Zap className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">What are webhooks?</h3>
              <p className="text-text-secondary text-sm">
                Webhooks send HTTP POST requests to your specified URL when events occur (task completed, payment received, etc.). 
                Perfect for integrating TaskBlitz with your own systems, Slack, or automation tools.
              </p>
            </div>
          </div>
        </div>

        {/* Webhooks List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          </div>
        ) : webhooks.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-text-secondary">No webhooks configured yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {webhooks.map(webhook => (
              <div key={webhook.id} className="glass-card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{webhook.name}</h3>
                    <p className="text-text-secondary text-sm font-mono">{webhook.url}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => viewDeliveries(webhook.id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="View deliveries"
                    >
                      <Eye className="w-5 h-5 text-cyan-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(webhook.id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {webhook.events.map(event => (
                    <span key={event} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                      {event}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className={`px-2 py-1 rounded ${webhook.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {webhook.is_active ? 'Active' : 'Inactive'}
                  </span>
                  {webhook.last_triggered_at && (
                    <span className="text-text-muted">
                      Last triggered: {new Date(webhook.last_triggered_at).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card p-8 max-w-lg w-full">
              <h2 className="text-2xl font-bold mb-6">Create Webhook</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full glass-card px-4 py-2 bg-transparent border-white/20 rounded-lg focus:border-purple-400 focus:outline-none"
                    placeholder="My Webhook"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">URL</label>
                  <input
                    type="url"
                    name="url"
                    required
                    className="w-full glass-card px-4 py-2 bg-transparent border-white/20 rounded-lg focus:border-purple-400 focus:outline-none"
                    placeholder="https://your-domain.com/webhook"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Events</label>
                  <div className="space-y-2">
                    {['task.created', 'task.completed', 'task.cancelled', 'payment.received', 'payment.sent'].map(event => (
                      <label key={event} className="flex items-center gap-2">
                        <input type="checkbox" name="events" value={event} className="rounded" />
                        <span className="text-sm">{event}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Deliveries Modal */}
        {selectedWebhook && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Recent Deliveries</h2>
                <button
                  onClick={() => setSelectedWebhook(null)}
                  className="text-text-secondary hover:text-white"
                >
                  Close
                </button>
              </div>

              {deliveries.length === 0 ? (
                <p className="text-text-secondary text-center py-8">No deliveries yet</p>
              ) : (
                <div className="space-y-4">
                  {deliveries.map(delivery => (
                    <div key={delivery.id} className="bg-white/5 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {delivery.success ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )}
                          <span className="font-semibold">{delivery.event_type}</span>
                        </div>
                        <span className="text-text-muted text-sm">
                          {new Date(delivery.delivered_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-text-secondary">
                        <p>Status: {delivery.response_status || 'No response'}</p>
                        <p>Attempt: {delivery.attempt_number}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>    </main>
  )
}
