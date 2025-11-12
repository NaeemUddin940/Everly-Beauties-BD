"use client";

import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const dummyFeatures = [
  {
    _id: "1",
    featureName: "Free Shipping",
    featuredImage:
      "https://images.unsplash.com/photo-1496594501676-1fd9b70a89b7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXw4NjEzODUwfHxlbnwwfHx8fHw%3D&auto=format&fit=crop&q=60&w=500",
  },
  {
    _id: "2",
    featureName: "24/7 Support",
    featuredImage:
      "https://images.unsplash.com/photo-1496594501676-1fd9b70a89b7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXw4NjEzODUwfHxlbnwwfHx8fHw%3D&auto=format&fit=crop&q=60&w=500",
  },
  {
    _id: "3",
    featureName: "Secure Payment",
    featuredImage:
      "https://images.unsplash.com/photo-1496594501676-1fd9b70a89b7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXw4NjEzODUwfHxlbnwwfHx8fHw%3D&auto=format&fit=crop&q=60&w=500",
  },
  {
    _id: "4",
    featureName: "Discount Offers",
    featuredImage:
      "https://images.unsplash.com/photo-1496594501676-1fd9b70a89b7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXw4NjEzODUwfHxlbnwwfHx8fHw%3D&auto=format&fit=crop&q=60&w=500",
  },
  {
    _id: "5",
    featureName: "Quality Products",
    featuredImage:
      "https://images.unsplash.com/photo-1496594501676-1fd9b70a89b7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXw4NjEzODUwfHxlbnwwfHx8fHw%3D&auto=format&fit=crop&q=60&w=500",
  },
  {
    _id: "6",
    featureName: "Easy Returns",
    featuredImage:
      "https://images.unsplash.com/photo-1496594501676-1fd9b70a89b7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXw4NjEzODUwfHxlbnwwfHx8fHw%3D&auto=format&fit=crop&q=60&w=500",
  },
];

export default function Slide_of_features() {
  const settings = {
    dots: false,
    infinite: true,
    arrows: false,
    speed: 1000,
    slidesToShow: 5,
    autoplay: true,
    slidesToScroll: 1,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2.3,
        },
      },
    ],
  };

  // if (isLoading) {
  //   return (
  //     <div className="my-2 md:my-5 border-0">
  //       <div className="flex gap-2 overflow-hidden">
  //         {Array.from({ length: 5 }).map((_, index) => (
  //           <div key={index} className="px-2 w-1/5 min-w-[200px] flex-shrink-0">
  //             <div className="skeleton h-10 w-full rounded"></div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }

  // if (isError) {
  //   console.error("Error fetching posts:", error);
  //   return (
  //     <div className="text-red-500 text-center my-2">
  //       Failed to load features.
  //     </div>
  //   );
  // }

  return (
    <div className="my-2 md:my-5 border-0">
      <Slider {...settings}>
        {dummyFeatures.map((item: any) => (
          <div
            key={item?._id}
            className="px-2 text-center outline-none focus:outline-none"
          >
            <Image
              src={item?.featuredImage}
              alt={item?.featureName}
              width={300}
              height={200}
              className="w-full h-auto object-cover rounded shadow"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
