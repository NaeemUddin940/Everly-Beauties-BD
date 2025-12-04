/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Filter } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

// ... (Rest of your imports remain the same)
import { AppliedFilters } from "@/components/product/applied-filters";
import { Modal } from "@/components/product/custom-modal";
import { Select } from "@/components/product/custom-select";
import {
  BrandFilterDropdown,
  CategoryFilterDropdown,
  PriceFilterDropdown,
} from "@/components/product/filter-dropdown";
import { FilterDropdownSkeleton } from "@/components/product/filter-dropdown-skeleton";
import { FilterSidebar } from "@/components/product/filter-sidebar";
import { Pagination } from "@/components/product/pagination";
import { ProductSkeleton } from "@/components/product/product-skeleton";
import type { ApiResponse, FilterState, Product } from "@/types/product";

import Container from "@/components/common/Container";
import ProductCard from "@/components/common/ProductCard";
import { useCart } from "@/components/context/cart-context";
import { Button } from "@/components/product/custom-button";
import { useSimpleProductStore } from "@/ZustandStore/useSimpleProductStore";
import toast from "react-hot-toast";

export default function ShopPage() {
  const { getAllSimpleProduct, allSimpleProduct, isLoading, isError } =
    useSimpleProductStore();

  // Local state for presentation/filter options (derived from allSimpleProduct)
  const [apiData, setApiData] = useState<ApiResponse | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    page: 1,
    per_page: 12,
  });
  const { addItem } = useCart();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Helper function to convert object with numeric keys to array
  const convertToArray = useCallback((data: any) => {
    if (Array.isArray(data)) {
      return data;
    }
    if (data && typeof data === "object") {
      const keys = Object.keys(data);
      if (keys.length > 0 && keys.every((key) => !isNaN(Number(key)))) {
        return Object.values(data);
      }
    }
    return [];
  }, []);

  // --- 1. Fetching Data using Filters (CLEANED) ---
  useEffect(() => {
    // When filters change, trigger the fetch with the current filters.
    // The `isLoading` state from the store will manage the loading UI.
    getAllSimpleProduct();

    // Dependencies: filters (to re-fetch on change) and getAllSimpleProduct (stability).
    // Removed the problematic local state variables (isInitialLoad, isProductsLoading, isLoading) from the deps.
  }, [getAllSimpleProduct, convertToArray]);

  // --- 2. Observing Store Data Changes and Mapping to Local State (THE KEY FIX) ---
  useEffect(() => {
    // This runs AFTER the store state (allSimpleProduct) has been updated.
    if (allSimpleProduct && Object.keys(allSimpleProduct).length > 0) {
      const normalizedData = {
        ...allSimpleProduct,
        products: Array.isArray(allSimpleProduct.products)
          ? allSimpleProduct.products
          : allSimpleProduct.simpleProducts || [], // Use simpleProducts if 'products' is missing

        // Ensure filter options are always present for rendering filter components
        filter_options: {
          ...allSimpleProduct.filter_options,
          categories: convertToArray(
            allSimpleProduct.filter_options?.categories
          ),
          brands: convertToArray(allSimpleProduct.filter_options?.brands),
          price_range: allSimpleProduct.filter_options?.price_range || {
            min: 0,
            max: 5000,
          },
        },
        sorting_options: allSimpleProduct.sorting_options || {
          menu_order: "Default sorting",
          popularity: "Sort by popularity",
          rating: "Sort by average rating",
          date: "Sort by latest",
          price: "Sort by price: low to high",
          "price-desc": "Sort by price: high to low",
        },
      };

      setApiData(normalizedData);
    } else if (allSimpleProduct?.simpleProducts?.length === 0) {
      setApiData(null); // Clear data if store returns empty array
    }
  }, [allSimpleProduct, convertToArray]);

  // --- 3. Filter/Sort/Page Handlers (Remain the same) ---
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters({ ...newFilters, page: 1 });
  }, []);

  const handleSortChange = useCallback((sortValue: string) => {
    const [orderby, order] = sortValue.includes("-desc")
      ? [sortValue.replace("-desc", ""), "DESC"]
      : [sortValue, "ASC"];

    setFilters((prev) => ({
      ...prev,
      orderby,
      order,
      page: 1,
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      page: 1,
      per_page: 12,
    });
  }, []);

  // Handle wishlist toggle
  const handleWishlistToggle = useCallback((productId: number) => {
    console.log("Toggle wishlist:", productId);
  }, []);

  // Convert product data for card display (CRITICAL FIX RETAINED)
  const convertProductForCard = useCallback((product: Product) => {
    const brand =
      product.categories && product.categories.length > 0
        ? product.categories[0]
        : "";

    // Create slug from permalink or fallback to product ID
    let slug = `product-${product.id}`;
    if (product.permalink) {
      const urlParts = product.permalink.split("/");
      const lastPart =
        urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
      if (lastPart && lastPart !== "") {
        slug = lastPart;
      }
    }

    let finalPrice = 0;
    let finalRegularPrice = undefined;

    // Price logic...
    if (
      product.salePrice &&
      product.salePrice !== "" &&
      product.salePrice !== "0"
    ) {
      finalPrice = Number.parseFloat(product.salePrice);

      if (
        product.regularPrice &&
        product.regularPrice !== "" &&
        product.regularPrice !== "0"
      ) {
        const regPrice = Number.parseFloat(product.regularPrice);
        if (regPrice > finalPrice) {
          finalRegularPrice = regPrice;
        }
      }
    } else if (
      product.regularPrice &&
      product.regularPrice !== "" &&
      product.regularPrice !== "0"
    ) {
      finalPrice = Number.parseFloat(product.regularPrice);
    } else if (product.price && product.price !== "" && product.price !== "0") {
      finalPrice = Number.parseFloat(product.price);
    }

    if (isNaN(finalPrice) || finalPrice <= 0) {
      finalPrice = 0;
    }

    let rating = 0;
    if (product.average_rating) {
      const parsedRating = Number.parseFloat(product.average_rating.toString());
      if (!isNaN(parsedRating)) {
        rating = parsedRating;
      }
    }

    // ⭐ CRITICAL FIX RETAINED: Ensure image is a valid absolute URL string.
    // const safeImage =
    //   typeof product.image === "string" &&
    //   product.image.trim() !== "" &&
    //   (product.image.startsWith("http") || product.image.startsWith("https"))
    //     ? product.image
    //     : "https://via.placeholder.com/300x300?text=No+Image"; // Fallback Placeholder

    return {
      id: product.id,
      slug: slug,
      image: product.productImage, // 👈 USING THE GUARANTEED SAFE IMAGE URL
      title: product.name,
      brand: brand,
      price: finalPrice,
      regular_price: finalRegularPrice,
      campaign_name: product.campaign_name || "",
      variations: [],
      rating: rating,
      // hasFreeShipping: product.hasFreeShipping,
    };
  }, []);

  const handleAddToCart = useCallback(
    (product: Product, variation?: any) => {
      const convertedProduct = convertProductForCard(product);

      addItem({
        id: convertedProduct.id,
        slug: convertedProduct.slug,
        image: convertedProduct.image,
        title: convertedProduct.title,
        brand: convertedProduct.brand,
        price: convertedProduct.price,
        regularPrice: convertedProduct.regular_price,
        variation: variation,
      });
      toast.success("Product added to cart successfully");
    },
    [addItem, convertProductForCard]
  );

  // Memoize sort options
  const sortOptions = useMemo(() => {
    if (!apiData?.sorting_options) return [];
    return Object.entries(apiData.sorting_options).map(([key, label]) => ({
      value: key,
      label: label,
    }));
  }, [apiData?.sorting_options]);

  // --- 4. Render Logic ---

  // Combine data source for rendering
  const productsToRender = allSimpleProduct?.simpleProducts || [];
  const productCount = apiData?.total || productsToRender.length;
  const totalPages = apiData?.total_pages || 0;
  const currentPage = apiData?.current_page || 1;

  // Use store loading state for initial load check
  if (isLoading) {
    return (
      <Container>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:hidden mb-6 flex items-center justify-between border-b border-gray-200 pb-4 animate-pulse">
            <div className="bg-gray-200 rounded w-20 h-8"></div>
            <div className="bg-gray-200 rounded w-48 h-8"></div>
          </div>
          <main className="w-full">
            <div className="hidden lg:flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
              <FilterDropdownSkeleton />
              <div className="bg-gray-200 rounded w-48 h-8 animate-pulse"></div>
            </div>
            <div className="mb-4 animate-pulse">
              <div className="bg-gray-200 rounded w-48 h-4"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          </main>
        </div>
      </Container>
    );
  }

  // Use store error state
  if (isError) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading products</p>
            <Button
              onClick={() => getAllSimpleProduct(filters)} // Call the store action directly
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  // No data state
  if (!apiData || productCount === 0) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No products found</p>
            <p className="text-gray-500 mb-6">
              Try adjusting your filters or search criteria
            </p>
            <Button onClick={clearAllFilters} variant="outline">
              Clear All Filters
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter Button and Sort */}
        <div className="lg:hidden mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
          <Button
            variant="outline"
            onClick={() => setIsFilterModalOpen(true)}
            className="inline-flex items-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>

          <Select
            options={sortOptions}
            value={filters.orderby || "menu_order"}
            onValueChange={handleSortChange}
            placeholder="Sort by: Featured"
            className="w-48"
          />
        </div>

        {/* Mobile Filter Modal */}
        <Modal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          title="Filter Options"
        >
          <FilterSidebar
            filterOptions={apiData.filter_options}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClose={() => setIsFilterModalOpen(false)}
            isMobile={true}
          />
        </Modal>

        {/* Main Content */}
        <main className="w-full">
          {/* Desktop Filter Bar */}
          <div className="hidden lg:flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
            <div className="flex items-center space-x-4 flex-wrap">
              <span className="text-sm font-medium text-gray-700">
                Filter by:
              </span>
              <PriceFilterDropdown
                filterOptions={apiData.filter_options}
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
              {apiData.filter_options.categories &&
                apiData.filter_options.categories.length > 0 && (
                  <CategoryFilterDropdown
                    filterOptions={apiData.filter_options}
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                  />
                )}
              {apiData.filter_options.brands &&
                apiData.filter_options.brands.length > 0 && (
                  <BrandFilterDropdown
                    filterOptions={apiData.filter_options}
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                  />
                )}
            </div>

            <Select
              options={sortOptions}
              value={filters.orderby || "menu_order"}
              onValueChange={handleSortChange}
              placeholder="Sort by: Featured"
              className="w-48"
            />
          </div>

          {/* Applied Filters */}
          <AppliedFilters
            filters={filters}
            filterOptions={apiData.filter_options}
            onFiltersChange={handleFiltersChange}
            onClearAll={clearAllFilters}
          />

          {/* Results Count */}
          <div className="mb-4">
            {isLoading ? (
              <div className="bg-gray-200 rounded w-48 h-4 animate-pulse"></div>
            ) : (
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * 12 + 1} -{" "}
                {Math.min(currentPage * 12, productCount)} of {productCount}{" "}
                results
              </p>
            )}
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : productsToRender.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
              {productsToRender.map((product: any) => {
                const convertedProduct = convertProductForCard(product);
                console.log(convertedProduct);
                return (
                  <div key={product.id} className="px-1 pb-2 md:px-2 md:pb-3">
                    <ProductCard
                      id={convertedProduct.id}
                      slug={convertedProduct.slug}
                      image={convertedProduct.image}
                      title={convertedProduct.title}
                      brand={convertedProduct.brand}
                      price={convertedProduct.price}
                      regularPrice={convertedProduct.regular_price}
                      campaignName={convertedProduct.campaign_name}
                      variations={convertedProduct.variations}
                      rating={convertedProduct.rating}
                      // hasFreeShipping={convertedProduct.hasFreeShipping}
                      onAddToCart={() => handleAddToCart(product)}
                      onWishlistToggle={() => handleWishlistToggle(product.id)}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">No products found</p>
              <p className="text-gray-500 mb-6">
                Try adjusting your filters or search criteria
              </p>
              <Button onClick={clearAllFilters} variant="outline">
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && productCount > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>
    </Container>
  );
}
