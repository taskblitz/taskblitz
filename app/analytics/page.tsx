'use client'
import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useWallet } from '@solana/wallet-adapter-react'
import { getAdvancedAnalytics } from '@/lib/advanced-analytics'
import { AnalyticsData } from '@/types/advanced-features'
import { TrendingUp, Clock, Target, Award, BarChart3 } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#a855f7', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

export default function AnalyticsPage() {
  const { publicKey } = useWallet()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<'worker' | 'client'>('worker')

  useEffect(() => {
    if (publicKey) {
      loadAnalytics()
    }
  }, [publicKey, role])

  async function loadAnalytics() {
    if (!publicKey) return
    
    try {
      setLoading(true)
      const data = await getAdvancedAnalytics(publicKey.toString(), role)
      setAnalytics(data)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!publicKey) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="glass-card p-12 text-center">
            <h1 className="text-3xl font-bold mb-4">Advanced Analytics</h1>
            <p className="text-text-secondary mb-6">Connect your wallet to view your analytics</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Advanced Analytics
            </h1>
            <p className="text-text-secondary">Deep insights into your TaskBlitz performance</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setRole('worker')}
              className={`px-4 py-2 rounded-lg transition-all ${
                role === 'worker' 
                  ? 'bg-purple-500 text-white' 
                  : 'glass-card text-text-secondary hover:text-white'
              }`}
            >
              Worker View
            </button>
            <button
              onClick={() => setRole('client')}
              className={`px-4 py-2 rounded-lg transition-all ${
                role === 'client' 
                  ? 'bg-cyan-500 text-white' 
                  : 'glass-card text-text-secondary hover:text-white'
              }`}
            >
              Client View
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          </div>
        ) : !analytics ? (
          <div className="glass-card p-12 text-center">
            <p className="text-text-secondary">No analytics data available yet</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Earnings/Spending Trend */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold">
                  {role === 'worker' ? 'Earnings Trend' : 'Spending Trend'}
                </h2>
              </div>
              {analytics.earnings_trend.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.earnings_trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px'
                      }}
                    />
                    <Line type="monotone" dataKey="amount" stroke="#a855f7" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-text-secondary text-center py-12">No data available yet</p>
              )}
            </div>

            {/* Task Performance by Category */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-bold">Performance by Category</h2>
              </div>
              {analytics.task_performance.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.task_performance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="category" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="completed" fill="#06b6d4" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-text-secondary text-center py-12">No data available yet</p>
              )}
            </div>

            {/* Peak Hours */}
            {analytics.peak_hours.length > 0 && (
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-bold">
                    {role === 'worker' ? 'Peak Earning Hours' : 'Best Posting Times'}
                  </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {analytics.peak_hours.map(hour => (
                    <div key={hour.hour} className="bg-white/5 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-purple-400">{hour.hour}:00</p>
                      <p className="text-text-secondary text-sm mt-1">{hour.tasks} tasks</p>
                      {role === 'worker' && (
                        <p className="text-cyan-400 text-sm">${hour.earnings.toFixed(2)}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skill Analysis (Worker only) */}
            {role === 'worker' && analytics.skill_analysis.length > 0 && (
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-2xl font-bold">Skill Analysis</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {analytics.skill_analysis.map(skill => (
                    <div key={skill.category} className="bg-white/5 p-4 rounded-lg">
                      <h3 className="font-semibold mb-3">{skill.category}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">Success Rate</span>
                          <span className="text-green-400 font-semibold">{skill.success_rate.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">Avg Rating</span>
                          <span className="text-yellow-400 font-semibold">{skill.avg_rating.toFixed(1)} ⭐</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">Potential Earnings</span>
                          <span className="text-purple-400 font-semibold">${skill.potential_earnings.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass-card p-6 text-center">
                <Target className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <p className="text-text-secondary text-sm mb-1">Total Tasks</p>
                <p className="text-3xl font-bold">
                  {analytics.earnings_trend.reduce((sum, day) => sum + day.task_count, 0)}
                </p>
              </div>
              <div className="glass-card p-6 text-center">
                <TrendingUp className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <p className="text-text-secondary text-sm mb-1">
                  {role === 'worker' ? 'Total Earned' : 'Total Spent'}
                </p>
                <p className="text-3xl font-bold text-cyan-400">
                  ${analytics.earnings_trend.reduce((sum, day) => sum + day.amount, 0).toFixed(2)}
                </p>
              </div>
              <div className="glass-card p-6 text-center">
                <Award className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <p className="text-text-secondary text-sm mb-1">Avg per Task</p>
                <p className="text-3xl font-bold">
                  ${(analytics.earnings_trend.reduce((sum, day) => sum + day.amount, 0) / 
                     analytics.earnings_trend.reduce((sum, day) => sum + day.task_count, 0) || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
