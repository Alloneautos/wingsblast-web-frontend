import { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import LoadingComponent from "../../components/LoadingComponent";
import { BiSolidError } from "react-icons/bi";
import { FaChevronRight } from "react-icons/fa";

const RicePlattarCostom = ({ ricePlatter, loading, error, onRicePlattarSelected }) => {
  const [selectedRicePlattar, setSelectedRicePlattar] = useState([]);
  const [ricePlattarQuantities, setRicePlattarQuantities] = useState({});
  const howManyRicePlattar = ricePlatter.how_many_select;
  const howManyChoiceRicePlattar = ricePlatter.how_many_choice;
  const allRicePlattar = ricePlatter.data;
  const selectedCount = selectedRicePlattar.length;
  const choiceItem = Object.values(ricePlattarQuantities).reduce(
    (sum, qty) => sum + qty,
    0
  );

  const handleSelectRicePlattar = (rice) => {
    const isSelected = selectedRicePlattar.some((s) => s.id === rice.id);
    let updatedRicePlattar;

    if (isSelected) {
      updatedRicePlattar = selectedRicePlattar.filter((s) => s.id !== rice.id);
    } else if (selectedRicePlattar.length < howManyRicePlattar) {
      updatedRicePlattar = [...selectedRicePlattar, rice];
    } else {
      return;
    }

    setSelectedRicePlattar(updatedRicePlattar);
    distributeQuantities(updatedRicePlattar);
  };

  const distributeQuantities = (riceplattar) => {
    const totalRicePlattar = riceplattar.length;
    const baseQuantity = Math.floor(howManyChoiceRicePlattar / totalRicePlattar);
    const remainder = howManyChoiceRicePlattar % totalRicePlattar;

    const newQuantities = {};
    riceplattar.forEach((s, index) => {
      newQuantities[s.id] = baseQuantity + (index < remainder ? 1 : 0);
    });

    setRicePlattarQuantities(newQuantities);

    const formattedData = riceplattar.map((s) => ({
      type: "RicePlattar",
      type_id: s.id,
      is_paid_type: 0,
      quantity: newQuantities[s.id],
    }));
    onRicePlattarSelected(formattedData);
  };

  const handleQuantityChange = (riceplattarId, change) => {
    setRicePlattarQuantities((prevQuantities) => {
      const newQuantities = { ...prevQuantities };
      newQuantities[riceplattarId] = Math.max(
        0,
        Math.min((newQuantities[riceplattarId] || 0) + change, howManyChoiceRicePlattar)
      );

      const totalSelected = Object.values(newQuantities).reduce(
        (sum, qty) => sum + qty,
        0
      );

      let excess = totalSelected - howManyChoiceRicePlattar;
      if (excess > 0) {
        const otherRicePlattar = selectedRicePlattar.filter((s) => s.id !== riceplattarId);
        for (const ricePlattar of otherRicePlattar) {
          if (excess <= 0) break;
          const reduceBy = Math.min(newQuantities[ricePlattar.id], excess);
          newQuantities[ricePlattar.id] -= reduceBy;
          excess -= reduceBy;
        }
      }

      let deficit =
        howManyChoiceRicePlattar -
        Object.values(newQuantities).reduce((sum, qty) => sum + qty, 0);
      if (deficit > 0) {
        const otherRicePlattar = selectedRicePlattar.filter((s) => s.id !== riceplattarId);
        for (const ricePlattar of otherRicePlattar) {
          if (deficit <= 0) break;
          const increaseBy = Math.min(
            howManyChoiceRicePlattar - newQuantities[ricePlattar.id],
            deficit
          );
          newQuantities[ricePlattar.id] += increaseBy;
          deficit -= increaseBy;
        }
      }

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
                  </span>
                  CHOOSE REGULAR RICEPLATTER
                </span>
                <span>
                  {ricePlatter.is_required === 1 && selectedCount === 0 ? (
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
                      ({selectedCount} of {howManyRicePlattar} Selected)
                    </span>
                  </span>
                </h2>
                <div className="text-gray-500">
                  <h2 className="grid text-lg font-bold mb-1">
                    <span className="text-xs text-gray-900">
                      ( {choiceItem} of {howManyChoiceRicePlattar} Selected)
                    </span>
                  </h2>
                </div>
              </div>
            </Disclosure.Button>
            {error && (
              <p className="text-red-500 mt-4">
                Error loading RicePlattar. Please try again.
              </p>
            )}
            {loading && <LoadingComponent />}
            <Disclosure.Panel className="px-4 pt-6 pb-4 text-sm text-gray-700">
              <div className="flavor-selection grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {!loading &&
                  allRicePlattar.map((category, index) => (
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
                              <p className="text-lg font-TitleFont text-gray-900">
                                {category.name}
                              </p>
                              <div className="flex gap-2 text-gray-600">
                                <p className="text-green-600">Free</p>
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
                            checked={selectedRicePlattar.some(
                              (s) => s.id === category.id
                            )}
                            onChange={() => handleSelectRicePlattar(category)}
                          />
                        </div>
                        <div className={`${selectedCount === 1 ? "hidden" : ""}`}>

                        {selectedRicePlattar.some((s) => s.id === category.id) && (
                          <div className="mt-3 ml-[90px] mx-auto items-center gap-2 text-gray-700">
                            <span className="font-medium">Quantity:</span>
                            <div className="flex items-center border p-2 w-[148px] rounded-md overflow-hidden">
                              <button
                                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition"
                                onClick={() =>
                                  handleQuantityChange(category.id, -1)
                                }
                                disabled={ricePlattarQuantities[category.id] <= 1}
                              >
                                -
                              </button>
                              <input
                                type="number"
                                value={ricePlattarQuantities[category.id] || 1}
                                readOnly
                                className="w-16 text-center text-lg border-l border-r outline-none"
                              />
                              <button
                                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition"
                                onClick={() =>
                                  handleQuantityChange(category.id, 1)
                                }
                                disabled={
                                  ricePlattarQuantities[category.id] >=
                                    howManyChoiceRicePlattar ||
                                  Object.values(ricePlattarQuantities).reduce(
                                    (sum, qty) => sum + qty,
                                    0
                                  ) >= howManyChoiceRicePlattar
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
                        <h1 className="text-2xl font-semibold">NO RICEPLATTAR</h1>
                      </div>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary rounded"
                        checked={selectedRicePlattar.length === 0}
                        onChange={() => setSelectedRicePlattar([])}
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

export default RicePlattarCostom;
