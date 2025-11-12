'use client'

import { Shield, AlertTriangle, Flag } from 'lucide-react'

interface ReputationBadgeProps {
  approvalRate: number
  totalReviews?: number
  isCompact?: boolean
}

export default function ReputationBadge({ 
  approvalRate, 
  totalReviews = 0,
  isCompact = false 
}: ReputationBadgeProps) {
  // Determine badge color and icon based on approval rate
  const getBadgeStyle = () => {
    if (approvalRate >= 90) {
      return {
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
        icon: Shield,
        label: 'Trusted',
        emoji: '🟢'
      }
    } else if (approvalRate >= 70) {
      return {
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20',
        icon: Shield,
        label: 'Average',
        emoji: '🟡'
      }
    } else if (approvalRate >= 50) {
      return {
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20',
        icon: AlertTriangle,
        label: 'Risky',
        emoji: '🟠'
      }
    } else {
      return {
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        icon: Flag,
        label: 'Flagged',
        emoji: '🔴'
      }
    }
  }

  const style = getBadgeStyle()
  const Icon = style.icon

  if (isCompact) {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${style.bg} ${style.border} border`}>
        <span className="text-xs">{style.emoji}</span>
        <span className={`text-xs font-medium ${style.color}`}>
          {approvalRate.toFixed(0)}%
        </span>
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${style.bg} ${style.border} border`}>
      <Icon className={`w-4 h-4 ${style.color}`} />
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium ${style.color}`}>
          {approvalRate.toFixed(0)}% approval
        </span>
        {totalReviews > 0 && (
          <span className="text-xs text-gray-400">
            ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
          </span>
        )}
      </div>
      <span className={`text-xs px-2 py-0.5 rounded ${style.bg} ${style.color}`}>
        {style.label}
      </span>
    </div>
  )
}
