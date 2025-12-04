"use client";

import { addHours, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";

interface CampaignSaleTimerProps {
  campaignName: string;
  endDate: string;
  productId: string | number;
}

const CampaignSaleTimer: React.FC<CampaignSaleTimerProps> = ({
  campaignName,
  endDate,
  productId,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    actualDays: 0,
    displayDays: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    showDays: true,
  });

  // Adjust the endDate to Bangladesh time and calculate the time left
  useEffect(() => {
    if (!endDate) return;

    const adjustToBangladeshTime = (date: Date) => {
      return addHours(date, 6);
    };

    const calculateTimeLeft = () => {
      const now = adjustToBangladeshTime(new Date());
      const endDateObj = adjustToBangladeshTime(parseISO(endDate));

      const difference = endDateObj.getTime() - now.getTime();

      if (difference <= 0) {
        return {
          actualDays: 0,
          displayDays: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
          showDays: false,
        };
      }

      const actualDays = Math.floor(difference / (1000 * 60 * 60 * 24));
      const displayDays = actualDays + 1;
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return {
        actualDays,
        displayDays: displayDays.toString().padStart(2, "0"),
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
        showDays: displayDays > 0,
      };
    };

    // Update immediately
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (
    timeLeft.actualDays <= 0 &&
    timeLeft.hours === "00" &&
    timeLeft.minutes === "00" &&
    timeLeft.seconds === "00"
  ) {
    return null;
  }

  return (
    <div
      className={`campaign-timer-${productId} flex items-center justify-between bg-primary/5 p-3 rounded-lg mb-4`}
    >
      <span className="text-md font-semibold text-primary">{campaignName}</span>
      <div className="flex items-center gap-1">
        {timeLeft.showDays && (
          <div className={`countdown-segment px-2 cm_day_${productId}`}>
            <div className="text-center">
              <div
                className={`text-xl font-bold bg-white rounded-md py-1 px-2 shadow-timer cam-days-${productId}`}
              >
                {timeLeft.displayDays}
              </div>
              <div className="text-xs text-gray-500 mt-1">DAYS</div>
            </div>
          </div>
        )}
        <div className="countdown-segment px-2">
          <div className="text-center">
            <div
              className={`text-xl font-bold bg-white rounded-md py-1 px-2 shadow-timer cam-hours-${productId}`}
            >
              {timeLeft.hours}
            </div>
            <div className="text-xs text-gray-500 mt-1">HRS</div>
          </div>
        </div>
        <div className="countdown-segment px-2">
          <div className="text-center">
            <div
              className={`text-xl font-bold bg-white rounded-md py-1 px-2 shadow-timer cam-minutes-${productId}`}
            >
              {timeLeft.minutes}
            </div>
            <div className="text-xs text-gray-500 mt-1">MINS</div>
          </div>
        </div>
        <div className="countdown-segment px-2">
          <div className="text-center">
            <div
              className={`text-xl font-bold bg-white rounded-md py-1 px-2 shadow-timer cam-seconds-${productId}`}
            >
              {timeLeft.seconds}
            </div>
            <div className="text-xs text-gray-500 mt-1">SECS</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignSaleTimer;
