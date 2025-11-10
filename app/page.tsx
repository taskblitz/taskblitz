'use client'
import { useState } from 'react'
import { Header } from '@/components/Header'
import { TaskGrid } from '@/components/TaskGrid'
import { MarketplaceFilters } from '@/components/MarketplaceFilters'
import { MarketplaceStats } from '@/components/MarketplaceStats'
import { QuickActions } from '@/components/QuickActions'

interface Filters {
  categories: string[]
  difficulty: string[]
  rewardRange: { min: string; max: string }
}

export default function Marketplace() {
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    difficulty: [],
    rewardRange: { min: '', max: '' }
  })
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">TaskBlitz Marketplace</h1>
          <p className="text-text-secondary">Browse and complete micro-tasks, earn crypto instantly</p>
          
          {/* Search Bar */}
          <div className="mt-6">
            <input
              type="text"
              placeholder="🔍 Search tasks by title, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-card px-4 py-3 bg-transparent border-white/20 rounded-lg focus:border-purple-400 focus:outline-none text-white placeholder-text-muted"
            />
          </div>
        </div>
        
        <MarketplaceStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          <div className="lg:col-span-1">
            <MarketplaceFilters onFiltersChange={setFilters} />
          </div>
          <div className="lg:col-span-3">
            <TaskGrid filters={filters} searchQuery={searchQuery} />
          </div>
        </div>
      </div>
      <QuickActions />
    </main>
  )
}