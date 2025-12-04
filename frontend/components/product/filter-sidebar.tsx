"use client";

import { Button } from "@/components/product/custom-button";
import { Checkbox } from "@/components/product/custom-checkbox";
import { Slider } from "@/components/product/custom-slider";
import type { FilterOptions, FilterState } from "@/types/product";
import { X } from "lucide-react";
import { useState } from "react";

interface FilterSidebarProps {
  filterOptions: FilterOptions;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export function FilterSidebar({
  filterOptions,
  filters,
  onFiltersChange,
  onClose,
  isMobile = false,
}: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState([
    filters.min_price || filterOptions.price_range.min,
    filters.max_price || filterOptions.price_range.max,
  ]);

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
    onFiltersChange({
      ...filters,
      min_price: values[0],
      max_price: values[1],
    });
  };

  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    const currentCategories = filters.categories
      ? filters.categories.split(",")
      : [];
    let newCategories;

    if (checked) {
      newCategories = [...currentCategories, categorySlug];
    } else {
      newCategories = currentCategories.filter((cat) => cat !== categorySlug);
    }

    onFiltersChange({
      ...filters,
      categories:
        newCategories.length > 0 ? newCategories.join(",") : undefined,
    });
  };

  const handleBrandChange = (brandSlug: string, checked: boolean) => {
    const currentBrands = filters.brand ? filters.brand.split(",") : [];
    let newBrands;

    if (checked) {
      newBrands = [...currentBrands, brandSlug];
    } else {
      newBrands = currentBrands.filter((brand) => brand !== brandSlug);
    }

    onFiltersChange({
      ...filters,
      brand: newBrands.length > 0 ? newBrands.join(",") : undefined,
    });
  };

  const handleBenefitsChange = (benefitSlug: string, checked: boolean) => {
    const currentBenefits = filters.benefits ? filters.benefits.split(",") : [];
    let newBenefits;

    if (checked) {
      newBenefits = [...currentBenefits, benefitSlug];
    } else {
      newBenefits = currentBenefits.filter(
        (benefit) => benefit !== benefitSlug
      );
    }

    onFiltersChange({
      ...filters,
      benefits: newBenefits.length > 0 ? newBenefits.join(",") : undefined,
    });
  };

  const handleMadeInChange = (madeInSlug: string, checked: boolean) => {
    const currentMadeIn = filters.made_in ? filters.made_in.split(",") : [];
    let newMadeIn;

    if (checked) {
      newMadeIn = [...currentMadeIn, madeInSlug];
    } else {
      newMadeIn = currentMadeIn.filter((item) => item !== madeInSlug);
    }

    onFiltersChange({
      ...filters,
      made_in: newMadeIn.length > 0 ? newMadeIn.join(",") : undefined,
    });
  };

  const handleTypeOfSkinsChange = (skinTypeSlug: string, checked: boolean) => {
    const currentSkinTypes = filters.type_of_skins
      ? filters.type_of_skins.split(",")
      : [];
    let newSkinTypes;

    if (checked) {
      newSkinTypes = [...currentSkinTypes, skinTypeSlug];
    } else {
      newSkinTypes = currentSkinTypes.filter((type) => type !== skinTypeSlug);
    }

    onFiltersChange({
      ...filters,
      type_of_skins:
        newSkinTypes.length > 0 ? newSkinTypes.join(",") : undefined,
    });
  };

  const handleFinishChange = (finishSlug: string, checked: boolean) => {
    const currentFinishes = filters.finish ? filters.finish.split(",") : [];
    let newFinishes;

    if (checked) {
      newFinishes = [...currentFinishes, finishSlug];
    } else {
      newFinishes = currentFinishes.filter((finish) => finish !== finishSlug);
    }

    onFiltersChange({
      ...filters,
      finish: newFinishes.length > 0 ? newFinishes.join(",") : undefined,
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      page: 1,
      per_page: 12,
    });
    setPriceRange([
      filterOptions.price_range.min,
      filterOptions.price_range.max,
    ]);
  };

  const currentCategories = filters.categories
    ? filters.categories.split(",")
    : [];
  const currentBrands = filters.brand ? filters.brand.split(",") : [];
  const currentBenefits = filters.benefits ? filters.benefits.split(",") : [];
  const currentMadeIn = filters.made_in ? filters.made_in.split(",") : [];
  const currentSkinTypes = filters.type_of_skins
    ? filters.type_of_skins.split(",")
    : [];
  const currentFinishes = filters.finish ? filters.finish.split(",") : [];

  return (
    <div className={`bg-white ${isMobile ? "p-6" : "p-4"} space-y-6`}>
      {isMobile && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Filter Options
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Price Range
        </h3>
        <div className="space-y-4">
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
              onChange={(e) =>
                handlePriceChange([
                  Number.parseInt(e.target.value) || 0,
                  priceRange[1],
                ])
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-pink-500 focus:border-pink-500"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange[1]}
              onChange={(e) =>
                handlePriceChange([
                  priceRange[0],
                  Number.parseInt(e.target.value) ||
                    filterOptions.price_range.max,
                ])
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Categories</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {filterOptions.categories && filterOptions.categories.length > 0 ? (
            filterOptions.categories.map((category: any) => (
              <div key={category.slug} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.slug}`}
                  checked={currentCategories.includes(category.slug)}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category.slug, checked as boolean)
                  }
                />
                <label
                  htmlFor={`category-${category.slug}`}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {category.name} ({category.count})
                </label>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No categories available</p>
          )}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Brands</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {filterOptions.brands && filterOptions.brands.length > 0 ? (
            filterOptions.brands.map((brand: any) => (
              <div key={brand.slug} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand.slug}`}
                  checked={currentBrands.includes(brand.slug)}
                  onCheckedChange={(checked) =>
                    handleBrandChange(brand.slug, checked as boolean)
                  }
                />
                <label
                  htmlFor={`brand-${brand.slug}`}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {brand.name} ({brand.count})
                </label>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No brands available</p>
          )}
        </div>
      </div>

      {/* Benefits */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Benefits</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {filterOptions.benefits && filterOptions.benefits.length > 0 ? (
            filterOptions.benefits.map((benefit: any) => (
              <div key={benefit.slug} className="flex items-center space-x-2">
                <Checkbox
                  id={`benefit-${benefit.slug}`}
                  checked={currentBenefits.includes(benefit.slug)}
                  onCheckedChange={(checked) =>
                    handleBenefitsChange(benefit.slug, checked as boolean)
                  }
                />
                <label
                  htmlFor={`benefit-${benefit.slug}`}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {benefit.name} ({benefit.count})
                </label>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No benefits available</p>
          )}
        </div>
      </div>

      {/* Made In */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Made In</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {filterOptions.made_in && filterOptions.made_in.length > 0 ? (
            filterOptions.made_in.map((item: any) => (
              <div key={item.slug} className="flex items-center space-x-2">
                <Checkbox
                  id={`madein-${item.slug}`}
                  checked={currentMadeIn.includes(item.slug)}
                  onCheckedChange={(checked) =>
                    handleMadeInChange(item.slug, checked as boolean)
                  }
                />
                <label
                  htmlFor={`madein-${item.slug}`}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {item.name} ({item.count})
                </label>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              No made in options available
            </p>
          )}
        </div>
      </div>

      {/* Type of Skins */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Type of Skins
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {filterOptions.type_of_skins &&
          filterOptions.type_of_skins.length > 0 ? (
            filterOptions.type_of_skins.map((skinType: any) => (
              <div key={skinType.slug} className="flex items-center space-x-2">
                <Checkbox
                  id={`skintype-${skinType.slug}`}
                  checked={currentSkinTypes.includes(skinType.slug)}
                  onCheckedChange={(checked) =>
                    handleTypeOfSkinsChange(skinType.slug, checked as boolean)
                  }
                />
                <label
                  htmlFor={`skintype-${skinType.slug}`}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {skinType.name} ({skinType.count})
                </label>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              No skin type options available
            </p>
          )}
        </div>
      </div>

      {/* Finish */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Finish</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {filterOptions.finish && filterOptions.finish.length > 0 ? (
            filterOptions.finish.map((finish: any) => (
              <div key={finish.slug} className="flex items-center space-x-2">
                <Checkbox
                  id={`finish-${finish.slug}`}
                  checked={currentFinishes.includes(finish.slug)}
                  onCheckedChange={(checked) =>
                    handleFinishChange(finish.slug, checked as boolean)
                  }
                />
                <label
                  htmlFor={`finish-${finish.slug}`}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {finish.name} ({finish.count})
                </label>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No finish options available</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 pt-4">
        <Button variant="outline" onClick={resetFilters} className="w-full">
          Reset Filters
        </Button>
        {isMobile && (
          <Button
            onClick={onClose}
            className="w-full bg-pink-500 hover:bg-pink-600"
          >
            Apply Filters
          </Button>
        )}
      </div>
    </div>
  );
}
