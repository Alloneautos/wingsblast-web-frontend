import { Disclosure } from "@headlessui/react";
import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import LoadingComponent from "../../components/LoadingComponent";
import { FaChevronRight } from "react-icons/fa";
import { BiSolidError } from "react-icons/bi";

const FishSection = ({
  myFish,
  loading,
  error,
  onFishPriceChange,
  onFishSelected,
}) => {
  const [selectedFish, setSelectedFish] = useState(null);
  const fish = myFish.data;

  const handleSelectFish = (fishItem) => {
    if (selectedFish && selectedFish.id === fishItem.id) {
      setSelectedFish(null);
      onFishPriceChange(0);
      onFishSelected([]);
    } else {
      setSelectedFish(fishItem);
      const price = fishItem.isPaid === 1 ? fishItem.price : 0;
      onFishPriceChange(price);
      onFishSelected([
        {
          type: "fish_choice",
          type_id: fishItem.id,
          is_paid_type: fishItem.isPaid === 1 ? 1 : 0,
          quantity: 1,
        },
      ]);
    }
  };

  useEffect(() => {
    if (!selectedFish) {
      onFishPriceChange(0);
      onFishSelected([]);
    }
  }, [selectedFish, onFishPriceChange, onFishSelected]);

  return (
    <div className="w-full lg:w-10/12 mx-auto my-3 p-2 bg-white rounded-lg">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="w-full rounded-lg bg-blue-50 px-6 py-3 text-left text-sm font-medium text-black hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 transition ease-in-out duration-300">
              <div className="flex justify-between items-center w-full">
                <span className="font-TitleFont text-2xl flex items-center gap-1">
                  <span
                    className={`text-lg transform transition-transform duration-300 ${
                      open ? "rotate-90" : "rotate-0"
                    }`}
                  >
                    <FaChevronRight />
                  </span>{" "}
                  CHOOSE REGULAR FISH
                </span>
                <span>
                  {myFish.is_required === 1 && !selectedFish ? (
                    <span className="text-red-700">
                      <span className="text-sm font-semibold">Required</span>
                    </span>
                  ) : (
                    <span className="text-green-600">
                      <span className="text-sm font-semibold">
                        {selectedFish ? "Done" : "Optional"}
                      </span>
                    </span>
                  )}
                </span>
              </div>
              <h2 className="font-semibold mt-2 text-xs text-gray-900">
                <span>Selected: </span>
                <span className="text-black">
                  {selectedFish ? selectedFish.name : "None"}
                </span>
              </h2>
            </Disclosure.Button>
            {error && (
              <p className="text-red-500 mt-4">
                Error loading fish. Please try again.
              </p>
            )}
            {loading && <LoadingComponent />}
            <Disclosure.Panel className="px-4 pt-6 pb-4 text-sm text-gray-700">
              <div className="flavor-selection grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                 <div className="w-full">
                  <label className="block border border-gray-300 px-4 py-[30px] rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <RxCross2 className="text-4xl text-red-600" />
                        <h1 className="text-2xl font-TitleFont text-black">
                          No Fish
                        </h1>
                      </div>
                      <input
                        type="radio"
                        name="fish"
                        className="radio radio-primary"
                        checked={!selectedFish}
                        onChange={() => setSelectedFish(null)}
                      />
                    </div>
                  </label>
                </div>
                {!loading &&
                  fish.map((category, index) => (
                    <div key={index} className="w-full">
                      <label className="block border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-3">
                            <img
                              className="h-16 rounded-full"
                              src={category.image}
                              alt={category.name}
                            />
                            <div>
                              <p className="font-TitleFont text-black text-lg">
                                {category.name}
                              </p>
                              <div className="flex gap-2 text-gray-600">
                                {category.isPaid == 1 && (
                                  <p>+${category.price}</p>
                                )}
                                <p className="flex gap-1 items-center">
                                  <BiSolidError className="text-black"/>
                                  {category.cal}
                                </p>
                              </div>
                            </div>
                          </div>
                          <input
                            type="radio"
                            name="fish"
                            className="radio radio-primary"
                            checked={
                              selectedFish && selectedFish.id === category.id
                            }
                            onChange={() => handleSelectFish(category)}
                          />
                        </div>
                      </label>
                    </div>
                  ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default FishSection;
