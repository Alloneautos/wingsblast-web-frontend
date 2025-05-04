import { useState } from "react";
import { useFlavor } from "../../api/api";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";
import { FaFire } from "react-icons/fa6";
import { FaFireAlt } from "react-icons/fa";

const FlavorSelector = () => {
  const [heatLevel, setHeatLevel] = useState(100);
  const { flavor, loading, error } = useFlavor();

  // Adjust heat level by slider range
  const handleSliderChange = (e) => {
    setHeatLevel(parseInt(e.target.value, 10));
  };

  // Filter flavors based on selected heat level
  const filteredFlavors = flavor?.filter((item) => {
    if (heatLevel < 30) {
      return item.isHoney; // Show only Henny
    } else if (heatLevel >= 30 && heatLevel < 70) {
      return item.isWet; // Show Wet
    } else if (heatLevel >= 70) {
      return item.isDry; // Show Dry
    }
    return false;
  });

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
    <div
      className="min-h-screen flex flex-col items-center justify-center py-2 bg-black text-white relative"
      style={{
        backgroundImage: "url(https://i.ibb.co/3WyWXrF/happy.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="relative z-10 text-center">
        <h1 className="text-5xl mb-2 font-TitleFont">FIND YOUR FLAVOR</h1>
        <p className="mb-6">
          Explore our saucy or dry rub flavors that range from mild to hot, in
          sweet or savory.
        </p>
      </div>

      {/* Heat Range Slider */}
      <div className="relative z-10 w-full max-w-3xl px-4">
        <div className="text-red-200">
          <input
            type="range"
            min="0"
            max="100"
            value={heatLevel}
            onChange={handleSliderChange}
            className="w-full h-[3px] rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #008000 0%, #e35336 ${heatLevel}%, #d20a2e ${heatLevel}%)`,
            }}
          />
        </div>
        <div className="flex justify-between mt-2 text-lg font-TitleFont">
          <span className={heatLevel < 30 ? "text-green-400" : ""}>HONEY</span>
          <span
            className={heatLevel >= 30 && heatLevel < 70 ? "text-red-500" : ""}
          >
            WET
          </span>
          <span className={heatLevel >= 70 ? "text-red-700" : ""}>DRY</span>
        </div>
      </div>

      {/* Flavor Cards */}
      <div className="relative z-10 mt-10 w-full px-4">
        {error && (
          <div className="text-red-500 text-center">
            Failed to load flavors!
          </div>
        )}
        <Carousel
          responsive={responsive}
          infinite
          swipeable
          draggable
          arrows
          showDots={false}
          className="w-full md:w-11/12 lg:w-7/12 mx-auto"
        >
          {/* Show Skeleton if Loading */}
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="px-2">
                  <div className="bg-gray-200 h-60 animate-pulse rounded-lg"></div>
                </div>
              ))
            : filteredFlavors?.map((item, index) => (
                <div className="px-2" key={index}>
                  <div className="bg-[#CCCCCC] text-black py-6 px-2 rounded text-center shadow-lg">
                    {/* Image */}
                    <div className="w-20 h-20 inline-flex items-center justify-center border rounded-full mb-2 flex-shrink-0 mx-auto overflow-hidden">
                      <img
                        className="rounded-full object-cover w-full h-full"
                        src={item.image}
                        alt={item.name || "Flavor"}
                      />
                    </div>

                    {/* Name */}
                    <h3 className="text-lg font-TitleFont">{item.name}</h3>

                    {/* Rating */}
                    <div className="rating flex justify-center my-3">
                      {/* Filled Flames */}
                      {[...Array(item.flavor_rating)].map((_, i) => (
                        <FaFireAlt 
                          key={i}
                          className={`${
                            item.flavor_rating <= 1
                              ? "text-green-700"
                              : item.flavor_rating <= 3
                              ? "text-yellow-700"
                              : "text-red-700"
                          }`}
                        />
                      ))}
                      {/* Empty Flames */}
                      {[...Array(5 - item.flavor_rating)].map((_, i) => (
                        <FaFireAlt 
                          key={i}
                          className={`opacity-30 ${
                            item.flavor_rating <= 1
                              ? "text-green-500"
                              : item.flavor_rating <= 3
                              ? "text-yellow-700"
                              : "text-red-700"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Description */}
                    <p className="text-sm line-clamp-2 h-[42px] font-paragraphFont mt-4">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
        </Carousel>
      </div>

      {/* Explore Menu Button */}
      <Link to="/foodmenu" className="relative z-10">
        <button className="mt-8 px-6 py-2 text-2xl bg-red-600 text-white rounded font-TitleFont hover:bg-red-700 transition">
          Explore Menu
        </button>
      </Link>
    </div>
  );
};

export default FlavorSelector;
