'use client'
import { useState } from 'react'
import { Header } from '@/components/Header'
import { TaskGrid } from '@/components/TaskGrid'
import { MarketplaceFilters } from '@/components/MarketplaceFilters'
import { MarketplaceStats } from '@/components/MarketplaceStats'
import { QuickActions } from '@/components/QuickActions'
import { CategoryChips } from '@/components/CategoryChips'
import { Footer } from '@/components/Footer'

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
  const [showStats, setShowStats] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
        {/* Stats Toggle & Search - Mobile Only */}
        <div className="md:hidden mb-3">
          <div className="flex items-center justify-end mb-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className="text-xs text-purple-400 hover:text-purple-300 px-3 py-1 glass-card rounded-lg"
            >
              {showStats ? 'Hide' : 'Stats'}
            </button>
          </div>
          
          {/* Search Bar - Mobile Only */}
          <input
            type="text"
            placeholder="🔍 Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-card px-3 py-2 text-sm bg-transparent border-white/20 rounded-lg focus:border-purple-400 focus:outline-none text-white placeholder-text-muted"
          />
        </div>
        
        {/* Stats */}
        <div className={`${showStats ? 'block' : 'hidden'} md:block mb-4 md:mb-6`}>
          <MarketplaceStats />
        </div>

        {/* Category Chips - Mobile Quick Filter */}
        <div className="mb-4 md:hidden">
          <div className="flex items-start gap-2">
            <div className="flex-1 min-w-0 relative">
              <div className="overflow-x-auto scrollbar-hide">
                <CategoryChips 
                  selectedCategories={filters.categories}
                  onCategoryToggle={(category: string) => {
                    const newCategories = filters.categories.includes(category)
                      ? filters.categories.filter(c => c !== category)
                      : [...filters.categories, category]
                    setFilters({ ...filters, categories: newCategories })
                  }}
                />
              </div>
              {/* Fade gradient to indicate more content */}
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-bg-darkest to-transparent pointer-events-none" />
            </div>
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex-shrink-0 glass-card px-3 py-2 rounded-full text-sm font-medium text-purple-400 hover:text-purple-300 flex items-center whitespace-nowrap"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filters
            </button>
          </div>
        </div>

        {/* Mobile Filter Modal */}
        {showMobileFilters && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden">
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-b from-gray-900 to-black rounded-t-3xl max-h-[85vh] overflow-y-auto">
              <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm px-4 py-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <MarketplaceFilters 
                  onFiltersChange={(newFilters) => {
                    setFilters(newFilters)
                    setShowMobileFilters(false)
                  }} 
                  isMobile={true}
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
          {/* Desktop Filters with Search */}
          <div className="hidden lg:block lg:col-span-1">
            <MarketplaceFilters 
              onFiltersChange={setFilters}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
          
          {/* Task Grid - Full Width on Mobile */}
          <div className="lg:col-span-3">
            <TaskGrid filters={filters} searchQuery={searchQuery} />
          </div>
        </div>
      </div>
      <QuickActions />
      <Footer />
    </main>
  )
}