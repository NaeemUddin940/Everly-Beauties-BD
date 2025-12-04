/* eslint-disable react-hooks/refs */
"use client";

import WishlistShareButtons from "@/components/ProductPage/WishlistShareButtons";
import { api } from "@/lib/axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// interface ProductImage {
//   src: string;
//   alt?: string;
// }

interface ProductImageGalleryProps {
  images: string[];
  mainImage: string;
  productName: string;
}

export default function ProductImageGallery({
  images,
  mainImage,
  productName,
}: ProductImageGalleryProps) {
  const [mainImageState, setMainImageState] = useState(mainImage);

  const swiperRef = useRef<SwiperType | null>(null);
  const navigationPrevRef = useRef<HTMLButtonElement>(null);
  const navigationNextRef = useRef<HTMLButtonElement>(null);

  // Return null if no images are provided
  if (!images || images.length === 0) {
    return null;
  }

  const handleThumbnailClick = (image: string, index: number) => {
    setMainImageState(image);

    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };

  return (
    <div className="flex flex-col md:w-[50%]">
      {/* Main Image Display */}
      <div className="relative mb-4 rounded-xl overflow-hidden w-full aspect-square bg-gray-50">
        <WishlistShareButtons />
        <Image
          src={api + mainImageState}
          alt={productName}
          className="w-full h-full object-contain"
          width={800}
          height={800}
          unoptimized
        />
      </div>

      {/* Thumbnail Gallery - Only show if there are multiple images */}
      {images.length > 0 && (
        <div className="w-full relative">
          <Swiper
            modules={[Navigation]}
            slidesPerView={4}
            spaceBetween={10}
            navigation={{
              prevEl: navigationPrevRef.current,
              nextEl: navigationNextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            breakpoints={{
              320: { slidesPerView: 4 },
              640: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
            }}
            className="px-1!"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index} className="max-w-20 md:max-w-40">
                <button
                  onClick={() => handleThumbnailClick(image, index)}
                  className={`block w-full aspect-square rounded-lg overflow-hidden transition-all my-3 ${
                    mainImageState === image
                      ? "border-2 border-primary scale-105"
                      : "border border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Image
                    src={api + image}
                    alt={`${productName} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    width={100}
                    height={100}
                    quality={80}
                    unoptimized
                  />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Arrows - Only show if there are more than 4 images */}
          {images.length > 4 && (
            <>
              <button
                ref={navigationPrevRef}
                className="absolute left-0 cursor-pointer top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                ref={navigationNextRef}
                className="absolute right-0 cursor-pointer top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
