// components/common/ProductCardSkeleton.tsx
export default function ProductCardSkeleton() {
  return (
    <div className="w-[175px] md:w-[290px] bg-white rounded-lg shadow-lg p-4 animate-pulse">
      <div className="flex justify-between">
        <div className="w-full h-30 md:h-48 bg-gray-300 rounded mb-4 rounded"></div>
      </div>
      <div className="mb-4">
        <div className="bg-gray-300 h-2 md:h-4 w-24 mb-2 rounded"></div>
        <div className="bg-gray-300 h-3 md:h-6 w-full mb-2 rounded"></div>
        <div className="flex items-center gap-2 my-2">
          <div className="bg-gray-300 h-3 md:h-4 w-16 rounded"></div>
          <div className="bg-gray-300 h-2 md:h-4 w-12 rounded"></div>
          <div className="bg-gray-300 h-2 md:h-4 w-10 rounded"></div>
        </div>
        <div className="bg-gray-300 h-2 md:h-4 w-32 rounded"></div>
      </div>
      <div className="bg-gray-300 h-6 md:h-10 w-full rounded"></div>
    </div>
  );
}