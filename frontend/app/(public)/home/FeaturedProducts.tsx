"use client";

import { useState, useCallback, useEffect } from "react";
import ProductCard from "@/app/components/common/ProductCard";
import ProductCardSkeleton from "@/app/components/common/ProductCardSkeleton";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useCart } from "@/app/context/cart-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// Product Interface
interface ApiProduct {
  _id: string;
  id?: number;
  slug: string;
  productName: string;
  price?: string;
  regularPrice: string;
  salePrice?: string;
  mainImage: string;
  brands?: string;
  campaign?: {
    campaignName: string;
    discount: number;
    finalPrice: number;
    status: "active" | "inactive";
    startDate: string;
    endDate: string;
    discountType: "percentage" | "fixed";
    thumbnailImage?: string;
  };
  variations?: Array<{
    id: number;
    price: string;
    regularPrice: string;
    salePrice?: string;
    mainImage?: string;
    attributes?: Record<string, string>;
  }>;
  rating?: number;
  hasFreeShipping?: boolean;
  permalink?: string;
  stockStatus?: "in-stock" | "out-of-stock";
  categories?: Array<{
    categoryName: string;
    slug: string;
  }>;
}

// Mapping for tabs
const categoryMapping: Record<string, string> = {
  "new-arrival": "NEW ARRIVAL",
  "best-selling": "BEST SELLING",
  "trending-now": "TRENDING NOW",
  "hot-offers": "HOT OFFERS",
};

const tabs = Object.entries(categoryMapping);

// API fetcher
async function fetchSpecialProducts(type: string): Promise<ApiProduct[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/special-product/${type}`,
    { next: { revalidate: 60 } }
  );
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
}

// Custom Arrows
const PrevArrow = ({ onClick }: any) => (
  <div
    className="absolute z-10 left-[-16px] md:left-[-20px] top-1/2 transform -translate-y-1/2 bg-white shadow-md bg-opacity-70 rounded-full flex items-center justify-center w-8 h-8 md:w-10 md:h-10 cursor-pointer"
    onClick={onClick}
  >
    <IoIosArrowBack className="text-pink-500 text-lg md:text-xl" />
  </div>
);

const NextArrow = ({ onClick }: any) => (
  <div
    className="absolute z-10 right-[-16px] md:right-[-20px] top-1/2 transform -translate-y-1/2 bg-white shadow-md bg-opacity-70 rounded-full flex items-center justify-center w-8 h-8 md:w-10 md:h-10 cursor-pointer"
    onClick={onClick}
  >
    <IoIosArrowForward className="text-pink-500 text-lg md:text-xl" />
  </div>
);

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState("new-arrival");
  const { addItem } = useCart();
  const queryClient = useQueryClient();
  const [showArrows, setShowArrows] = useState(true);

  // Responsive arrows
  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateArrows = () => setShowArrows(window.innerWidth >= 768);
      updateArrows();
      window.addEventListener("resize", updateArrows);
      return () => window.removeEventListener("resize", updateArrows);
    }
  }, []);

  // Preload next tab
  const preloadProducts = (type: string) => {
    queryClient.prefetchQuery({
      queryKey: ["special-products", type],
      queryFn: () => fetchSpecialProducts(type),
    });
  };

  // Query current tab products
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ["special-products", activeTab],
    queryFn: () => fetchSpecialProducts(activeTab),
  });

  // Add to cart with stock check
  const handleAddToCart = useCallback(
    (product: ApiProduct, variation?: any) => {
      if (product.stockStatus === "out-of-stock") {
        toast.error("Product is out of stock");
        return;
      }

      const priceToUse =
        product.campaign?.status === "active"
          ? product.campaign.finalPrice
          : Number(product.salePrice || product.regularPrice);

      addItem({
        id: product._id,
        slug: product.slug,
        mainImage: product.mainImage,
        productName: product.productName,
        brands: product.brands,
        price: priceToUse,
        regularPrice: Number(product.regularPrice),
        variation,
      });

      toast.success("Product added to cart successfully");
    },
    [addItem]
  );

  const handleWishlistToggle = (productId: string | number) => {
    console.log("Toggling wishlist for:", productId);
  };

  // Render tabs
  const renderTabs = () => (
    <div className="flex flex-wrap justify-center gap-4 mb-6">
      {tabs.map(([key, label]) => (
        <button
          key={key}
          onClick={() => setActiveTab(key)}
          onMouseEnter={() => preloadProducts(key)}
          className={`text-sm font-semibold px-6 py-2 rounded-md tracking-wide hover:bg-black hover:text-white transition-colors shadow cursor-pointer ${
            activeTab === key
              ? "bg-black text-white"
              : "bg-white text-black border border-gray-300"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );

 const sliderSettings = {
  dots: false,
  infinite: products.length > 1,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  prevArrow: showArrows && products.length > 1 ? <PrevArrow /> : null,
  nextArrow: showArrows && products.length > 1 ? <NextArrow /> : null,
  responsive: [
    { breakpoint: 1280, settings: { slidesToShow: Math.min(products.length, 3) } },
    { breakpoint: 1024, settings: { slidesToShow: Math.min(products.length, 2) } },
    { breakpoint: 768, settings: { slidesToShow: Math.min(products.length, 2), arrows: false } },
    { breakpoint: 480, settings: { slidesToShow: 1, arrows: false } },
  ],
};

  if (isLoading) {
    return (
      <div className="w-full mx-auto py-4">
        {renderTabs()}
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="px-1 pb-2 md:px-2 md:pb-3">
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full mx-auto py-4">
        {renderTabs()}
        <div className="text-center p-8 bg-red-50 rounded-md">
          <p className="text-red-500">{(error as Error).message || "Failed to load products"}</p>
          <button
            className="mt-4 px-4 py-2 cursor-pointer bg-black text-white rounded-md"
            onClick={() => refetch()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto py-4 relative">
      {renderTabs()}
      {products.length > 0 ? (
        <Slider {...sliderSettings}>
          {products.map((product) => {
            const priceToUse =
              product.campaign?.status === "active"
                ? product.campaign.finalPrice
                : Number(product.salePrice || product.regularPrice);

            return (
              <div key={product._id} className="px-1 pb-2 md:px-2 md:pb-3 h-[300px]">
                <ProductCard
                  {...product}
                  price={priceToUse}
                  regularPrice={Number(product.regularPrice)}
                  campaignName={product.campaign?.campaignName || ""}
                  rating={product.rating}
                  onAddToCart={() => handleAddToCart(product)}
                  onWishlistToggle={() => handleWishlistToggle(product._id)}
                  // Optional: pass discount for badge
                  discount={product.campaign?.status === "active" ? product.campaign.discount : undefined}
                />
              </div>
            );
          })}
        </Slider>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-md">
          <p className="text-gray-500">No products available in this category</p>
        </div>
      )}
    </div>
  );
}