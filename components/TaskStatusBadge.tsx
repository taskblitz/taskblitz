interface TaskStatusBadgeProps {
  status: 'open' | 'completed' | 'expired' | 'cancelled'
  workersCompleted: number
  workersNeeded: number
}

export function TaskStatusBadge({ status, workersCompleted, workersNeeded }: TaskStatusBadgeProps) {
  const getStatusConfig = () => {
    if (status === 'completed' || workersCompleted >= workersNeeded) {
      return {
        label: 'Completed',
        color: 'bg-green-500/20 text-green-400 border-green-500/30',
        icon: '✓'
      }
    }
    
    if (status === 'expired') {
      return {
        label: 'Expired',
        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        icon: '⏰'
      }
    }
    
    if (status === 'cancelled') {
      return {
        label: 'Cancelled',
        color: 'bg-red-500/20 text-red-400 border-red-500/30',
        icon: '✕'
      }
    }
    
    const spotsLeft = workersNeeded - workersCompleted
    if (spotsLeft <= 3) {
      return {
        label: `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left!`,
        color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        icon: '🔥'
      }
    }
    
    return {
      label: 'Open',
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      icon: '●'
    }
  }

  const config = getStatusConfig()

  return (
    <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </div>
  )
}