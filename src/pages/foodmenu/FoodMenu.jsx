import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { BiSolidError } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useCategory, useCategoryWithFood } from "../../api/api";
import LocationModal from "../../components/LocationModal";
import "react-multi-carousel/lib/styles.css";
import FoodMenuAbout from "./FoodMenuAbout";
import { Helmet } from "react-helmet-async";
import LoadingComponent from "../../components/LoadingComponent";

const FoodMenu = () => {
  // Set first category as default active tab
  const { category } = useCategory();
  const categoryId = category?.[0]?.id || 0;
  const [isActive, setIsActive] = useState(categoryId);

  const sectionsRef = useRef({});
  const tabRefs = useRef({});
  const { allwithfood, isLoading } = useCategoryWithFood();
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [foodId, setFoodId] = useState(0);
  const navigate = useNavigate();

  const handleScrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
  
    if (!section) {
      console.warn(`Section with ID '${sectionId}' not found.`);
      return;
    }
      const header = document.querySelector('.sticky-header'); // Give your header a class
    const offset = header ? header.offsetHeight + (40) : 80; // fallback offset
  
    const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - offset;
  
    window.scrollTo({
      top: sectionTop,
      behavior: 'smooth',
    });
  
    setIsActive(sectionId);
  };
  

  useEffect(() => {
    if (!category.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsActive(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
      }
    );

    // Observe all sections
    Object.values(sectionsRef.current).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      Object.values(sectionsRef.current).forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, [allwithfood, category]); // Re-run when data changes

  // useEffect(() => {
  //   const activeTabEl = tabRefs.current[isActive];
  //   if (activeTabEl && typeof activeTabEl.scrollIntoView === "function") {
  //     activeTabEl.scrollIntoView({
  //       behavior: "smooth",
  //       inline: "center",
  //       block: "nearest",
  //     });
  //   }
  // }, [isActive]);

  useEffect(() => {
    const activeTabEl = tabRefs.current[isActive];
    if (activeTabEl && typeof activeTabEl.scrollIntoView === "function") {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        const header = document.querySelector(".sticky-header");
        const offset = header ? header.offsetHeight + (40) : 80; // fallback offset
        const sectionTop = activeTabEl.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: sectionTop,
          behavior: "smooth",
        });
      }

      activeTabEl.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [isActive]);

  // Rest of your existing functions remain the same...
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
      <Helmet>
        <title>Menu | Wingsblast</title>
      </Helmet>
      {/* Menu Section */}
      <h1 className="text-3xl font-TitleFont ml-[10px] lg:ml-[140px] py-4">
        MENU
      </h1>
      {/* tab menu section - updated with better active state */}
      <div
        role="tablist"
        className="tabs w-full lg:w-10/12 mx-auto overflow-x-scroll scrollbar-hide border-b-2 sticky bg-white shadow-2xl"
      >
        {category.map((catgr) => (
          <a
            key={catgr.id}
            ref={(el) => (tabRefs.current[catgr.id] = el)}
            data-id={catgr.id}
            role="tab"
            className={`tab whitespace-nowrap text-xl font-TitleFont px-4 transition-all duration-300 ease-in-out
           ${isActive == catgr.id ? "text-green-600" : "text-black"}
         `}
            onClick={() => handleScrollToSection(catgr.id)}
          >
            {catgr.category_name.toUpperCase()}
          </a>
        ))}
      </div>

      {/* Rest of your existing JSX remains the same... */}
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
            <div className="container px-3 lg:px-5 py-2 w-full lg:w-10/12 mx-auto">
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

      <dialog id="select_cal" className="modal">
        <div className="modal-box !p-5 max-w-[350px] !rounded">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="text-3xl font-TitleFont text-black">
            CHO0SE AN OPTION
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
                      <span className="flex items-center text-lg font-TitleFont text-black ">
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

export default FoodMenu;
