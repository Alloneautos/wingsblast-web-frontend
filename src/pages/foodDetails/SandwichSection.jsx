import { useEffect, useMemo, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import { FaChevronRight } from "react-icons/fa";

const ToppingSection = ({
  mySandwich,
  loading,
  error,
  onSandCustChange,
  onSandCustPriceChnge,
}) => {
  const [selectedSandCust, setSelectedSandCust] = useState([]);

  const sandCust = mySandwich.data;

  // Initialize the first 5 items in selectedSandCust
  useEffect(() => {
    if (sandCust.length > 0) {
      setSelectedSandCust(sandCust.slice(0, 5));
    }
  }, [sandCust]);

  const selectTop = useMemo(() => {
    return selectedSandCust.map((sandwich) => ({
      id: sandwich.id,
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
      return acc + (sandCust.isPaid === 1 ? sandCust.price : 0);
    }, 0);
    onSandCustPriceChnge(totalPrice);
  }, [selectedSandCust, onSandCustPriceChnge]);

  return (
    <div className="w-full lg:w-10/12 mx-auto my-3 p-2 bg-white rounded-lg">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="grid md:flex lg:flex justify-between items-center w-full rounded-lg bg-blue-50 px-6 py-3 text-left text-sm font-medium text-black hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 transition ease-in-out duration-300">
              <div>
                <span className="text-2xl font-TitleFont flex items-center gap-1">
                  <span
                    className={`text-lg transform transition-transform duration-300 ${
                      open ? "rotate-90" : "rotate-0"
                    }`}
                  >
                    <FaChevronRight />
                  </span>{" "}
                  CHOOSE REGULER SANDWICH
                </span>
                <h2 className="font-semibold mt-2 text-xs text-gray-900">
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
                              className="h-16 w-16 rounded-full"
                              src={category.image}
                              alt=""
                            />
                            <div>
                              <p className="font-TitleFont text-lg text-gray-800">
                                {category.name}
                              </p>
                              <div className="flex gap-2 text-gray-600">
                                {category.isPaid === 1 && (
                                  <p>+${category.price}</p>
                                )}
                                <p className="flex">💪{category.cal}</p>
                              </div>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            name="topping"
                            className="checkbox checkbox-primary rounded"
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
                        className="checkbox checkbox-primary rounded"
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
