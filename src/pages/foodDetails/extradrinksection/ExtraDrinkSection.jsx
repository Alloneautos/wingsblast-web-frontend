import { useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import { BiSolidError } from "react-icons/bi";
import { FaChevronRight } from "react-icons/fa";
import CustomExtraDrinkModal from "./CustomExtraDrinkModal";

const ExtraDrinkSection = ({
  allDrinks,
  loading,
  error,
  onExtraDrinkPriceChange,
  onExtraDrinkSelected,
  onSelectedExtraDrinksChange,
}) => {
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [selectPrice, setSelectPrice] = useState(0);


  const handleDrinkSelect = (selectedDrinkId, drink, quantity) => {
     console.log("Selected Drink ID:", selectedDrinkId);
    const existingDrink = selectedDrinks.find(
      (d) => d.child_item_id === selectedDrinkId && d.type_id === drink.id
    );

    if (existingDrink) {
      // Update quantity if the drink is already selected
      const updatedDrinks = selectedDrinks.map((d) =>
        d.child_item_id === selectedDrinkId && d.type_id === drink.id
          ? { ...d, quantity: d.quantity + quantity }
          : d
      );
      setSelectedDrinks(updatedDrinks);
      onSelectedExtraDrinksChange(updatedDrinks);

      // console.log("Updated Drinks:", updatedDrinks);
    } else {
      // Add new drink
      const newDrink = {
        type: "Drink",
        type_id: drink.id, // Use the category drink's ID
        is_paid_type: 1,
        quantity,
        child_item_id: selectedDrinkId, // Use the selected drink's brand ID
      };

      console.log("New Drink:", newDrink);

      const updatedDrinks = [...selectedDrinks, newDrink];
      setSelectedDrinks(updatedDrinks);
      onSelectedExtraDrinksChange(updatedDrinks);
    }
  };

  const handleSelectDrink = (drink) => {
    const isAlreadySelected = selectedDrinks.some(
      (selected) => selected.type_id === drink.id
    );

    if (isAlreadySelected) {
      // ❌ Remove drink if already selected
      const updatedDrinks = selectedDrinks.filter(
        (selected) => selected.type_id !== drink.id
      );
      setSelectedDrinks(updatedDrinks);
      onSelectedExtraDrinksChange(updatedDrinks);
    } else {
      // ✅ Add new drink
      const newDrink = {
        type: "Drink",
        type_id: drink.id,
        is_paid_type: 1,
        quantity: 1,
        child_item_id: null,
      };
      const updatedDrinks = [...selectedDrinks, newDrink];
      setSelectedDrinks(updatedDrinks);
      onSelectedExtraDrinksChange(updatedDrinks);
    }

    setSelectPrice(drink.price); // Always update price
  };

  useEffect(() => {
    const totalPrice = selectedDrinks.reduce((sum, drink) => {
      const category = allDrinks.find((cat) => cat.id === drink.type_id);
      const drinkData = category?.data?.find((d) => d.id === drink.child_item_id);
      return sum + (drinkData?.price || 0) * drink.quantity;
    }, 0);

    onExtraDrinkPriceChange(totalPrice);
    onExtraDrinkSelected(selectedDrinks);

    // console.log("Selected Drinks:", selectedDrinks);
  }, [selectedDrinks, allDrinks, onExtraDrinkPriceChange, onExtraDrinkSelected]);

  return (
    <div className="w-full lg:w-10/12 mx-auto my-3 p-2 bg-white">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className=" grid md:flex lg:flex justify-between items-center w-full rounded-lg bg-blue-50 px-6 py-3 text-left text-sm font-medium text-black hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 transition ease-in-out duration-300">
              <div>
                <span className="font-TitleFont text-2xl flex items-center gap-1">
                  <span
                    className={`text-lg transform transition-transform duration-300 ${
                      open ? "rotate-90" : "rotate-0"
                    }`}
                  >
                    <FaChevronRight />
                  </span>{" "}
                  CHOOSE EXTRA DRINK
                </span>
                <h2 className="font-bold mt-2 text-gray-600">
                  <span>Selected Drinks: </span>
                  <span className="text-black font-paragraphFont text-base">
                    {selectedDrinks.length > 0
                      ? selectedDrinks
                          .map((drink) => {
                            const drinkData = allDrinks
                              .flatMap((category) => category)
                              .find((d) => d.id === drink.type_id);
                            return drinkData?.name || "Unknown Drink"; // Handle undefined cases
                          })
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
                            <div className="w-16">
                              <img
                                className="h-16 w-16 rounded-full border border-gray-300 bg-cover shadow-md hover:shadow-lg transition duration-300 hover:scale-105 border-gradient-to-r from-blue-400 to-purple-500"
                                src={category.image}
                                alt={category.name}
                              />
                            </div>
                            <div>
                              <p className="font-paragraphFont font-semibold text-base text-black">
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
                        {selectedDrinks
                          .filter((drink) => drink.type_id === category.id)
                          .map((drink) => {
                            return (
                              <div key={drink.child_item_id || drink.type_id}>
                                <CustomExtraDrinkModal
                                  onDrinkSelect={(selectedDrinkId, quantity) =>
                                    handleDrinkSelect(
                                      selectedDrinkId,
                                      category,
                                      quantity
                                    )
                                  }
                                  drinkPrice={selectPrice} // Pass the dynamically selected drink price
                                />
                              </div>
                            );
                          })}
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
                        type="radio"
                        className="radio radio-primary"
                        checked={selectedDrinks.length === 0}
                        onChange={() => {
                          setSelectedDrinks([]);
                          onSelectedExtraDrinksChange([]); // Notify parent component
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
