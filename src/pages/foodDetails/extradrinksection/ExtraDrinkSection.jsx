import { useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import { BiSolidError } from "react-icons/bi";
import { FaChevronRight } from "react-icons/fa";
import CustomExtraDrinkModal from "./CustomExtraDrinkModal";
import { useAllDrinksName } from "../../../api/api";

const ExtraDrinkSection = ({
  allDrinks,
  loading,
  error,
  onExtraDrinkPriceChange,
  onExtraDrinkSelected,
  onSelectedExtraDrinksChange,
}) => {
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [openModals, setOpenModals] = useState({});
  const { allDrinksName } = useAllDrinksName();

  const handleDrinkSelect = (categoryId, selectedDrinkId, quantity) => {
    setSelectedDrinks((prev) => {
      // Remove any existing drinks with the same category and child item
      const filtered = prev.filter(
        (d) =>
          !(d.type_id === categoryId && d.child_item_id === selectedDrinkId)
      );

      // Add the new selection
      return [
        ...filtered,
        {
          type: "drink",
          type_id: categoryId,
          is_paid_type: 1,
          child_item_id: selectedDrinkId,
          quantity: quantity,
        },
      ];
    });
  };

  const toggleModal = (categoryId) => {
    setOpenModals((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  useEffect(() => {
    // Calculate total price
    const totalPrice = selectedDrinks.reduce((sum, drink) => {
      const category = allDrinks.find((cat) => cat.id === drink.type_id);
      const drinkItem = allDrinksName.find((d) => d.id === drink.child_item_id);
      return sum + (drinkItem?.price || category?.price || 0) * drink.quantity;
    }, 0);

    onExtraDrinkPriceChange(totalPrice);

    // Format and send selected drinks data
    const formattedDrinks = selectedDrinks.map((drink) => ({
      type: "drink",
      type_id: drink.type_id,
      is_paid_type: 1,
      child_item_id: drink.child_item_id,
      quantity: drink.quantity,
    }));

    console.log("formattedDrinks", formattedDrinks);
    onExtraDrinkSelected(formattedDrinks);
    onSelectedExtraDrinksChange(formattedDrinks);
  }, [selectedDrinks]);

  return (
    <div className="w-full lg:w-10/12 mx-auto my-3 p-2 bg-white">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="grid md:flex lg:flex justify-between items-center w-full rounded-lg bg-blue-50 px-6 py-3 text-left text-sm font-medium text-black hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 transition ease-in-out duration-300">
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
                            const category = allDrinks.find(
                              (cat) => cat.id === drink.type_id
                            );
                            const drinkItem = allDrinksName.find(
                              (d) => d.id === drink.child_item_id
                            );
                            return (
                              drinkItem?.name ||
                              category?.name ||
                              "Unknown Drink"
                            );
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
                  allDrinks.map((category) => (
                    <div key={category.id} className="w-full">
                      <h3 className="text-md font-semibold mb-2 text-blue-600">
                        {category.name}
                      </h3>
                      <label className="block border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-3">
                            <div className="w-16">
                              <img
                                className="h-16 w-16 rounded-full border border-gray-300 bg-cover shadow-md hover:shadow-lg transition duration-300 hover:scale-105"
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
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleModal(category.id);
                            }}
                          >
                            Select
                          </button>
                        </div>

                        {openModals[category.id] && (
                          <CustomExtraDrinkModal
                            allDrinks={allDrinks}
                            categoryId={category.id}
                            drinkPrice={category.price}
                            onDrinkSelect={(drinkId, quantity) =>
                              handleDrinkSelect(category.id, drinkId, quantity)
                            }
                            onClose={() => toggleModal(category.id)}
                            selectedDrinks={selectedDrinks.filter(
                              (d) => d.type_id === category.id
                            )}
                          />
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
                        type="radio"
                        className="radio radio-primary"
                        checked={selectedDrinks.length === 0}
                        onChange={() => {
                          setSelectedDrinks([]);
                          onSelectedExtraDrinksChange([]);
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
