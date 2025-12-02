/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";

import { api } from "@/lib/axios";
import { useCategoryStore } from "@/ZustandStore/useCategoryStore";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

// Custom Arrows
const PrevArrow = ({ onClick }: any) => (
  <div
    className="absolute z-10 -left-4 md:-left-6 top-1/2 transform -translate-y-1/2 bg-white shadow-md bg-opacity-70 rounded-full flex items-center justify-center w-8 h-8 md:w-10 md:h-10 cursor-pointer"
    onClick={onClick}
  >
    <IoIosArrowBack className="text-pink-500 text-lg md:text-xl" />
  </div>
);

const NextArrow = ({ onClick }: any) => (
  <div
    className="absolute z-10 -right-4 md:-right-6 top-1/2 transform -translate-y-1/2 bg-white shadow-md bg-opacity-70 rounded-full flex items-center justify-center w-8 h-8 md:w-10 md:h-10 cursor-pointer"
    onClick={onClick}
  >
    <IoIosArrowForward className="text-pink-500 text-lg md:text-xl" />
  </div>
);

export default function TopCategoriesSlider({
  allCategories,
}: {
  allCategories: any;
}) {
  const { isLoading, isError } = useCategoryStore();

  console.log(allCategories);

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

  const topCategories = allCategories?.categories?.filter(
    (cat: any) => cat.isFeaturedOnHomePage === true
  );

  console.log(topCategories);

  // Slider settings
  const sliderSettings = {
    dots: false,
    infinite: allCategories?.activeMainCategoryCount > 1,
    speed: 500,
    slidesToShow: Math.min(allCategories?.activeMainCategoryCount, 6),
    slidesToScroll: 1,
    prevArrow:
      allCategories?.activeMainCategoryCount > 6 ? <PrevArrow /> : null,
    nextArrow:
      allCategories?.activeMainCategoryCount > 6 ? <NextArrow /> : null,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(allCategories?.activeMainCategoryCount, 5),
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(allCategories?.activeMainCategoryCount, 4),
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(allCategories?.activeMainCategoryCount, 3),
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: Math.min(allCategories?.activeMainCategoryCount, 2),
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

      {allCategories?.categories?.length > 0 ? (
        <Slider {...sliderSettings}>
          {topCategories.map((category: any) => (
            <div key={category?._id} className="px-2">
              <div className="flex flex-col items-center">
                <Link href={`/category/${category?.slug}`}>
                  <div className="bg-white rounded-full shadow w-[100px] h-[100px] md:w-[120px] md:h-[120px] relative flex items-center justify-center mb-3 cursor-pointer hover:scale-105 transition-transform duration-300">
                    <div className="bg-[#FCE7EE] rounded-full w-[85px] h-[85px] md:w-[100px] md:h-[100px] flex items-center justify-center overflow-hidden">
                      <Image
                        src={api + category?.image}
                        alt={category?.name}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                        unoptimized
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
