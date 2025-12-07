/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { api } from "@/lib/axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { IoMdHeartEmpty } from "react-icons/io";
import QuickViewModal from "./QuickViewModal";

export interface Variation {
  _id: string;
  name: string;
  price?: number;
  stock?: number;
  [key: string]: any;
}

export interface ProductCardProps {
  slug: string;
  image: string;
  title: string;
  brand?: string;
  price: number;
  regularPrice?: number;
  campaignName?: string;
  variations?: Variation[];
  rating?: number | string;
  hasFreeShipping?: boolean;
  onAddToCart: (variation?: Variation) => void;
  onWishlistToggle: () => void;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  slug,
  image,
  title,
  brand,
  price,
  regularPrice = 0,
  campaignName,
  variations = [],
  rating,
  hasFreeShipping = false,
  onAddToCart,
  onWishlistToggle,
  className = "",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const discountPercentage =
    regularPrice > price && regularPrice > 0
      ? Math.round(((regularPrice - price) / regularPrice) * 100)
      : null;

  const numericRating = Number(rating) || 0;

  const handleAddToCartClick = () => {
    if (variations && variations.length > 0) {
      setIsModalOpen(true);
    } else {
      onAddToCart();
    }
  };
  console.log(api);
  return (
    <>
      <div
        className={`flex flex-col h-full border border-gray-200 bg-white rounded-lg shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 ${className}`}
      >
        {/* Campaign Name Badge & Wishlist */}
        <div className="relative overflow-hidden">
          {campaignName && (
            <div className="absolute top-2 left-2 bg-[rgb(226,82,140)] text-white text-xs font-medium md:font-bold px-2 py-0 md:py-1 rounded z-10">
              {campaignName}
            </div>
          )}

          <div className="absolute top-2 right-2 z-10">
            <button
              aria-label="Add to wishlist"
              className="text-gray-600 hover:text-black focus:outline-none"
              onClick={onWishlistToggle}
            >
              <IoMdHeartEmpty className="text-xl md:text-2xl" />
            </button>
          </div>

          {/* Product Image */}
          <Link href={`/products/${slug}`}>
            <Image
              src={ image}
              alt={title}
              width={430}
              height={430}
              className="w-full h-full object-cover cursor-pointer transition-opacity hover:opacity-90"
              unoptimized
            />
          </Link>

          {/* Badges */}
          {hasFreeShipping && (
            <div className="absolute bottom-2 left-2 z-10">
              <span className="text-xs font-md text-white bg-black px-2 py-0.5 rounded">
                FREE SHIPPING
              </span>
            </div>
          )}

          {numericRating > 0 && (
            <div className="absolute bottom-2 right-2 bg-[rgb(226,82,140)] flex items-center gap-0.5 px-1 md:px-2 rounded z-10 shadow">
              <FaStar className="text-amber-300 md:text-[18px]" />
              <span className="text-white text-[12px] md:text-[15px] font-md">
                {numericRating}
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col flex-1 px-2 pb-2 md:px-4 md:pb-4">
          <div className="flex-1">
            <span className="text-sm text-gray-600">
              {brand ? brand : "\u00A0"}
            </span>

            <Link
              href={`/products/${slug}`}
              className="block hover:text-pink-600 transition-colors"
            >
              <h1 className="text-sm font-semibold text-gray-800 leading-snug truncate">
                {title}
              </h1>
            </Link>

            {/* Price + Discount */}
            <div className="flex items-center space-x-2 md:mt-1">
              <span className="text-pink-600 font-bold text-sm md:text-[16px] font-lato">
                ৳ {price}
              </span>

              {regularPrice > price && (
                <>
                  <span className="text-gray-400 line-through text-sm font-semibold">
                    ৳ {regularPrice}
                  </span>

                  {discountPercentage !== null && (
                    <span className="text-green-600 text-sm font-semibold">
                      {discountPercentage}% off
                    </span>
                  )}
                </>
              )}
            </div>

            {variations.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {variations.length} variation
                {variations.length > 1 ? "s" : ""} available
              </p>
            )}
          </div>

          {/* Add to Cart */}
          <button
            className="w-full mt-1 md:mt-3 bg-[rgb(226,82,140)] hover:bg-[#D6336C] text-white text-xs md:text-sm font-semibold py-1 md:py-2 rounded transition-colors cursor-pointer"
            onClick={handleAddToCartClick}
          >
            ADD TO CART
          </button>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={{
          image,
          title,
          brand,
          price,
          rating: numericRating,
          variations,
        }}
        onAddToCart={(variation: any) => onAddToCart(variation)}
      />
    </>
  );
};

export default ProductCard;
