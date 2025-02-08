import { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useAllFood } from "../../api/api";
import { useNavigate } from "react-router-dom";
import LocationModal from "../../components/LocationModal";

const NewFoodAddCard = () => {
  const { allFood, loading } = useAllFood();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [foodId, setFoodId] = useState(0);
  const navigate = useNavigate();

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      partialVisibilityGutter: 20,
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 2,
      partialVisibilityGutter: 10,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
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
    <div className="bg-gray-50 rounded-t-md pb-6">
      <h1 className="title-font font-bold text-xl lg:text-3xl text-gray-900 pt-5 ml-12 mb-6">
        Add something extra to your order
      </h1>

      {/* Carousel Container */}
      <div className="slider-container w-full mx-auto px-4">
        <Carousel
          responsive={responsive}
          infinite
          swipeable
          draggable
          showDots={false}
          arrows
          className="w-full"
        >
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center w-full max-w-xs p-4 space-y-4 bg-gray-100 rounded-lg animate-pulse"
                >
                  <div className="w-full h-32 bg-gray-300 rounded-md"></div>
                  <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
                  <div className="w-full h-4 bg-gray-300 rounded"></div>
                  <div className="w-full h-4 bg-gray-300 rounded"></div>
                </div>
              ))
            : allFood?.map((foodMenu) => (
                <div key={foodMenu.id} className="p-2 w-full">
                  <div
                    className="cursor-pointer"
                    onClick={() => handleLinkClick(foodMenu?.id)}
                  >
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-300 transform hover:scale-105">
                      <div className="relative bg-gray-200">
                        <img
                          className="rounded-t-lg w-full object-cover h-48"
                          src={foodMenu.image}
                          alt={foodMenu.name}
                        />
                        <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-sm">
                          POPULAR
                        </span>
                      </div>
                      <div className="p-5 space-y-3">
                        <h2 className="text-gray-900 font-bold text-xl h-[48px] leading-tight line-clamp-2">
                          {foodMenu.name}
                        </h2>
                        <p className="leading-relaxed text-gray-600 text-sm line-clamp-2 h-[42px]">
                          {foodMenu.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </Carousel>
      </div>

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        foodId={foodId}
      />
    </div>
  );
};

export default NewFoodAddCard;
