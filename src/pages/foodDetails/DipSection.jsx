import { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import { BsHeartPulseFill } from "react-icons/bs";
import LoadingComponent from "../../components/LoadingComponent";
import { FaChevronRight } from "react-icons/fa";

const DipSection = ({ dips, loading, error, onDipSelected }) => {
  const [selectedDips, setSelectedDips] = useState([]);
  const [dipQuantities, setDipQuantities] = useState({});
  const howManyDips = dips.how_many_select;
  const howManyChoiceDips = dips.how_many_choice;
  const allDips = dips.data;
  const selectedCount = selectedDips.length; // Number of selected dips
  const choiceItem = Object.values(dipQuantities).reduce(
    (sum, qty) => sum + qty,
    0
  ); // Total quantity of dips selected

  const handleSelectDip = (dip) => {
    const isSelected = selectedDips.some((d) => d.id === dip.id);
    let updatedDips;

    if (isSelected) {
      updatedDips = selectedDips.filter((d) => d.id !== dip.id);
    } else if (selectedDips.length < howManyDips) {
      updatedDips = [...selectedDips, dip];
    } else {
      return;
    }

    setSelectedDips(updatedDips);
    distributeQuantities(updatedDips);
  };

  const distributeQuantities = (dips) => {
    const totalDips = dips.length;
    const baseQuantity = Math.floor(howManyChoiceDips / totalDips);
    const remainder = howManyChoiceDips % totalDips;

    const newQuantities = {};
    dips.forEach((d, index) => {
      newQuantities[d.id] = baseQuantity + (index < remainder ? 1 : 0);
    });

    setDipQuantities(newQuantities);

    // Prepare data in the required format
    const formattedData = dips.map((d) => ({
      type: "Dip",
      type_id: d.id,
      is_paid_type: 0,
      quantity: newQuantities[d.id],
    }));
    onDipSelected(formattedData); // Pass formatted data
  };

  const handleQuantityChange = (dipId, change) => {
    setDipQuantities((prevQuantities) => {
      const newQuantities = { ...prevQuantities };
      newQuantities[dipId] = Math.max(
        0,
        Math.min((newQuantities[dipId] || 0) + change, howManyChoiceDips)
      );

      const totalSelected = Object.values(newQuantities).reduce(
        (sum, qty) => sum + qty,
        0
      );

      let excess = totalSelected - howManyChoiceDips;
      if (excess > 0) {
        const otherDips = selectedDips.filter((d) => d.id !== dipId);
        for (const dip of otherDips) {
          if (excess <= 0) break;
          const reduceBy = Math.min(newQuantities[dip.id], excess);
          newQuantities[dip.id] -= reduceBy;
          excess -= reduceBy;
        }
      }

      let deficit =
        howManyChoiceDips -
        Object.values(newQuantities).reduce((sum, qty) => sum + qty, 0);
      if (deficit > 0) {
        const otherDips = selectedDips.filter((d) => d.id !== dipId);
        for (const dip of otherDips) {
          if (deficit <= 0) break;
          const increaseBy = Math.min(
            howManyChoiceDips - newQuantities[dip.id],
            deficit
          );
          newQuantities[dip.id] += increaseBy;
          deficit -= increaseBy;
        }
      }

      return newQuantities;
    });
  };

  return (
    <div className="w-full lg:w-10/12 mx-auto my-1 p-2 bg-white">
      <Disclosure>
        {({open}) => (
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
                  CHOOSE REGULAR DIP
                </span>
                <span>
                  {dips.is_required === 1 && selectedCount === 0 ? (
                    <span className="text-red-700">
                      <span className="text-sm font-semibold">Required</span>
                    </span>
                  ) : (
                    <span className="text-green-600">
                      <span className="text-sm font-semibold">
                        {selectedCount > 0 ? "Done" : "Optional"}
                      </span>
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center w-full">
                <h2 className="font-bold mb-4">
                  <span className="text-xs text-gray-900">
                    Up To Choose
                    <span className="text-black ">
                      ({selectedCount} of {howManyDips} Selected)
                    </span>
                  </span>
                </h2>
                <div className="text-gray-500">
                  <h2 className="grid text-lg font-bold mb-1">
                    <span className="text-xs text-gray-900">
                      ( {choiceItem} of {howManyChoiceDips} Selected)
                    </span>
                  </h2>
                </div>
              </div>
            </Disclosure.Button>
            {error && (
              <p className="text-red-500 mt-4">
                Error loading Dips. Please try again.
              </p>
            )}
            {loading && <LoadingComponent />}
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
                                  Free
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
                        <div
                          className={`${selectedCount === 1 ? "hidden" : ""}`}
                        >
                          {selectedDips.some((d) => d.id === category.id) && (
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
                                  disabled={
                                    dipQuantities[category.id] >=
                                      howManyChoiceDips ||
                                    Object.values(dipQuantities).reduce(
                                      (sum, qty) => sum + qty,
                                      0
                                    ) >= howManyChoiceDips
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

export default DipSection;
