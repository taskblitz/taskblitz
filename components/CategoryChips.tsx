'use client'

interface CategoryChipsProps {
  selectedCategories: string[]
  onCategoryToggle: (category: string) => void
}

export function CategoryChips({ selectedCategories, onCategoryToggle }: CategoryChipsProps) {
  const categories = [
    { name: 'All', value: '' },
    { name: 'Marketing', value: 'Marketing' },
    { name: 'Social Media', value: 'Social Media' },
    { name: 'Reviews', value: 'Reviews' },
    { name: 'Research', value: 'Research' },
    { name: 'Data Entry', value: 'Data Entry' },
    { name: 'Testing', value: 'Testing' },
  ]

  const handleChipClick = (value: string) => {
    if (value === '') {
      // Clear all filters
      selectedCategories.forEach(cat => onCategoryToggle(cat))
    } else {
      onCategoryToggle(value)
    }
  }

  const isAllSelected = selectedCategories.length === 0

  return (
    <div className="flex space-x-2 pb-2 pr-8">
      {categories.map((category) => {
        const isSelected = category.value === '' 
          ? isAllSelected 
          : selectedCategories.includes(category.value)
        
        return (
          <button
            key={category.value || 'all'}
            onClick={() => handleChipClick(category.value)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all
              ${isSelected 
                ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white' 
                : 'glass-card text-text-secondary hover:text-white'
              }
            `}
          >
            {category.name}
          </button>
        )
      })}
    </div>
  )
}
