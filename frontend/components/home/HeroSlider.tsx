"use client";

import image from "@/public/images.png";
import { useHeroSliderStore } from "@/ZustandStore/useHeroSliderStore";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

interface Slide {
  id: string;
  sliderImage: string;
  sliderTitle: string;
  sliderLink?: string;
}

const HeroSlider: React.FC = ({}) => {
  const { getAllSlides, allSlides } = useHeroSliderStore();

  useEffect(() => {
    getAllSlides();
  }, [getAllSlides]);

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
        <ul className="pagination-style absolute bottom-7 px-2 right-0 py-1 rounded-2xl border-2 mx-auto flex justify-end text-center z-10 gap-1 shadow">
          {dots}
        </ul>
      </div>
    ),
  };

  return (
    <div className="w-full mt-3 relative overflow-hidden">
      <Slider {...settings}>
        {allSlides.map((slide: any, index: number) => (
          <div key={slide?._id}>
            {slide.sliderImage ? (
              <Link
                href={slide.sliderLink || "#"}
                className="relative block w-full"
              >
                <Image
                  src={slide.sliderImage || image}
                  alt={slide.sliderTitle || "Slide Banner"}
                  width={1320}
                  height={480}
                  priority={slide.order === 1}
                  className="w-full md:aspect-1320/480 object-cover rounded-[5px] shadow"
                />
              </Link>
            ) : (
              <div className="relative block w-full">
                <Image
                  src={image}
                  alt={slide.sliderTitle || "Slide Banner"}
                  width={100}
                  height={100}
                  priority={slide.order === 1}
                  className="w-full md:aspect-1320/480 object-cover rounded-[5px] shadow"
                />
              </div>
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSlider;
