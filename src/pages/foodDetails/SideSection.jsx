import { useState, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";

const SideSection = ({
  sides,
  loading,
  error,
  onSidePriceChange,
  onSideSelected,
}) => {
  const [selectedSides, setSelectedSides] = useState(null);

  const handleSelectSide = (side) => {
    if (selectedSides === side) {
      setSelectedSides(null);
      onSidePriceChange(0);
      onSideSelected(null); // Unselect করলে null পাঠাবে
    } else {
      setSelectedSides(side);
      onSidePriceChange(side.isPaid === 1 ? side.side_price : 0);
      onSideSelected(side.side_id); // সিলেক্টেড সাইডের id পাঠাবে
    }
  };
  // Update the total price when a side is selected or unselected
  useEffect(() => {
    const price = selectedSides
      ? selectedSides.isPaid === 1
        ? selectedSides.side_price
        : 0
      : 0;
    onSidePriceChange(price); // Use the correct prop function to send the price
  }, [selectedSides, onSidePriceChange]);

  return (
    <div className="w-full lg:w-10/12 mx-auto my-3 p-2 bg-white rounded-lg shadow-lg">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="grid md:flex lg:flex justify-between items-center w-full rounded-lg bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 px-6 py-3 text-left text-sm font-medium text-black hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 shadow-md transition ease-in-out duration-300">
              <div>
                <span className="text-lg font-TitleFont lg:text-2xl font-semibold">
                  CHOOSE REGULAR SIDE
                </span>
                <h2 className="font-bold mt-2 text-gray-600">
                  <span>Up To Select: </span>
                  <span className="text-black">
                    {selectedSides ? selectedSides.side_name : "(Selected)"}
                  </span>
                </h2>
              </div>
            </Disclosure.Button>
            {error && (
              <p className="text-red-500 mt-4">
                Error loading sides. Please try again.
              </p>
            )}
            {loading && <p className="text-gray-500 mt-4">Loading sides...</p>}
            <Disclosure.Panel className="px-4 pt-6 pb-4 text-sm text-gray-700">
              <div className="flavor-selection grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {!loading &&
                  sides.map((category, index) => (
                    <div key={index} className="w-full">
                      <h3 className="text-md font-semibold mb-2 text-blue-600">
                        {category.category}
                      </h3>
                      <label className="block border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-3">
                            <img
                              className="w-[65px] h-[65px] rounded-full"
                              src={category.side_image}
                              alt=""
                            />
                            <div>
                              <p className="font-medium text-gray-800">
                                {category.side_name}
                              </p>
                              <div className="flex items-center gap-2 mt-2 text-gray-600">
                                {category.isPaid === 1 && (
                                  <p>+$ {category.side_price}</p>
                                )}
                                <p className="flex">💪 {category.side_cal}</p>
                              </div>
                            </div>
                          </div>
                          <input
                            type="radio"
                            name="side"
                            className="radio radio-success"
                            checked={selectedSides === category}
                            onChange={() => handleSelectSide(category)}
                          />
                        </div>
                        {/* {selectedSides === category && (
                                                <div className="custom-side-option px-4 py-2 rounded-lg">
                                                    <button
                                                        onClick={() => document.getElementById('side_option').showModal()}
                                                        className="text-green-500 text-base">Customize Your side</button>
                                                    <h3>Self-Serve Fountain</h3>
                                                </div>
                             )} */}
                      </label>
                    </div>
                  ))}
                <div className="w-full">
                  <label className="block border border-gray-300 px-4 py-[32px] mt-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <RxCross2 className="text-4xl text-red-600" />
                        <h1 className="text-2xl font-semibold">NO SIDE</h1>
                      </div>
                      <input
                        type="radio"
                        name="side"
                        className="radio radio-success"
                        checked={!selectedSides}
                        onChange={() => handleSelectSide(null)}
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
      <dialog id="side_option" className="modal">
        <div className="modal-box p-6 bg-white rounded-lg shadow-lg relative">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-500 hover:text-gray-800">
              ✕
            </button>
          </form>

          <h3 className="font-bold text-3xl text-center text-blue-600 mb-4">
            Customize Your Sides
          </h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg border hover:shadow-md transition duration-200 cursor-pointer">
              <h3 className="text-xl font-semibold text-gray-800">
                No Cheese Sauce
              </h3>
              <input type="checkbox" className="checkbox checkbox-info" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border hover:shadow-md transition duration-200 cursor-pointer">
              <h3 className="text-xl font-semibold text-gray-800">No Ranch</h3>
              <input type="checkbox" className="checkbox checkbox-info" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border hover:shadow-md transition duration-200 cursor-pointer">
              <h3 className="text-xl font-semibold text-gray-800">
                No Cajun Seasoning
              </h3>
              <input type="checkbox" className="checkbox checkbox-info" />
            </div>
          </div>
          <h3 className="font-bold text-3xl mt-3 text-blue-600 mb-4">
            Select for Extra Cook Time
          </h3>
          <div className="flex items-center justify-between p-3 rounded-lg border hover:shadow-md transition duration-200 cursor-pointer">
            <h3 className="text-xl font-semibold text-gray-800">
              Well Done (Extra Cook Time)
            </h3>
            <input
              type="checkbox"
              name="radio-7"
              className="radio radio-info"
            />
          </div>
          <div className="flex justify-center gap-1 mt-1 ">
            <button className="bg-green-700 w-full py-4">CANCEL</button>
            <button className="bg-green-700 w-full py-4">APPLY</button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default SideSection;
