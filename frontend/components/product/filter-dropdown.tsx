"use client"

import type React from "react"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/app/components/product/custom-button"
import { Checkbox } from "@/app/components/product/custom-checkbox"
import { Slider } from "@/app/components/product/custom-slider"
import type { FilterOptions, FilterState } from "@/types/product"

interface FilterDropdownProps {
  title: string
  children: React.ReactNode
}

export function FilterDropdown({ title, children }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative z-20">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="inline-flex cursor-pointer items-center justify-center px-4 py-2 text-sm font-medium"
      >
        {title}
        <ChevronDown className="w-4 h-4 ml-1" />
      </Button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-4 min-w-[280px]"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  )
}

interface PriceFilterDropdownProps {
  filterOptions: FilterOptions
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function PriceFilterDropdown({ filterOptions, filters, onFiltersChange }: PriceFilterDropdownProps) {
  const [priceRange, setPriceRange] = useState([
    filters.min_price || filterOptions.price_range.min,
    filters.max_price || filterOptions.price_range.max,
  ])

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values)
    onFiltersChange({
      ...filters,
      min_price: values[0],
      max_price: values[1],
    })
  }

  return (
    <FilterDropdown title="Price Range">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-800">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={handlePriceChange}
          max={filterOptions.price_range.max}
          min={filterOptions.price_range.min}
          step={10}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>৳ {filterOptions.price_range.min}</span>
          <span>৳ {filterOptions.price_range.max}+</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceRange[0]}
            onChange={(e) => handlePriceChange([Number.parseInt(e.target.value) || 0, priceRange[1]])}
            className="w-full text-xs border border-gray-300 rounded-md px-2 py-1 focus:ring-pink-500 focus:border-pink-500"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={priceRange[1]}
            onChange={(e) =>
              handlePriceChange([priceRange[0], Number.parseInt(e.target.value) || filterOptions.price_range.max])
            }
            className="w-full text-xs border border-gray-300 rounded-md px-2 py-1 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
      </div>
    </FilterDropdown>
  )
}

interface CategoryFilterDropdownProps {
  filterOptions: FilterOptions
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function CategoryFilterDropdown({ filterOptions, filters, onFiltersChange }: CategoryFilterDropdownProps) {
  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    const currentCategories = filters.categories ? filters.categories.split(",") : []
    let newCategories

    if (checked) {
      newCategories = [...currentCategories, categorySlug]
    } else {
      newCategories = currentCategories.filter((cat) => cat !== categorySlug)
    }

    onFiltersChange({
      ...filters,
      categories: newCategories.length > 0 ? newCategories.join(",") : undefined,
    })
  }

  const currentCategories = filters.categories ? filters.categories.split(",") : []

  return (
    <FilterDropdown title="Categories">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-800">Categories</h3>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {filterOptions.categories && filterOptions.categories.length > 0 ? (
            filterOptions.categories.map((category: any) => (
              <div key={category.slug} className="flex items-center space-x-2">
                <Checkbox
                  id={`desktop-category-${category.slug}`}
                  checked={currentCategories.includes(category.slug)}
                  onCheckedChange={(checked) => handleCategoryChange(category.slug, checked as boolean)}
                  className="h-3 w-3"
                />
                <label htmlFor={`desktop-category-${category.slug}`} className="text-xs text-gray-700 cursor-pointer">
                  {category.name} ({category.count})
                </label>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500">No categories available</p>
          )}
        </div>
      </div>
    </FilterDropdown>
  )
}

interface BrandFilterDropdownProps {
  filterOptions: FilterOptions
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function BrandFilterDropdown({ filterOptions, filters, onFiltersChange }: BrandFilterDropdownProps) {
  const handleBrandChange = (brandSlug: string, checked: boolean) => {
    const currentBrands = filters.brand ? filters.brand.split(",") : []
    let newBrands

    if (checked) {
      newBrands = [...currentBrands, brandSlug]
    } else {
      newBrands = currentBrands.filter((brand) => brand !== brandSlug)
    }

    onFiltersChange({
      ...filters,
      brand: newBrands.length > 0 ? newBrands.join(",") : undefined,
    })
  }

  const currentBrands = filters.brand ? filters.brand.split(",") : []

  return (
    <FilterDropdown title="Brands">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-800">Brands</h3>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {filterOptions.brands && filterOptions.brands.length > 0 ? (
            filterOptions.brands.map((brand: any) => (
              <div key={brand.slug} className="flex items-center space-x-2">
                <Checkbox
                  id={`desktop-brand-${brand.slug}`}
                  checked={currentBrands.includes(brand.slug)}
                  onCheckedChange={(checked) => handleBrandChange(brand.slug, checked as boolean)}
                  className="h-3 w-3"
                />
                <label htmlFor={`desktop-brand-${brand.slug}`} className="text-xs text-gray-700 cursor-pointer">
                  {brand.name} ({brand.count})
                </label>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500">No brands available</p>
          )}
        </div>
      </div>
    </FilterDropdown>
  )
}