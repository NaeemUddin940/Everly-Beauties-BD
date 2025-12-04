import Container from "@/components/common/Container";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const ProductLoading = React.memo(function ProductLoading() {
  return (
    <Container>
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center space-x-2 my-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Images Skeleton */}
        <div className="md:w-1/2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Skeleton className="w-full aspect-square" />
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-md" />
            ))}
          </div>
        </div>

        <div className="md:w-1/2">
          <Skeleton className="h-5 w-24 mb-2" />
          <Skeleton className="h-8 w-full mb-4" />

          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-5 w-24" />
          </div>

          <Skeleton className="h-6 w-20 mb-6" />

          <div className="flex gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-16 rounded-md" />
            ))}
          </div>

          <Skeleton className="h-12 w-full mb-6" />

          <div className="grid grid-cols-2 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex space-x-8 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-28" />
          ))}
        </div>

        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>

      <div className="mt-16">
        <Skeleton className="h-8 w-48 mb-6" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <Skeleton className="w-full aspect-square" />
              <div className="p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-6 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
});

export default ProductLoading;
