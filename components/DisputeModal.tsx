'use client'

import { useState } from 'react'
import { X, AlertCircle, FileText } from 'lucide-react'
import { createDispute } from '@/lib/database'
import { useWallet } from '@solana/wallet-adapter-react'

interface DisputeModalProps {
  isOpen: boolean
  onClose: () => void
  submission: {
    id: string
    task_id: string
    rejection_reason?: string
    task?: {
      title: string
      payment_per_task: number
    }
  }
  onDisputeCreated?: () => void
}

export default function DisputeModal({ 
  isOpen, 
  onClose, 
  submission,
  onDisputeCreated 
}: DisputeModalProps) {
  const { publicKey } = useWallet()
  const [disputeReason, setDisputeReason] = useState('')
  const [workerEvidence, setWorkerEvidence] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!publicKey) {
      setError('Please connect your wallet')
      return
    }

    if (!disputeReason.trim()) {
      setError('Please provide a reason for the dispute')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await createDispute({
        submissionId: submission.id,
        taskId: submission.task_id,
        workerWallet: publicKey.toString(),
        disputeReason: disputeReason.trim(),
        workerEvidence: workerEvidence.trim() || undefined
      })

      // Success
      onDisputeCreated?.()
      onClose()
      
      // Reset form
      setDisputeReason('')
      setWorkerEvidence('')
    } catch (err: any) {
      console.error('Error creating dispute:', err)
      setError(err.message || 'Failed to create dispute. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-gray-900 to-black border border-purple-500/20 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">File a Dispute</h2>
              <p className="text-sm text-gray-400">Challenge the rejection of your submission</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Task Info */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Task Details</h3>
            <p className="text-white font-medium">{submission.task?.title}</p>
            <p className="text-sm text-gray-400 mt-1">
              Payment: ${submission.task?.payment_per_task.toFixed(2)}
            </p>
            {submission.rejection_reason && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-sm text-gray-400 mb-1">Rejection Reason:</p>
                <p className="text-sm text-red-400">{submission.rejection_reason}</p>
              </div>
            )}
          </div>

          {/* Dispute Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Why do you believe this rejection was unfair? *
            </label>
            <textarea
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="Explain why you believe your submission met the requirements..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={4}
              required
            />
          </div>

          {/* Evidence */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Additional Evidence (Optional)
            </label>
            <textarea
              value={workerEvidence}
              onChange={(e) => setWorkerEvidence(e.target.value)}
              placeholder="Provide links to screenshots, additional proof, or any other supporting evidence..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-2">
              Include URLs to screenshots, documents, or any proof that supports your case
            </p>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex gap-3">
              <FileText className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-200">
                <p className="font-medium mb-1">What happens next?</p>
                <ul className="space-y-1 text-blue-300/80">
                  <li>• An admin will review your dispute within 48 hours</li>
                  <li>• They&apos;ll examine both your submission and the rejection reason</li>
                  <li>• If approved, you&apos;ll receive payment for your work</li>
                  <li>• The requester&apos;s reputation will be affected if the rejection was unfair</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-medium transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !disputeReason.trim()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-all transform hover:scale-105 disabled:scale-100"
            >
              {isSubmitting ? 'Submitting...' : 'File Dispute'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
