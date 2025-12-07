"use client";
import Container from "@/components/common/Container";
import CampaignBanner from "@/components/home/CampaignBanner";
import ComboOffer from "@/components/home/ComboOffer";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HeroSlider from "@/components/home/HeroSlider";
import Slide_of_features from "@/components/home/Slide_of_features";
import TopCategoriesSlider from "@/components/home/TopCategoriesSlider";
import { useAuthStore } from "@/ZustandStore/useAuthStore";
import { useCategoryStore } from "@/ZustandStore/useCategoryStore";
import { useEffect } from "react";
import PublicLayout from "./(public)/layout";

export default function Page() {
  const { checkAuth } = useAuthStore();
  const { getAllCategory, getCategory } = useCategoryStore();

  useEffect(() => {
    checkAuth();
    getAllCategory();
  }, [checkAuth, getAllCategory]);

  return (
    <PublicLayout>
      <Container>
        <HeroSlider />
        <Slide_of_features />
        <CampaignBanner />
        <FeaturedProducts />
        <TopCategoriesSlider allCategories={getCategory} />
        {/* <Banner /> */}
        <ComboOffer />
        {/* <OfferBanner /> */}
        {/* <ProductCategoryTabs/> */}
        {/* <FeaturedBrands /> */}
        {/* <GlamGurusReviews /> */}
      </Container>
    </PublicLayout>
  );
}
