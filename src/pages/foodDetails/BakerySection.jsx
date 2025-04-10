import { Disclosure } from "@headlessui/react";
import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";

const BakerySection = ({
  bakery,
  loading,
  error,
  onBakeryPriceChange,
  onBakerySelected,
}) => {
  const [selectedBakeries, setSelectedBakeries] = useState([]);

  const handleSelectBakery = (bakery) => {
    const isSelected = selectedBakeries.includes(bakery);
    let updatedSelection;

    if (isSelected) {
      updatedSelection = selectedBakeries.filter((item) => item !== bakery);
    } else {
      updatedSelection = [...selectedBakeries, bakery];
    }

    setSelectedBakeries(updatedSelection);

    const totalPrice = updatedSelection.reduce((sum, item) => {
      return sum + (item.isPaid === 1 ? item.beverage_price : 0);
    }, 0);

    onBakeryPriceChange(totalPrice);

    const formattedData = updatedSelection.map((item) => ({
      type: "Bakery",
      type_id: item.beverage_id,
      is_paid_type: item.isPaid,
      quantity: 1,
    }));

    onBakerySelected(formattedData);
  };

  useEffect(() => {
    const totalPrice = selectedBakeries.reduce((sum, item) => {
      return sum + (item.isPaid === 1 ? item.beverage_price : 0);
    }, 0);
    onBakeryPriceChange(totalPrice);
  }, [selectedBakeries, onBakeryPriceChange]);

  return (
    <div className="w-full lg:w-10/12 mx-auto my-3 p-2 bg-white rounded-lg shadow-lg">
      <Disclosure>
        {() => (
          <>
            <Disclosure.Button className=" grid md:flex lg:flex justify-between items-center w-full rounded-lg bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 px-6 py-3 text-left text-sm font-medium text-black hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 shadow-md transition ease-in-out duration-300">
              <div>
                <span className="text-lg font-TitleFont lg:text-xl font-semibold">
                  CHOOSE REGULER BAKERY
                </span>
                <h2 className="font-bold mt-2 text-gray-600">
                  <span>Selected: </span>
                  <span className="text-black">
                    {selectedBakeries.length > 0
                      ? selectedBakeries.map((item) => item.beverage_name).join(", ")
                      : "(None)"}
                  </span>
                </h2>
              </div>
            </Disclosure.Button>
            {error && (
              <p className="text-red-500 mt-4">
                Error loading Bakery. Please try again.
              </p>
            )}
            {loading && <p className="text-gray-500 mt-4">Loading Bakery...</p>}
            <Disclosure.Panel className="px-4 pt-6 pb-4 text-sm text-gray-700">
              <div className="flavor-selection grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {!loading &&
                  bakery.map((category, index) => (
                    <div key={index} className="w-full">
                      <h3 className="text-md font-semibold mb-2 text-blue-600">
                        {category.category}
                      </h3>
                      <label className="block border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-3">
                            <img
                              className="h-16 rounded-full"
                              src={category.beverage_image}
                              alt=""
                            />
                            <div>
                              <p className="font-medium text-gray-800">
                                {category.beverage_name}
                              </p>
                              <div className="flex gap-2 text-gray-600">
                                {category.isPaid == 1 && (
                                  <p>+${category.beverage_price}</p>
                                )}
                                <p className="flex">
                                  💪{category.beverage_cal}
                                </p>
                              </div>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary rounded"
                            checked={selectedBakeries.includes(category)}
                            onChange={() => handleSelectBakery(category)}
                          />
                        </div>
                      </label>
                    </div>
                  ))}
                <div className="w-full">
                  <label className="block border border-gray-300 px-4 py-[30px] mt-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <RxCross2 className="text-4xl text-red-600" />
                        <h1 className="text-2xl font-semibold">No Bakery</h1>
                      </div>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary rounded"
                        checked={selectedBakeries.length === 0}
                        onChange={() => setSelectedBakeries([])}
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

export default BakerySection;
