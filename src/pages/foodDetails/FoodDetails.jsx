import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../assets/images/loader.gif";
import FlavorSelection from "./FlavorSelection";
import {
  API,
  useFoodDetails,
  useGuestUser,
  useUserProfile,
} from "../../api/api";
import DrinkSection from "./DrinkSection";
import SideSection from "./SideSection";
import DipSection from "./DipSection";
import BakerySection from "./BakerySection";
import Swal from "sweetalert2";
import ToppingSection from "./ToppingSection";
import SanwichSection from "./SandwichSection";
// import RicePlattarCostom from "./RicePlattarCostom";
import { useQueryClient } from "@tanstack/react-query";
import AddMoreFood from "./AddMoreFood";

const FoodDetails = () => {
  const queryClient = useQueryClient();
  const { guestUser } = useGuestUser();
  const { user } = useUserProfile();
  const { foodDetailsID } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);
  const { foodDetails, loading, error } = useFoodDetails(foodDetailsID);
  const [dipId, setDipId] = useState(null);
  const [sideId, setSideId] = useState(null);
  const [drinkId, setDrinkId] = useState(null);
  const [bakeryId, setBakeryId] = useState(null);
  const [toppingsData, setToppingsData] = useState(null);
  const [sandCustData, setSandCustData] = useState(null);
  const [flavorData, setFlavorData] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);

  const navigate = useNavigate();
  const [unitPrice, setUnitPrice] = useState(0);
  const [sidePrice, setSidePrice] = useState(0);
  const [bakeryPrice, setBakryPrice] = useState(0);
  const [drinkPrice, setDrinkPrice] = useState(0);
  const [dipPrice, setDipPrice] = useState(0);
  const [toppingPrice, setToppingsPrice] = useState(0);
  const [sandwichPrice, setSandWichPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [myFoodPrice, setMyFoodPrice] = useState(0);
  const [isDrinkPrice, setIsDrinkPrice] = useState(0);
  const [isSidePrice, setIsSidePrice] = useState(0);
  const [isDipPrice, setIsDipPrice] = useState(0);
  const [isBakeryPrice, setIsBakeryPrice] = useState(0);

  useEffect(() => {
    setIsDrinkPrice(drinkPrice > 0 ? 1 : 0);
  }, [drinkPrice]);
  useEffect(() => {
    setIsSidePrice(sidePrice > 0 ? 1 : 0);
  }, [sidePrice]);
  useEffect(() => {
    setIsDipPrice(dipPrice > 0 ? 1 : 0);
  }, [dipPrice]);
  useEffect(() => {
    setIsBakeryPrice(bakeryPrice > 0 ? 1 : 0);
  }, [bakeryPrice]);

  useEffect(() => {
    if (foodDetails?.price) {
      setUnitPrice(foodDetails.price);
      setTotalPrice((quantity * foodDetails.price).toFixed(2));
    }
  }, [foodDetails.price, quantity]);
  useEffect(() => {
    setTotalPrice(
      (
        quantity * unitPrice +
        sidePrice * quantity +
        drinkPrice * quantity +
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
    setIsScrolled(scrollPosition > 200);
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

  const handleDrinkPriceChange = (price) => {
    // Fixed typo here
    setDrinkPrice(price);
  };
  const onBakeryPriceChange = (price) => {
    setBakryPrice(price);
  };
  const handleDipPriceChange = (price) => {
    // Fixed typo here
    setDipPrice(price);
  };
  const handleToppingsPriceChnge = (price) => {
    setToppingsPrice(price);
  };
  const onSandCustPriceChnge = (price) => {
    setSandWichPrice(price);
  };

  const handleSideSelected = (sideId) => {
    setSideId(sideId);
  };

  const handleDrinkSelected = (drinkId) => {
    setDrinkId(drinkId);
    console.log(drinkId, "drinkid");
  };

  const onToppingsChange = (selectedToppingId) => {
    setToppingsData(selectedToppingId);
  };
  const onSandCustChange = (selectSandCustId) => {
    setSandCustData(selectSandCustId);
  };
  const handleDipSelected = (selectedDipId) => {
    setDipId(selectedDipId);
  };
  const handleBakerySelected = (selectedBakery) => {
    setBakeryId(selectedBakery);
  };

  const handleFlavorSelected = (selectFlavorId) => {
    setFlavorData(selectFlavorId);
  };

  const handleAddToBag = async () => {
    try {
      const data = {
        user_id: user.id,
        guest_user_id: guestUser,
        food_details_id: foodDetailsID,
        quantity,
        price: myFoodPrice,
        flavers: flavorData,
        toppings: toppingsData,
        sandCust: sandCustData,
        // dip
        dip_id: dipId,
        is_dip_paid: isDipPrice,
        // side
        side_id: sideId,
        is_side_paid: isSidePrice,
        // drink
        drink_id: drinkId,
        is_drink_paid: isDrinkPrice,
        // bakery
        bakery_id: bakeryId,
        is_bakery_paid: isBakeryPrice,
        // toppings
      };

      const response = await API.post("/card/add", data);
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
        navigate("/foodmenu");
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
    return (
      <div className="flex items-center justify-center">
        <img src={Loader} alt="Loading..." className="w-[150px]" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="flex flex-col w-full lg:w-10/12 mx-auto">
        <div className="container mx-auto p-6 bg-white -mt-[15px] lg:mt-6">
          <div className="flex flex-col md:flex-row lg:flex-row items-center lg:gap-10">
            <div className="w-full lg:w-1/3 flex justify-center items-center">
              <div className="bg-white rounded-lg p-4">
                <img
                  src={foodDetails.image}
                  alt={foodDetails.name}
                  className=" w-[320px] md:w-[400px] lg:w-[400px] h-auto rounded-lg object-cover border-gray-200  transition-shadow duration-300"
                />
              </div>
            </div>

            <div className="w-auto p-4">
              <h1 className="font-TitleFont text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-black">
                {foodDetails.name.toUpperCase()}
              </h1>
              <p className="text-black text-lg md:text-xl font-medium mb-4">
                ${foodDetails.price}
                <span className="text-xs text-gray-700">
                  {" "}
                  {foodDetails.cal}
                </span>
              </p>
              <p className="text-black mb-6 leading-relaxed text-sm md:text-base lg:text-base">
                {foodDetails.description}
              </p>

              <div className="flex-col md:flex-row justify-start items-center gap-9 p-4 bg-white flex md:gap-4 lg:gap-6">
                {/* Quantity Controls */}
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

                {/* Total Price and Add to Cart Button */}
                <div className=" flex items-center bg-gray-100 pl-5 md:justify-end rounded-l-md gap-3">
                  <div className="text-lg md:text-xl font-bold text-gray-800">
                    ${totalPrice}
                  </div>
                  <button
                    onClick={handleAddToBag}
                    className={`flex items-center justify-center py-2 px-6 md:py-3 text-white font-semibold rounded-r-md bg-ButtonColor transition duration-300 ease-in-out transform hover:scale-105 hover:bg-ButtonHover ${
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

      {foodDetails.toppings && foodDetails.toppings.length > 0 ? (
        <ToppingSection
          toppings={foodDetails.toppings}
          loading={loading}
          error={error}
          onToppingsChange={onToppingsChange}
          onToppingsPriceChnge={handleToppingsPriceChnge}
        />
      ) : null}
      {foodDetails.howManyChoiceFlavor > 0 ? (
        <FlavorSelection
          flavorReq={foodDetails.howManyFlavor}
          choiceFlavorReq={foodDetails.howManyChoiceFlavor}
          sendFlavorData={handleFlavorSelected}
        />
      ) : null}

      {/* {foodDetails.sides && foodDetails.sides.length > 0 ? (
        <RicePlattarCostom
          plattarSide={foodDetails.sides}
          loading={loading}
          error={error}
          onToppingsChange={onToppingsChange}
          onToppingsPriceChnge={handleToppingsPriceChnge}
        ></RicePlattarCostom>
       ) : null} */}

      {foodDetails.dips && foodDetails.dips.length > 0 ? (
        <DipSection
          dips={foodDetails.dips}
          loading={loading}
          error={error}
          onDipPriceChange={handleDipPriceChange}
          onDipSelected={handleDipSelected}
        />
      ) : null}

      {foodDetails.sides && foodDetails.sides.length > 0 ? (
        <SideSection
          sides={foodDetails.sides}
          loading={loading}
          error={error}
          onSideSelected={handleSideSelected}
          onSidePriceChange={handleSidePriceChange}
        />
      ) : null}

      {foodDetails.drinks && foodDetails.drinks.length > 0 ? (
        <DrinkSection
          drinks={foodDetails.drinks}
          loading={loading}
          error={error}
          onDrinkSelected={handleDrinkSelected}
          onDrinkPriceChange={handleDrinkPriceChange}
        />
      ) : null}

      {foodDetails.beverages && foodDetails.beverages.length > 0 ? (
        <BakerySection
          bakery={foodDetails.beverages}
          loading={loading}
          error={error}
          onBakerySelected={handleBakerySelected}
          onBakeryPriceChange={onBakeryPriceChange}
        />
      ) : null}
      {foodDetails.sandCust && foodDetails.sandCust.length > 0 ? (
        <SanwichSection
          sandCust={foodDetails.sandCust}
          loading={loading}
          error={error}
          onSandCustChange={onSandCustChange}
          onSandCustPriceChnge={onSandCustPriceChnge}
        />
      ) : null}

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
          className={`px-5 py-2 text-white font-semibold rounded transform transition-transform duration-300 ${
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
