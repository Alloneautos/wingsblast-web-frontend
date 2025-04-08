import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { BiSolidError } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useCategory, useCategoryWithFood } from "../../api/api";
import LocationModal from "../../components/LocationModal";
import Loader from "../../assets/images/loader.gif";
import "react-multi-carousel/lib/styles.css";
import FoodMenuAbout from "./FoodMenuAbout";

const FoodMenu = () => {
  const [activeTab, setActiveTab] = useState("Wingsblast");
  const sectionsRef = useRef({});
  const { allwithfood, isLoading } = useCategoryWithFood();
  const { category } = useCategory();
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [foodId, setFoodId] = useState(0);
  const navigate = useNavigate();

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
      <h1 className="text-3xl font-sans ml-[10px] lg:ml-[140px] py-4 font-semibold">
        MENU
      </h1>
      {/* tab menu section  */}
      <div
        role="tablist"
        className="tabs overflow-x-scroll scrollbar-hide w-full border-b-2 sticky px-0 lg:px-[120px] bg-white shadow-2xl font-semibold"
      >
        {category.map((catgr) => (
          <a
            key={catgr.id}
            role="tab"
            className={`tab whitespace-nowrap text-lg text-gray-800 font-semibold font-TitleFont ${
              activeTab === catgr.id ? "tab-active text-green-600" : ""
            }`}
            onClick={() => handleScrollToSection(catgr.id)}
          >
            {catgr.category_name.toUpperCase()}
          </a>
        ))}
      </div>

      {/* Food Menu Sections */}
      {allwithfood.length === 0 && !isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <h1 className="text-2xl font-semibold text-gray-500">
            No Food Menu Available
          </h1>
        </div>
      ) : null}

      {/* Display Food Menus */}
      {isLoading ? (
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
              <h1 className="text-3xl lg:text-5xl font-bold font-TitleFont mb-5">
                {foodMenu.food_menus.length > 0 &&
                  foodMenu.category_name.toUpperCase()}
              </h1>

              {/* Food Items */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {foodMenu.food_menus.map((food) => (
                  <div
                    key={food.id}
                    className="p-4 w-full mb-6 border border-gray-500 rounded transition duration-300"
                  >
                     {/* Food Name */}
                     <h2 className="text-xl font-bold font-TitleFont text-gray-900">
                      {food.name.toUpperCase()}
                    </h2>
                    {/* Food Image */}
                    <div className="rounded-lg w-full h-[300px] overflow-hidden cursor-pointer">
                      <img
                        alt={food.name}
                        onClick={() => handleSelectItem(food)}
                        className="object-cover object-center h-full bg-white w-full"
                        src={food.image || "placeholder-image-url"} // Use fallback image
                      />
                    </div>

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
                            <span className="flex items-center font-semibold text-base text-black">
                              $ {food_detail.price.toFixed(2)}
                              <MdOutlineKeyboardArrowRight />
                            </span>
                          </div>
                          <h4 className="flex items-center gap-2 text-sm text-gray-700">
                            {food_detail.cal.toLowerCase()} <BiSolidError />
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

      <FoodMenuAbout />

      {/* Dialog Box */}
      <dialog id="select_cal" className="modal">
        <div className="modal-box !p-5  max-w-[350px] !rounded">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-[900] text-2xl font-sans text-black">
            CHO0SE AN OPTION
          </h3>
          {!isLoading && selectedItem && (
            <div>
              <p className="py-1 font-semibold text-black">
                {selectedItem.name.toUpperCase()}
              </p>
              <div className="w-full h-[1px] bg-gray-300 my-2"></div>
              {selectedItem.food_details.map((food) => (
                <p
                  key={food.id}
                  className="cursor-pointer"
                  onClick={() => handleLinkClick(food.id)}
                >
                  <div className="my-1">
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-black">
                        {food.food_menu_name}
                      </h3>
                      <span className="flex items-center text-sm font-sans font-semibold text-black ">
                        $ {food.price} <MdOutlineKeyboardArrowRight />
                      </span>
                    </div>
                    <h4 className="flex items-center gap-2 text-xs font-medium">
                      {food.cal} <BiSolidError />
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
