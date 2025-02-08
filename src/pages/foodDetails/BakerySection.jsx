import { Disclosure } from "@headlessui/react";
import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";

const BakerySection = ({ bakery, loading,error, onBakeryPriceChange, onBakerySelected }) => {
    const [selectBakery, setSelectBakery] = useState(null);
    const handleSelectBakery = (bakery) => {
        if (selectBakery === bakery) {
            setSelectBakery(null);
            onBakerySelected(0);
            onBakerySelected(null)
        } else {
            setSelectBakery(bakery);
            onBakeryPriceChange(bakery.isPaid === 1 ? bakery.beverage_price: 0);
            onBakerySelected(bakery.beverage_food_id);
        }
    }
    useEffect(() => {
        const price = selectBakery ? selectBakery.isPaid === 1
                        ? selectBakery.beverage_price: 0
                        : 0;
                        onBakeryPriceChange(price)
    },[selectBakery, onBakeryPriceChange]);
  return (
    <div className="w-full lg:w-10/12 mx-auto my-3 p-2 bg-white rounded-lg shadow-lg">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className=" grid md:flex lg:flex justify-between items-center w-full rounded-lg bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 px-6 py-3 text-left text-sm font-medium text-black hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 shadow-md transition ease-in-out duration-300">
              <div>
                <span className="text-xl lg:text-2xl font-semibold">
                  Choose Reguler Bakery
                </span>
                <h2 className="font-bold mt-2 text-gray-600">
                  <span>Up To Select: </span>
                  <span className="text-black">
                    {selectBakery ? selectBakery.beverage_name : "(Selected)"}
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
                                <p className="flex">💪{category.beverage_cal}</p>
                              </div>
                            </div>
                          </div>
                          <input
                            type="radio"
                            name="bakery"
                            className="radio radio-success"
                            checked={selectBakery === category}
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
                        type="radio"
                        name="bakery"
                        className="radio radio-success"
                        checked={!selectBakery}
                        onChange={() => handleSelectBakery(null)}
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
