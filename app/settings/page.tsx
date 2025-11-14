'use client'
import { Header } from '@/components/Header'
import { useWallet } from '@solana/wallet-adapter-react'
import { useUser } from '@/contexts/UserContext'
import { useState, useEffect } from 'react'
import { updateUsername } from '@/lib/database'
import toast from 'react-hot-toast'
import { User, Clock, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { connected, publicKey } = useWallet()
  const { user, refreshUser } = useUser()
  const router = useRouter()
  const [newUsername, setNewUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [canChange, setCanChange] = useState(true)
  const [daysUntilChange, setDaysUntilChange] = useState(0)

  useEffect(() => {
    if (user?.username) {
      setNewUsername(user.username)
    }
  }, [user])

  useEffect(() => {
    if (user?.username_last_changed) {
      const lastChanged = new Date(user.username_last_changed)
      const now = new Date()
      const daysSinceLastChange = (now.getTime() - lastChanged.getTime()) / (1000 * 60 * 60 * 24)
      
      if (daysSinceLastChange < 7) {
        setCanChange(false)
        setDaysUntilChange(Math.ceil(7 - daysSinceLastChange))
      } else {
        setCanChange(true)
        setDaysUntilChange(0)
      }
    } else {
      // First time changing username
      setCanChange(true)
    }
  }, [user])

  const handleUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet')
      return
    }

    if (!newUsername.trim()) {
      toast.error('Username cannot be empty')
      return
    }

    if (newUsername.length < 3) {
      toast.error('Username must be at least 3 characters')
      return
    }

    if (newUsername.length > 20) {
      toast.error('Username must be less than 20 characters')
      return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
      toast.error('Username can only contain letters, numbers, and underscores')
      return
    }

    if (newUsername === user?.username) {
      toast.error('This is already your username')
      return
    }

    setLoading(true)
    const loadingToast = toast.loading('Updating username...')

    try {
      await updateUsername(publicKey.toString(), newUsername)
      toast.dismiss(loadingToast)
      toast.success('✅ Username updated successfully!')
      
      // Refresh user data
      await refreshUser()
      
      // Redirect to profile after a short delay
      setTimeout(() => {
        router.push(`/profile/${publicKey.toString()}`)
      }, 1500)
    } catch (error: any) {
      console.error('Error updating username:', error)
      toast.dismiss(loadingToast)
      toast.error(error.message || 'Failed to update username')
    } finally {
      setLoading(false)
    }
  }

  if (!connected) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="glass-card p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-text-secondary">
              Please connect your wallet to access settings
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        {/* Username Section */}
        <div className="glass-card rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-semibold">Username</h2>
          </div>

          <form onSubmit={handleUsernameChange} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full glass-card px-4 py-3 bg-transparent border-white/20 rounded-lg focus:border-purple-400 focus:outline-none"
                disabled={loading || !canChange}
                minLength={3}
                maxLength={20}
                pattern="[a-zA-Z0-9_]+"
              />
              <p className="text-xs text-gray-400 mt-2">
                3-20 characters. Letters, numbers, and underscores only.
              </p>
            </div>

            {/* Cooldown Warning */}
            {!canChange && (
              <div className="flex items-start gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-orange-400 mb-1">
                    Username Change Cooldown
                  </div>
                  <p className="text-sm text-gray-300">
                    You can change your username again in {daysUntilChange} day{daysUntilChange > 1 ? 's' : ''}.
                    This helps prevent abuse and maintains user identity.
                  </p>
                </div>
              </div>
            )}

            {/* First Time Info */}
            {canChange && !user?.username_last_changed && (
              <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-green-400 mb-1">
                    First Username Change
                  </div>
                  <p className="text-sm text-gray-300">
                    You can change your username right away. After that, you'll be able to change it once every 7 days.
                  </p>
                </div>
              </div>
            )}

            {/* Can Change Info */}
            {canChange && user?.username_last_changed && (
              <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-green-400 mb-1">
                    Username Change Available
                  </div>
                  <p className="text-sm text-gray-300">
                    You can now change your username. After changing, you'll need to wait 7 days before changing it again.
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="glass-card px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !canChange || newUsername === user?.username}
                className="gradient-primary text-white font-semibold px-8 py-3 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  'Update Username'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Current Username Display */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Current Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Username:</span>
              <span className="font-medium">{user?.username || 'Not set'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Wallet:</span>
              <span className="font-mono text-sm">
                {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-6)}
              </span>
            </div>
            {user?.username_last_changed && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Last Changed:</span>
                <span className="text-sm">
                  {new Date(user.username_last_changed).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
