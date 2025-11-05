'use client'
import { useState } from 'react'
import { Header } from '@/components/Header'
import { TaskGrid } from '@/components/TaskGrid'
import { MarketplaceFilters } from '@/components/MarketplaceFilters'
import { MarketplaceStats } from '@/components/MarketplaceStats'

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

  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">TaskBlitz Marketplace</h1>
          <p className="text-text-secondary">Browse and complete micro-tasks, earn crypto instantly</p>
        </div>
        
        <MarketplaceStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          <div className="lg:col-span-1">
            <MarketplaceFilters onFiltersChange={setFilters} />
          </div>
          <div className="lg:col-span-3">
            <TaskGrid filters={filters} />
          </div>
        </div>
      </div>
    </main>
  )
}