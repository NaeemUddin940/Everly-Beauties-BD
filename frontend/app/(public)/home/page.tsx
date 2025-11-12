import Container from "@/components/common/Container";
import Slide_of_features from "@/components/home/Slide_of_features";
import HeroSlider from "../../../components/home/HeroSlider";

export default function page() {
  return (
    <div>
      <Container>
        <HeroSlider />
        <Slide_of_features />
      </Container>
    </div>
  );
}
