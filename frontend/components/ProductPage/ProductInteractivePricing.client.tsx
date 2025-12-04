'use client';

import { useAppSelector } from '@/app/hooks';
import VariationSelector from './VariationSelector';
import PriceDiscountSection from './Price&DiscountSection';

interface ProductInteractivePricingProps {
  product: {
    type: string;
    full_variations?: Array<{
      id: number;
      price: string;
      regular_price: string;
      sale_price: string;
      image: string;
    }>;
    price: string;
    regular_price: string;
  };
}

export default function ProductInteractivePricing({
  product
}: ProductInteractivePricingProps) {
  const { currentPrice, currentRegularPrice } = useAppSelector(
    (state) => state.product
  );

  return (
    <>
      {product?.type === 'variable' && product.full_variations && (
        <VariationSelector 
          variations={product.full_variations} 
        />
      )}

      <PriceDiscountSection 
        salePrice={currentPrice || product.price} 
        regularPrice={currentRegularPrice || product.regular_price}
      />
    </>
  );
}