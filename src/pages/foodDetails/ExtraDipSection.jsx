import { useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import { BsHeartPulseFill } from "react-icons/bs";
import { useAllDips } from "../../api/api";

const ExtraDipSection = ({
  onDipPriceChange,
  onDipSelected,
}) => {
  const { allDips, loading, error } = useAllDips(); // Assuming useAllDrinks fetches dips data
  const [selectedDips, setSelectedDips] = useState([]); // Track selected dips
  const [dipQuantities, setDipQuantities] = useState({}); // Track quantities for dips

  const handleSelectDip = (dip) => {
    const isSelected = selectedDips.some((d) => d.id === dip.id);
    let updatedDips;

    if (isSelected) {
      updatedDips = selectedDips.filter((d) => d.id !== dip.id);
    } else {
      updatedDips = [...selectedDips, dip];
      setDipQuantities((prevQuantities) => ({
        ...prevQuantities,
        [dip.id]: 1, // Default quantity to 1 for newly selected dips
      }));
    }

    setSelectedDips(updatedDips);
  };

  const handleQuantityChange = (dipId, change) => {
    setDipQuantities((prevQuantities) => {
      const newQuantities = { ...prevQuantities };
      newQuantities[dipId] = Math.max(1, (newQuantities[dipId] || 1) + change); // Ensure quantity is at least 1

      // Update price
      const price = selectedDips.reduce(
        (total, d) => total + ((d.price || 0) * newQuantities[d.id]), // Ensure price defaults to 0
        0
      );
      onDipPriceChange(price);

      return newQuantities;
    });
  };

  const distributeQuantities = (dips) => {
    const newQuantities = {};
    dips.forEach((d) => {
      newQuantities[d.id] = dipQuantities[d.id] || 1; // Retain existing quantity or default to 1
    });

    setDipQuantities(newQuantities);

    // Prepare data in the required format
    const formattedData = dips.map((d) => ({
      type: "Dip",
      type_id: d.id,
      is_paid_type: 1,
      quantity: newQuantities[d.id],
    }));

    console.log("Formatted Data:", formattedData); // Log the formatted data

    // Update price and selected dips
    const price = dips.reduce(
      (total, d) => total + ((d.price || 0) * newQuantities[d.id]), // Ensure price defaults to 0
      0
    );
    onDipPriceChange(price);
    onDipSelected(formattedData); // Pass formatted data
  };

  useEffect(() => {
    const price = selectedDips.reduce(
      (total, dip) => total + ((dip.price || 0) * dipQuantities[dip.id]), // Ensure price defaults to 0
      0
    );
    onDipPriceChange(price);
  }, [selectedDips, dipQuantities, onDipPriceChange]);

  useEffect(() => {
    distributeQuantities(selectedDips); // Call distributeQuantities whenever selectedDips changes
  }, [selectedDips]);

  return (
    <div className="w-full lg:w-10/12 mx-auto my-1 p-2 bg-white rounded-lg shadow-lg">
      <Disclosure>
        {() => (
          <>
            <Disclosure.Button className="grid md:flex lg:flex justify-between items-center w-full rounded-lg bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 px-6 py-3 text-left text-sm font-medium text-black hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 shadow-md transition ease-in-out duration-300">
              <div>
                <span className="text-lg font-TitleFont lg:text-xl font-semibold">
                  CHOOSE EXTRA DIP
                </span>
                <h2 className=" font-bold mt-2 text-gray-600">
                  <span>Up To Select: </span>
                  <span className="text-black">
                    {selectedDips.length > 0
                      ? selectedDips.map((dip) => dip.name).join(", ")
                      : "(Selected)"}
                  </span>
                </h2>
              </div>
            </Disclosure.Button>
            {error && (
              <p className="text-red-500 mt-4">
                Error loading Dips. Please try again.
              </p>
            )}
            {loading && <p className="text-gray-500 mt-4">Loading Dips...</p>}
            <Disclosure.Panel className="px-4 pt-6 pb-4 text-sm text-gray-700">
              <div className="flavor-selection grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {!loading &&
                  allDips.map((category, index) => (
                    <div key={index} className="w-full">
                      <h3 className="text-md font-semibold mb-2 text-blue-600">
                        {category.category}
                      </h3>
                      <label className="block border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-3">
                            <img
                              className="w-[75px] h-[70px] rounded-full"
                              src={category.image}
                              alt=""
                            />
                            <div>
                              <p className="font-medium text-gray-800">
                                {category.name}
                              </p>
                              <div className="flex gap-2 text-gray-600">
                                <p className="text-green-500 font-semibold">
                                    <span className="text-black font-medium">
                                      $ {category.price}
                                    </span>
                                </p>
                                <p className="flex items-center gap-1.5">
                                  <BsHeartPulseFill className="text-red-500" />
                                  {category.cal}
                                </p>
                              </div>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary rounded"
                            checked={selectedDips.some(
                              (d) => d.id === category.id
                            )}
                            onChange={() => handleSelectDip(category)}
                          />
                        </div>
                        {selectedDips.some(
                          (d) => d.id === category.id
                        ) && (
                          <div className="mt-3 ml-[90px] mx-auto items-center gap-2 text-gray-700">
                            <span className="font-medium">Quantity:</span>
                            <div className="flex items-center border p-2 w-[148px] rounded-md overflow-hidden">
                              <button
                                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition"
                                onClick={() =>
                                  handleQuantityChange(category.id, -1)
                                }
                                disabled={dipQuantities[category.id] <= 1}
                              >
                                -
                              </button>
                              <input
                                type="number"
                                value={dipQuantities[category.id] || 1}
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
                      </label>

                    </div>
                  ))}
                <div className="w-full">
                  <label className="block border border-gray-300 px-4 py-[33px] mt-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <RxCross2 className="text-4xl text-red-600" />
                        <h1 className="text-2xl font-semibold">NO SIDE</h1>
                      </div>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary rounded"
                        checked={selectedDips.length === 0}
                        onChange={() => setSelectedDips([])}
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

export default ExtraDipSection;
