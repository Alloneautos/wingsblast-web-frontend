import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";
import LocationModal from "../../components/LocationModal";
import { useAllFood } from "../../api/api";

const BestFood = () => {
  const { allFood, loading } = useAllFood();
  const sliderRef = useRef(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [foodId, setFoodId] = useState(0);
  const navigate = useNavigate();

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      partialVisibilityGutter: 30,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      partialVisibilityGutter: 20,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
      arrows: false,
      swipeable: true,
      partialVisibilityGutter: 10,
    },
  };

  const handleLinkClick = (value) => {
    const savedAddress = localStorage.getItem("orderStatus");
    if (savedAddress) {
      navigate(`/food-details/${value}`);
    } else {
      setIsLocationModalOpen(true);
      setFoodId(value);
    }
  };

  return (
    <section className="text-black body-font w-full lg:w-10/12 mx-auto">
      <div className="container px-1 py-4 md:py-5 lg:py-24 mx-auto">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-TextColor text-5xl font-TitleFont">FOR YOU</h1>
          <p className="my-5 text-gray-600">Curated by Your Flavor Experts</p>
        </div>

        {/* Carousel Section */}
        {loading ? (
          // Skeleton Loader when data is loading
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse p-4 space-y-4">
                <div className="h-36 w-full bg-gray-300 rounded-lg"></div>
                <div className="h-4 bg-gray-300 w-3/4 rounded"></div>
                <div className="h-4 bg-gray-300 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          // Actual Carousel
          <Carousel
            responsive={responsive}
            infinite
            swipeable
            draggable
            showDots={false}
            arrows
            className=""
          >
            {allFood?.map((foodMenu, index) => (
              <div key={index} className="p-2 sm:p-4 cursor-pointer">
                <div
                  className="h-full w-full border border-green-200 rounded overflow-hidden hover:border-2 hover:border-green-700 bg-white"
                  onClick={() => handleLinkClick(foodMenu?.id)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      className="h-[180px] w-[180px] mx-auto object-cover object-center transition-all duration-300"
                      src={foodMenu.image}
                      alt={foodMenu.name || 'Food Item'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30 hover:opacity-20 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-2 sm:p-6 space-y-1 sm:space-y-2">
                    <h2 className="title-font text-lg sm:text-xl font-semibold text-gray-800 truncate">
                      {foodMenu.name}
                    </h2>
                    <p className="leading-relaxed text-gray-600 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">
                      {foodMenu.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-black font-paragraphFont text-sm">
                        {foodMenu.cal}
                      </span>
                      <div className="text-gray-800 font-bold text-base sm:text-lg">
                        ${foodMenu.price}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        )}
      </div>

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        foodId={foodId}
      />
    </section>
  );
};

export default BestFood;
