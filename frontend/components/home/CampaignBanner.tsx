"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CampaignThumbnail {
  large: string;
  mobile: string;
  alt: string;
  link?: string;
}

interface Campaign {
  _id: string;
  campaignName: string;
  permalink: string;
  endDate: string;
  thumbnailImage: CampaignThumbnail;
}

interface Banner {
  _id: string;
}

// ✅ Static campaign data
const campaigns: Campaign[] = [
  {
    _id: "1",
    campaignName: "Winter Sale",
    permalink: "/campaigns/winter-sale",
    endDate: new Date(new Date().getTime() + 1 * 2 * 10 * 1000).toISOString(), // 2 days later
    thumbnailImage: {
      large: "/campaigns/winter-large.jpg",
      mobile: "/campaigns/winter-mobile.jpg",
      alt: "Winter Sale Banner",
    },
  },
  {
    _id: "2",
    campaignName: "Summer Bonanza",
    permalink: "/campaigns/summer-bonanza",
    endDate: new Date(
      new Date().getTime() + 5 * 24 * 3600 * 1000
    ).toISOString(),
    thumbnailImage: {
      large: "/campaigns/summer-large.jpg",
      mobile: "/campaigns/summer-mobile.jpg",
      alt: "Summer Bonanza Banner",
    },
  },
];

const banner: Banner = {
  _id: "2", // points to the first campaign
};

export default function CampaignBanner() {
  const campaign = campaigns.find((c) => c._id === banner._id) || null;

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!campaign) return;

    const targetDate = new Date(campaign.endDate);

    const updateCountdown = () => {
      const now = new Date();
      const diff = Math.max(0, targetDate.getTime() - now.getTime());
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [campaign]);

  if (!campaign) return null;

  const isExpired = new Date(campaign.endDate).getTime() < new Date().getTime();
  if (isExpired) return null;

  return (
    <div className="bg-white rounded-[5px] p-6 md:p-10 my-2 md:my-5 shadow">
      <Link
        href={campaign.permalink}
        className="flex flex-col md:flex-row items-center justify-between gap-8 py-5 px-2"
      >
        <div className="order-2 md:order-1 text-center md:text-left">
          <h1 className="text-2xl md:text-4xl font-semibold uppercase text-pink-600">
            {campaign.campaignName}
          </h1>

          <div className="grid grid-flow-col gap-2 text-center auto-cols-max justify-center md:justify-start mt-4">
            <CountdownBox label="days" value={timeLeft.days} />
            <CountdownBox label="hours" value={timeLeft.hours} />
            <CountdownBox label="min" value={timeLeft.minutes} />
            <CountdownBox label="sec" value={timeLeft.seconds} />
          </div>

          <button className="mt-6 bg-[rgb(226,82,140)] text-white px-8 py-2 rounded tracking-widest hover:bg-[#D6336C] transition shadow-lg cursor-pointer">
            SHOP NOW
          </button>
        </div>

        <Image
          src={campaign.thumbnailImage.large}
          alt={campaign.thumbnailImage.alt}
          className="hidden md:block order-1 md:order-2 text-center rounded-lg w-full max-w-[400px] object-cover"
          width={750}
          height={400}
          loading="lazy"
          placeholder="blur"
          blurDataURL="/placeholder.svg"
        />
      </Link>
    </div>
  );
}

function CountdownBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col p-2 bg-white rounded-lg shadow-lg text-black">
      <span className="font-mono text-3xl">
        {value.toString().padStart(2, "0")}
      </span>
      {label}
    </div>
  );
}
