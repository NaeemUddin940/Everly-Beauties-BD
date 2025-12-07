"use client";

import combobg from "@/assets/img/bg/apple-shopping-event-full-bg-opt.jpg";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import ProductCard from "../common/ProductCard";
import ProductCardSkeleton from "../common/ProductCardSkeleton";
import { useCart } from "../context/cart-context";

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

// Dummy data only - no fetch calls
const dummyProducts: ApiProduct[] = [
  {
    id: 1,
    slug: "combo-skincare-set-1",
    title: "Premium Skincare Combo Pack",
    price: "2499",
    regular_price: "3499",
    sale_price: "2499",
    image: "../../assets/img/products/1-1-430x430.webp",
    brand: "DermaCare",
    campaign_name: "Summer Special",
    variations: [],
    rating: 4.5,
    hasFreeShipping: true,
  },
  {
    id: 2,
    slug: "makeup-combo-set",
    title: "Complete Makeup Kit",
    price: "1899",
    regular_price: "2599",
    sale_price: "1899",
    image: "../../assets/img/products/1-3-430x430.webp",
    brand: "Glamour",
    campaign_name: "Combo Offer",
    variations: [],
    rating: 4.2,
    hasFreeShipping: true,
  },
  {
    id: 3,
    slug: "hair-care-bundle",
    title: "Hair Care Essential Bundle",
    price: "1799",
    regular_price: "2299",
    sale_price: "1799",
    image: "../../assets/img/products/1-430x430.webp",
    brand: "HairLux",
    campaign_name: "Hair Festival",
    variations: [],
    rating: 4.7,
    hasFreeShipping: false,
  },
  {
    id: 4,
    slug: "fragrance-combo",
    title: "Perfume Collection Set",
    price: "3299",
    regular_price: "4599",
    sale_price: "3299",
    image: "../../assets/img/products/aurora-amore-430x430.webp",
    brand: "Scentify",
    campaign_name: "Luxury Combo",
    variations: [],
    rating: 4.8,
    hasFreeShipping: true,
  },
  {
    id: 5,
    slug: "face-wash-toner-combo",
    title: "Face Wash & Toner Combo",
    price: "899",
    regular_price: "1299",
    sale_price: "899",
    image: "../../assets/img/products/evle-430x430.webp",
    brand: "PureSkin",
    campaign_name: "Daily Care",
    variations: [],
    rating: 4.3,
    hasFreeShipping: true,
  },
  {
    id: 6,
    slug: "body-lotion-combo",
    title: "Body Lotion Trio Pack",
    price: "1499",
    regular_price: "1999",
    sale_price: "1499",
    image: "../../assets/img/products/glitter-primer-430x430.webp",
    brand: "BodyBliss",
    campaign_name: "Winter Special",
    variations: [],
    rating: 4.4,
    hasFreeShipping: false,
  },
];

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
  // Track if device is mobile (less than 768px)
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for 1 second
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { addItem } = useCart();

  const handleAddToCart = useCallback(
    (product: ApiProduct, variation?: any) => {
      // Validate and fix image URL if needed
      let imageUrl = product.image;
      if (imageUrl.startsWith("../../")) {
        // Convert relative path to absolute or use a placeholder
        imageUrl = "https://picsum.photos/400/400"; // Fallback image
      }

      addItem({
        id: product.id,
        slug: product.slug,
        image: imageUrl,
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
    toast.success("Added to wishlist");
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
        style={{ backgroundImage: `url(${combobg.src})` }}
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
          ) : (
            <>
              {/* Notification for demo data */}
              <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                <p>Showing demo combo offers</p>
              </div>

              <Slider {...settings}>
                {dummyProducts.map((product) => (
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComboOffer;
