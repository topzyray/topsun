import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Key } from "react";

interface SchoolCarousel<T> {
  schoolDetails: T;
}

const SchoolCarousel = ({ schoolDetails }: SchoolCarousel<any>) => {
  if (!schoolDetails?.school_images?.length) return null;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <Slider {...settings} className="relative">
      {schoolDetails.school_images.map((image: { url: any }, index: Key | null | undefined) => (
        <div key={index} className="relative">
          <AspectRatio
            ratio={60 / 15}
            className="flex items-center justify-center bg-cover bg-center"
            style={{
              backgroundImage: `url(${image.url})`,
            }}
          >
            <div className="flex flex-col items-center justify-center gap-1">
              <Image
                src={schoolDetails?.logo?.url || "/default-logo.png"}
                alt={`${schoolDetails?.school_name} logo`}
                width={80}
                height={80}
                className="h-14 w-14 rounded-full shadow-lg sm:h-24 sm:w-24 lg:h-32 lg:w-32"
              />
              <h2 className="text-shadow text-2xl font-extrabold text-white capitalize sm:text-4xl lg:text-6xl">
                {schoolDetails?.school_name}
              </h2>
            </div>
          </AspectRatio>
        </div>
      ))}
    </Slider>
  );
};

export default SchoolCarousel;
