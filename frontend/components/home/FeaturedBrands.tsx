"use client"

import type React from "react"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import Link from "next/link"

interface Brand {
  id: number
  name: string
  slug: string
  link: string
  thumbnail_url: string
}

const fetchFeaturedBrands = async (): Promise<Brand[]> => {
  const response = await fetch("https://everlybeautiesbd.com/wp-json/custom/v1/featured-brands")

  if (!response.ok) {
    throw new Error("Failed to fetch brands")
  }

  return response.json()
}

const FeaturedBrands: React.FC = () => {
  const { data: brands, isLoading, isError, error, refetch } = useQuery<Brand[]>({
    queryKey: ["featured-brands"],
    queryFn: fetchFeaturedBrands,
    staleTime: 5 * 60 * 1000,
  })

  return (
    <div className="mx-auto py-6 px-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-center text-[#E91E63] font-semibold text-xl md:text-2xl mb-2 font-[Inter]">
            Featured Brands
          </h2>
          <div className="w-16 h-[3px] bg-[#E91E63] mb-8 rounded"></div>
        </div>
        <Link
          href="/brands"
          className="flex items-center gap-x-1 shadow bg-white hover:bg-gray-500 px-3 py-1.5 rounded-[20px]"
        >
          <span className="text-xs sm:text-base text-black">see all</span>
          <svg
            className="hidden sm:block"
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M1 6H11M6 1L11 6L6 11"
              stroke="black"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </Link>
      </div>

      {isLoading && (
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-2 md:gap-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-full aspect-square rounded-lg bg-gray-200 animate-pulse"></div>
              <div className="mt-2 h-3 w-16 bg-gray-200 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-8">
          <p className="text-red-500">Error loading brands: {(error as Error).message}</p>
          <button
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 bg-[#E91E63] text-white rounded hover:bg-[#C2185B]"
          >
            Try Again
          </button>
        </div>
      )}

      {!isLoading && !isError && brands && (
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-2 md:gap-4">
          {brands.map((brand) => (
            <div key={brand.id} className="flex flex-col items-center">
              <Link href={brand.link} className="w-full block">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={brand.thumbnail_url || "/placeholder.svg"}
                    alt={`${brand.name} cosmetic products`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FeaturedBrands