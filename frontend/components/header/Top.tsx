import Marquee from "react-fast-marquee";
import Container from "../common/Container";

function Top() {
  return (
    <div>
      {/* Marquee Section */}
      <div className="bg-pink-600">
        <Container>
          <Marquee speed={80} gradient={false}>
            <p className="text-white py-2 text-[18px]">
              ঈদ Mega Sale - 🚚 ফ্রি ডেলিভারি সারা বাংলাদেশে (ন্যূনতম ২টি পণ্য
              এবং ৬০০৳ অর্ডারে) । সাথে থাকছে আরও অতিরিক্ত ৫% ডিসকাউন্ট (সর্বোচ্চ
              ২৫০৳ পর্যন্ত) কোপনঃ EID2025
            </p>
          </Marquee>
        </Container>
      </div>
    </div>
  );
}

export default Top;
