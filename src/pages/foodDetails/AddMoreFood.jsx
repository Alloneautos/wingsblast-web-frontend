import { useReletiveFood } from "../../api/api";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";
import LoadingComponent from "../../components/LoadingComponent";

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
      <h2 className="text-4xl font-TitleFont text-black mb-8">
        ADD MORE
      </h2>

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
                <div className="p-4 cursor-pointer hover:scale-105 transition-transform duration-300">
                  <div className="h-full border border-black rounded-lg bg-white overflow-hidden">
                    <img
                      className="w-full h-[180px] mx-auto object-cover"
                      src={foodMenu.image}
                      alt={foodMenu.category_name}
                    />
                    <div className="p-4">
                      <h3 className="text-lg font font-TitleFont line-clamp-1 text-black h-[28px]">
                        {foodMenu.name}
                      </h3>
                      <p className="text-black text-xs h-[33px] line-clamp-2">
                        {foodMenu.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-semibold">
                          ${foodMenu.price}
                        </span>
                        <span className="text-sm text-black">
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
