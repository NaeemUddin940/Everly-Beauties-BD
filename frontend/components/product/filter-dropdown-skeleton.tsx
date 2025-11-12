export function FilterDropdownSkeleton() {
  return (
    <div className="flex items-center space-x-4 flex-wrap animate-pulse">
      <div className="bg-gray-200 rounded w-16 h-4"></div>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-gray-200 rounded w-24 h-8"></div>
      ))}
      <div className="bg-gray-200 rounded w-16 h-4"></div>
    </div>
  )
}