export function ProductSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden animate-pulse">
      <div className="relative">
        {/* Image skeleton */}
        <div className="w-full h-64 bg-gray-200"></div>
        {/* Discount badge skeleton */}
        <div className="absolute top-2 left-2 bg-gray-200 rounded w-16 h-6"></div>
        {/* Heart icon skeleton */}
        <div className="absolute top-2 right-2 bg-gray-200 rounded-full w-6 h-6"></div>
      </div>
      <div className="p-4">
        {/* Category skeleton */}
        <div className="bg-gray-200 rounded w-16 h-3 mb-1"></div>
        {/* Product name skeleton */}
        <div className="space-y-1 mb-2">
          <div className="bg-gray-200 rounded w-full h-4"></div>
          <div className="bg-gray-200 rounded w-3/4 h-4"></div>
        </div>
        {/* Price skeleton */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="bg-gray-200 rounded w-16 h-5"></div>
          <div className="bg-gray-200 rounded w-12 h-4"></div>
          <div className="bg-gray-200 rounded w-12 h-4"></div>
        </div>
        {/* Rating skeleton */}
        <div className="flex items-center mb-2">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded w-3 h-3"></div>
            ))}
          </div>
          <div className="bg-gray-200 rounded w-8 h-3 ml-1"></div>
        </div>
        {/* Button skeleton */}
        <div className="bg-gray-200 rounded w-full h-10"></div>
      </div>
    </div>
  )
}