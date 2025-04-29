import { useReletiveFood } from "../../api/api";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";
import LoadingComponent from "../../components/LoadingComponent";
import PercentisImage from "../../assets/images/purcentes.svg";
import DiscountImage from "../../assets/images/discount.png";

const AddMoreFood = ({ categoryID }) => {
  const { reletiveFood, isLoading } = useReletiveFood(categoryID);

  // Responsive settings for react-multi-carousel
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
      items: 1,
      partialVisibilityGutter: 10,
    },
  };

  return (
    <div className="w-full md:w-10/12 lg:w-10/12 mx-auto p-2 lg:p-6">
      {/* Section Header */}
      <h2 className="text-4xl font-TitleFont text-black mb-2 px-3">ADD MORE</h2>
      {/* Carousel Container */}
      {isLoading ? (
        <div className="slider-container">
          <LoadingComponent />
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
              <Link
                key={foodMenu.id}
                to={`/food-details/${foodMenu.id}`}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <div className="p-3 cursor-pointer hover:scale-105 transition-transform duration-300">
                  <div className="h-full border shadow-xl rounded-lg bg-white overflow-hidden">
                    <img
                      className="w-[250px] lg:w-[140px] h-[220px] lg:h-[140px] mx-auto object-cover"
                      src={foodMenu.image}
                      alt={foodMenu.category_name}
                    />
                    {foodMenu.is_discount_amount === 1 && (
                      <span className="absolute top-4 right-4 text-white text-md font-TitleFont p-0.5 rounded-l-3xl">
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
                            <span className="text-xl leading-[0px]">OFF</span>
                          </div>
                        </div>
                      </span>
                    )}
                    {foodMenu.is_discount_percentage === 1 && (
                      <span className="absolute top-4 right-4 text-white text-md font-TitleFont p-0.5 rounded-l-3xl">
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
                    <div className="p-4">
                      <h3 className="text-lg font font-TitleFont line-clamp-1 text-black h-[28px]">
                        {foodMenu.name}
                      </h3>
                      <p className="text-black text-xs h-[33px] line-clamp-2">
                        {foodMenu.description}
                      </p>
                      <div className="flex justify-between items-center ">
                        <span className="text-xl font-TitleFont">
                          {foodMenu.is_discount_amount === 1 ? (
                            <div className="flex gap-1 items-center">
                              <span className="text-black">
                                {foodMenu.price - foodMenu.discount_amount}
                              </span>
                              <span className="text-[16px] text-gray-600 line-through">
                                ${foodMenu.price}
                              </span>
                            </div>
                          ) : foodMenu.is_discount_percentage === 1 ? (
                            <div className="flex gap-1 ">
                              <span className=" text-black">
                                $
                                {(
                                  foodMenu.price -
                                  (foodMenu.price *
                                    foodMenu.discount_percentage) /
                                    100
                                ).toFixed(2)}
                              </span>
                              <span className="text-[16px] text-gray-600 line-through">
                                ${foodMenu.price}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <span className="text-black">
                                ${foodMenu.price}
                              </span>
                            </div>
                          )}
                          {/* ${foodMenu.price} */}
                        </span>
                        <span className="text-[9px] text-black">
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

export default AddMoreFood;
