import { supabase } from './supabase'
import { AnalyticsData } from '@/types/advanced-features'

export async function getAdvancedAnalytics(userId: string, role: 'worker' | 'client'): Promise<AnalyticsData> {
  
  // Check cache first
  const { data: cached } = await supabase
    .from('analytics_cache')
    .select('*')
    .eq('user_id', userId)
    .eq('metric_type', `${role}_analytics`)
    .eq('time_period', 'weekly')
    .gt('expires_at', new Date().toISOString())
    .single()
  
  if (cached) {
    return cached.data as AnalyticsData
  }
  
  // Calculate fresh analytics
  const analytics = role === 'worker' 
    ? await calculateWorkerAnalytics(userId)
    : await calculateClientAnalytics(userId)
  
  // Cache the results
  await supabase
    .from('analytics_cache')
    .insert({
      user_id: userId,
      metric_type: `${role}_analytics`,
      time_period: 'weekly',
      data: analytics,
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour
    })
  
  return analytics
}

async function calculateWorkerAnalytics(userId: string): Promise<AnalyticsData> {
  
  // Get last 30 days of completed tasks
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('worker_id', userId)
    .eq('status', 'completed')
    .gte('completed_at', thirtyDaysAgo.toISOString())
  
  if (!tasks) return getEmptyAnalytics()
  
  // Earnings trend (daily)
  const earningsByDate = new Map<string, { amount: number; count: number }>()
  tasks.forEach((task: any) => {
    const date = new Date(task.completed_at).toISOString().split('T')[0]
    const current = earningsByDate.get(date) || { amount: 0, count: 0 }
    earningsByDate.set(date, {
      amount: current.amount + parseFloat(task.reward_amount),
      count: current.count + 1
    })
  })
  
  const earnings_trend = Array.from(earningsByDate.entries())
    .map(([date, data]) => ({
      date,
      amount: data.amount,
      task_count: data.count
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
  
  // Task performance by category
  const performanceByCategory = new Map<string, { completed: number; totalTime: number; totalReward: number }>()
  tasks.forEach((task: any) => {
    const current = performanceByCategory.get(task.category) || { completed: 0, totalTime: 0, totalReward: 0 }
    const timeSpent = task.completed_at && task.accepted_at 
      ? (new Date(task.completed_at).getTime() - new Date(task.accepted_at).getTime()) / (1000 * 60)
      : 0
    
    performanceByCategory.set(task.category, {
      completed: current.completed + 1,
      totalTime: current.totalTime + timeSpent,
      totalReward: current.totalReward + parseFloat(task.reward_amount)
    })
  })
  
  const task_performance = Array.from(performanceByCategory.entries())
    .map(([category, data]) => ({
      category,
      completed: data.completed,
      avg_time: data.totalTime / data.completed,
      avg_reward: data.totalReward / data.completed
    }))
  
  // Peak earning hours
  const hourlyEarnings = new Map<number, { earnings: number; tasks: number }>()
  tasks.forEach((task: any) => {
    const hour = new Date(task.completed_at).getHours()
    const current = hourlyEarnings.get(hour) || { earnings: 0, tasks: 0 }
    hourlyEarnings.set(hour, {
      earnings: current.earnings + parseFloat(task.reward_amount),
      tasks: current.tasks + 1
    })
  })
  
  const peak_hours = Array.from(hourlyEarnings.entries())
    .map(([hour, data]) => ({
      hour,
      earnings: data.earnings,
      tasks: data.tasks
    }))
    .sort((a, b) => b.earnings - a.earnings)
    .slice(0, 5)
  
  // Skill analysis - categories with high success rate
  const { data: allApplications } = await supabase
    .from('tasks')
    .select('category, status')
    .eq('worker_id', userId)
    .in('status', ['completed', 'rejected'])
  
  const skillsByCategory = new Map<string, { completed: number; total: number; totalRating: number }>()
  allApplications?.forEach((task: any) => {
    const current = skillsByCategory.get(task.category) || { completed: 0, total: 0, totalRating: 0 }
    skillsByCategory.set(task.category, {
      completed: current.completed + (task.status === 'completed' ? 1 : 0),
      total: current.total + 1,
      totalRating: current.totalRating + (task.worker_rating || 0)
    })
  })
  
  const skill_analysis = Array.from(skillsByCategory.entries())
    .map(([category, data]) => ({
      category,
      success_rate: (data.completed / data.total) * 100,
      avg_rating: data.totalRating / data.completed,
      potential_earnings: data.completed * 10 // Simplified calculation
    }))
    .sort((a, b) => b.success_rate - a.success_rate)
  
  return {
    earnings_trend,
    task_performance,
    peak_hours,
    skill_analysis
  }
}

async function calculateClientAnalytics(userId: string): Promise<AnalyticsData> {
  
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('client_id', userId)
    .gte('created_at', thirtyDaysAgo.toISOString())
  
  if (!tasks) return getEmptyAnalytics()
  
  // Spending trend
  const spendingByDate = new Map<string, { amount: number; count: number }>()
  tasks.filter((t: any) => t.status === 'completed').forEach((task: any) => {
    const date = new Date(task.completed_at).toISOString().split('T')[0]
    const current = spendingByDate.get(date) || { amount: 0, count: 0 }
    spendingByDate.set(date, {
      amount: current.amount + parseFloat(task.reward_amount),
      count: current.count + 1
    })
  })
  
  const earnings_trend = Array.from(spendingByDate.entries())
    .map(([date, data]) => ({
      date,
      amount: data.amount,
      task_count: data.count
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
  
  // Task completion rates by category
  const categoryStats = new Map<string, { completed: number; total: number; totalTime: number; totalReward: number }>()
  tasks.forEach((task: any) => {
    const current = categoryStats.get(task.category) || { completed: 0, total: 0, totalTime: 0, totalReward: 0 }
    const timeToComplete = task.completed_at && task.created_at
      ? (new Date(task.completed_at).getTime() - new Date(task.created_at).getTime()) / (1000 * 60)
      : 0
    
    categoryStats.set(task.category, {
      completed: current.completed + (task.status === 'completed' ? 1 : 0),
      total: current.total + 1,
      totalTime: current.totalTime + timeToComplete,
      totalReward: current.totalReward + parseFloat(task.reward_amount)
    })
  })
  
  const task_performance = Array.from(categoryStats.entries())
    .map(([category, data]) => ({
      category,
      completed: data.completed,
      avg_time: data.totalTime / data.completed,
      avg_reward: data.totalReward / data.total
    }))
  
  // Best posting times (when tasks get completed fastest)
  const hourlyCompletion = new Map<number, { count: number; avgTime: number }>()
  tasks.filter((t: any) => t.status === 'completed').forEach((task: any) => {
    const hour = new Date(task.created_at).getHours()
    const completionTime = (new Date(task.completed_at).getTime() - new Date(task.created_at).getTime()) / (1000 * 60)
    const current = hourlyCompletion.get(hour) || { count: 0, avgTime: 0 }
    hourlyCompletion.set(hour, {
      count: current.count + 1,
      avgTime: (current.avgTime * current.count + completionTime) / (current.count + 1)
    })
  })
  
  const peak_hours = Array.from(hourlyCompletion.entries())
    .map(([hour, data]) => ({
      hour,
      earnings: 0, // Not applicable for clients
      tasks: data.count
    }))
    .sort((a, b) => a.hour - b.hour)
  
  return {
    earnings_trend,
    task_performance,
    peak_hours,
    skill_analysis: [] // Not applicable for clients
  }
}

function getEmptyAnalytics(): AnalyticsData {
  return {
    earnings_trend: [],
    task_performance: [],
    peak_hours: [],
    skill_analysis: []
  }
}
