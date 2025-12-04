import React from "react";

interface PriceDiscountSectionProps {
  salePrice: string;
  regularPrice: string;
}

const PriceDiscountSection: React.FC<PriceDiscountSectionProps> = ({
  salePrice,
  regularPrice,
}) => {
  const sale = parseFloat(salePrice);
  const regular = parseFloat(regularPrice);

  const discount = regular - sale;
  const savePercentage = (discount / regular) * 100;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-4">
        <span className="text-2xl font-bold">৳{sale.toFixed(2)}</span>
        {discount > 0 && (
          <>
            <span className="text-gray-400 line-through">৳{regular.toFixed(2)}</span>
            <span className="text-primary font-semibold">
              Save ৳{discount.toFixed(2)} ({savePercentage.toFixed(0)}% Off)
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default PriceDiscountSection;