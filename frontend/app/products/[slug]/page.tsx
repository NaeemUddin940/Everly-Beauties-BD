/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import PublicLayout from "@/app/(public)/layout";
import Container from "@/components/common/Container";
import AddToCart from "@/components/ProductPage/AddToCart";
import CampaignSaleTimer from "@/components/ProductPage/CampaignSaleTimer";
import PriceDiscountSection from "@/components/ProductPage/Price&DiscountSection";
import ProductImageGallery from "@/components/ProductPage/ProductImageGallery";
import ProductTabsNavigation from "@/components/ProductPage/ProductTabsNavigation";
import RecommendedProductsGrid from "@/components/ProductPage/RecommendedProductsCarousel";
import VariationSelector from "@/components/ProductPage/VariationSelector";
import { useSimpleProductStore } from "@/ZustandStore/useSimpleProductStore";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

// type Product = {
//   id: number;
//   name: string;
//   slug: string;
//   description: string;
//   price: string;
//   sale_price: string;
//   regular_price: string;
//   hasFreeShipping: boolean;
//   isTopSelling: boolean;
//   salesLast72Hours: number;
//   images: { src: string }[];
//   type: string;
//   attributes: Array<{
//     id: number;
//     name: string;
//     slug: string;
//     options: string[];
//     position: number;
//     visible: boolean;
//     variation: boolean;
//   }>;
//   categories?: Array<{
//     id: number;
//     name: string;
//     slug: string;
//   }>;
//   meta_data?: Array<{
//     id: number;
//     key: string;
//     value: string;
//   }>;
//   full_variations?: Array<{
//     id: number;
//     name: string;
//     price: string;
//     regular_price: string;
//     sale_price: string;
//     image: string;
//   }>;
//   related_products?: Array<{
//     brand: string;
//     campaign_name: string;
//     hasFreeShipping: boolean;
//     id: number;
//     price: string;
//     slug: string;
//     regular_price: string;
//     title: string;
//     image: string;
//     rating: number;
//     variations: [
//       {
//         id: number;
//         attributes: object;
//         price: string;
//         regular_price: string;
//         sale_price: string;
//         image: string;
//       }
//     ];
//   }>;
// };

// // Fetch a single product
// async function getProductBySlug(slug: string): Promise<Product | null> {
//   const domain = "https://everlybeautiesbd.com";
//   const key = process.env.WC_CONSUMER_KEY!;
//   const secret = process.env.WC_CONSUMER_SECRET!;

//   const res = await fetch(`${domain}/wp-json/wc/v3/products?slug=${slug}`, {
//     headers: {
//       Authorization:
//         "Basic " + Buffer.from(`${key}:${secret}`).toString("base64"),
//     },
//     next: { revalidate: 60 },
//   });

//   if (!res.ok) return null;
//   const data = await res.json();
//   return data.length > 0 ? data[0] : null;
// }

// export async function generateStaticParams() {
//   const domain = "https://everlybeautiesbd.com";
//   const key = process.env.WC_CONSUMER_KEY!;
//   const secret = process.env.WC_CONSUMER_SECRET!;

//   const res = await fetch(`${domain}/wp-json/wc/v3/products?per_page=12`, {
//     headers: {
//       Authorization:
//         "Basic " + Buffer.from(`${key}:${secret}`).toString("base64"),
//     },
//   });

//   const products = await res.json();

//   return products.map((product: any) => ({
//     slug: product.slug,
//   }));
// }

