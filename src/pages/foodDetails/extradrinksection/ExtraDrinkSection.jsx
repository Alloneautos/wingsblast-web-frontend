import { useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import { BiSolidError } from "react-icons/bi";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useAllDrinks } from "../../../api/api";
import CustomDrinkModal from "./CustomDrinkModal";

const ExtraDrinkSection = ({
  onDrinkPriceChange = () => {},
  onDrinkSelected = () => {},
  onSelectedDrinksChange = () => {},
}) => {
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const { allDrinks, loading, error } = useAllDrinks();

  const handleSelectDrink = (drink) => {
    const isAlreadySelected = selectedDrinks.some(
      (selected) => selected.type_id === drink.id
    );

    if (isAlreadySelected) {
      // Remove drink if already selected
      const updatedDrinks = selectedDrinks.filter(
        (selected) => selected.type_id !== drink.id
      );
      setSelectedDrinks(updatedDrinks);
      onSelectedDrinksChange(updatedDrinks); // Notify parent component
    } else {
      // Add new drink
      const newDrink = {
        type: "Drink",
        type_id: drink.id,
        is_paid_type: drink.isPaid,
        quantity: 1, // Assuming quantity is always 1 for drinks
      };
      const updatedDrinks = [...selectedDrinks, newDrink];
      setSelectedDrinks(updatedDrinks);
      onSelectedDrinksChange(updatedDrinks); // Notify parent component
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
      const drinkData = allDrinks
        .flatMap((category) => category)
        .find((d) => d.id === drink.type_id);
      return sum + drinkData.price * drink.quantity;
    }, 0);

    onDrinkPriceChange(totalPrice);
    onDrinkSelected(selectedDrinks);
  }, [selectedDrinks, allDrinks, onDrinkPriceChange, onDrinkSelected]);

  return (
    <div className="w-full lg:w-10/12 mx-auto my-3 p-2 bg-white rounded-lg shadow-lg">
      <Disclosure>
        {() => (
          <>
            <Disclosure.Button className=" grid md:flex lg:flex justify-between items-center w-full rounded-lg bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 px-6 py-3 text-left text-sm font-medium text-black hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 shadow-md transition ease-in-out duration-300">
              <div>
                <span className="text-lg font-TitleFont lg:text-xl font-semibold">
                  CHOOSE EXTRA DRINK
                </span>
                <h2 className="font-bold mt-2 text-gray-600">
                  <span>Selected Drinks: </span>
                  <span className="text-black">
                    {selectedDrinks.length > 0
                      ? selectedDrinks
                          .map(
                            (drink) =>
                              allDrinks
                                .flatMap((category) => category)
                                .find((d) => d.id === drink.type_id)?.name
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
                  allDrinks.map((category, index) => (
                    <div key={index} className="w-full">
                      <h3 className="text-md font-semibold mb-2 text-blue-600">
                        {category.category}
                      </h3>
                      <label className="block border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-3">
                            <img
                              className="h-16 rounded-full"
                              src={category.image}
                              alt=""
                            />
                            <div>
                              <p className="font-medium text-gray-800">
                                {category.name}
                              </p>
                              <div className="flex gap-2 text-gray-600">
                                <p className="text-green-500 font-semibold">
                                  <span className="text-black font-medium">
                                    ${category.price}
                                  </span>
                                </p>
                                <p className="flex items-center gap-1.5">
                                  <BiSolidError className="text-black" />
                                  {category.cal}
                                </p>
                              </div>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary rounded"
                            checked={selectedDrinks.some(
                              (drink) => drink.type_id === category.id
                            )}
                            onChange={() => handleSelectDrink(category)}
                          />
                        </div>
                        {selectedDrinks.some(
                          (drink) => drink.type_id === category.id
                        ) && (
                          <div>
                            <CustomDrinkModal />
                            <div className="flex items-center justify-center  ml-3">
                              <div className="flex items-center gap-3">
                                <button
                                  className="p-1.5 border border-gray-300 rounded-md hover:bg-gray-100"
                                  onClick={() =>
                                    handleQuantityChange(category.id, false)
                                  }
                                >
                                  <FaMinus />
                                </button>
                                <span className="p-2 border-gray-300 text-xl">
                                  {selectedDrinks.find(
                                    (drink) => drink.type_id === category.id
                                  )?.quantity || 1}
                                </span>
                                <button
                                  className="p-1.5 border border-gray-300 rounded-md hover:bg-gray-100"
                                  onClick={() =>
                                    handleQuantityChange(category.id, true)
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

export default ExtraDrinkSection;
