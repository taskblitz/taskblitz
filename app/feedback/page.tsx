'use client'
import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { 
  ChatBubbleIcon, 
  PaperPlaneIcon, 
  LightningBoltIcon, 
  ExclamationTriangleIcon, 
  MagicWandIcon 
} from '@radix-ui/react-icons'
import toast from 'react-hot-toast'

export default function FeedbackPage() {
  const { connected, publicKey } = useWallet()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: 'suggestion',
    subject: '',
    message: ''
  })

  const feedbackTypes = [
    { 
      value: 'suggestion', 
      label: 'Suggestion', 
      icon: LightningBoltIcon, 
      color: 'text-yellow-400',
      activeColor: 'border-yellow-500 bg-yellow-500/30 shadow-lg shadow-yellow-500/20',
      hoverColor: 'hover:border-yellow-400 hover:bg-yellow-500/10',
      checkmarkBg: 'bg-yellow-500'
    },
    { 
      value: 'bug', 
      label: 'Bug Report', 
      icon: ExclamationTriangleIcon, 
      color: 'text-red-400',
      activeColor: 'border-red-500 bg-red-500/30 shadow-lg shadow-red-500/20',
      hoverColor: 'hover:border-red-400 hover:bg-red-500/10',
      checkmarkBg: 'bg-red-500'
    },
    { 
      value: 'feature', 
      label: 'Feature Request', 
      icon: MagicWandIcon, 
      color: 'text-purple-400',
      activeColor: 'border-purple-500 bg-purple-500/30 shadow-lg shadow-purple-500/20',
      hoverColor: 'hover:border-purple-400 hover:bg-purple-500/10',
      checkmarkBg: 'bg-purple-500'
    },
    { 
      value: 'other', 
      label: 'Other', 
      icon: ChatBubbleIcon, 
      color: 'text-cyan-400',
      activeColor: 'border-cyan-500 bg-cyan-500/30 shadow-lg shadow-cyan-500/20',
      hoverColor: 'hover:border-cyan-400 hover:bg-cyan-500/10',
      checkmarkBg: 'bg-cyan-500'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!formData.subject.trim() || !formData.message.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    const loadingToast = toast.loading('Sending feedback...')

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          walletAddress: publicKey.toString(),
          timestamp: new Date().toISOString()
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send feedback')
      }

      toast.dismiss(loadingToast)
      toast.success('✅ Feedback sent! Thank you for helping improve TaskBlitz.')
      
      // Reset form
      setFormData({
        type: 'suggestion',
        subject: '',
        message: ''
      })

      // Redirect after delay
      setTimeout(() => router.push('/'), 2000)
    } catch (error: any) {
      toast.dismiss(loadingToast)
      console.error('Error sending feedback:', error)
      toast.error(error.message || 'Failed to send feedback. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!connected) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="glass-card p-8 text-center">
            <ChatBubbleIcon className="w-16 h-16 mx-auto mb-4 text-purple-400" />
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-text-secondary mb-6">
              Please connect your wallet to submit feedback
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <ChatBubbleIcon className="w-8 h-8 mr-3 text-purple-400" />
            <h1 className="text-3xl font-bold">Send Feedback</h1>
          </div>
          <p className="text-text-secondary">
            Help us improve TaskBlitz! Share your suggestions, report bugs, or request new features.
          </p>
        </div>

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Feedback Type */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">What type of feedback?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {feedbackTypes.map((type) => {
                const Icon = type.icon
                const isSelected = formData.type === type.value
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`
                      glass-card p-4 rounded-xl transition-all border-2 relative
                      ${isSelected 
                        ? `${type.activeColor} scale-105` 
                        : `border-white/20 ${type.hoverColor}`
                      }
                    `}
                  >
                    {isSelected && (
                      <div className={`absolute top-2 right-2 w-5 h-5 ${type.checkmarkBg} rounded-full flex items-center justify-center`}>
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? type.color.replace('400', '300') : type.color}`} />
                    <p className={`text-xs font-medium ${isSelected ? 'text-white' : ''}`}>{type.label}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Subject */}
          <div className="glass-card p-6">
            <label className="block text-sm font-medium mb-2">
              Subject *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Brief summary of your feedback..."
              className="w-full glass-card px-4 py-3 bg-transparent border-white/20 rounded-lg focus:border-purple-400 focus:outline-none"
              required
            />
          </div>

          {/* Message */}
          <div className="glass-card p-6">
            <label className="block text-sm font-medium mb-2">
              Details *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us more about your feedback..."
              rows={8}
              className="w-full glass-card px-4 py-3 bg-transparent border-white/20 rounded-lg focus:border-purple-400 focus:outline-none resize-none"
              required
            />
            <p className="text-xs text-text-muted mt-2">
              Be as detailed as possible. Screenshots or examples are helpful!
            </p>
          </div>

          {/* Wallet Info */}
          <div className="glass-card p-4 bg-purple-500/10 border-purple-500/20">
            <p className="text-xs text-text-muted">
              Your wallet address will be included so we can follow up if needed:
            </p>
            <p className="text-xs font-mono text-purple-300 mt-1">
              {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="glass-card px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="gradient-primary text-white font-semibold px-8 py-3 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <PaperPlaneIcon className="w-4 h-4 mr-2" />
                  Send Feedback
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-8 glass-card p-6 bg-cyan-500/10 border-cyan-500/20">
          <h4 className="font-semibold mb-2 text-cyan-300">💡 Tips for great feedback:</h4>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• Be specific about what you experienced</li>
            <li>• Include steps to reproduce bugs</li>
            <li>• Explain why a feature would be useful</li>
            <li>• Share your use case or scenario</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
