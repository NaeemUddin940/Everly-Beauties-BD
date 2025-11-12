"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BiSolidOffer } from "react-icons/bi";
import {
  FaEye,
  FaHandsWash,
  FaMagic,
  FaPalette,
  FaSprayCan,
} from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

interface NavigationItem {
  label: string;
  icon?: React.ReactNode;
  href: string;
  children?: NavigationItem[];
}

const Navigation = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isSliderReady, setIsSliderReady] = useState(false);
  const pathname = usePathname();
  const sliderRef = useRef<Slider>(null);

  // Menu items with proper icons for categories
  const menuItems: NavigationItem[] = [
    {
      label: "All Products",
      icon: null,
      href: "/products",
    },
    {
      label: "Face Makeup",
      icon: <FaPalette className="text-pink-400" />,
      href: "/face-makeup",
      children: [
        {
          label: "Blush, Highlighter & Contour",
          href: "/face-makeup/blush-highlighter-contour",
        },
        { label: "Concealer", href: "/face-makeup/concealer" },
        { label: "Foundation", href: "/face-makeup/foundation" },
        { label: "Loose Powder", href: "/face-makeup/loose-powder" },
        { label: "Pressed Powder", href: "/face-makeup/pressed-powder" },
        { label: "Primer", href: "/face-makeup/primer" },
        { label: "Setting Spray", href: "/face-makeup/setting-spray" },
      ],
    },
    {
      label: "Eye Makeup",
      icon: <FaEye className="text-blue-400" />,
      href: "/eye-makeup",
      children: [
        { label: "Eye Primer", href: "/eye-makeup/eye-primer" },
        { label: "Eyebrow", href: "/eye-makeup/eyebrow" },
        { label: "Eyelash", href: "/eye-makeup/eyelash" },
        { label: "Eyelash Glue", href: "/eye-makeup/eyelash-glue" },
        { label: "Eyeliner", href: "/eye-makeup/eyeliner" },
        { label: "Eyeshadow", href: "/eye-makeup/eyeshadow" },
        { label: "Mascara", href: "/eye-makeup/mascara" },
      ],
    },
    {
      label: "Lip Makeup",
      icon: "👄",
      href: "/lip-makeup",
      children: [
        { label: "Lip Gloss", href: "/lip-makeup/lip-gloss" },
        { label: "Lip Liner", href: "/lip-makeup/lip-liner" },
        { label: "Lipstick", href: "/lip-makeup/lipstick" },
        { label: "Liquid Lipstick", href: "/lip-makeup/liquid-lipstick" },
      ],
    },
    {
      label: "Makeup Tools",
      icon: <FaMagic className="text-purple-400" />,
      href: "/makeup-tools",
      children: [
        { label: "Curler", href: "/makeup-tools/curler" },
        { label: "Makeup Brushes", href: "/makeup-tools/makeup-brushes" },
        { label: "Sponge", href: "/makeup-tools/sponge" },
      ],
    },
    {
      label: "Hair Care Shop",
      icon: <FaSprayCan className="text-green-400" />,
      href: "/hair-care",
      children: [
        { label: "Hair Mask", href: "/hair-care/hair-mask" },
        { label: "Hair Oil", href: "/hair-care/hair-oil" },
        { label: "Shampoo", href: "/hair-care/shampoo" },
        { label: "Tools", href: "/hair-care/tools" },
      ],
    },
    {
      label: "Skin Care Shop",
      icon: <FaHandsWash className="text-blue-300" />,
      href: "/skin-care",
      children: [
        { label: "Face Mask", href: "/skin-care/face-mask" },
        { label: "Face Wash", href: "/skin-care/face-wash" },
        { label: "Makeup Remover", href: "/skin-care/makeup-remover" },
        { label: "Moisturizer", href: "/skin-care/moisturizer" },
        { label: "Serum", href: "/skin-care/serum" },
        { label: "Sunscreen", href: "/skin-care/sunscreen" },
        { label: "Toner", href: "/skin-care/toner" },
        { label: "Tools", href: "/skin-care/tools" },
      ],
    },
    {
      label: "Combo",
      icon: <BiSolidOffer className="text-black" />,
      href: "/combo",
    },
  ];

  // Slick slider settings
  const settings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 12,
    slidesToScroll: 1,
    arrows: true,
    variableWidth: true,
    swipeToSlide: true,
    draggable: true,
    initialSlide: 0,
    centerMode: false,
    centerPadding: "0px",
    lazyLoad: "progressive",
    waitForAnimate: false,
    focusOnSelect: true,
    onInit: () => {
      setIsSliderReady(true);
    },
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 10,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 8,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 6,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSliderReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleMouseEnter = (item: NavigationItem) => {
    if (item.children && item.children.length > 0) {
      setActiveMenu(item.label);
    }
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  // Get the current active menu item
  const activeMenuItem = menuItems.find((item) => item.label === activeMenu);

  return (
    <nav className="w-full bg-white relative">
      <div className="w-full">
        <div
          className={`nav-menu-slider pb-1 ${
            !isSliderReady
              ? "opacity-0"
              : "opacity-100 transition-opacity duration-300"
          }`}
        >
          <Slider ref={sliderRef} {...settings}>
            {menuItems.map((item, index) => (
              <div key={index} className="px-2">
                <Link
                  href={item.href}
                  className={`flex items-center justify-center gap-x-1 px-3 py-2 text-xs sm:text-sm capitalize whitespace-nowrap rounded-[20px] transition-colors duration-200 ${
                    pathname === item.href
                      ? "text-pink-500 bg-pink-50"
                      : "text-gray-700 hover:text-pink-500 hover:bg-pink-50"
                  }`}
                  onMouseEnter={() => handleMouseEnter(item)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item.icon && <span className="text-sm">{item.icon}</span>}
                  <span>{item.label}</span>
                </Link>
              </div>
            ))}
          </Slider>
        </div>

        {/* Fallback placeholder shown while slider initializes */}
        {!isSliderReady && (
          <div className="flex justify-center items-center h-[30px] space-x-2 pb-2">
            <div className="animate-pulse bg-gray-200 rounded-[20px] h-8 w-24"></div>
            <div className="animate-pulse bg-gray-200 rounded-[20px] h-8 w-24"></div>
            <div className="animate-pulse bg-gray-200 rounded-[20px] h-8 w-24"></div>
          </div>
        )}

        {/* Dynamic mega menu dropdown */}
        {activeMenuItem &&
          activeMenuItem.children &&
          activeMenuItem.children.length > 0 && (
            <div
              className="absolute left-0 right-0 bg-white shadow-lg z-50 rounded-b-xl"
              onMouseEnter={() => setActiveMenu(activeMenuItem.label)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-2">
                    {activeMenuItem.icon && (
                      <span className="text-2xl">{activeMenuItem.icon}</span>
                    )}
                    <h3 className="font-semibold text-xl">
                      {activeMenuItem.label}
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {activeMenuItem.children.map((child, index) => (
                      <Link
                        key={index}
                        href={child.href}
                        className="block px-4 py-2 rounded-lg text-gray-600 hover:text-pink-500 hover:bg-pink-50 transition-colors text-[16px]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>

      <style jsx>{`
        .nav-menu-slider {
          width: 100%;
          position: relative;
        }

        /* Prevent layout shift during initialization */
        .nav-menu-slider :global(.slick-initialized) {
        }

        /* Hide slider until it's ready */
        .nav-menu-slider:not(:global(.slick-initialized)) {
          visibility: hidden;
        }

        .nav-menu-slider :global(.slick-list) {
          margin: 0;
        }

        .nav-menu-slider :global(.slick-track) {
          margin: 0;
        }

        .nav-menu-slider :global(.slick-prev),
        .nav-menu-slider :global(.slick-next) {
          width: 25px;
          height: 25px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          z-index: 1;
        }

        .nav-menu-slider :global(.slick-prev:before),
        .nav-menu-slider :global(.slick-next:before) {
          color: #e60076;
          font-size: 20px;
          opacity: 0.75;
        }

        .nav-menu-slider :global(.slick-prev:hover:before),
        .nav-menu-slider :global(.slick-next:hover:before) {
          opacity: 1;
        }

        .nav-menu-slider :global(.slick-disabled) {
          display: none !important;
        }

        .nav-menu-slider :global(.slick-prev) {
          left: 0;
        }

        .nav-menu-slider :global(.slick-next) {
          right: 0;
        }

        .nav-menu-slider :global(.slick-slide) {
          width: auto !important;
          margin: 0 5px;
        }

        .nav-menu-slider :global(.slick-track) {
          display: flex;
          align-items: center;
        }

        .nav-menu-slider :global(.slick-list) {
          overflow: hidden;
        }

        @media (max-width: 1024px) {
          .nav-menu-slider :global(.slick-list) {
            margin: 0 20px;
          }
        }

        @media (max-width: 768px) {
          .nav-menu-slider :global(.slick-list) {
            margin: 0 10px;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navigation;
