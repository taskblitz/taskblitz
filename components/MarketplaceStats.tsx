'use client'
import { TrendingUp, Users, DollarSign, Clock } from 'lucide-react'

export function MarketplaceStats() {
  const stats = [
    {
      label: 'Active Tasks',
      value: '247',
      change: '+12%',
      icon: Clock,
      color: 'text-purple-400'
    },
    {
      label: 'Total Freelancers',
      value: '1,834',
      change: '+8%',
      icon: Users,
      color: 'text-cyan-400'
    },
    {
      label: 'Tasks Completed',
      value: '5,692',
      change: '+23%',
      icon: TrendingUp,
      color: 'text-green-400'
    },
    {
      label: 'Total Paid Out',
      value: '$12,847',
      change: '+31%',
      icon: DollarSign,
      color: 'text-yellow-400'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <Icon className={`w-8 h-8 ${stat.color}`} />
              <span className="text-xs text-green-400 font-medium">
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-text-secondary">{stat.label}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}