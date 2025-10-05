import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import imageLists from "./image-data";
import Image from "next/image";

type ImageData = {
  image: string;
  name: string;
};

export default function ImageCarousel() {
  const [loadedImages, setLoadedImages] = useState<ImageData[]>([]);

  useEffect(() => {
    if (imageLists.length === 0) {
      return;
    }
    setLoadedImages(imageLists);
  }, []);
  return (
    <div className="w-[100vw] items-center bg-[#05123c]">
      {loadedImages.length === 0 ? (
        <p className="bg-green-900 text-center text-red-700">Loading images...</p>
      ) : (
        <Swiper
          modules={[Autoplay, FreeMode, Pagination]}
          spaceBetween={30}
          slidesPerView={3}
          autoplay={{
            delay: 2000, // No waiting time between slides
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={60000} // Super slow motion (10 seconds per full slide transition)
          allowTouchMove={false} // Prevent manual dragging
          cssMode={true}
          loop={true}
          className="mx-auto w-full max-w-[1280px]"
        >
          {imageLists.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-64 w-full">
                <Image
                  src={image.image}
                  alt={image.name}
                  layout="fill"
                  objectFit="cover"
                  className="w-[60vw]"
                />
                <p className="absolute bottom-0 bg-[#05123c] text-[10px] text-white uppercase md:text-[14px]">
                  {image.name}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