export default function ProductPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { singleSimpleProduct, getSingleSimpleProductBySlug } =
    useSimpleProductStore();
  const { slug } = useParams();

  useEffect(() => {
    getSingleSimpleProductBySlug(slug);
  }, [getSingleSimpleProductBySlug, slug]);


  // If product not found, return a simple message
  if (!singleSimpleProduct) {
    return <div className="p-6">Product not found.</div>;
  }

  // const brandName =
  //   singleSimpleProduct?.attributes?.find(
  //     (attr) => attr.name.toLowerCase() === "brand"
  //   )?.options?.[0] || " ";

  const categories = singleSimpleProduct?.categories || [];

  const getMetaValue = (key: string): string => {
    return (
      singleSimpleProduct?.meta_data?.find((item:any) => item.key === key)?.value ||
      ""
    );
  };

  const campaignName = getMetaValue("campaign_name");
  const campaignEndDate = getMetaValue("_campaign_offer_end_date");

  const productId = singleSimpleProduct?.id;

  const ingredientsMetaData = singleSimpleProduct?.meta_data?.find(
    (meta:any) => meta.key === "ingredients"
  );
  const ingredientsContent = ingredientsMetaData?.value;

  const productTab = {
    description: singleSimpleProduct?.description,
    attributes: singleSimpleProduct?.attributes,
    ingredients: ingredientsContent,

    shippingInfo: `
      <p>For this product, we offer special gift wrapping for an additional ৳50.</p>
      <p>Please note that deliveries to remote areas may take 1-2 extra days.</p>
    `,

    reviews: [
      {
        username: "Tasnim A.",
        rating: 5,
        date: "April 15, 2025",
        comment:
          "Love this lip oil! The blueberry flavor is amazing and it keeps my lips hydrated all day. Will definitely purchase again!",
      },
      {
        username: "Rahima K.",
        rating: 4,
        date: "March 28, 2025",
        comment:
          "Great product for dry lips. I like the strawberry flavor the best. Would give 5 stars but the packaging could be improved.",
      },
    ],
  };

  const sale = parseFloat(singleSimpleProduct?.salePrice);
  const regular = parseFloat(singleSimpleProduct?.regularPrice);

  const discount = regular - sale;
  const savePercentage = (discount / regular) * 100;

  const allGalleryImages = singleSimpleProduct
    ? [singleSimpleProduct.productImage, ...singleSimpleProduct.galleryImages]
    : [];

  return (
    <PublicLayout>
      <Container className="mx-auto py-8">
        <div className="text-sm text-gray-500 mb-6 flex flex-wrap items-center gap-1">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>

          {categories.map((category: any) => (
            <React.Fragment key={category.id}>
              <span>/</span>
              <Link
                href={`/category/${category.slug}`}
                className="hover:text-primary"
              >
                {category.name}
              </Link>
            </React.Fragment>
          ))}

          <span>/</span>
          <span className="text-dark">{singleSimpleProduct?.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <ProductImageGallery
            mainImage={singleSimpleProduct?.productImage}
            images={allGalleryImages}
            productName={singleSimpleProduct?.name}
          />

          <div className="lg:w-1/2">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold tracking-wider text-gray-500">
                {singleSimpleProduct?.brand}
              </span>
              <div className="flex gap-2">
                {singleSimpleProduct?.isTopSelling && (
                  <span className="bg-primary text-white text-xs px-3 py-1 rounded-full !uppercase">
                    Top Selling
                  </span>
                )}
                <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full">
                  {savePercentage.toFixed(0)}% OFF
                </span>
              </div>
            </div>

            {campaignName && (
              <CampaignSaleTimer
                campaignName={campaignName}
                endDate={campaignEndDate}
                productId={productId}
              />
            )}

            <h1 className="text-lg font-semibold md:text-2xl mb-2">
              {singleSimpleProduct?.name}
            </h1>

            {singleSimpleProduct?.type === "variable" && (
              <VariationSelector
                variations={singleSimpleProduct?.full_variations}
              />
            )}

            <PriceDiscountSection
              salePrice={singleSimpleProduct?.salePrice}
              regularPrice={singleSimpleProduct?.regularPrice}
            />

            <AddToCart product={singleSimpleProduct} />

            {singleSimpleProduct?.hasFreeShipping && (
              <div className="border border-gray-100 rounded-xl p-4 mb-6 bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className="bg-primarylight p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Free Delivery</p>
                    <Link
                      href="#"
                      className="text-sm text-primary font-medium mt-1 inline-block"
                    >
                      Shipping & Delivery
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* <!-- Trust Badges --> */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <div className="bg-primarylight p-1 rounded">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium">100% Authentic</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <div className="bg-primarylight p-1 rounded">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium">Secure Checkout</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <div className="bg-primarylight p-1 rounded">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium">Easy Returns</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <div className="bg-primarylight p-1 rounded">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium">Cruelty-Free</span>
              </div>
            </div>

            {singleSimpleProduct?.salesLast72Hours > 0 && (
              <div className="flex items-center gap-3 bg-primarylight/30 border border-primarylight rounded-lg p-3 mb-8">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    🔥
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-primary">
                    <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-2.5 w-2.5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Fast selling!</p>
                  <p className="text-xs text-gray-600">
                    Purchased {singleSimpleProduct?.salesLast72Hours}+ times in
                    last 24 hours
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <ProductTabsNavigation product={productTab} />

        <RecommendedProductsGrid
          products={singleSimpleProduct?.related_products}
        />
      </Container>
    </PublicLayout>
  );
}
