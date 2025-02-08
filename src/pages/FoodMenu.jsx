// import Bannar from "../assets/images/Desktop_Banner_1440_x_106.jpg";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { BiSolidError } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAllFood, useCategory, useCategoryWithFood } from "../api/api";
import LocationModal from "../components/LocationModal";
import Loader from "../assets/images/loader.gif";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const FoodMenu = () => {
  const [activeTab, setActiveTab] = useState("specials");
  const sectionsRef = useRef({});
  const { allwithfood, isLoading } = useCategoryWithFood();
  const { allFood, loading } = useAllFood();
  const { category } = useCategory();
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [foodId, setFoodId] = useState(0);
  const navigate = useNavigate();

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 3,
      partialVisibilityGutter: 20,
    },
    desktop: {
      breakpoint: { max: 1024, min: 768 },
      items: 3,
      partialVisibilityGutter: 20,
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 2,
      partialVisibilityGutter: 10,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const handleScrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setActiveTab(sectionId); // Set active tab based on clicked section
    }
  };
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    }, options);

    // Observe each section
    const sections = Object.values(sectionsRef.current);
    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      if (sections) {
        sections.forEach((section) => observer.unobserve(section));
      }
    };
  }, []);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    document.getElementById("select_cal").showModal();
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
    <div className="">
      <h1 className="text-4xl font-sans ml-[10px] lg:ml-[140px] py-4 font-semibold">
        MENU
      </h1>
      {/* tab menu section  */}
      <div
        role="tablist"
        className="tabs overflow-x-scroll tabs-bordered w-full sticky top-[0px] z-40 px-0 lg:px-[120px] shadow-md font-semibold"
      >
        {category.map((catgr) => (
          <a
            key={catgr.id}
            role="tab"
            className={`tab ${
              activeTab === catgr.id ? "tab-active text-green-600" : ""
            }`}
            onClick={() => handleScrollToSection(catgr.id)}
          >
            {catgr.category_name}
          </a>
        ))}
      </div>

      {/* bannar section  */}
      {/* <div className="mt-1 hidden md:block lg:block">
        <img src={Bannar} alt="" />
      </div> */}

      {/* Our recommendations section */}
       <div className="slider-container w-full lg:w-10/12 mx-auto">
      <Carousel
        responsive={responsive}
        swipeable
        draggable
        infinite
        arrows
        showDots={false}
        partialVisible
        className="flex"
      >
        {/* Skeleton Loading */}
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 p-4 w-full max-w-[250px]"
              >
                <div className="skeleton h-32 w-full"></div>
                <div className="skeleton h-7 my-6 w-28"></div>
                <div className="skeleton h-7 my-6 w-full"></div>
                <div className="skeleton h-7 my-6 w-full"></div>
              </div>
            ))
          : allFood?.map((foodMenu) => (
              <div
                key={foodMenu.id}
                className="p-4 lg:p-6 cursor-pointer"
                onClick={() => handleLinkClick(foodMenu?.id)}
              >
                <div className="relative h-full w-full border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transform transition duration-300 ease-in-out hover:scale-105 bg-white">
                  {/* Image */}
                  <img
                    className="w-full h-48 object-cover"
                    src={foodMenu.image}
                    alt={foodMenu.name}
                  />
                  {/* Badge */}
                  <div className="absolute top-2 right-2 bg-ButtonColor text-white text-xs font-bold uppercase px-3 py-1 rounded-full shadow">
                    Most Sell
                  </div>
                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {/* Title */}
                    <h1 className="text-lg font-bold text-gray-800 truncate">
                      {foodMenu.name}
                    </h1>
                    {/* Description */}
                    <p className="text-gray-600 text-sm h-14 overflow-hidden line-clamp-2">
                      {foodMenu.description}
                    </p>
                    {/* Calories and Price */}
                    <div className="flex items-center justify-between text-gray-700 text-sm font-medium">
                      <span>{foodMenu.cal}</span>
                      <span className="text-green-600 font-semibold text-lg">
                        ${foodMenu.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </Carousel>
    </div>

      {loading ? (
        // Skeleton Loading UI
        <div className="flex items-center justify-center">
          <img src={Loader} alt="Loading..." className="w-[150px]" />
        </div>
      ) : (
        // Actual Content Display
        allwithfood.map((foodMenu) => (
          <section
            key={foodMenu.id}
            id={foodMenu.id}
            ref={(el) => (sectionsRef.current[foodMenu.id] = el)}
          >
            <div className="container px-3 lg:px-5 py-2 w-full lg:w-10/12 mx-auto">
              {/* Category Name */}
              <h1 className="text-5xl font-bold mb-5">
                {foodMenu.food_menus.length > 0 && foodMenu.category_name}
              </h1>

              {/* Food Items */}
              <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4">
                {foodMenu.food_menus.map((food) => (
                  <div
                    key={food.id}
                    className="p-4 w-full sm:w-1/2 lg:w-1/3 mb-6"
                  >
                    {/* Food Image */}
                    <div className="rounded-lg h-64 overflow-hidden cursor-pointer">
                      <img
                        alt={food.name}
                        onClick={() => handleSelectItem(food)}
                        className="object-cover object-center h-full bg-gray-300 w-full"
                        src={food.image || "placeholder-image-url"} // Use fallback image
                      />
                    </div>

                    {/* Food Name */}
                    <h2 className="text-xl font-bold title-font text-gray-900 mt-5">
                      {food.name}
                    </h2>

                    {/* Food Details */}
                    <p className="text-sm leading-relaxed line-clamp-2 mt-2">
                      {food.details}
                    </p>

                    {/* Food Sub-details */}
                    {food.food_details.map((food_detail) => (
                      <div key={food_detail.id} className="my-1">
                        <div
                          className="cursor-pointer"
                          onClick={() => handleLinkClick(food_detail.id)}
                        >
                          <div className="flex justify-between">
                            <h3 className="font-semibold">
                              {food_detail.food_menu_name}
                            </h3>
                            <span className="flex items-center text-lg">
                              $ {food_detail.price.toFixed(2)}
                              <MdOutlineKeyboardArrowRight />
                            </span>
                          </div>
                          <h4 className="flex items-center gap-2 text-sm">
                            {food_detail.cal} <BiSolidError />
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))
      )}

      {/* Dialog Box */}
      <dialog id="select_cal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-2xl">Choose An Option</h3>
          {!isLoading && selectedItem && (
            <div>
              <p className="py-1 text-green-600">{selectedItem.name}</p>
              {selectedItem.food_details.map((food) => (
                <p
                  key={food.id}
                  className="cursor-pointer"
                  onClick={() => handleLinkClick(food.id)}
                >
                  <div className="my-1">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{food.food_menu_name}</h3>
                      <span className="flex items-center text-lg">
                        $ {food.price} <MdOutlineKeyboardArrowRight />
                      </span>
                    </div>
                    <h4 className="flex items-center gap-2 text-sm">
                      {food.cal} cal <BiSolidError />
                    </h4>
                  </div>
                </p>
              ))}
            </div>
          )}
        </div>
      </dialog>

      {/* location modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        foodId={foodId}
      />
    </div>
  );
};

export default FoodMenu;
