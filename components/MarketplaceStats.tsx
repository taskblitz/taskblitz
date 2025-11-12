'use client'
import { 
  ClockIcon, 
  PersonIcon, 
  RocketIcon, 
  TokensIcon 
} from '@radix-ui/react-icons'

export function MarketplaceStats() {
  const stats = [
    {
      label: 'Active Tasks',
      value: '247',
      change: '+12%',
      icon: ClockIcon,
      color: 'text-purple-400'
    },
    {
      label: 'Total Freelancers',
      value: '1,834',
      change: '+8%',
      icon: PersonIcon,
      color: 'text-cyan-400'
    },
    {
      label: 'Tasks Completed',
      value: '5,692',
      change: '+23%',
      icon: RocketIcon,
      color: 'text-green-400'
    },
    {
      label: 'Total Paid Out',
      value: '$12,847',
      change: '+31%',
      icon: TokensIcon,
      color: 'text-yellow-400'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="glass-card p-3 md:p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color} flex-shrink-0 mt-1`} />
                <div>
                  <p className="text-lg md:text-2xl font-bold leading-tight mb-1">{stat.value}</p>
                  <p className="text-xs md:text-sm text-text-secondary">{stat.label}</p>
                </div>
              </div>
              <span className="text-xs text-green-400 font-medium flex-shrink-0">
                {stat.change}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}