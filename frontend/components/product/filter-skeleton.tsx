export function FilterSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Price Range Skeleton */}
      <div>
        <div className="bg-gray-200 rounded w-24 h-5 mb-3"></div>
        <div className="space-y-4">
          <div className="bg-gray-200 rounded-full w-full h-2"></div>
          <div className="flex justify-between">
            <div className="bg-gray-200 rounded w-12 h-3"></div>
            <div className="bg-gray-200 rounded w-12 h-3"></div>
          </div>
          <div className="flex gap-2">
            <div className="bg-gray-200 rounded w-full h-8"></div>
            <div className="bg-gray-200 rounded w-full h-8"></div>
          </div>
        </div>
      </div>

      {/* Categories Skeleton */}
      <div>
        <div className="bg-gray-200 rounded w-20 h-5 mb-3"></div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="bg-gray-200 rounded w-4 h-4"></div>
              <div className="bg-gray-200 rounded w-32 h-4"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Brands Skeleton */}
      <div>
        <div className="bg-gray-200 rounded w-16 h-5 mb-3"></div>
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="bg-gray-200 rounded w-4 h-4"></div>
              <div className="bg-gray-200 rounded w-28 h-4"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex space-x-2 pt-4">
        <div className="bg-gray-200 rounded w-full h-10"></div>
        <div className="bg-gray-200 rounded w-full h-10"></div>
      </div>
    </div>
  )
}