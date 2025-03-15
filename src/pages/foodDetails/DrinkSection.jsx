import { useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import Coke from "../../assets/images/coke.png";

const DrinkSection = ({
  drinks,
  loading,
  error,
  onDrinkPriceChange,
  onDrinkSelected,
}) => {
  const [selectedDrink, setSelectedDrink] = useState(null);
  const handleSelectDrink = (drink) => {
    if (selectedDrink === drink) {
      setSelectedDrink(null); // Unselect if clicked again
      onDrinkSelected(0);
      onDrinkSelected(null);
    } else {
      setSelectedDrink(drink); // Select new drink
      onDrinkPriceChange(drink.isPaid === 1 ? drink.drink_price : 0);
      onDrinkSelected(drink.drink_id);
    }
  };
  useEffect(() => {
    const price = selectedDrink
      ? selectedDrink.isPaid === 1
        ? selectedDrink.drink_price
        : 0
      : 0;
    onDrinkPriceChange(price);
  }, [selectedDrink, onDrinkPriceChange]);

  console.log(drinks, "drinkd");

  return (
    <div className="w-full lg:w-10/12 mx-auto my-3 p-2 bg-white rounded-lg shadow-lg">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className=" grid md:flex lg:flex justify-between items-center w-full rounded-lg bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 px-6 py-3 text-left text-sm font-medium text-black hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 shadow-md transition ease-in-out duration-300">
              <div>
                <span className="text-xl lg:text-2xl font-semibold">
                  Choose Reguler Drink
                </span>
                <h2 className="font-bold mt-2 text-gray-600">
                  <span>Up To Select: </span>
                  <span className="text-black">
                    {selectedDrink ? selectedDrink.drink_name : "(Selected)"}
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
                            <img
                              className="h-16 rounded-full"
                              src={category.drink_image}
                              alt=""
                            />
                            <div>
                              <p className="font-medium text-gray-800">
                                {category.drink_name}
                              </p>
                              <div className="flex gap-2 text-gray-600">
                                {category.isPaid == 1 && (
                                  <p>+${category.drink_price}</p>
                                )}
                                <p className="flex">💪{category.drink_cal}</p>
                              </div>
                            </div>
                          </div>
                          <input
                            type="radio"
                            name="drink"
                            className="radio radio-success"
                            checked={selectedDrink === category}
                            onChange={() => handleSelectDrink(category)}
                          />
                        </div>
                        {/* {selectedDrink === category && (
                                                <div className="custom-drink-option px-4 py-2 rounded-lg">
                                                    <button
                                                        onClick={() => document.getElementById('drink_option').showModal()}
                                                        className=" text-green-500 text-base">Customize Your Drink</button>
                                                    <h3>Self-Serve Fountain</h3>
                                                </div>
                                            )} */}
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
                        name="drink"
                        className="radio radio-success"
                        checked={!selectedDrink}
                        onChange={() => handleSelectDrink(null)}
                      />
                    </div>
                  </label>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      {/* optional section  */}
      <dialog id="drink_option" className="modal">
        <div className="modal-box p-6 bg-white rounded-lg shadow-lg relative">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-500 hover:text-gray-800">
              ✕
            </button>
          </form>

          <h3 className="font-bold text-3xl text-center text-blue-600 mb-4">
            Customize Your Drink
          </h3>

          <div className="space-y-2">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border hover:shadow-md transition duration-200 cursor-pointer"
              >
                <img
                  src={Coke}
                  alt="Drink"
                  className="w-14 h-14 rounded-full"
                />
                <h3 className="text-xl font-semibold text-gray-800">
                  CokeKola
                </h3>
                <input
                  type="radio"
                  name="radio-5"
                  className="radio radio-success"
                />
              </div>
            ))}
            <div className="flex justify-center gap-1 ">
              <button className="bg-green-700 w-full py-4">CANCEL</button>
              <button className="bg-green-700 w-full  py-4">APPLY</button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default DrinkSection;
