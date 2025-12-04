import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/4 pr-0 lg:pr-6 mb-6 lg:mb-0">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>

            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="py-4 border-t">
                <Skeleton className="h-5 w-32 mb-4" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <Skeleton className="h-10 w-full mt-6" />
          </div>
        </div>

        <div className="lg:w-3/4">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <Skeleton className="h-4 w-48 mb-3 sm:mb-0" />
              <div className="flex items-center space-x-4">
                <Skeleton className="h-8 w-32" />
                <div className="hidden sm:flex items-center space-x-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <Skeleton className="w-full h-64" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/4 mb-4" />
                    <Skeleton className="h-5 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="container mx-auto px-4 py-8 flex justify-center">
            <div className="flex items-center space-x-1">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
