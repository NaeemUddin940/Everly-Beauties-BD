"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface BannerType {
  _id: string;
  bannerTitle: string;
  bannerSlug: string;
  eventLink: string;
  bannerDescription: string;
  banner4xImage: string;
}

const fetchBanners = async (): Promise<BannerType[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/banners-4x`
  );
  if (!res.ok) throw new Error("Failed to fetch banners");
  return res.json();
};

const Banner: React.FC = () => {
  const [loaded, setLoaded] = useState<boolean[]>([]);

  const {
    data: banners = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["banners-4x"],
    queryFn: fetchBanners,
    staleTime: 0,
    cacheTime: 0,
    keepPreviousData: false,
    refetchOnWindowFocus: true,
  });

  const handleLoad = (index: number) => {
    setLoaded((prev) => {
      const newLoaded = [...prev];
      newLoaded[index] = true;
      return newLoaded;
    });
  };

  if (isLoading) {
    return (
      <div className="w-full py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-full sm:w-[48%] md:w-[23%] aspect-[16/9] bg-gray-300 animate-pulse rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-6">
        Failed to load banners.
      </div>
    );
  }

  return (
    <div className="w-full py-4">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-4">
        {banners.map((banner, index) => (
          <Link
            key={banner?._id}
            href={banner?.eventLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-[48%] md:w-[23%] relative aspect-[16/9] rounded-lg overflow-hidden shadow-md block"
          >
            {!loaded[index] && (
              <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-lg" />
            )}

            <Image
              src={banner?.banner4xImage}
              alt={banner?.bannerTitle}
              fill
              className={`transition-opacity duration-500 ${
                loaded[index] ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => handleLoad(index)}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Banner;
