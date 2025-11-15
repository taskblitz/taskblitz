'use client'
import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { CheckCircle, Clock, XCircle, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { applyToTask, getApplicationStatus } from '@/lib/applications'

interface ApplicationButtonProps {
  taskId: string
  taskMode: 'open' | 'application'
  onApproved?: () => void
}

export function ApplicationButton({ taskId, taskMode, onApproved }: ApplicationButtonProps) {
  const { publicKey } = useWallet()
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [applicationMessage, setApplicationMessage] = useState('')
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    if (publicKey && taskMode === 'application') {
      checkApplicationStatus()
    } else {
      setLoading(false)
    }
  }, [publicKey, taskId, taskMode])

  const checkApplicationStatus = async () => {
    if (!publicKey) return
    
    try {
      const status = await getApplicationStatus(taskId, publicKey.toString())
      setApplication(status)
      
      if (status?.status === 'approved' && onApproved) {
        onApproved()
      }
    } catch (error) {
      console.error('Error checking application:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet')
      return
    }

    setApplying(true)
    try {
      await applyToTask(taskId, publicKey.toString(), applicationMessage)
      toast.success('✅ Application submitted! Wait for approval.')
      setShowApplicationModal(false)
      setApplicationMessage('')
      await checkApplicationStatus()
    } catch (error: any) {
      toast.error(error.message || 'Failed to apply')
    } finally {
      setApplying(false)
    }
  }

  // For open tasks, don't show anything
  if (taskMode === 'open') {
    return null
  }

  if (loading) {
    return (
      <div className="animate-pulse h-10 bg-white/10 rounded-lg"></div>
    )
  }

  // No application yet - show Apply button
  if (!application) {
    return (
      <>
        <button
          onClick={() => setShowApplicationModal(true)}
          className="w-full gradient-primary text-white py-3 px-6 rounded-lg hover:scale-105 transition-transform font-semibold"
        >
          <Send className="w-4 h-4 inline mr-2" />
          Apply to Work on This Task
        </button>

        {/* Application Modal */}
        {showApplicationModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="glass-card p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Apply to Task</h3>
              <p className="text-sm text-gray-400 mb-4">
                Tell the client why you're a good fit for this task (optional)
              </p>
              
              <textarea
                value={applicationMessage}
                onChange={(e) => setApplicationMessage(e.target.value)}
                placeholder="I have experience with... I can complete this task because..."
                rows={4}
                className="w-full glass-card px-4 py-3 bg-transparent border-white/20 rounded-lg focus:border-purple-400 focus:outline-none resize-none mb-4"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className="flex-1 glass-card py-2 px-4 rounded-lg hover:bg-white/20 transition-colors"
                  disabled={applying}
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="flex-1 gradient-primary text-white py-2 px-4 rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // Application pending
  if (application.status === 'pending') {
    return (
      <div className="glass-card p-4 bg-yellow-500/10 border-yellow-500/20 rounded-lg">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-yellow-400" />
          <div>
            <div className="font-semibold text-yellow-400">Application Pending</div>
            <div className="text-sm text-gray-400">Waiting for client approval</div>
          </div>
        </div>
      </div>
    )
  }

  // Application approved
  if (application.status === 'approved') {
    return (
      <div className="glass-card p-4 bg-green-500/10 border-green-500/20 rounded-lg">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <div>
            <div className="font-semibold text-green-400">Application Approved!</div>
            <div className="text-sm text-gray-400">You can now submit your work</div>
          </div>
        </div>
      </div>
    )
  }

  // Application rejected
  if (application.status === 'rejected') {
    return (
      <div className="glass-card p-4 bg-red-500/10 border-red-500/20 rounded-lg">
        <div className="flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-400" />
          <div>
            <div className="font-semibold text-red-400">Application Not Accepted</div>
            <div className="text-sm text-gray-400">The client chose other workers</div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
