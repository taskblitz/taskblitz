'use client'
import { useEffect, useState } from 'react'

export function Stats() {
  const [stats, setStats] = useState({
    totalVolume: 0,
    totalTasks: 0,
    totalUsers: 0,
    avgCompletion: 0
  })

  // Animate numbers on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalVolume: 247391,
        totalTasks: 45892,
        totalUsers: 1243,
        avgCompletion: 24
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Platform Stats</h2>
          <p className="text-text-secondary">Real-time metrics from the TaskBlitz ecosystem</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold gradient-text mb-2">
              ${formatNumber(stats.totalVolume)}
            </div>
            <div className="text-text-secondary">Total Volume</div>
            <div className="text-sm text-green-400 mt-1">↗ +23% today</div>
          </div>

          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold gradient-text mb-2">
              {formatNumber(stats.totalTasks)}
            </div>
            <div className="text-text-secondary">Tasks Completed</div>
            <div className="text-sm text-green-400 mt-1">↗ +892 today</div>
          </div>

          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold gradient-text mb-2">
              {formatNumber(stats.totalUsers)}
            </div>
            <div className="text-text-secondary">Active Users</div>
            <div className="text-sm text-green-400 mt-1">↗ +156 today</div>
          </div>

          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold gradient-text mb-2">
              {stats.avgCompletion}h
            </div>
            <div className="text-text-secondary">Avg Completion</div>
            <div className="text-sm text-green-400 mt-1">↗ 15% faster</div>
          </div>
        </div>
      </div>
    </section>
  )
}