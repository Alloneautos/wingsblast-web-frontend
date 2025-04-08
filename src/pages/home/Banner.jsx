import { useEffect, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      url: "https://i.ibb.co.com/XjmHvnk/01.jpg",
      content: "Slide 1",
    },
    {
      url: "https://i.ibb.co.com/GCYmJvs/03.png",
      content: "Slide 2",
    },
    {
      url: "https://i.ibb.co.com/bvSVm3p/05.png",
      content: "Slide 3",
    },
  ];

  const totalSlides = slides.length;

  // Automatically change slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    }, 2000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [totalSlides]);

  const goToNextSlide = () => {
    setCurrentSlide((currentSlide + 1) % totalSlides);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((currentSlide - 1 + totalSlides) % totalSlides);
  };

  return (
    <header className="bg-white w-full lg:w-10/12 mt-0 lg:mt-7 mx-auto">
      <div className="container grid md:flex lg:flex flex-col lg:flex-row gap-3 lg:gap-6 px-1 lg:px-0 py-3 lg:py-10 mx-auto space-y-6 lg:h-[32rem] lg:items-center">
        <div className="flex items-center justify-center w-full lg:w-4/6 order-2 lg:order-1">
          <div className="relative w-full overflow-hidden">
            {/* Carousel wrapper */}
            <div
              className="flex transition-transform ease-in-out duration-300"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div key={index} className="min-w-full rounded-3xl">
                  <img
                    src={slide.url}
                    alt={slide.content}
                    className="w-full  object-cover rounded-xl md:rounded-none lg:rounded-none"
                  />
                </div>
              ))}
            </div>

            {/* Left Arrow */}
            <button
              onClick={goToPrevSlide}
              className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-300 text-blue-500 p-1 rounded-full"
            >
              <FaAngleLeft className="h-6 w-6"/>
            </button>

            {/* Right Arrow */}
            <button
              onClick={goToNextSlide}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-300 text-blue-500 p-1 rounded-full"
            >
             <FaAngleRight className="h-6 w-6"/>
            </button>
          </div>
        </div>
        <div className="w-full lg:w-2/6 order-1 lg:order-2">
          <div className="lg:max-w-lg">
            <h1 className="text-2xl font-bold tracking-wide italic text-TextColor text-center lg:text-4xl">
              Your journey to incredible teste begins here
            </h1>
            <p className="mt-4 text-black text-center ">
              We know one flavor does not fit all, that is why we perfected 30
              of them. Your next flavor obsession starts with just one click.
            </p>
            <Link to="/foodmenu">
              <button className="w-full md:w-6/12 lg:w-full mx-auto btn bg-ButtonColor hover:bg-ButtonHover text-white mt-7">
                Order Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Banner;
