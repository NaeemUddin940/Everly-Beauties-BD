"use client";

import { Button } from "@/components/product/custom-button";
import type { FilterOptions, FilterState } from "@/types/product";
import { X } from "lucide-react";

interface AppliedFiltersProps {
  filters: FilterState;
  filterOptions: FilterOptions;
  onFiltersChange: (filters: FilterState) => void;
  onClearAll: () => void;
}

export function AppliedFilters({
  filters,
  filterOptions,
  onFiltersChange,
  onClearAll,
}: AppliedFiltersProps) {
  const appliedFilters: Array<{
    key: string;
    label: string;
    value: string;
    displayValue: string;
  }> = [];

  // Helper function to find filter term by slug
  const findFilterTerm = (terms: any[], slug: string) => {
    return terms?.find((term) => term.slug === slug);
  };

  // Price Range
  if (filters.min_price !== undefined || filters.max_price !== undefined) {
    const minPrice = filters.min_price || filterOptions.price_range.min;
    const maxPrice = filters.max_price || filterOptions.price_range.max;

    if (
      minPrice !== filterOptions.price_range.min ||
      maxPrice !== filterOptions.price_range.max
    ) {
      appliedFilters.push({
        key: "price",
        label: "Price Range",
        value: "price",
        displayValue: `৳${minPrice} - ৳${maxPrice}`,
      });
    }
  }

  // Categories
  if (filters.categories) {
    const categoryIds = filters.categories.split(",");
    categoryIds.forEach((categoryId) => {
      const category = findFilterTerm(filterOptions.categories, categoryId);
      if (category) {
        appliedFilters.push({
          key: "categories",
          label: "Category",
          value: categoryId,
          displayValue: category.name,
        });
      }
    });
  }

  // Brands
  if (filters.brand) {
    const brandIds = filters.brand.split(",");
    brandIds.forEach((brandId) => {
      const brand = findFilterTerm(filterOptions.brands, brandId);
      if (brand) {
        appliedFilters.push({
          key: "brand",
          label: "Brand",
          value: brandId,
          displayValue: brand.name,
        });
      }
    });
  }

  // Sorting (if not default)
  if (filters.orderby && filters.orderby !== "menu_order") {
    const sortLabel = filterOptions.price_range ? "Sort" : "Sort";
    let sortDisplay = filters.orderby;

    // Convert technical sort values to user-friendly labels
    const sortLabels: Record<string, string> = {
      popularity: "Popularity",
      rating: "Rating",
      date: "Latest",
      price: "Price: Low to High",
      "price-desc": "Price: High to Low",
    };

    if (filters.order === "DESC" && filters.orderby === "price") {
      sortDisplay = "Price: High to Low";
    } else {
      sortDisplay = sortLabels[filters.orderby] || filters.orderby;
    }

    appliedFilters.push({
      key: "sort",
      label: "Sort",
      value: "sort",
      displayValue: sortDisplay,
    });
  }

  const removeFilter = (filterKey: string, filterValue: string) => {
    const newFilters = { ...filters };

    switch (filterKey) {
      case "price":
        delete newFilters.min_price;
        delete newFilters.max_price;
        break;
      case "categories":
        if (newFilters.categories) {
          const categories = newFilters.categories
            .split(",")
            .filter((cat) => cat !== filterValue);
          newFilters.categories =
            categories.length > 0 ? categories.join(",") : undefined;
        }
        break;
      case "brand":
        if (newFilters.brand) {
          const brands = newFilters.brand
            .split(",")
            .filter((brand) => brand !== filterValue);
          newFilters.brand = brands.length > 0 ? brands.join(",") : undefined;
        }
        break;
      case "sort":
        delete newFilters.orderby;
        delete newFilters.order;
        break;
    }

    newFilters.page = 1;
    onFiltersChange(newFilters);
  };

  if (appliedFilters.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-700 mr-2">
          Applied filters:
        </span>

        {appliedFilters.map((filter, index) => (
          <div
            key={`${filter.key}-${filter.value}-${index}`}
            className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span className="font-medium text-gray-500 text-xs">
              {filter.label}:
            </span>
            <span>{filter.displayValue}</span>
            <button
              onClick={() => removeFilter(filter.key, filter.value)}
              className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
              aria-label={`Remove ${filter.displayValue} filter`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {appliedFilters.length > 1 && (
          <Button
            variant="link"
            onClick={onClearAll}
            className="text-sm text-pink-600 cursor-pointer hover:text-pink-700 hover:underline p-0 ml-2"
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}
