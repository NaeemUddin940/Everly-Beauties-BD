"use client";

import React from "react";
import Image from "next/image";
import Slider from "react-slick";
import { useQuery } from "@tanstack/react-query";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type ReviewData = {
  title: string;
  thumbnail_url: string;
  review_content: string;
};

type Slide = {
  CustomerName: string;
  CustomerImage: string;
  CustomerReview: string;
};

// Fetch and transform review data
const fetchReviews = async (): Promise<Slide[]> => {
  const response = await fetch("https://everlybeautiesbd.com/wp-json/custom/v1/influencers-reviews");

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: ReviewData[] = await response.json();

  return data.map((review) => ({
    CustomerName: review.title,
    CustomerImage: review.thumbnail_url,
    CustomerReview: review.review_content
      .replace(/&#8217;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\r\n/g, " ")
      .replace(/"/g, "")
      .trim(),
  }));
};

const GlamGurusReviews = () => {
  const {
    data: reviews = [],
    isLoading,
    isError,
  } = useQuery<Slide[], Error>({
    queryKey: ["glam-gurus-reviews"],
    queryFn: fetchReviews,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: (prev) => prev,
  });

  const settings = {
    dots: true,
    infinite: true,
    arrows: false,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    autoplay: !isLoading,
    autoplaySpeed: 3000,
    dotsClass: "slick-dots custom-dots",
    customPaging: (i: number) => (
      <div className="w-3 h-3 rounded-full bg-gray-300 hover:bg-[#E91E63] transition-colors duration-300 cursor-pointer"></div>
    ),
  };

  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-48 mx-auto mb-3"></div>
      <div className="w-[120px] h-[120px] bg-gray-300 rounded-full mx-auto mb-4"></div>
      <div className="max-w-xl mx-auto px-2 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6 mx-auto"></div>
        <div className="h-4 bg-gray-300 rounded w-4/5 mx-auto"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
      </div>
    </div>
  );

  return (
    <div className="w-full mt-3 mb-5 pb-5 relative overflow-hidden">
      <h2 className="text-center text-[#E91E63] font-semibold text-xl md:text-2xl mb-2">GLAM GURU'S REVIEWS</h2>
      <div className="w-16 h-[3px] bg-[#E91E63] mx-auto mb-8 rounded"></div>

      <style jsx global>{`
        .slick-dots {
          bottom: -15px !important;
        }
        .custom-dots {
          display: flex !important;
          justify-content: center !important;
          gap: 8px !important;
          list-style: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        .custom-dots li {
          margin: 0 !important;
          padding: 0 !important;
          width: auto !important;
          height: auto !important;
        }
        .custom-dots li div {
          width: 12px !important;
          height: 12px !important;
          border-radius: 50% !important;
          background-color: #d1d5db !important;
          transition: all 0.3s ease !important;
          cursor: pointer !important;
        }
        .custom-dots li.slick-active div {
          background-color: #E91E63 !important;
          transform: scale(1.2) !important;
        }
        .custom-dots li:hover div {
          background-color: #E91E63 !important;
          opacity: 0.7 !important;
        }
      `}</style>

      {isLoading && (
        <>
          <div className="py-8">
            <SkeletonLoader />
          </div>
          <div className="flex justify-center mt-6 space-x-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse"></div>
          </div>
        </>
      )}

      {isError && (
        <div className="text-center py-8 text-red-600">
          Failed to load reviews. Please try again later.
        </div>
      )}

      {!isLoading && !isError && reviews.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          No reviews available at the moment.
        </div>
      )}

      {!isLoading && !isError && reviews.length > 0 && (
        <Slider {...settings}>
          {reviews.map((slide, index) => (
            <div key={`${slide.CustomerName}-${index}`}>
              <h2 className="text-center text-black text-md font-semibold mb-3">{slide.CustomerName}</h2>
              <Image
                className="mx-auto text-center w-[120px] h-[120px] rounded-full mb-4 shadow-2xl object-cover"
                alt={slide.CustomerName}
                src={slide.CustomerImage}
                width={120}
                height={120}
                loading="lazy"
              />
              <p className="mx-auto text-center text-black text-md max-w-xl leading-relaxed px-2">
                {slide.CustomerReview}
              </p>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default GlamGurusReviews;