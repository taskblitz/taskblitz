'use client'
import { useState } from 'react'
import { Filter, X } from 'lucide-react'

interface MarketplaceFiltersProps {
  onFiltersChange: (filters: {
    categories: string[]
    difficulty: string[]
    rewardRange: { min: string; max: string }
  }) => void
}

export function MarketplaceFilters({ onFiltersChange }: MarketplaceFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([])
  const [rewardRange, setRewardRange] = useState({ min: '', max: '' })

  const categories = [
    'Writing', 'Design', 'Data Entry', 'Testing', 'Transcription', 
    'Research', 'Translation', 'Marketing', 'Programming', 'Other'
  ]

  const difficulties = ['Easy', 'Medium', 'Hard']

  const toggleCategory = (category: string) => {
    const newCategories = selectedCategories.includes(category) 
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category]
    
    setSelectedCategories(newCategories)
    onFiltersChange({
      categories: newCategories,
      difficulty: selectedDifficulty,
      rewardRange
    })
  }

  const toggleDifficulty = (difficulty: string) => {
    const newDifficulty = selectedDifficulty.includes(difficulty) 
      ? selectedDifficulty.filter(d => d !== difficulty)
      : [...selectedDifficulty, difficulty]
    
    setSelectedDifficulty(newDifficulty)
    onFiltersChange({
      categories: selectedCategories,
      difficulty: newDifficulty,
      rewardRange
    })
  }

  const updateRewardRange = (field: 'min' | 'max', value: string) => {
    const newRewardRange = { ...rewardRange, [field]: value }
    setRewardRange(newRewardRange)
    onFiltersChange({
      categories: selectedCategories,
      difficulty: selectedDifficulty,
      rewardRange: newRewardRange
    })
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedDifficulty([])
    setRewardRange({ min: '', max: '' })
    onFiltersChange({
      categories: [],
      difficulty: [],
      rewardRange: { min: '', max: '' }
    })
  }

  const hasActiveFilters = selectedCategories.length > 0 || selectedDifficulty.length > 0 || rewardRange.min || rewardRange.max

  return (
    <div className="glass-card p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Filter className="w-5 h-5 mr-2 text-purple-400" />
          <h3 className="font-semibold">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center"
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3 text-text-secondary">Category</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center transition-colors ${
                selectedCategories.includes(category)
                  ? 'bg-purple-500 border-purple-500'
                  : 'border-white/30 hover:border-purple-400'
              }`}>
                {selectedCategories.includes(category) && (
                  <div className="w-2 h-2 bg-white rounded-sm" />
                )}
              </div>
              <span className="text-sm text-text-secondary hover:text-white transition-colors">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3 text-text-secondary">Difficulty</h4>
        <div className="space-y-2">
          {difficulties.map((difficulty) => (
            <label key={difficulty} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedDifficulty.includes(difficulty)}
                onChange={() => toggleDifficulty(difficulty)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center transition-colors ${
                selectedDifficulty.includes(difficulty)
                  ? 'bg-purple-500 border-purple-500'
                  : 'border-white/30 hover:border-purple-400'
              }`}>
                {selectedDifficulty.includes(difficulty) && (
                  <div className="w-2 h-2 bg-white rounded-sm" />
                )}
              </div>
              <span className="text-sm text-text-secondary hover:text-white transition-colors">
                {difficulty}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Reward Range */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3 text-text-secondary">Reward Range (USD)</h4>
        <div className="space-y-3">
          <input
            type="number"
            placeholder="Min"
            value={rewardRange.min}
            onChange={(e) => updateRewardRange('min', e.target.value)}
            className="w-full glass-card px-3 py-2 text-sm bg-transparent border-white/20 rounded-lg focus:border-purple-400 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Max"
            value={rewardRange.max}
            onChange={(e) => updateRewardRange('max', e.target.value)}
            className="w-full glass-card px-3 py-2 text-sm bg-transparent border-white/20 rounded-lg focus:border-purple-400 focus:outline-none"
          />
        </div>
      </div>


    </div>
  )
}