import { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useAllFood } from "../../api/api";
import { useNavigate } from "react-router-dom";
import LocationModal from "../../components/LocationModal";
import PercentisImage from "../../assets/images/purcentes.svg";
import DiscountImage from "../../assets/images/discount.png";

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
      {/* Header Section */}
      <h1 className="font-TitleFont text-2xl lg:text-3xl text-gray-900 p-4">
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
                  className="flex flex-col items-center w-full p-4 space-y-4 bg-gray-100 rounded-lg animate-pulse"
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
                    <div className="bg-white border shadow-xl rounded-lg  overflow-hidden hover:shadow-xl transition duration-900 transform">
                      <div className="relative ">
                        <img
                          className="rounded-t-lg w-[180px] h-[180px] mx-auto object-cover"
                          src={foodMenu.image}
                          alt={foodMenu.name}
                        />
                        {foodMenu.is_discount_amount === 1 && (
                          <span className="absolute top-0 right-0 text-white text-md font-TitleFont p-0.5 rounded-l-3xl">
                            <div
                              style={{
                                backgroundImage: `url(${DiscountImage})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                              className="w-[70px] h-[70px] flex flex-col items-center justify-center relative overflow-hidden"
                            >
                              <div className="absolute inset-0 rounded-full"></div>{" "}
                              {/* Red overlay for readability */}
                              <div className="relative z-10  text-center">
                                <div className="text-2xl leading-[25px]">
                                  ${foodMenu.discount_amount}
                                </div>
                                <span className="text-xl leading-[0px]">
                                  OFF
                                </span>
                              </div>
                            </div>
                          </span>
                        )}
                        {foodMenu.is_discount_percentage === 1 && (
                          <span className="absolute top-0 right-0 text-white text-md font-TitleFont p-0.5 rounded-l-3xl">
                            <div
                              style={{
                                backgroundImage: `url(${PercentisImage})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                              className="w-[70px] h-[70px] flex flex-col items-center justify-center relative overflow-hidden"
                            >
                              <div className="absolute inset-0 rounded-full"></div>{" "}
                              {/* Red overlay for readability */}
                              <div className="relative z-10 text-center leading-tight">
                                <div className="text-3xl -mt-3 mr-3">
                                  {foodMenu.discount_percentage}
                                </div>
                              </div>
                            </div>
                          </span>
                        )}
                        <span className="absolute left-3 top-3 mt-1 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded">
                          POPULAR
                        </span>
                      </div>
                      <div className="p-2 space-y-1">
                        <h2 className="text-gray-900 text-xl h-[33px] font-TitleFont leading-tight line-clamp-2">
                          {foodMenu.name}
                        </h2>
                        <p className="leading-relaxed text-black text-xs line-clamp-2 h-[42px]">
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
