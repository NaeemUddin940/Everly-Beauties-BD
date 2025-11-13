import Container from "@/components/common/Container";
import HeroSlider from "@/components/home/HeroSlider";
import Slide_of_features from "@/components/home/Slide_of_features";
import PublicLayout from "./(public)/layout";

export default function page() {
  return (
    <PublicLayout>
      <Container>
        <HeroSlider />
        <Slide_of_features />
      </Container>
    </PublicLayout>
  );
}
