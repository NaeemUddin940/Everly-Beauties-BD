"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/app/components/ui/skeleton";

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

// Fetch banner (just ID)
const fetchBanner = async (): Promise<Banner | null> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campaign-banner`);
  if (!res.ok) throw new Error("Failed to fetch banner");
  const data = await res.json();
  return data?.[0] || null;
};

// Fetch all campaigns
const fetchCampaigns = async (): Promise<Campaign[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/campaigns`);
  if (!res.ok) throw new Error("Failed to fetch campaigns");
  const data = await res.json();
  return data || [];
};

export default function CampaignBanner() {
  const { data: banner, isLoading: loadingBanner } = useQuery({
    queryKey: ["banner"],
    queryFn: fetchBanner,
  });

  const { data: campaigns = [], isLoading: loadingCampaigns } = useQuery({
    queryKey: ["campaigns"],
    queryFn: fetchCampaigns,
  });

  const campaign = banner ? campaigns.find((c) => c._id === banner._id) : null;

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!campaign) return;

    const targetDate = new Date(campaign?.endDate);

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

  const isLoading = loadingBanner || loadingCampaigns;
  const isExpired = campaign ? new Date(campaign?.endDate).getTime() < new Date().getTime() : true;

  // ⏳ Loading
  if (isLoading) {
    return (
      <div className="bg-white rounded-[5px] p-6 md:p-10 my-2 md:my-5 shadow">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-5 px-2">
          <div className="order-2 md:order-1 text-center md:text-left w-full md:w-1/2">
            <Skeleton className="h-10 w-3/4 mb-4 animate-pulse" />
            <Skeleton className="h-6 w-5/6 mb-6 animate-pulse" />
            <div className="py-5">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full mb-2 animate-pulse" />
              ))}
            </div>
            <div className="grid grid-flow-col gap-2 text-center auto-cols-max justify-center md:justify-start mb-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-16 animate-pulse" />
              ))}
            </div>
            <Skeleton className="h-10 w-32 mt-6 animate-pulse" />
          </div>
          <Skeleton className="hidden md:block order-1 md:order-2 h-[300px] w-full max-w-[400px] rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  // ❌ যদি কোনো ক্যাম্পেইন না থাকে বা টাইম শেষ হয়ে যায় → হাইড
  if (!campaign || isExpired) return null;

  return (
    <div className="bg-white rounded-[5px] p-6 md:p-10 my-2 md:my-5 shadow">
      <Link
        href={campaign?.permalink || "#"}
        className="flex flex-col md:flex-row items-center justify-between gap-8 py-5 px-2"
      >
        <div className="order-2 md:order-1 text-center md:text-left">
          <h1 className="text-2xl md:text-4xl font-[600] uppercase text-pink-600">
            {campaign?.campaignName}
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
          src={campaign?.thumbnailImage}
          alt={campaign?.campaignName}
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
      <span className="font-mono text-3xl">{value.toString().padStart(2, "0")}</span>
      {label}
    </div>
  );
}
