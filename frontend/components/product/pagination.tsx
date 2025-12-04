"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/product/custom-button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  return (
    <nav className="mt-10 flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
      <div className="-mt-px flex w-0 flex-1">
        <Button
          variant="ghost"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-50"
        >
          <ChevronLeft className="mr-3 h-5 w-5 text-gray-400" />
          Previous
        </Button>
      </div>

      <div className="hidden md:-mt-px md:flex">
        {visiblePages.map((page, index) => (
          <div key={index}>
            {page === "..." ? (
              <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
                ...
              </span>
            ) : (
              <Button
                variant="ghost"
                onClick={() => onPageChange(page as number)}
                className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
                  currentPage === page
                    ? "border-pink-500 text-pink-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {page}
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="-mt-px flex w-0 flex-1 justify-end">
        <Button
          variant="ghost"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-50"
        >
          Next
          <ChevronRight className="ml-3 h-5 w-5 text-gray-400" />
        </Button>
      </div>
    </nav>
  )
}