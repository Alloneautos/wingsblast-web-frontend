import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FlavorSelection from "./FlavorSelection";
import {
  API,
  useFoodDetails,
  useGuestUser,
  useUserProfile,
} from "../../api/api";
import SideSection from "./SideSection";
import DipSection from "./DipSection";
import BakerySection from "./BakerySection";
import Swal from "sweetalert2";
import ToppingSection from "./ToppingSection";
import SanwichSection from "./SandwichSection";
import { useQueryClient } from "@tanstack/react-query";
import AddMoreFood from "./AddMoreFood";
import DrinkSection from "./drinksection/DrinkSection";
import ExtraDrinkSection from "./extradrinksection/ExtraDrinkSection";
import ExtraDipSection from "./ExtraDipSection";
import LoadingComponent from "../../components/LoadingComponent";
import ExtraCombo from "./ExtraCombo";
import RicePlattarCostom from "./RicePlattarCostom";
import ExtraSideSection from "./ExtraSideSection";
import { Helmet } from "react-helmet-async";

const FoodDetails = () => {
  const queryClient = useQueryClient();
  const { guestUser } = useGuestUser();
  const { user } = useUserProfile();
  const { foodDetailsID } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);
  const { foodDetails, loading, error } = useFoodDetails(foodDetailsID);
  const [dipSelects, setDipSelects] = useState([]); // Initialize as an empty array
  const [sideSelects, setSideSelects] = useState([]);
  const [extraSideSelects, setExtraSideSelects] = useState([]);
  const [ricePlattarSelects, setRicePlattarSelects] = useState([]);
  const [drinkId, setDrinkId] = useState(null);
  const [bakerySelects, setBakerySelects] = useState([]);
  const [toppingsData, setToppingsData] = useState([]);
  const [sandCustData, setSandCustData] = useState([]);
  const [flavorData, setFlavorData] = useState([]); // Initialize as an empty array
  const [cartLoading, setCartLoading] = useState(false);
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [selectedExtraDrinks, setSelectedExtraDrinks] = useState([]);

  const navigate = useNavigate();
  const [unitPrice, setUnitPrice] = useState(0);
  const [sidePrice, setSidePrice] = useState(0);
  const [bakeryPrice, setBakeryPrice] = useState(0);
  const [drinkPrice, setDrinkPrice] = useState(0);
  const [drinkRegulerPrice, setDrinkRegulerPrice] = useState(0);
  const [dipPrice, setDipPrice] = useState(0);
  const [toppingPrice, setToppingsPrice] = useState(0);
  const [sandwichPrice, setSandWichPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [myFoodPrice, setMyFoodPrice] = useState(0);
  const [isDrinkPrice, setIsDrinkPrice] = useState(0);
  const [isDrinkRegulerPrice, setIsDrinkRegulerPrice] = useState(0);
  const [isSidePrice, setIsSidePrice] = useState(0);
  const [isDipPrice, setIsDipPrice] = useState(0);
  const [isBakeryPrice, setIsBakeryPrice] = useState(0);

  useEffect(() => {
    setIsDrinkPrice(drinkPrice > 0 ? 1 : 0);
  }, [drinkPrice]);
  useEffect(() => {
    setIsDrinkRegulerPrice(drinkRegulerPrice > 0 ? 1 : 0);
  }, [drinkRegulerPrice]);
  useEffect(() => {
    setIsSidePrice(sidePrice > 0 ? 1 : 0);
  }, [sidePrice]);
  useEffect(() => {
    setIsDipPrice(dipPrice > 0 ? 1 : 0);
  }, [dipPrice]);
  useEffect(() => {
    setIsBakeryPrice(bakeryPrice > 0 ? 1 : 0);
  }, [bakeryPrice]);

  let mainPrice;

  if (foodDetails?.is_discount_amount === 1) {
    mainPrice = foodDetails.price - foodDetails.discount_amount;
  } else if (foodDetails?.is_discount_percentage === 1) {
    const discountAmount =
      (foodDetails.price * foodDetails.discount_percentage) / 100;
    mainPrice = foodDetails.price - discountAmount;
  } else {
    mainPrice = foodDetails.price;
  }

  useEffect(() => {
    if (mainPrice) {
      setUnitPrice(mainPrice);
      setTotalPrice((quantity * mainPrice).toFixed(2));
    }
  }, [mainPrice, quantity]);
  useEffect(() => {
    setTotalPrice(
      (
        quantity * unitPrice +
        sidePrice * quantity +
        drinkPrice * quantity +
        drinkRegulerPrice * quantity +
        dipPrice * quantity +
        bakeryPrice * quantity +
        toppingPrice * quantity +
        sandwichPrice * quantity
      ).toFixed(2)
    );
  }, [
    quantity,
    unitPrice,
    sidePrice,
    drinkPrice,
    dipPrice,
    bakeryPrice,
    toppingPrice,
    sandwichPrice,
    drinkRegulerPrice,
  ]);

  useEffect(() => {
    setMyFoodPrice(
      (
        unitPrice +
        sidePrice +
        drinkPrice +
        dipPrice +
        bakeryPrice +
        toppingPrice +
        sandwichPrice
      ).toFixed(2)
    );
  }, [
    unitPrice,
    sidePrice,
    drinkPrice,
    dipPrice,
    bakeryPrice,
    toppingPrice,
    sandwichPrice,
  ]);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const screenWidth = window.innerWidth;

    if (screenWidth >= 768) {
      // Medium (md) and larger devices
      setIsScrolled(scrollPosition > 200); // example value for larger screens
    } else {
      // Small devices
      setIsScrolled(scrollPosition > 400); // example value for small screens
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const handleSidePriceChange = (price) => {
    setSidePrice(price);
  };
  const handleBakeryPriceChange = (price) => {
    setBakeryPrice(price);
  };

  const handleExtraDrinkPriceChange = (price) => {
    setDrinkPrice(price);
  };
  const handleDrinkRegularPrice = (price) => {
    setDrinkRegulerPrice(price);
  };
  const handleDipPriceChange = (price) => {
    setDipPrice(price);
  };
  const handleToppingsPriceChnge = (price) => {
    setToppingsPrice(price);
  };
  const onSandCustPriceChnge = (price) => {
    setSandWichPrice(price);
  };

  const handleSideSelected = (selectedSides) => {
    setSideSelects(selectedSides); // Store the formatted data
  };
  const handleExtraSideSelected = (selectedExtraSides) => {
    setExtraSideSelects(selectedExtraSides); // Store the formatted data
  };

  const handleRicePlattarSelected = (selectedRicePlattar) => {
    setRicePlattarSelects(selectedRicePlattar); // Store the formatted data
  };

  const handleDrinkSelected = (drinkId) => {
    setDrinkId(drinkId);
  };

  const onToppingsChange = (selectedToppingId) => {
    setToppingsData(selectedToppingId);
  };
  const onSandCustChange = (selectSandCustId) => {
    setSandCustData(selectSandCustId);
  };
  const handleDipSelected = (selectedDips) => {
    setDipSelects(selectedDips); // Store the formatted data
  };
  const handleBakerySelected = (selectedBakery) => {
    setBakerySelects(selectedBakery); // Store the formatted data
  };

  const handleFlavorSelected = (selectFlavorId) => {
    setFlavorData(selectFlavorId);
  };

  const handleSelectedDrinksChange = (drinks) => {
    setSelectedDrinks(drinks);
  };
  const handleSelectedExtraDrinksChange = (drinks) => {
    setSelectedExtraDrinks(drinks);
  };
  const components = [
    {
      component:
        foodDetails?.flavor?.how_many_select > 0 ? (
          <FlavorSelection
            flavor={foodDetails.flavor}
            loading={loading}
            sendFlavorData={handleFlavorSelected}
          />
        ) : null,
      sn_number: foodDetails?.flavor?.sn_number,
    },
    {
      component:
        foodDetails?.dip?.how_many_select > 0 ? (
          <DipSection
            dips={foodDetails.dip}
            loading={loading}
            error={error}
            onDipSelected={handleDipSelected}
          />
        ) : null,
      sn_number: foodDetails?.dip?.sn_number,
    },
    {
      component:
        foodDetails?.side?.how_many_select > 0 ? (
          <SideSection
            sides={foodDetails.side}
            loading={loading}
            error={error}
            onSideSelected={handleSideSelected}
          />
        ) : null,
      sn_number: foodDetails?.side?.sn_number,
    },
    {
      component:
        foodDetails?.drink?.data?.length > 0 ? (
          <DrinkSection
            myDrink={foodDetails.drink}
            loading={loading}
            error={error}
            onDrinkSelected={handleDrinkSelected}
            onDrinkRegulerPrice={handleDrinkRegularPrice}
            onSelectedDrinksChange={handleSelectedDrinksChange}
          />
        ) : null,
      sn_number: foodDetails?.drink?.sn_number,
    },
    {
      component:
        foodDetails?.topping?.data?.length > 0 ? (
          <ToppingSection
            myTopping={foodDetails.topping}
            loading={loading}
            error={error}
            onToppingsChange={onToppingsChange}
            onToppingsPriceChnge={handleToppingsPriceChnge}
          />
        ) : null,
      sn_number: foodDetails?.topping?.sn_number,
    },
    {
      component:
        foodDetails?.sandwichCustomize?.data.length > 0 ? (
          <SanwichSection
            mySandwich={foodDetails.sandwichCustomize}
            loading={loading}
            error={error}
            onSandCustChange={onSandCustChange}
            onSandCustPriceChnge={onSandCustPriceChnge}
          />
        ) : null,
      sn_number: foodDetails?.sandwichCustomize?.sn_number,
    },
    {
      component:
        foodDetails?.ricePlatter?.data?.length > 0 ? (
          <RicePlattarCostom
            ricePlatter={foodDetails.ricePlatter}
            loading={loading}
            error={error}
            onRicePlattarSelected={handleRicePlattarSelected}
          />
        ) : null,
      sn_number: foodDetails?.ricePlatter?.sn_number,
    },
    {
      component:
        foodDetails?.bakery?.data?.length > 0 ? (
          <BakerySection
            myBakery={foodDetails.bakery}
            loading={loading}
            error={error}
            onBakerySelected={handleBakerySelected}
            onBakeryPriceChange={handleBakeryPriceChange}
          />
        ) : null,
      sn_number: foodDetails?.ricePlatter?.sn_number,
    },
  ];

  const sortedComponents = components
    .filter((item) => item.component !== null)
    .sort((a, b) => a.sn_number - b.sn_number);

  const handleAddToBag = async () => {
    if (
      foodDetails?.flavor?.is_required === 1 &&
      (!flavorData || flavorData.length === 0)
    ) {
      Swal.fire({
        title: "Flavor is Required",
        text: "Please select at least one flavor.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    if (
      foodDetails?.dip?.is_required === 1 &&
      (!dipSelects || dipSelects.length === 0)
    ) {
      Swal.fire({
        title: "Dip is Required",
        text: "Please select at least one dip.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    if (
      foodDetails?.side?.is_required === 1 &&
      (!sideSelects || sideSelects.length === 0)
    ) {
      Swal.fire({
        title: "Side is Required",
        text: "Please select at least one side.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    if (
      foodDetails?.drink?.is_required === 1 &&
      (!selectedDrinks || selectedDrinks.length === 0)
    ) {
      Swal.fire({
        title: "Drink is Required",
        text: "Please select at least one drink.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    if (
      foodDetails?.sandwichCustomize?.is_required === 1 &&
      (!sandCustData || sandCustData.length === 0)
    ) {
      Swal.fire({
        title: "Sandwich is Required",
        text: "Please select at least one sandwich.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    if (
      foodDetails?.topping?.is_required === 1 &&
      (!toppingsData || toppingsData.length === 0)
    ) {
      Swal.fire({
        title: "Topping is Required",
        text: "Please select at least one topping.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    if (
      foodDetails?.bakery?.is_required === 1 &&
      (!bakerySelects || bakerySelects.length === 0)
    ) {
      Swal.fire({
        title: "Bakery is Required",
        text: "Please select at least one bakery.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    if (
      foodDetails?.ricePlatter?.is_required === 1 &&
      (!ricePlattarSelects || ricePlattarSelects.length === 0)
    ) {
      Swal.fire({
        title: "Rice Platter is Required",
        text: "Please select at least one rice platter.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const formattedFeatures = [
        ...(dipSelects?.map((dip) => ({
          type: "Dip",
          type_id: dip.id,
          is_paid_type: 0,
          quantity: dip.quantity,
        })) || []),
        ...(selectedDrinks?.map((drink) => ({
          type: "Drink",
          type_id: drink.type_id,
          is_paid_type: drink.is_paid_type,
          quantity: drink.quantity,
          child_item_id: drink.child_item_id,
        })) || []),
        ...(selectedExtraDrinks?.map((drink) => ({
          type: "Drink",
          type_id: drink.type_id,
          is_paid_type: drink.is_paid_type,
          quantity: drink.quantity,
          child_item_id: drink.child_item_id,
        })) || []),
        ...(sandCustData?.map((sand) => ({
          type: "Sandwich",
          type_id: sand.id,
          is_paid_type: sand.is_paid_type,
          quantity: sand.quantity,
        })) || []),
        ...(toppingsData?.map((topping) => ({
          type: "Topping",
          type_id: topping.id,
          is_paid_type: topping.is_paid_type,
          quantity: topping.quantity,
        })) || []),
        ...(sideSelects?.map((side) => ({
          type: "Side",
          type_id: side.id,
          is_paid_type: 0,
          quantity: side.quantity,
        })) || []),
        ...(extraSideSelects?.map((side) => ({
          type: "Side",
          type_id: side.type_id,
          is_paid_type: side.is_paid_type,
          quantity: side.quantity,
        })) || []),
        ...(ricePlattarSelects?.map((ricePlattar) => ({
          type: "ricePlatter",
          type_id: ricePlattar.id,
          is_paid_type: 0,
          quantity: ricePlattar.quantity,
        })) || []),
        ...(bakerySelects?.map((bakery) => ({
          type: "Bakery",
          type_id: bakery.type_id,
          is_paid_type: bakery.is_paid_type,
          quantity: bakery.quantity,
        })) || []),
        ...(flavorData?.map((flavor) => ({
          type: "flavor",
          type_id: flavor.id,
          quantity: flavor.quantity,
        })) || []),
      ];

      const data = {
        user_id: user?.id || null,
        guest_user_id: guestUser,
        food_details_id: foodDetailsID,
        quantity,
        price: myFoodPrice,
        features: formattedFeatures,
      };
      setCartLoading(true);
      const response = await API.post("/card/addtocard", data);
      queryClient.invalidateQueries(["wishListVechile", guestUser]);

      if (response.status == 200) {
        setCartLoading(false);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Add to Cart Successfull!",
          showConfirmButton: false,
          timer: 1500,
        });
        // navigate("/foodmenu");
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Add to Cart Failed",
        text: "Failed Add to Cart.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Helmet>
        <title>{`${foodDetails?.name || "Loading"} | Wingsblast`}</title>
      </Helmet>
      <div className="flex flex-col w-full lg:w-10/12 mx-auto">
        <div className="container mx-auto px-6 py-1 bg-white -mt-[15px] lg:mt-6">
          <div className="flex flex-col md:flex-row lg:flex-row items-center lg:gap-10">
            <div className="w-full lg:w-1/3 flex justify-center items-center">
              <div className="bg-white rounded-lg">
                <img
                  src={foodDetails?.image}
                  alt={foodDetails.name}
                  className=" w-[320px] md:w-[400px] lg:w-[350px] h-auto rounded-lg object-cover border-gray-200  transition-shadow duration-300"
                />
              </div>
            </div>

            <div className="w-auto py-1 px-5 ">
              <h1 className="font-TitleFont text-4xl md:text-4xl lg:text-5xl font-s mb-2 text-black">
                {foodDetails.name}
              </h1>
              {foodDetails.is_discount_amount === 1 ? (
                <p className="text-black text-4xl font-TitleFont">
                  <span className="text-2xl text-gray-700 line-through">
                    {" "}
                    ${foodDetails.price}
                  </span>{" "}
                  ${mainPrice.toFixed(2)}{" "}
                  <span className="text-[20px] text-green-600">
                    (Save ${foodDetails.discount_amount})
                  </span>
                  <span className="text-xs ml-1 text-gray-600">
                    {foodDetails.cal}
                  </span>
                </p>
              ) : foodDetails.is_discount_percentage === 1 ? (
                <p className="text-black text-4xl font-TitleFont">
                  <span className="text-2xl text-gray-700 line-through">
                    {" "}
                    ${foodDetails.price}
                  </span>{" "}
                  ${mainPrice.toFixed(2)}{" "}
                  <span className="text-2xl text-green-600">
                    (Save ${(foodDetails.price - mainPrice).toFixed(2)})
                  </span>
                  <span className="text-xs ml-1 text-gray-600">
                    {foodDetails.cal}
                  </span>
                </p>
              ) : (
                <span className="text-4xl font-TitleFont">
                  ${foodDetails.price}
                  <span className="text-xs text-gray-600">
                    {foodDetails.cal}
                  </span>
                </span>
              )}

              <p className="text-black mb-0.5 font-paragraphFont leading-relaxed text-sm md:text-base lg:text-base">
                {foodDetails.description}
              </p>

              <div className="justify-start items-center gap-3 bg-white flex md:gap-4 lg:gap-6">
                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 border border-gray-300 rounded text-lg md:text-xl font-semibold transition duration-200 ease-in-out hover:bg-gray-100"
                    onClick={decrementQuantity}
                  >
                    -
                  </button>
                  <div className="flex items-center justify-center w-12 h-10 md:w-14 md:h-12 border bg-gray-100 border-gray-300 text-lg md:text-xl font-semibold rounded-">
                    {quantity}
                  </div>
                  <button
                    className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 border border-gray-300 rounded text-lg md:text-xl font-semibold transition duration-200 ease-in-out hover:bg-gray-100"
                    onClick={incrementQuantity}
                  >
                    +
                  </button>
                </div>

                {/* Total Price and Add to Cart Button */}
                <div className=" flex items-center bg-gray-300 pl-5 md:justify-end rounded-l-md gap-3">
                  <div className="text-2xl font-TitleFont text-gray-800">
                    ${totalPrice}
                  </div>
                  <button
                    onClick={handleAddToBag}
                    className={`flex items-center justify-center py-2 px-2 md:py-3 whitespace-nowrap text-white font-TitleFont text-lg rounded-r-md bg-ButtonColor transition duration-300 ease-in-out transform hover:bg-ButtonHover ${
                      cartLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    disabled={cartLoading}
                  >
                    {cartLoading ? "Adding..." : "Add To Cart"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {foodDetails?.upgrade_food_details?.length > 0 && (
        <ExtraCombo extraPackege={foodDetails.upgrade_food_details} />
      )}

      {sortedComponents.map((item, index) => (
        <div key={index}>{item.component}</div>
      ))}

      {/* // Extra Combo dip Section */}
      {foodDetails?.dip?.is_extra_addon === 1 && (
        <ExtraDipSection
          allDips={foodDetails.dip.data}
          loading={loading}
          error={error}
          onDipPriceChange={handleDipPriceChange}
          onDipSelected={handleDipSelected}
        />
      )}
      {/* // Extra Combo Side Section */}
      {foodDetails?.side?.is_extra_addon === 1 && (
        <ExtraSideSection
          sides={foodDetails.side}
          loading={loading}
          error={error}
          onExtraSideSelected={handleExtraSideSelected}
          onSidePriceChange={handleSidePriceChange}
        />
      )}
      {/* // Extra Combo Drink Section */}
      {foodDetails?.drink?.is_extra_addon === 1 && (
        <ExtraDrinkSection
          allDrinks={foodDetails.drink.data}
          loading={loading}
          error={error}
          onExtraDrinkPriceChange={handleExtraDrinkPriceChange}
          onSelectedExtraDrinksChange={handleSelectedExtraDrinksChange}
          onExtraDrinkSelected={handleDrinkSelected}
        />
      )}
      
      <AddMoreFood categoryID={foodDetails.category_id} />

      {/* scroll section */}
      <div
        className={`${
          isScrolled
            ? "fixed bottom-0 left-0 right-0 bg-white text-black z-50 transition-all duration-300 shadow-lg"
            : "relative"
        } border-t border-gray-200 px-3 py-2 shadow-lg rounded-md flex gap-3 justify-center items-center`}
      >
        <div className="flex items-center gap-2">
          <button
            className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 border border-gray-300 rounded text-lg md:text-xl font-semibold transition duration-200 ease-in-out hover:bg-gray-100"
            onClick={decrementQuantity}
          >
            -
          </button>
          <div className="flex items-center justify-center w-12 h-10 md:w-14 md:h-12 border border-gray-300 text-lg md:text-xl font-semibold rounded-">
            {quantity}
          </div>
          <button
            className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 border border-gray-300 rounded text-lg md:text-xl font-semibold transition duration-200 ease-in-out hover:bg-gray-100"
            onClick={incrementQuantity}
          >
            +
          </button>
        </div>
        <button
          onClick={handleAddToBag}
          className={`px-5 py-2 text-white font-TitleFont text-xl rounded transform transition-transform duration-300 ${
            cartLoading
              ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
              : "bg-ButtonColor hover:from-indigo-600 hover:to-purple-600 hover:scale-105"
          }`}
          disabled={cartLoading}
        >
          ${totalPrice}{" "}
          <span className="ml-2">
            {cartLoading ? (
              <span className="animate-pulse">Adding...</span>
            ) : (
              "Add To Cart"
            )}
          </span>
        </button>
      </div>
    </>
  );
};

export default FoodDetails;
