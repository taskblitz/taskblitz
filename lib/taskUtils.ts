export function isTaskExpired(deadline: Date | string): boolean {
  const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline
  return deadlineDate < new Date()
}

export function getTimeRemaining(deadline: Date | string): string {
  const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline
  const now = new Date()
  const diff = deadlineDate.getTime() - now.getTime()

  if (diff < 0) return 'Expired'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) return `${days}d ${hours}h left`
  if (hours > 0) return `${hours}h ${minutes}m left`
  return `${minutes}m left`
}

export function getTaskUrgency(deadline: Date | string): 'urgent' | 'soon' | 'normal' {
  const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline
  const now = new Date()
  const hoursLeft = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60)

  if (hoursLeft < 24) return 'urgent'
  if (hoursLeft < 72) return 'soon'
  return 'normal'
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function truncateAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function getTaskProgress(completed: number, needed: number): number {
  return Math.min((completed / needed) * 100, 100)
}