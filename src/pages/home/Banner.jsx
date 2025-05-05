import { useEffect, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAllBannar } from "../../api/api";
import LoadingComponent from "../../components/LoadingComponent";

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { allBannar, isLoading } = useAllBannar();

  const totalSlides = allBannar.length;

  useEffect(() => {
    if (totalSlides > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [totalSlides]);

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <header className="bg-white w-full lg:w-10/12 mt-0 mx-auto">
      <div className="container grid md:flex lg:flex flex-col lg:flex-row gap-3 lg:gap-6 px-1 lg:px-0 py-3 lg:py-2 mx-auto space-y-6 lg:h-[32rem] lg:items-center">
        {/* Carousel Section */}
        <div className="flex items-center justify-center w-full lg:w-4/6">
          <div className="relative w-full overflow-hidden rounded-xl">
            {/* Slides */}
            <div
              className="flex transition-transform ease-in-out duration-300"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {allBannar.map((slide, index) => (
                <div key={index} className="min-w-full rounded-xl">
                  {slide.link_type == "category" && (
                    <Link to={`/foodmenu#${slide.link_url}`}>
                      {" "}
                      {slide.type === "video" ? (
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-[250px] md:h-[350px] lg:h-[500px] object-cover rounded-xl"
                        >
                          <source src={slide.video_image} type="video/mp4" />
                        </video>
                      ) : (
                        <img
                          src={slide.video_image}
                          alt={slide.content}
                          className="w-full h-[250px] md:h-[350px] lg:h-[500px] object-cover rounded-xl"
                        />
                      )}
                    </Link>
                  )}

                  {slide.link_type == "foodDetails" && (
                    <Link to={`/food-details/${slide.link_url}`}>
                      {" "}
                      {slide.type === "video" ? (
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-[250px] md:h-[350px] lg:h-[500px] object-cover rounded-xl"
                        >
                          <source src={slide.video_image} type="video/mp4" />
                        </video>
                      ) : (
                        <img
                          src={slide.video_image}
                          alt={slide.content}
                          className="w-full h-[250px] md:h-[350px] lg:h-[500px] object-cover rounded-xl"
                        />
                      )}
                    </Link>
                  )}
                  {slide.link_type == "others" && (
                    <a href={slide.link_url} target="_blank">
                      {" "}
                      {slide.type === "video" ? (
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-[250px] md:h-[350px] lg:h-[500px] object-cover rounded-xl"
                        >
                          <source src={slide.video_image} type="video/mp4" />
                        </video>
                      ) : (
                        <img
                          src={slide.video_image}
                          alt={slide.content}
                          className="w-full h-[250px] md:h-[350px] lg:h-[500px] object-cover rounded-xl"
                        />
                      )}
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevSlide}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-300 text-blue-500 p-2 rounded-full z-10"
            >
              <FaAngleLeft className="h-5 w-5" />
            </button>

            <button
              onClick={goToNextSlide}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-300 text-blue-500 p-2 rounded-full z-10"
            >
              <FaAngleRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Text + CTA Section */}
        <div className="w-full lg:w-2/6">
          <div className="lg:max-w-lg text-center lg:text-left">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-wide uppercase text-rose-600 font-italicFont">
              Blasting your taste with wingsBlast
            </h1>
            <p className="mt-4 text-black font-paragraphFont">
              We know one flavor does not fit all, that is why we perfected 30
              of them. Your next flavor obsession starts with just one click.
            </p>
            <Link to="/foodmenu">
              <button className="w-full md:w-6/12 lg:w-full mx-auto btn rounded bg-ButtonColor hover:bg-ButtonHover text-white mt-7 uppercase font-TitleFont font-normal text-3xl">
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
