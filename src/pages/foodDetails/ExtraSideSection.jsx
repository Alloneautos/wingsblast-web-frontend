import { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import LoadingComponent from "../../components/LoadingComponent";
import { BiSolidError } from "react-icons/bi";
import { FaChevronRight } from "react-icons/fa";

const ExtraSideSection = ({
  sides,
  loading,
  error,
  onExtraSideSelected,
  onSidePriceChange,
}) => {
  const [selectedSides, setSelectedSides] = useState([]);
  const [sideQuantities, setSideQuantities] = useState({});
  const selectedCount = selectedSides.length;

  const handleSelectSide = (side) => {
    const isSelected = selectedSides.some((s) => s.id === side.id);
    let updatedSides;

    if (isSelected) {
      updatedSides = selectedSides.filter((s) => s.id !== side.id);
    } else {
      updatedSides = [...selectedSides, side];
    }

    setSelectedSides(updatedSides);
    distributeQuantities(updatedSides);
  };

  const distributeQuantities = (sides) => {
    const newQuantities = { ...sideQuantities }; // Start with existing quantities
    let totalPrice = 0;

    sides.forEach((s) => {
      newQuantities[s.id] = sideQuantities[s.id] || 1; // Ensure quantity is set to 1 if not already set
      totalPrice += (s.price || 0) * newQuantities[s.id]; // Calculate total price
    });

    setSideQuantities(newQuantities);

    const formattedData = sides.map((s) => ({
      type: "Side",
      type_id: s.id,
      is_paid_type: 1,
      quantity: newQuantities[s.id],
    }));
    onExtraSideSelected(formattedData);
    onSidePriceChange(totalPrice); // Pass total price
  };

  const handleQuantityChange = (sideId, change) => {
    setSideQuantities((prevQuantities) => {
      const newQuantities = { ...prevQuantities };
      newQuantities[sideId] = Math.max(
        1,
        (newQuantities[sideId] || 1) + change
      ); // Minimum quantity is 1

      let totalPrice = 0;
      selectedSides.forEach((s) => {
        totalPrice += (s.price || 0) * (newQuantities[s.id] || 1); // Recalculate total price
      });

      const formattedData = selectedSides.map((s) => ({
        type: "Side",
        type_id: s.id,
        is_paid_type: 1,
        quantity: newQuantities[s.id],
      }));

      onExtraSideSelected(formattedData); // Pass updated formatted data
      onSidePriceChange(totalPrice); // Pass updated total price
      return newQuantities;
    });
  };

  return (
    <div className="w-full lg:w-10/12 mx-auto my-1 p-2 bg-white">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="grid items-center w-full rounded-lg bg-blue-50 px-6 py-3 text-left text-sm font-medium text-black hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 transition ease-in-out duration-300">
              <div className="flex justify-between items-center w-full">
                <span className="font-TitleFont text-2xl flex items-center gap-1">
                  <span
                    className={`text-lg transform transition-transform duration-300 ${
                      open ? "rotate-90" : "rotate-0"
                    }`}
                  >
                    <FaChevronRight />
                  </span>{" "}
                  CHOOSE EXTRA SIDE
                </span>
                <span>
                  {sides.is_required === 1 && selectedCount === 0 ? (
                    <span className="text-red-700">
                      <span className="text-sm font-semibold">Required</span>
                    </span>
                  ) : (
                    <span className="text-green-600">
                      <span className="text-sm font-semibold">Optional</span>
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center w-full">
                <h2 className="font-bold mb-4">
                  <span className="text-xs text-gray-900">
                    Up To Choose
                    <span className="text-black ">
                      ({selectedCount} Selected)
                    </span>
                  </span>
                </h2>
              </div>
            </Disclosure.Button>
            {error && (
              <p className="text-red-500 mt-4">
                Error loading Sides. Please try again.
              </p>
            )}
            {loading && <LoadingComponent />}
            <Disclosure.Panel className="px-4 pt-6 pb-4 text-sm text-gray-700">
              <div className="flavor-selection grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                <div className="w-full">
                  <label className="block border border-gray-300 px-4 py-[33px] mt-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <RxCross2 className="text-4xl text-red-600" />
                        <h1 className="text-2xl font-TitleFont text-black">
                          NO SIDE
                        </h1>
                      </div>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary rounded"
                        checked={selectedSides.length === 0}
                        onChange={() => setSelectedSides([])}
                      />
                    </div>
                  </label>
                </div>
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
                              className="w-[70px] h-[70px] rounded-full"
                              src={category.image}
                              alt=""
                            />
                            <div>
                              <p className="font-medium text-gray-800">
                                {category.name}
                              </p>
                              <div className="flex gap-2 text-gray-600">
                                <p className="text-black">
                                  +$ {category.price}
                                </p>
                                <p className="flex items-center gap-1.5 text-black">
                                  <BiSolidError />
                                  {category.cal}
                                </p>
                              </div>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary rounded"
                            checked={selectedSides.some(
                              (s) => s.id === category.id
                            )}
                            onChange={() => handleSelectSide(category)}
                          />
                        </div>
                        <div>
                          {selectedSides.some((s) => s.id === category.id) && (
                            <div className="mt-3 ml-[90px] mx-auto items-center gap-2 text-gray-700">
                              <span className="font-medium">Quantity:</span>
                              <div className="flex items-center border p-2 w-[148px] rounded-md overflow-hidden">
                                <button
                                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition"
                                  onClick={() =>
                                    handleQuantityChange(category.id, -1)
                                  }
                                  disabled={sideQuantities[category.id] <= 1}
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  value={sideQuantities[category.id] || 1}
                                  readOnly
                                  className="w-16 text-center text-lg border-l border-r outline-none"
                                />
                                <button
                                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition"
                                  onClick={() =>
                                    handleQuantityChange(category.id, 1)
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          )}
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

export default ExtraSideSection;
