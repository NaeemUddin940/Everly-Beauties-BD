"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ProductCard from "@/app/components/common/ProductCard";
import ProductCardSkeleton from "@/app/components/common/ProductCardSkeleton";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Combobg from "@/app/assets/img/bg/apple-shopping-event-full-bg-opt.jpg";
import { useCart } from "@/app/context/cart-context";
import toast from "react-hot-toast";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// Product interface
interface ApiProduct {
  id: number;
  slug: string;
  title: string;
  price: string;
  regular_price: string;
  sale_price: string;
  image: string;
  brand: string;
  campaign_name: string;
  variations: any[];
  rating: number;
  hasFreeShipping: boolean;
}

// Fetch combo products
const fetchComboProducts = async (): Promise<ApiProduct[]> => {
  const res = await fetch(
    "https://everlybeautiesbd.com/wp-json/custom/v1/combo-products"
  );
  if (!res.ok) throw new Error("Failed to fetch combo products");
  return res.json();
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      className="absolute z-10 left-[-16px] md:left-[-20px] top-1/2 transform -translate-y-1/2 bg-white shadow-md bg-opacity-70 rounded-full flex items-center justify-center w-8 h-8 md:w-10 md:h-10 cursor-pointer"
      onClick={onClick}
    >
      <IoIosArrowBack className="text-pink-500 text-lg md:text-xl" />
    </div>
  );
};

const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      className="absolute z-10 right-[-16px] md:right-[-20px] top-1/2 transform -translate-y-1/2 bg-white shadow-md bg-opacity-70 rounded-full flex items-center justify-center w-8 h-8 md:w-10 md:h-10 cursor-pointer"
      onClick={onClick}
    >
      <IoIosArrowForward className="text-pink-500 text-lg md:text-xl" />
    </div>
  );
};

const ComboOffer = () => {
  const queryClient = useQueryClient();

  // Track if device is mobile (less than 768px)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["comboProducts"],
      queryFn: fetchComboProducts,
    });
  }, [queryClient]);

  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useQuery<ApiProduct[], Error>({
    queryKey: ["comboProducts"],
    queryFn: fetchComboProducts,
    staleTime: 0,
    cacheTime: 0,
    keepPreviousData: false,
    refetchOnWindowFocus: true,
  });

  const { addItem } = useCart();

  const handleAddToCart = useCallback(
    (product: ApiProduct, variation?: any) => {
      addItem({
        id: product.id,
        slug: product.slug,
        image: product.image,
        title: product.title,
        brand: product.brand,
        price: Number(product.price),
        regularPrice: Number(product.regular_price),
        variation: variation,
      });
      toast.success("Product added to cart successfully");
    },
    [addItem]
  );

  const handleWishlistToggle = (productId: number) => {
    console.log(`Wishlist toggled: ${productId}`);
  };

  const settings = {
    dots: false,
    infinite: true,
    arrows: !isMobile,
    slidesToShow: 4,
    swipeToSlide: true,
    centerMode: false,
    prevArrow: !isMobile ? <PrevArrow /> : undefined,
    nextArrow: !isMobile ? <NextArrow /> : undefined,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <div>
      <div
        className="rounded-xl mx-auto mt-5 py-4 px-4"
        style={{ backgroundImage: `url(${Combobg.src})` }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-center text-[#9b1453] font-semibold text-xl md:text-2xl mb-2 font-[Inter]">
              Combo Offer
            </h2>
            <div className="w-16 h-[3px] bg-[#9b1453] mb-5 rounded" />
          </div>
          <Link
            href={"/combo-offers"}
            className="flex items-center gap-x-1 shadow bg-white hover:bg-gray-200 px-3 py-1.5 rounded-[20px]"
          >
            <span className="text-xs sm:text-base text-black">see all</span>
            <svg
              className="hidden sm:block"
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M1 6H11M6 1L11 6L6 11"
                stroke="black"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        <div>
          {isLoading ? (
            <Slider {...settings}>
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="px-1 pb-2 md:px-2 md:pb-3">
                  <ProductCardSkeleton />
                </div>
              ))}
            </Slider>
          ) : isError ? (
            <div className="bg-red-50 p-4 rounded-lg text-red-600">
              <p>Failed to load combo offers: {error.message}</p>
            </div>
          ) : (
            <Slider {...settings}>
              {products.map((product) => (
                <div key={product.id} className="px-1 pb-2 md:px-2 md:pb-3">
                  <ProductCard
                    id={product.id}
                    slug={product.slug}
                    image={product.image}
                    title={product.title}
                    brand={product.brand}
                    price={parseFloat(product.price)}
                    regularPrice={parseFloat(product.regular_price)}
                    campaignName={product.campaign_name}
                    variations={product.variations}
                    rating={product.rating}
                    hasFreeShipping={product.hasFreeShipping}
                    onAddToCart={() => handleAddToCart(product)}
                    onWishlistToggle={() => handleWishlistToggle(product.id)}
                  />
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComboOffer;
