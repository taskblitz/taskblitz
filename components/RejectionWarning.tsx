'use client'

import { AlertTriangle, Info } from 'lucide-react'

interface RejectionWarningProps {
  workersCompleted: number
  workersRejected: number
  rejectionLimitPercentage: number
}

export default function RejectionWarning({ 
  workersCompleted, 
  workersRejected,
  rejectionLimitPercentage 
}: RejectionWarningProps) {
  if (workersCompleted === 0) return null

  const currentRejectionRate = (workersRejected / workersCompleted) * 100
  const remainingRejections = Math.floor((rejectionLimitPercentage / 100) * workersCompleted) - workersRejected

  // Show warning when at 50% of limit or higher
  const warningThreshold = rejectionLimitPercentage * 0.5
  
  if (currentRejectionRate < warningThreshold) return null

  const isNearLimit = currentRejectionRate >= rejectionLimitPercentage * 0.8
  const isAtLimit = currentRejectionRate >= rejectionLimitPercentage

  if (isAtLimit) {
    return (
      <div className="p-4 bg-red-500/20 border border-red-500/40 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-red-400 font-semibold mb-1">Rejection Limit Reached</h4>
            <p className="text-sm text-red-300 mb-2">
              You have reached the {rejectionLimitPercentage}% rejection limit for this task. 
              All remaining pending submissions have been automatically approved.
            </p>
            <p className="text-xs text-red-400">
              Current rejection rate: {currentRejectionRate.toFixed(1)}% ({workersRejected}/{workersCompleted})
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (isNearLimit) {
    return (
      <div className="p-4 bg-orange-500/20 border border-orange-500/40 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-orange-400 font-semibold mb-1">Approaching Rejection Limit</h4>
            <p className="text-sm text-orange-300 mb-2">
              You can only reject {remainingRejections} more submission{remainingRejections !== 1 ? 's' : ''} before 
              reaching the {rejectionLimitPercentage}% limit. After that, all pending submissions will be auto-approved.
            </p>
            <p className="text-xs text-orange-400">
              Current rejection rate: {currentRejectionRate.toFixed(1)}% ({workersRejected}/{workersCompleted})
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-yellow-400 font-semibold mb-1">Rejection Limit Notice</h4>
          <p className="text-sm text-yellow-300 mb-2">
            You can reject up to {rejectionLimitPercentage}% of submissions. 
            You have {remainingRejections} rejection{remainingRejections !== 1 ? 's' : ''} remaining.
          </p>
          <p className="text-xs text-yellow-400">
            Current rejection rate: {currentRejectionRate.toFixed(1)}% ({workersRejected}/{workersCompleted})
          </p>
        </div>
      </div>
    </div>
  )
}
