import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { BiSolidError } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useCategory, useCategoryWithFood } from "../../api/api";
import "react-multi-carousel/lib/styles.css";
import { Helmet } from "react-helmet-async";
import LoadingComponent from "../../components/LoadingComponent";
import FoodMenuAbout from "./FoodMenuAbout";
import LocationModal from "../../components/LocationModal";

const FoodMenuTest = () => {
  const { category } = useCategory();
  const categoryId = category?.[0]?.id || 0;
  const [isActive, setIsActive] = useState(categoryId);
  const sectionsRef = useRef({});
  const tabRefs = useRef({});
  const tabsContainerRef = useRef(null);
  const { allwithfood, isLoading } = useCategoryWithFood();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [foodId, setFoodId] = useState(0);
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    document.getElementById("select_cal").showModal();
  };

  const handleScrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const header = document.querySelector(".sticky-header");
    const offset = header ? header.offsetHeight + 40 : 80;

    const sectionTop =
      section.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({
      top: sectionTop,
      behavior: "smooth",
    });

    setIsActive(sectionId);
  };

  // Center the active tab in the tab bar
  const centerActiveTab = (activeTabId) => {
    if (!tabsContainerRef.current) return;

    const activeTab = tabRefs.current[activeTabId];
    if (!activeTab) return;

    const container = tabsContainerRef.current;
    const containerWidth = container.offsetWidth;
    const containerScrollLeft = container.scrollLeft;
    const tabOffsetLeft = activeTab.offsetLeft;
    const tabWidth = activeTab.offsetWidth;

    // Calculate the position to scroll to
    const scrollTo = tabOffsetLeft - containerWidth / 2 + tabWidth / 2;

    container.scrollTo({
      left: scrollTo,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!category.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            setIsActive(sectionId);
            centerActiveTab(sectionId);
          }
        });
      },
      {
        root: null,
        rootMargin: "-50% 0px -50% 0px", // Adjust this to change when the tab becomes active
        threshold: 0,
      }
    );

    Object.values(sectionsRef.current).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      Object.values(sectionsRef.current).forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, [allwithfood, category]);

  useEffect(() => {
    // Center the initial active tab on load
    if (isActive) {
      setTimeout(() => {
        centerActiveTab(isActive);
      }, 300);
    }
  }, [isActive]);

  const handleLinkClick = (value) => {
    const savedAddress = localStorage.getItem("orderStatus");
    if (savedAddress) {
      navigate(`/food-details/${value}`);
    } else {
      setIsLocationModalOpen(true);
      setFoodId(value);
    }
  };

  const location = useLocation();
  // console.log(location.hash); #BURGER

  useEffect(() => {
    const target = location.hash;
    if (target && allwithfood.length > 0) {
      const id = target.replace("#", "");
      setTimeout(() => {
        handleScrollToSection(id);
      }, 300);
    }
  }, [location.hash, allwithfood]);

  return (
    <div>
      <Helmet>
        <title>Menu | Wingsblast</title>
      </Helmet>

      <h1 className="text-3xl font-TitleFont ml-[10px] lg:ml-[140px] py-4">
        MENU
      </h1>

      <div
        ref={tabsContainerRef}
        role="tablist"
        className="tabs w-full lg:w-10/12 mx-auto overflow-x-auto scrollbar-hide border-b-2 sticky-header bg-white shadow-2xl"
      >
        <div className="flex">
          {category.map((catgr) => (
            <a
              key={catgr.id}
              ref={(el) => (tabRefs.current[catgr.id] = el)}
              role="tab"
              className={`tab whitespace-nowrap text-xl font-TitleFont px-4 transition-all duration-300 ease-in-out flex-shrink-0
                ${
                  isActive == catgr.id
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-black"
                }
              `}
              onClick={() => handleScrollToSection(catgr.id)}
            >
              {catgr.category_name.toUpperCase()}
            </a>
          ))}
        </div>
      </div>

      {/* Rest of your component remains the same */}
      {allwithfood.length === 0 && !isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <h1 className="text-2xl font-semibold text-gray-500">
            No Food Menu Available
          </h1>
        </div>
      ) : null}

      {isLoading ? (
        <LoadingComponent />
      ) : (
        allwithfood.map((foodMenu) => (
          <section
            key={foodMenu.id}
            id={foodMenu.id}
            ref={(el) => (sectionsRef.current[foodMenu.id] = el)}
          >
            <div
              id={foodMenu.category_name}
              className="container px-3 lg:px-5 py-7 w-full lg:w-10/12 mx-auto"
            >
              <h1 className="text-3xl lg:text-4xl font-TitleFont mb-5 text-black">
                {foodMenu.food_menus.length > 0 &&
                  foodMenu.category_name.toUpperCase()}
              </h1>

              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {foodMenu.food_menus.map((food) => (
                  <div
                    key={food.id}
                    className="p-4 w-full mb-6 border rounded-xl shadow-xl transition duration-300"
                  >
                    <h2 className="text-xl font-TitleFont">
                      {food.name.toUpperCase()}
                    </h2>
                    <div className="rounded-lg w-full h-[250px] lg:h-[300px] overflow-hidden cursor-pointer">
                      <img
                        alt={food.name}
                        onClick={() => handleSelectItem(food)}
                        className="object-cover object-center h-full bg-white w-full"
                        src={food.image || "placeholder-image-url"}
                      />
                    </div>
                    <p className="text-xs leading-relaxed line-clamp-4 mt-2">
                      {food.details}
                    </p>
                    {food.food_details.map((food_detail) => (
                      <div key={food_detail.id} className="my-1">
                        <div
                          className="cursor-pointer"
                          onClick={() => handleLinkClick(food_detail.id)}
                        >
                          <div className="flex justify-between">
                            <h3 className="text-lg text-black font-TitleFont">
                              {food_detail.food_menu_name.toUpperCase()}
                            </h3>
                            <span className="flex items-center font-TitleFont text-lg text-black">
                              $ {food_detail.price.toFixed(2)}
                              <MdOutlineKeyboardArrowRight />
                            </span>
                          </div>
                          <h4 className="flex items-center gap-2 text-[10px] text-gray-700">
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
       {/* product id modal */}
      <dialog id="select_cal" className="modal">
        <div className="modal-box !p-5 max-w-[350px] !rounded">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="text-3xl font-TitleFont text-black">
            CHOOSE AN OPTION
          </h3>
          {!isLoading && selectedItem && (
            <div>
              <p className="py-1 font-TitleFont text-xl text-black">
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
                      <h3 className="font-TitleFont text-lg text-black">
                        {food.food_menu_name.toUpperCase()}
                      </h3>
                      <span className="flex items-center text-lg font-TitleFont text-black">
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
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        foodId={foodId}
      />
    </div>
  );
};

export default FoodMenuTest;
