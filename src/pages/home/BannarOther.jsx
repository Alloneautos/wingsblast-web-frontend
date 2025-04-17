import { Link } from "react-router-dom";
import BannarImage1 from "../../assets/bannarimage/wbannar1.jpeg";
import BannarImage2 from "../../assets/bannarimage/wbannar2.jpeg";
import BannarImage3 from "../../assets/bannarimage/wbannar3.jpeg";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Button } from "@headlessui/react";

const BannarOther = () => {
  const slides = [
    {
      image: BannarImage1,
      title: "Your journey to incredible teste begins here",
      description:
        "We know one flavor does not fit all, that is why we perfected 30 of them. Your next flavor obsession starts with just one click.",
      link: "/food-menu",
    },
    {
      image: BannarImage2,
      title: "Your journey to incredible teste begins here",
      description:
        "We know one flavor does not fit all, that is why we perfected 30 of them. Your next flavor obsession starts with just one click.",
      link: "/food-menu",
    },
    {
      image: BannarImage3,
      title: "Your journey to incredible teste begins here",
      description:
        "We know one flavor does not fit all, that is why we perfected 30 of them. Your next flavor obsession starts with just one click.",
      link: "/food-menu",
    },
  ];

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <div className="text-black flex items-center justify-center">
      <div className="w-full h-screen">
        <Carousel
          responsive={responsive}
          autoPlay
          autoPlaySpeed={2000}
          infinite
          arrows
          showDots
        >
          {slides.map((slide, index) => (
            <div key={index}>
              <div
                className="w-full bg-center bg-cover h-screen relative"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              >
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center px-4 md:px-10 lg:px-28">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white font-mono leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-white text-sm sm:text-base md:text-lg font-medium mt-4">
                      {slide.description}
                    </p>
                    <Link to={slide.link}>
                      <Button
                        variant="outlined"
                        className="font-semibold text-lg text-white p-6 bg-transparent"
                      >
                        CHECKOUT NOW
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default BannarOther;