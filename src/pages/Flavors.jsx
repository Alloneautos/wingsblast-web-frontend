import { Link } from "react-router-dom";
import BannarImg from "../assets/images/bannar.jpg";
import { useState } from "react";
import { useFlavor } from "../api/api";
import { BsFire } from "react-icons/bs";
import Loader from "../assets/images/loader.gif";
const Flavors = () => {
  const [heatLevel, setHeatLevel] = useState(100);
  const { flavor, isLoading, error } = useFlavor();

  // Filter options for wet, dry, honey flavors
  const [isWet, setIsWet] = useState(true);
  const [isDry, setIsDry] = useState(true);
  const [isHoney, setIsHoney] = useState(true);

  // Adjust heat level by slider range
  const handleSliderChange = (e) => {
    setHeatLevel(parseInt(e.target.value, 10));
  };

  // Determine selected range flavor based on heatLevel
  const selectedRange =
    heatLevel < 30 ? "HENNY" : heatLevel < 70 ? "WET" : "DRY";

  // Filter flavors based on selected range and checkbox options
  const filteredFlavors = flavor?.filter((item) => {
    if (selectedRange === "HENNY") {
      return isHoney && item.isHoney;
    } else if (selectedRange === "WET") {
      return (isHoney && item.isHoney) || (isDry && item.isDry);
    } else if (selectedRange === "DRY") {
      return (
        (isHoney && item.isHoney) ||
        (isWet && item.isWet) ||
        (isDry && item.isDry)
      );
    }
    return false;
  });

  return (
    <div>
      <div
        className="hero h-auto lg:h-96"
        style={{
          backgroundImage:
            "url(https://i.ibb.co.com/M1FRdHc/Screenshot-2024-10-22-105817.png)",
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className=" text-neutral-content text-center mx-auto w-11/12 lg:w-5/12">
          <div>
            <h1 className="mb-5 text-4xl md:text-5xl font-TitleFont">
              Find your Flavor
            </h1>

            <div className="mb-7">
              <input
                type="range"
                min="0"
                max="100"
                value={heatLevel}
                onChange={handleSliderChange}
                className="w-full h-[3px] bg-green-600 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #008000 0%, #e35336 ${heatLevel}%, #d20a2e ${heatLevel}%)`,
                }}
              />
              <div className="flex justify-between font-TitleFont mt-2">
                <span className={heatLevel < 30 ? "text-green-400" : ""}>
                  NO DRY
                </span>
                <span
                  className={
                    heatLevel >= 30 && heatLevel < 70 ? "text-red-500" : ""
                  }
                >
                  SAME DRY
                </span>
                <span className={heatLevel >= 70 ? "text-red-700" : ""}>
                  HOT DEY
                </span>
              </div>
            </div>

            {/* Flavor filter section */}
            <h2 className="text-center my-3 font-TitleFont text-3xl">
              Flavor Type
            </h2>
            <div className="flex flex-wrap ml-[10px] lg:ml-[120px] py-2 justify-center lg:justify-start gap-4 font-TitleFont">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="toggle toggle-success"
                  checked={isWet}
                  onChange={() => setIsWet(!isWet)}
                />
                <span className="">WET</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="toggle toggle-success"
                  checked={isDry}
                  onChange={() => setIsDry(!isDry)}
                />
                <span className="">DRY</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="toggle toggle-success"
                  checked={isHoney}
                  onChange={() => setIsHoney(!isHoney)}
                />
                <span className="">HONEY</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flavor Cards Section */}
      <section
        className="text-gray-600 body-font hero"
        style={{ backgroundImage: `url(${BannarImg})` }}
      >
        <div className="container py-14 mx-auto w-full lg:w-10/12">
          {isLoading && (
            <div className="flex items-center justify-center">
              <img
                src={Loader}
                alt="Loading..."
                className="w-[150px] text-red-600"
              />
            </div>
          )}
          {error && <p className="text-red-500">Error loading flavors.</p>}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 mx-2 gap-3">
            {!isLoading &&
              filteredFlavors.map((item, index) => (
                <div
                  key={index}
                  className="w-full bg-gray-100 flex flex-col text-center rounded items-center"
                >
                  <div className="w-[80px] h-[80px] inline-flex mt-3 items-center justify-center rounded-full mb-2 flex-shrink-0 transition-all duration-300 transform hover:scale-110">
                    <img
                      className="rounded-full w-full h-full object-cover"
                      src={item.image}
                      alt={item.name || "Flavor"}
                    />
                  </div>
                  <h2 className="text-gray-900 text-xl font-TitleFont mb-1">
                    {item.name}
                  </h2>
                  <div className="rating flex justify-center my-1">
                    {[...Array(item.flavor_rating)].map((_, i) => (
                      <BsFire
                        key={i}
                        type="radio"
                        name={`rating-${index}`}
                        className={`${
                          item.flavor_rating <= 1
                            ? "text-green-700"
                            : item.flavor_rating <= 3
                            ? "text-yellow-600"
                            : "text-red-500"
                        }`}
                      />
                    ))}
                    {[...Array(5 - item.flavor_rating)].map((_, i) => (
                      <BsFire
                        key={i}
                        type="radio"
                        name={`rating-${index}`}
                        className={`opacity-30 ${
                          item.flavor_rating <= 1
                            ? "text-green-500"
                            : item.flavor_rating <= 3
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="line-clamp-2 h-[40px] text-sm">{item.description}</p>
                  <Link to="/foodmenu" className="w-full">
                    <button className="w-11/12 rounded mx-[15px] font-TitleFont my-3 py-2 hover:bg-ButtonHover bg-ButtonColor text-white text-xl">
                      ORDER NOW
                    </button>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </section>

      <div className="h-1 w-full bg-sky-800"></div>
    </div>
  );
};

export default Flavors;
