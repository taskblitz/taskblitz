'use client'
import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useWallet } from '@solana/wallet-adapter-react'
import { getUserTemplates, getPublicTemplates, createTaskTemplate, deleteTemplate } from '@/lib/task-templates'
import { TaskTemplate } from '@/types/advanced-features'
import { Plus, Trash2, Edit, Copy, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function TemplatesPage() {
  const { publicKey } = useWallet()
  const [myTemplates, setMyTemplates] = useState<TaskTemplate[]>([])
  const [publicTemplates, setPublicTemplates] = useState<TaskTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    loadTemplates()
  }, [publicKey])

  async function loadTemplates() {
    try {
      setLoading(true)
      if (publicKey) {
        const [my, pub] = await Promise.all([
          getUserTemplates(publicKey.toString()),
          getPublicTemplates()
        ])
        setMyTemplates(my)
        setPublicTemplates(pub)
      } else {
        const pub = await getPublicTemplates()
        setPublicTemplates(pub)
      }
    } catch (error) {
      console.error('Error loading templates:', error)
      toast.error('Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this template?')) return
    
    try {
      await deleteTemplate(id)
      toast.success('Template deleted')
      loadTemplates()
    } catch (error) {
      toast.error('Failed to delete template')
    }
  }

  function applyTemplate(template: TaskTemplate) {
    // Store template data in localStorage and redirect to post-task
    localStorage.setItem('taskTemplate', JSON.stringify(template))
    window.location.href = '/post-task'
  }

  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Task Templates
            </h1>
            <p className="text-text-secondary">Save time by reusing task configurations</p>
          </div>
          {publicKey && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Template
            </button>
          )}
        </div>

        {!publicKey && (
          <div className="glass-card p-6 mb-8 text-center">
            <p className="text-text-secondary mb-4">Connect your wallet to create and manage templates</p>
          </div>
        )}

        {/* My Templates */}
        {publicKey && myTemplates.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">My Templates</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myTemplates.map(template => (
                <div key={template.id} className="glass-card p-6 hover:border-purple-400/50 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">{template.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => applyTemplate(template)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Use template"
                      >
                        <Copy className="w-4 h-4 text-cyan-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(template.id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm mb-4 line-clamp-2">{template.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">{template.category}</span>
                    <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">{template.difficulty}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-secondary">Reward: ${template.reward_amount}</span>
                    <span className="text-text-muted">Used {template.use_count}x</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Public Templates */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Community Templates</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
            </div>
          ) : publicTemplates.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-text-secondary">No public templates available yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicTemplates.map(template => (
                <div key={template.id} className="glass-card p-6 hover:border-cyan-400/50 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">{template.name}</h3>
                    <Star className="w-5 h-5 text-yellow-400" />
                  </div>
                  <p className="text-text-secondary text-sm mb-4 line-clamp-2">{template.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">{template.category}</span>
                    <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">{template.difficulty}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary text-sm">Reward: ${template.reward_amount}</span>
                    <button
                      onClick={() => applyTemplate(template)}
                      className="btn-secondary text-sm py-1 px-3"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
