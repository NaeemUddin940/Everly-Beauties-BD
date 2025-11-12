"use client";

import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useQuery } from "@tanstack/react-query";
import getFeaturesPost from "../../../../../lib/getFeaturesPost";

export default function Slide_of_features() {
  const {
    data: posts = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["features-posts"],
    queryFn: getFeaturesPost,
    staleTime: 0,
    cacheTime: 0,
    keepPreviousData: false,
    refetchOnWindowFocus: true,
  });

  const settings = {
    dots: false,
    infinite: true,
    arrows: false,
    speed: 1000,
    slidesToShow: 5,
    slidesToScroll: 1,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2.3,
        },
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="my-2 md:my-5 border-0">
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="px-2 w-1/5 min-w-[200px] flex-shrink-0">
              <div className="skeleton h-10 w-full rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    console.error("Error fetching posts:", error);
    return (
      <div className="text-red-500 text-center my-2">
        Failed to load features.
      </div>
    );
  }

  return (
    <div className="my-2 md:my-5 border-0">
      <Slider {...settings}>
        {posts.map((item: any) => (
          <div
            key={item?._id}
            className="px-2 text-center outline-none focus:outline-none"
          >
            <Image
              src={item?.featuredImage}
              alt={item?.featureName}
              width={300}
              height={200}
              className="w-full h-auto object-cover rounded shadow"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
