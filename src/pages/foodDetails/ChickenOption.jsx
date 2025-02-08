import React from "react";
import { useReletiveFood } from "../../api/api";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";

const ChickenOption = ({ categoryID }) => {
  const { reletiveFood, isLoading } = useReletiveFood(categoryID);

  // Responsive settings for react-multi-carousel
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

  return (
    <div className="w-full md:w-10/12 lg:w-9/12 mx-auto p-2 lg:p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-lg shadow-2xl">
      {/* Section Header */}
      <h2 className="text-4xl text-center font-bold text-gray-800 mb-8">
        Relative Food
      </h2>

      {/* Carousel Container */}
      {isLoading ? (
        <div className="slider-container">
          <Carousel responsive={responsive} arrows={false} infinite autoPlay>
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="p-4 animate-pulse flex flex-col items-center"
              >
                <div className="h-40 w-full bg-gray-300 rounded-lg"></div>
                <div className="mt-4 h-4 w-3/4 bg-gray-300 rounded"></div>
                <div className="mt-2 h-4 w-1/2 bg-gray-300 rounded"></div>
              </div>
            ))}
          </Carousel>
        </div>
      ) : reletiveFood.length > 1 ? (
        // Carousel with Food Items
        <div className="slider-container">
          <Carousel
            responsive={responsive}
            infinite
            autoPlay={false}
            draggable
            swipeable
            showDots={false}
          >
            {reletiveFood.map((foodMenu) => (
              <Link key={foodMenu.id} to={`/food-details/${foodMenu.id}`}>
                <div className="p-4 cursor-pointer hover:scale-105 transition-transform duration-300">
                  <div className="h-full border border-gray-200 rounded-lg shadow-md bg-white overflow-hidden">
                    <img
                      className="w-full h-40 object-cover"
                      src={foodMenu.image}
                      alt={foodMenu.category_name}
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-800 h-[48px]">
                        {foodMenu.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 h-[58px] line-clamp-3">
                        {foodMenu.description}
                      </p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xl font-semibold text-purple-700">
                          ${foodMenu.price}
                        </span>
                        <span className="text-sm text-gray-500">
                          {foodMenu.cal}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </Carousel>
        </div>
      ) : (
        // No Related Food Message
        <p>No more related food available</p>
      )}
    </div>
  );
};

export default ChickenOption;
