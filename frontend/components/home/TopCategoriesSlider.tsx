"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import { useQuery } from "@tanstack/react-query";
import getTopCategories from "../../../../../lib/getTopCategories";
import getCategories from "../../../../../lib/getCategories";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom Arrows
const PrevArrow = ({ onClick }: any) => (
  <div
    className="absolute z-10 left-[-16px] md:left-[-24px] top-1/2 transform -translate-y-1/2 bg-white shadow-md bg-opacity-70 rounded-full flex items-center justify-center w-8 h-8 md:w-10 md:h-10 cursor-pointer"
    onClick={onClick}
  >
    <IoIosArrowBack className="text-pink-500 text-lg md:text-xl" />
  </div>
);

const NextArrow = ({ onClick }: any) => (
  <div
    className="absolute z-10 right-[-16px] md:right-[-24px] top-1/2 transform -translate-y-1/2 bg-white shadow-md bg-opacity-70 rounded-full flex items-center justify-center w-8 h-8 md:w-10 md:h-10 cursor-pointer"
    onClick={onClick}
  >
    <IoIosArrowForward className="text-pink-500 text-lg md:text-xl" />
  </div>
);

export default function TopCategoriesSlider() {
  const {
    data: topCategories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["topCategories"],
    queryFn: getTopCategories,
    staleTime: 0,
    cacheTime: 0,
    keepPreviousData: false,
    refetchOnWindowFocus: true,
  });

  const { data: allCategories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 0,
    cacheTime: 0,
    keepPreviousData: false,
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-3">
        <h2 className="text-center text-[#E91E63] font-semibold text-xl md:text-2xl mb-2 font-[Inter]">
          Shop by Categories
        </h2>
        <div className="w-16 h-[3px] bg-[#E91E63] mx-auto mb-8 rounded"></div>
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center w-[100px]">
              <div className="skeleton w-full aspect-square rounded-full mb-2"></div>
              <div className="skeleton h-4 w-20 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-3 text-center text-red-500">
        <p>Failed to load categories. Please try again later.</p>
      </div>
    );
  }

  const matchedCategories = allCategories.filter((cat: any) =>
    topCategories.some((top: any) => top?._id === cat?._id)
  );

  // Slider settings
  const sliderSettings = {
    dots: false,
    infinite: matchedCategories.length > 1,
    speed: 500,
    slidesToShow: Math.min(matchedCategories.length, 6),
    slidesToScroll: 1,
    prevArrow: matchedCategories.length > 6 ? <PrevArrow /> : null,
    nextArrow: matchedCategories.length > 6 ? <NextArrow /> : null,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: Math.min(matchedCategories.length, 5) },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: Math.min(matchedCategories.length, 4) },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(matchedCategories.length, 3),
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: Math.min(matchedCategories.length, 2),
          arrows: false,
        },
      },
    ],
  };

  return (
    <div className="container mx-auto py-8 relative">
      <h2 className="text-center text-[#E91E63] font-semibold text-xl md:text-2xl mb-2 font-[Inter]">
        Shop by Categories
      </h2>
      <div className="w-16 h-[3px] bg-[#E91E63] mx-auto mb-8 rounded"></div>

      {matchedCategories.length > 0 ? (
        <Slider {...sliderSettings}>
          {matchedCategories.map((category: any) => (
            <div key={category?._id} className="px-2">
              <div className="flex flex-col items-center">
                <Link href={`/category/${category?.slug}`}>
                  <div className="bg-white rounded-full shadow w-[100px] h-[100px] md:w-[120px] md:h-[120px] relative flex items-center justify-center mb-3 cursor-pointer hover:scale-105 transition-transform duration-300">
                    <div className="bg-[#FCE7EE] rounded-full w-[85px] h-[85px] md:w-[100px] md:h-[100px] flex items-center justify-center overflow-hidden">
                      <Image
                        src={category?.categoryImage}
                        alt={category?.categoryName}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                        priority
                      />
                    </div>
                  </div>
                  <span className="text-[12px] md:text-[14px] font-semibold text-[#4B3B2B] text-center px-1 block">
                    {category?.categoryName}
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <div className="text-center text-gray-500 bg-gray-50 py-6 rounded-md">
          No categories available.
        </div>
      )}
    </div>
  );
}