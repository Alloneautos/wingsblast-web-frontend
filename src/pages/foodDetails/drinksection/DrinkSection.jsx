import { useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import { BiSolidError } from "react-icons/bi";
import { FaMinus, FaPlus } from "react-icons/fa";
import CustomDrinkModal from "./CustomDrinkModal";

const DrinkSection = ({
  drinks,
  loading,
  error,
  onDrinkPriceChange,
  onDrinkSelected,
  onSelectedDrinksChange,
}) => {
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [drinksNameId, setDrinksNameId] = useState(0);

  const handleDrinkSelect = (selectedDrinkId, drink) => {
    setDrinksNameId(selectedDrinkId);

    const newDrink = {
      type: "Drink",
      type_id: drink.drink_id,
      is_paid_type: drink.isPaid,
      quantity: 1,
      child_item_id: selectedDrinkId,
    };

    setSelectedDrinks([newDrink]); // Only one drink can be selected
    onSelectedDrinksChange([newDrink]); // Notify parent component
  };

  const handleSelectDrink = (drink) => {
    const isAlreadySelected = selectedDrinks.some(
      (selected) => selected.type_id === drink.drink_id
    );

    if (isAlreadySelected) {
      // Deselect the drink if it's already selected
      setSelectedDrinks([]);
      onSelectedDrinksChange([]); // Notify parent component
    } else {
      // Select the new drink and deselect any previously selected drink
      const newDrink = {
        type: "Drink",
        type_id: drink.drink_id,
        is_paid_type: drink.isPaid,
        quantity: 1, // Assuming quantity is always 1 for drinks
        child_item_id: drinksNameId,
      };
      setSelectedDrinks([newDrink]); // Only one drink can be selected
      onSelectedDrinksChange([newDrink]); // Notify parent component
    }
  };

  const handleQuantityChange = (drinkId, increment) => {
    const updatedDrinks = selectedDrinks.map((drink) => {
      if (drink.type_id === drinkId) {
        return {
          ...drink,
          quantity: increment
            ? drink.quantity + 1
            : Math.max(1, drink.quantity - 1), // Ensure quantity is at least 1
        };
      }
      return drink;
    });
    setSelectedDrinks(updatedDrinks);
    onSelectedDrinksChange(updatedDrinks); // Notify parent component
  };

  useEffect(() => {
    // Calculate total price of selected drinks
    const totalPrice = selectedDrinks.reduce((sum, drink) => {
      const drinkData = drinks
        .flatMap((category) => category)
        .find((d) => d.drink_id === drink.type_id);
      return (
        sum +
        (drinkData?.isPaid === 1 ? drinkData.drink_price * drink.quantity : 0)
      );
    }, 0);

    onDrinkPriceChange(totalPrice);
    onDrinkSelected(selectedDrinks);
  }, [selectedDrinks, drinks, onDrinkPriceChange, onDrinkSelected]);

  return (
    <div className="w-full lg:w-10/12 mx-auto my-3 p-2 bg-white rounded-lg shadow-lg">
      <Disclosure>
        {() => (
          <>
            <Disclosure.Button className=" grid md:flex lg:flex justify-between items-center w-full rounded-lg bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 px-6 py-3 text-left text-sm font-medium text-black hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 shadow-md transition ease-in-out duration-300">
              <div>
                <span className="text-lg font-TitleFont lg:text-xl font-semibold">
                  CHOOSE REGULER DRINK
                </span>
                <h2 className="font-bold mt-2 text-gray-600">
                  <span>Selected Drinks: </span>
                  <span className="text-black">
                    {selectedDrinks.length > 0
                      ? selectedDrinks
                          .map(
                            (drink) =>
                              drinks
                                .flatMap((category) => category)
                                .find((d) => d.drink_id === drink.type_id)
                                ?.drink_name
                          )
                          .join(", ")
                      : "(Please select)"}
                  </span>
                </h2>
              </div>
            </Disclosure.Button>
            {error && (
              <p className="text-red-500 mt-4">
                Error loading drinks. Please try again.
              </p>
            )}
            {loading && <p className="text-gray-500 mt-4">Loading drinks...</p>}
            <Disclosure.Panel className="px-4 pt-6 pb-4 text-sm text-gray-700">
              <div className="flavor-selection grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {!loading &&
                  drinks.map((category, index) => (
                    <div key={index} className="w-full">
                      <h3 className="text-md font-semibold mb-2 text-blue-600">
                        {category.category}
                      </h3>
                      <label className="block border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-3">
                            <div className="w-16">
                              <img
                                className="h-16 rounded-full"
                                src={category.drink_image}
                                alt=""
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {category.drink_name}
                              </p>
                              <div className="flex gap-2 text-gray-600">
                                <p className="text-green-500 font-semibold">
                                  {category.isPaid == 1 ? (
                                    <span className="text-black font-medium">
                                      ${category.drink_price}
                                    </span>
                                  ) : (
                                    "Free"
                                  )}
                                </p>
                                <p className="flex items-center gap-1.5">
                                  <BiSolidError className="text-black" />
                                  {category.drink_cal}
                                </p>
                              </div>
                            </div>
                          </div>
                          <input
                            type="radio"
                            className="radio radio-primary"
                            checked={selectedDrinks.some(
                              (drink) => drink.type_id === category.drink_id
                            )}
                            onChange={() => handleSelectDrink(category)}
                          />
                        </div>
                        {selectedDrinks.some(
                          (drink) => drink.type_id === category.drink_id
                        ) && (
                          <div>
                            <CustomDrinkModal
                              onDrinkSelect={(selectedDrinkId) =>
                                handleDrinkSelect(selectedDrinkId, category)
                              }
                            />
                            <div className="items-center justify-center hidden ">
                              <div className="flex items-center gap-3">
                                <button
                                  className="p-1.5 border border-gray-300 rounded-md hover:bg-gray-100"
                                  onClick={() =>
                                    handleQuantityChange(
                                      category.drink_id,
                                      false
                                    )
                                  }
                                >
                                  <FaMinus />
                                </button>
                                <span className="p-2 border-gray-300 text-xl">
                                  {selectedDrinks.find(
                                    (drink) =>
                                      drink.type_id === category.drink_id
                                  )?.quantity || 1}
                                </span>
                                <button
                                  className="p-1.5 border border-gray-300 rounded-md hover:bg-gray-100"
                                  onClick={() =>
                                    handleQuantityChange(
                                      category.drink_id,
                                      true
                                    )
                                  }
                                >
                                  <FaPlus />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </label>
                    </div>
                  ))}
                <div className="w-full">
                  <label className="block border border-gray-300 px-4 py-[30px] mt-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <RxCross2 className="text-4xl text-red-600" />
                        <h1 className="text-2xl font-semibold">No Drink</h1>
                      </div>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary rounded"
                        checked={selectedDrinks.length === 0}
                        onChange={() => {
                          setSelectedDrinks([]);
                          onSelectedDrinksChange([]); // Notify parent component
                        }}
                      />
                    </div>
                  </label>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default DrinkSection;
