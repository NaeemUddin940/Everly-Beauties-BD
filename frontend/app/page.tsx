"use client";
import Container from "@/components/common/Container";
import HeroSlider from "@/components/home/HeroSlider";
import Slide_of_features from "@/components/home/Slide_of_features";
import { useAuthStore } from "@/ZustandStore/useAuthStore";
import { useEffect } from "react";
import PublicLayout from "./(public)/layout";

export default function Page() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return (
    <PublicLayout>
      <Container>
        <HeroSlider />
        <Slide_of_features />
      </Container>
    </PublicLayout>
  );
}
