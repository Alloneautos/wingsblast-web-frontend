import { useEffect, useMemo, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";

const ToppingSection = ({
  sandCust,
  loading,
  error,
  onSandCustChange,
  onSandCustPriceChnge,
}) => {
  const [selectedSandCust, setSelectedSandCust] = useState([]);

  // Initialize the first 5 items in selectedSandCust
  useEffect(() => {
    if (sandCust.length > 0) {
      setSelectedSandCust(sandCust.slice(0, 5));
    }
  }, [sandCust]);

  const selectTop = useMemo(() => {
    return selectedSandCust.map((sandwich) => ({
      id: sandwich.sandCust_id,
      isPaid: sandwich.isPaid,
    }));
  }, [selectedSandCust]);

  useEffect(() => {
    onSandCustChange(selectTop);
  }, [selectTop, onSandCustChange]);

  const handleSelectTopping = (sandCust) => {
    setSelectedSandCust((prev) => {
      const updatedSandCust = prev.includes(sandCust)
        ? prev.filter((item) => item !== sandCust)
        : [...prev, sandCust];
      return updatedSandCust;
    });
  };

  useEffect(() => {
    const totalPrice = selectedSandCust.reduce((acc, sandCust) => {
      return acc + (sandCust.isPaid === 1 ? sandCust.sandCust_price : 0);
    }, 0);
    onSandCustPriceChnge(totalPrice);
  }, [selectedSandCust, onSandCustPriceChnge]);

  return (
    <div className="w-full lg:w-10/12 mx-auto my-3 p-2 bg-white rounded-lg shadow-lg">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="grid md:flex lg:flex justify-between items-center w-full rounded-lg bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 px-6 py-3 text-left text-sm font-medium text-black hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 shadow-md transition ease-in-out duration-300">
              <div>
                <span className="text-xl lg:text-xl font-semibold">
                  CHOOSE REGULER SANDWICH
                </span>
                <h2 className="font-bold mt-2 text-gray-600">
                  <span>Up To Select: </span>
                  <span className="text-black">
                    {selectedSandCust.length} selected
                  </span>
                </h2>
              </div>
            </Disclosure.Button>
            {error && (
              <p className="text-red-500 mt-4">
                Error loading toppings. Please try again.
              </p>
            )}
            {loading && (
              <p className="text-gray-500 mt-4">Loading Toppings...</p>
            )}
            <Disclosure.Panel className="px-4 pt-6 pb-4 text-sm text-gray-700">
              <div className="flavor-selection grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {!loading &&
                  sandCust.map((category, index) => (
                    <div key={index} className="w-full">
                      <h3 className="text-md font-semibold mb-2 text-blue-600">
                        {category.category}
                      </h3>
                      <label className="block border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-3">
                            <img
                              className="h-16 rounded-full"
                              src={category.sandCust_image}
                              alt=""
                            />
                            <div>
                              <p className="font-medium text-gray-800">
                                {category.sandCust_name}
                              </p>
                              <div className="flex gap-2 text-gray-600">
                                {category.isPaid === 1 && (
                                  <p>+${category.sandCust_price}</p>
                                )}
                                <p className="flex">
                                  💪{category.sandCust_cal}
                                </p>
                              </div>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            name="topping"
                            className="checkbox checkbox-primary"
                            checked={selectedSandCust.includes(category)}
                            onChange={() => handleSelectTopping(category)}
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
                        <h1 className="text-2xl font-semibold">No Topping</h1>
                      </div>
                      <input
                        type="checkbox"
                        name="noTopping"
                        className="checkbox checkbox-primary"
                        checked={selectedSandCust.length === 0}
                        onChange={() => {
                          setSelectedSandCust([]);
                          onSandCustChange([]); // Clear all selections
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

export default ToppingSection;
