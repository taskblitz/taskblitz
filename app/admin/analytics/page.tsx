'use client'
import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { getGrowthMetrics, getCategoryPerformance } from '@/lib/admin'
import { BarChart3, TrendingUp, Users, Briefcase } from 'lucide-react'

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [growthData, setGrowthData] = useState<any>(null)
  const [categoryData, setCategoryData] = useState<any>(null)
  const [timeRange, setTimeRange] = useState(30)

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    setLoading(true)
    const growth = await getGrowthMetrics(timeRange)
    const categories = await getCategoryPerformance()
    
    setGrowthData(growth)
    setCategoryData(categories)
    setLoading(false)
  }

  const calculateGrowthRate = (data: any[]) => {
    if (!data || data.length < 2) return 0
    const recent = data.slice(-7).length
    const previous = data.slice(-14, -7).length
    if (previous === 0) return 100
    return ((recent - previous) / previous * 100).toFixed(1)
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-text-secondary">Platform growth and performance metrics</p>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2 mb-6">
        {[7, 30, 90].map((days) => (
          <button
            key={days}
            onClick={() => setTimeRange(days)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRange === days
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {days} Days
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      ) : (
        <>
          {/* Growth Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-purple-400" />
                <span className="text-2xl font-bold">{growthData?.users?.length || 0}</span>
              </div>
              <p className="text-text-secondary text-sm mb-2">New Users</p>
              <p className="text-xs text-green-400">
                +{calculateGrowthRate(growthData?.users)}% vs last week
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <Briefcase className="w-8 h-8 text-cyan-400" />
                <span className="text-2xl font-bold">{growthData?.tasks?.length || 0}</span>
              </div>
              <p className="text-text-secondary text-sm mb-2">New Tasks</p>
              <p className="text-xs text-green-400">
                +{calculateGrowthRate(growthData?.tasks)}% vs last week
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-green-400" />
                <span className="text-2xl font-bold">
                  ${growthData?.transactions?.reduce((sum: number, tx: any) => sum + parseFloat(tx.amount), 0).toFixed(2) || 0}
                </span>
              </div>
              <p className="text-text-secondary text-sm mb-2">Transaction Volume</p>
              <p className="text-xs text-green-400">
                {growthData?.transactions?.length || 0} transactions
              </p>
            </div>
          </div>

          {/* Category Performance */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-6">Category Performance</h2>
            <div className="space-y-4">
              {categoryData && Object.entries(categoryData).map(([category, stats]: [string, any]) => (
                <div key={category} className="bg-black/30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-white capitalize">{category}</h3>
                    <span className="text-sm text-text-secondary">
                      {stats.completedTasks}/{stats.totalTasks} completed
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full"
                      style={{ width: `${(stats.completedTasks / stats.totalTasks) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-text-secondary">
                    <span>Volume: ${stats.totalVolume.toFixed(2)}</span>
                    <span>Avg: ${(stats.totalVolume / stats.totalTasks).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  )
}
