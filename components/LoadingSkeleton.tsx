export function TaskCardSkeleton() {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="flex space-x-2">
          <div className="h-6 w-20 bg-white/10 rounded-full"></div>
          <div className="h-6 w-16 bg-white/10 rounded-full"></div>
        </div>
        <div className="h-8 w-16 bg-white/10 rounded"></div>
      </div>
      
      <div className="h-6 w-3/4 bg-white/10 rounded mb-2"></div>
      <div className="h-4 w-full bg-white/10 rounded mb-4"></div>
      
      <div className="h-2 w-full bg-white/10 rounded mb-4"></div>
      
      <div className="flex justify-between items-center">
        <div className="h-4 w-32 bg-white/10 rounded"></div>
        <div className="h-10 w-24 bg-white/10 rounded-lg"></div>
      </div>
    </div>
  )
}

export function TaskGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <TaskCardSkeleton key={i} />
      ))}
    </div>
  )
}