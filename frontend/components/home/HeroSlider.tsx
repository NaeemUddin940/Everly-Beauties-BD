"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

interface Slide {
  id: string;
  slideBanner: string;
  sliderTitle: string;
  bannerLink?: string;
}

// Static data
const slides: Slide[] = [
  {
    id: "1",
    slideBanner:
      "https://images.unsplash.com/photo-1496594501676-1fd9b70a89b7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXw4NjEzODUwfHxlbnwwfHx8fHw%3D&auto=format&fit=crop&q=60&w=500",
    sliderTitle: "Spring Collection 2025",
    bannerLink: "/collection/spring",
  },
  {
    id: "2",
    slideBanner:
      "https://images.unsplash.com/photo-1553901753-215db344677a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8Mnw4NjEzODUwfHxlbnwwfHx8fHw%3D&auto=format&fit=crop&q=60&w=500",
    sliderTitle: "Summer Sale Up to 50%",
    bannerLink: "/sale/summer",
  },
  {
    id: "3",
    slideBanner:
      "https://images.unsplash.com/photo-1618783609530-e60ae69093a4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MTR8ODYxMzg1MHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=500",
    sliderTitle: "New Arrivals",
    bannerLink: "/new-arrivals",
  },
];

const HeroSlider: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    arrows: false,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    autoplay: true,
    autoplaySpeed: 3000,
    appendDots: (dots: React.ReactNode) => (
      <div>
        <ul className="pagination-style absolute bottom-15 inset-x-0 mx-auto flex justify-end text-center z-10 gap-1 shadow">
          {dots}
        </ul>
      </div>
    ),
  };

  // if (isLoading) return <p className="text-center py-10">Loading...</p>;
  // if (error)
  //   return (
  //     <p className="text-center py-10 text-red-500">Failed to load slides.</p>
  //   );

  return (
    <div className="w-full mt-3 relative overflow-hidden">
      <Slider {...settings}>
        {slides.map((slide: any, index: number) => (
          <Link
            key={slide?._id || index}
            href={slide?.bannerLink || "#"}
            className="relative block w-full"
          >
            <Image
              src={slide?.slideBanner}
              alt={slide?.sliderTitle || "Slide Banner"}
              width={1320}
              height={480}
              priority={index === 0}
              className="w-full md:aspect-[1320/480] object-cover rounded-[5px] shadow"
            />
          </Link>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSlider;
