"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import ProductCard from "../../common/ProductCard"
import { useCart } from "@/app/context/cart-context"
import toast from "react-hot-toast"

// Types
interface Variation {
  id: string | number
  name: string
  image: string
  price?: number
  regular_price?: string
  sale_price?: string
  attributes?: Record<string, string>
}

interface Product {
  id: number
  slug: string
  title: string
  category: string
  price: number
  originalPrice?: number
  regular_price: number
  sale_price?: number
  brand: string
  image: string
  hasFreeShipping: boolean
  variations: Variation[]
  rating: number
  saleLabel?: string
  campaign_name?: string
  campaign_subtitle?: string
  campaign_description?: string
  discount_percent?: string
}

interface Subcategory {
  id: string
  label: string
  count?: number
}

interface Category {
  label: string
  slug: string
  description?: string
  subcategories: Subcategory[]
  products: Product[]
}

interface CategoriesData {
  [key: string]: Category
}

// API fetch functions
const fetchCategories = async (): Promise<CategoriesData> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`)
  if (!res.ok) throw new Error("Failed to fetch categories")
  return res.json()
}

const fetchCategoryProducts = async (slug: string): Promise<Product[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/${slug}`)
  if (!res.ok) throw new Error("Failed to fetch category products")
  const data = await res.json()
  return data.products || []
}

const fetchSubcategoryProducts = async (parent: string, sub: string): Promise<Product[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/${parent}/${sub}`)
  if (!res.ok) throw new Error("Failed to fetch subcategory products")
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

// Component
export default function ProductCategoryTabs() {
  const { addItem } = useCart()
  const PRODUCTS_PER_PAGE = 4

  const [activeParentCategory, setActiveParentCategory] = useState("")
  const [activeSubcategory, setActiveSubcategory] = useState("")
  const [displayCounts, setDisplayCounts] = useState<{ [key: string]: number }>({})

  const { data: categories = {}, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  })

  // Initialize first active tab
  useEffect(() => {
    if (categories && Object.keys(categories).length && !activeParentCategory) {
      const firstKey = Object.keys(categories)[0]
      setActiveParentCategory(firstKey)
      const firstSub = categories[firstKey].subcategories.find((s) => s.count && s.count > 0)
      if (firstSub) {
        setActiveSubcategory(firstSub.id)
      } else {
        setActiveSubcategory("")
      }
    }
  }, [categories, activeParentCategory])

  const currentCategory = categories[activeParentCategory]

  const {
    data: products = [],
    isLoading: productsLoading,
  } = useQuery({
    queryKey: ["products", activeParentCategory, activeSubcategory || null],
    queryFn: async () => {
      if (currentCategory) {
        if (activeSubcategory) {
          return fetchSubcategoryProducts(currentCategory.slug, activeSubcategory)
        }
        if (currentCategory.products?.length > 0) {
          return currentCategory.products
        }
        return fetchCategoryProducts(currentCategory.slug)
      }
      return []
    },
    enabled: !!currentCategory,
    keepPreviousData: true,
  })

  const cacheKey = useMemo(() => {
    if (!currentCategory) return ""
    return activeSubcategory
      ? `${currentCategory.slug}/${activeSubcategory}`
      : currentCategory.slug
  }, [currentCategory, activeSubcategory])

  const currentDisplayCount = displayCounts[cacheKey] || PRODUCTS_PER_PAGE
  const displayedProducts = products.slice(0, currentDisplayCount)

  const handleParentCategoryChange = (key: string) => {
    setActiveParentCategory(key)
    const firstSub = categories[key].subcategories.find((s) => s.count && s.count > 0)
    setActiveSubcategory(firstSub ? firstSub.id : "")
  }

  const handleSubcategoryChange = (id: string) => {
    setActiveSubcategory(id)
  }

  const handleLoadMore = () => {
    setDisplayCounts((prev) => ({
      ...prev,
      [cacheKey]: (prev[cacheKey] || PRODUCTS_PER_PAGE) + PRODUCTS_PER_PAGE,
    }))
  }

  const hasMoreProducts = products.length > displayedProducts.length

  const handleAddToCart = useCallback(
    (product: Product, variation?: any) => {
      addItem({
        id: product.id,
        slug: product.slug,
        image: product.image,
        title: product.title,
        brand: product.brand,
        price: Number(product.sale_price),
        regularPrice: Number(product.regular_price),
        variation: variation,
      })
      toast.success("Product added to cart successfully")
    },
    [addItem]
  )

  if (categoriesLoading) {
    return (
      <div className="w-full mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          <span className="ml-2 text-gray-600">Loading categories...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full mx-auto md:bg-white rounded-lg md:shadow-sm overflow-hidden">
      {/* Parent Categories */}
      <div className="flex w-full overflow-x-auto">
        {Object.entries(categories).map(([key, category]) => (
          <button
            key={key}
            className={`flex-1 py-4 text-center cursor-pointer text-white font-medium transition-colors ${
              activeParentCategory === key
                ? "bg-pink-500"
                : "bg-pink-400 hover:bg-pink-500"
            }`}
            onClick={() => handleParentCategoryChange(key)}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Subcategories */}
      {currentCategory && currentCategory.subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4">
          {currentCategory.subcategories
            .filter((s) => s.count && s.count > 0)
            .map((s) => (
              <button
                key={s.id}
                className={`px-5 py-2 cursor-pointer rounded-full text-sm font-medium transition-colors ${
                  activeSubcategory === s.id
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => handleSubcategoryChange(s.id)}
              >
                {s.label} <span className="ml-1 text-xs">({s.count})</span>
              </button>
            ))}
        </div>
      )}

      {/* Products */}
      <div className="md:p-4">
        {productsLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
            <span className="ml-2 text-gray-600">Loading products...</span>
          </div>
        ) : displayedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
              {displayedProducts.map((product) => (
                <div
                  key={product?._id}
                  className="flex flex-col border border-gray-200 shadow-md transition-transform hover:[transform:translateY(-5px)] hover:shadow-lg rounded-lg overflow-hidden"
                >
                  <ProductCard
                    mainImage={product?.mainImage}
                    productName={product?.productName}
                    brands={product?.brands}
                    price={product?.price}
                    slug={product?.slug}
                    regularPrice={product?.regular_price}
                    campaignName={product?.saleLabel || product?.campaignName}
                    variations={product?.variations}
                    rating={product?.rating}
                    hasFreeShipping={product?.hasFreeShipping}
                    onAddToCart={() => handleAddToCart(product)}
                    onWishlistToggle={() => console.log("Toggle wishlist", product?._id)}
                  />
                </div>
              ))}
            </div>

            {hasMoreProducts && (
              <div className="flex justify-center mt-5 mb-2">
                <button
                  onClick={handleLoadMore}
                  className="px-4 py-2 cursor-pointer text-sm uppercase bg-white shadow-lg text-pink-600 font-medium rounded hover:bg-pink-600 transition-colors hover:text-white"
                >
                  Load More ({products.length - displayedProducts.length})
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}