'use client'
import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useWallet } from '@solana/wallet-adapter-react'
import { getUserApiKeys, generateApiKey, revokeApiKey, getApiUsageStats } from '@/lib/api-rate-limit'
import { ApiRateLimit, ApiUsage } from '@/types/advanced-features'
import { Key, Plus, Trash2, Eye, EyeOff, BarChart3, Copy } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ApiSettingsPage() {
  const { publicKey } = useWallet()
  const [apiKeys, setApiKeys] = useState<ApiRateLimit[]>([])
  const [usage, setUsage] = useState<ApiUsage[]>([])
  const [showKey, setShowKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (publicKey) {
      loadApiKeys()
      loadUsage()
    }
  }, [publicKey])

  async function loadApiKeys() {
    if (!publicKey) return
    
    try {
      setLoading(true)
      const data = await getUserApiKeys(publicKey.toString())
      setApiKeys(data)
    } catch (error) {
      console.error('Error loading API keys:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadUsage() {
    if (!publicKey) return
    
    try {
      const data = await getApiUsageStats(publicKey.toString(), 7)
      setUsage(data)
    } catch (error) {
      console.error('Error loading usage:', error)
    }
  }

  async function handleGenerate() {
    if (!publicKey) return
    
    try {
      const newKey = await generateApiKey(publicKey.toString())
      toast.success('API key generated')
      setShowKey(newKey.api_key)
      loadApiKeys()
    } catch (error) {
      toast.error('Failed to generate API key')
    }
  }

  async function handleRevoke(apiKey: string) {
    if (!confirm('Revoke this API key? This cannot be undone.')) return
    
    try {
      await revokeApiKey(apiKey)
      toast.success('API key revoked')
      loadApiKeys()
    } catch (error) {
      toast.error('Failed to revoke API key')
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  if (!publicKey) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="glass-card p-12 text-center">
            <h1 className="text-3xl font-bold mb-4">API Settings</h1>
            <p className="text-text-secondary mb-6">Connect your wallet to manage API keys</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  const totalRequests = usage.length
  const successfulRequests = usage.filter(u => u.status_code && u.status_code < 400).length
  const avgResponseTime = usage.length > 0 
    ? usage.reduce((sum, u) => sum + (u.response_time_ms || 0), 0) / usage.length 
    : 0

  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              API Settings
            </h1>
            <p className="text-text-secondary">Manage your API keys and monitor usage</p>
          </div>
          <button
            onClick={handleGenerate}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Generate API Key
          </button>
        </div>

        {/* Usage Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <h3 className="font-semibold">Total Requests</h3>
            </div>
            <p className="text-3xl font-bold">{totalRequests}</p>
            <p className="text-text-muted text-sm">Last 7 days</p>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-6 h-6 text-green-400" />
              <h3 className="font-semibold">Success Rate</h3>
            </div>
            <p className="text-3xl font-bold text-green-400">
              {totalRequests > 0 ? ((successfulRequests / totalRequests) * 100).toFixed(1) : 0}%
            </p>
            <p className="text-text-muted text-sm">{successfulRequests} successful</p>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-6 h-6 text-cyan-400" />
              <h3 className="font-semibold">Avg Response Time</h3>
            </div>
            <p className="text-3xl font-bold text-cyan-400">{avgResponseTime.toFixed(0)}ms</p>
            <p className="text-text-muted text-sm">Average latency</p>
          </div>
        </div>

        {/* API Keys */}
        <div className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">API Keys</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-12">
              <Key className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-secondary">No API keys generated yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map(key => (
                <div key={key.id} className="bg-white/5 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <Key className="w-5 h-5 text-purple-400" />
                      <code className="font-mono text-sm bg-black/30 px-3 py-1 rounded">
                        {showKey === key.api_key ? key.api_key : '••••••••••••••••••••••••••••••••'}
                      </code>
                      <button
                        onClick={() => setShowKey(showKey === key.api_key ? null : key.api_key)}
                        className="p-1 hover:bg-white/10 rounded"
                      >
                        {showKey === key.api_key ? (
                          <EyeOff className="w-4 h-4 text-text-secondary" />
                        ) : (
                          <Eye className="w-4 h-4 text-text-secondary" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(key.api_key)}
                        className="p-1 hover:bg-white/10 rounded"
                      >
                        <Copy className="w-4 h-4 text-text-secondary" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRevoke(key.api_key)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      disabled={!key.is_active}
                    >
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-text-muted">Per Minute</p>
                      <p className="font-semibold">{key.requests_per_minute} req/min</p>
                    </div>
                    <div>
                      <p className="text-text-muted">Per Hour</p>
                      <p className="font-semibold">{key.requests_per_hour} req/hr</p>
                    </div>
                    <div>
                      <p className="text-text-muted">Per Day</p>
                      <p className="font-semibold">{key.requests_per_day} req/day</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className={`px-2 py-1 rounded text-xs ${key.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {key.is_active ? 'Active' : 'Revoked'}
                    </span>
                    <span className="text-text-muted text-xs">
                      Created {new Date(key.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Documentation Link */}
        <div className="glass-card p-6 bg-purple-500/10 border-purple-500/20">
          <h3 className="font-semibold mb-2">Need help with the API?</h3>
          <p className="text-text-secondary text-sm mb-4">
            Check out our comprehensive API documentation to get started with integrating TaskBlitz into your application.
          </p>
          <a href="/developers/docs" className="btn-secondary inline-block">
            View API Documentation
          </a>
        </div>
      </div>
      <Footer />
    </main>
  )
}
