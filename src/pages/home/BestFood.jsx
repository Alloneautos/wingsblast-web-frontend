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
      items: 3,
      partialVisibilityGutter: 30,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      partialVisibilityGutter: 20,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
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
    <section className="text-black body-font w-full lg:w-8/12 mx-auto">
      <div className="container px-1 py-4 md:py-5 lg:py-24 mx-auto">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="font-bold text-TextColor text-4xl italic">FOR YOU</h1>
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
              <div key={index} className="p-4 cursor-pointer">
                <div
                  className="h-full w-full border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform transition duration-300 ease-in-out hover:scale-105 bg-gradient-to-br from-white to-gray-100"
                  onClick={() => handleLinkClick(foodMenu?.id)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      className="lg:h-48 md:h-36 h-36 w-full object-cover object-center transition-all duration-300"
                      src={foodMenu.image}
                      alt={foodMenu.name || "Food Item"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40 hover:opacity-30 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-6 space-y-4">
                    <h2 className="title-font text-xl font-semibold text-gray-800 truncate">
                      {foodMenu.name}
                    </h2>
                    <p className="leading-relaxed text-gray-600 text-sm line-clamp-3 h-[38px]">
                      {foodMenu.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-TextColor text-base">
                        {foodMenu.cal}
                      </span>
                      <div className="text-gray-800 font-bold text-lg">
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
