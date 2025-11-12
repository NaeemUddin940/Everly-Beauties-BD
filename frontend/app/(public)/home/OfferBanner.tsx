import React from "react";
import CampaignBannerImage from '@/app/assets/img/campaign_banner.png';
import Image from "next/image";

const OfferBanner = () => {
  return (
    <div className="my-5">

      <section className="bg-[#FCE8F3] rounded-lg flex flex-col md:flex-row items-center justify-between p-6 my-5 md:p-10">
        <div className="max-w-xl md:max-w-lg order-2 text-center md:text-left md:order-1">
          <p className="text-sm font-semibold text-[#9B1453] mb-1">
            Glamour Glow Cosmetics
          </p>
          <h2 className="text-[#9B1453] font-extrabold text-2xl md:text-3xl mb-2">
            UP TO 35% OFF
          </h2>
          <p className="text-[#6B7280] text-sm md:text-base mb-5">
            Discover our latest makeup collection with vibrant colors and
            long-lasting formulas to enhance your natural beauty.
          </p>
          <button
            className="bg-[#D6336C] text-white text-xs md:text-sm font-semibold px-5 py-2 rounded"
            type="button"
          >
            Shop Now
          </button>
        </div>
        <div className="mt-6 md:mt-0 flex-shrink-0 order-1 md:order-2">
          <Image
            alt="Makeup products"
            className="w-48 md:w-60 lg:w-72 object-contain"
            loading="lazy"
            src={CampaignBannerImage}
            width={300}
            height={400}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#F9D6E3] rounded-lg flex flex-col md:flex-row items-center justify-between p-6 md:p-10">
          <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-6">
            <Image
              alt="Pink lipstick tube with cap off showing the lipstick"
              className="w-40 md:w-48 object-contain"
              height={150}
              loading="lazy"
              src={CampaignBannerImage}
              width={200}
            />
          </div>
          <div className="max-w-xs md:max-w-sm text-center md:text-left">
            <p className="text-sm font-semibold text-[#9B1453] mb-1">
              Velvet Matte Lipstick
            </p>
            <h3 className="text-[#9B1453] font-extrabold text-xl md:text-2xl mb-1">
              Bold &amp; Beautiful
            </h3>
            <p className="text-[#D6336C] font-semibold mb-5">Flat 25% off</p>
            <button
              className="bg-[#D6336C] text-white text-xs md:text-sm font-semibold px-5 py-2 rounded"
              type="button"
            >
              Grab Now
            </button>
          </div>
        </div>

        <div className="bg-[#FCE8F3] rounded-lg flex flex-col md:flex-row items-center justify-between p-6 md:p-10">
          <div className="max-w-xs md:max-w-sm text-center md:text-left md:mr-6 order-2 md:order-1">
            <p className="text-sm font-semibold text-[#9B1453] mb-1">
              Radiant Blush Palette
            </p>
            <h3 className="text-[#9B1453] font-extrabold text-xl md:text-2xl mb-1">
              Glow Up Your Look
            </h3>
            <p className="text-[#6B7280] text-sm md:text-base mb-5">
              Soft, blendable shades that add a natural flush to your cheeks.
            </p>
            <button
              className="bg-[#D6336C] text-white text-xs md:text-sm font-semibold px-5 py-2 rounded"
              type="button"
            >
              Buy Now
            </button>
          </div>
          <div className="flex-shrink-0 mt-6 md:mt-0 order-1 md:order-2">
            <Image
              alt="Blush palette with multiple pink shades"
              className="w-40 md:w-48 object-contain"
              height={150}
              loading="lazy"
              src={CampaignBannerImage}
              width={200}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default OfferBanner;