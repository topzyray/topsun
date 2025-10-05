import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import imageLists from "./image-data";
import Image from "next/image";

export default function AutoPlay() {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3, // On large screens
    slidesToScroll: 1,
    autoplay: true,
    speed: 9000,
    autoplaySpeed: 2000,
    cssEase: "linear",
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="h-full w-[100vw] items-center bg-[#05123c]">
      {" "}
      {/* <Slider> */}
      <Slider {...settings}>
        {imageLists.map((item, index) => (
          <div
            key={index}
            // className="card-container h-[400px] p-6 rounded-lg shadow-md mx-4 bg-gray-50"
            className="rounded border p-4"
          >
            {/* <p className="h-[60%]">{item.name}</p> */}
            <div
              // className="flex items-center gap-2 mt-[40px]"
              className="h-24 w-[40%] items-center sm:h-52 sm:w-52"
              style={{ marginRight: 20, width: 200 }}
            >
              <Image
                // className="h-full w-full"
                className="h-full w-full items-center object-center pl-10"
                src={item.image}
                alt={item.name + "image"}
                width={150}
                height={150}
                sizes="(max-width: 1080px) 100vw"
                // layout="fill"
                // objectFit="cover"
              />
              <p className="ml-5 text-lg font-bold text-red-700 md:text-xl">{item.name}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
