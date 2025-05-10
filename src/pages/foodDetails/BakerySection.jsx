import { Disclosure } from "@headlessui/react";
import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import LoadingComponent from "../../components/LoadingComponent";
import { FaChevronRight } from "react-icons/fa";

const BakerySection = ({
  myBakery,
  loading,
  error,
  onBakeryPriceChange,
  onBakerySelected,
}) => {
  const [selectedBakeries, setSelectedBakeries] = useState([]);
  const [bakeryQuantities, setBakeryQuantities] = useState({});
  const bakery = myBakery.data;

  const handleSelectBakery = (bakery) => {
    const isSelected = selectedBakeries.includes(bakery);
    let updatedSelection;

    if (isSelected) {
      updatedSelection = selectedBakeries.filter((item) => item !== bakery);
      setBakeryQuantities((prevQuantities) => {
        const { [bakery.id]: _, ...updatedQuantities } = prevQuantities;
        return updatedQuantities;
      });
    } else {
      updatedSelection = [...selectedBakeries, bakery];
      setBakeryQuantities((prevQuantities) => ({
        ...prevQuantities,
        [bakery.id]: 1, // Default quantity to 1
      }));
    }

    setSelectedBakeries(updatedSelection);

    // Calculate total price and formatted data after updating quantities
    const updatedQuantities = {
      ...bakeryQuantities,
      ...(isSelected ? {} : { [bakery.id]: 1 }),
    };

    const totalPrice = updatedSelection.reduce((sum, item) => {
      return (
        sum +
        (item.isPaid === 1 ? item.price * (updatedQuantities[item.id] || 1) : 0)
      );
    }, 0);

    onBakeryPriceChange(totalPrice);

    const formattedData = updatedSelection.map((item) => ({
      type: "Bakery",
      type_id: item.id,
      is_paid_type: 1,
      quantity: updatedQuantities[item.id] || 1, // Ensure quantity defaults to 1
    }));

    onBakerySelected(formattedData);
  };

  const handleQuantityChange = (bakeryId, change) => {
    setBakeryQuantities((prevQuantities) => {
      const newQuantities = { ...prevQuantities };
      newQuantities[bakeryId] = Math.max(
        1,
        (newQuantities[bakeryId] || 1) + change
      ); // Ensure quantity is at least 1

      // Update price and formatted data
      const totalPrice = selectedBakeries.reduce(
        (sum, item) =>
          sum + (item.isPaid === 1 ? item.price * newQuantities[item.id] : 0),
        0
      );
      onBakeryPriceChange(totalPrice);

      const formattedData = selectedBakeries.map((item) => ({
        type: "Bakery",
        type_id: item.id,
        is_paid_type: 1,
        quantity: newQuantities[item.id],
      }));

      onBakerySelected(formattedData);

      return newQuantities;
    });
  };

  useEffect(() => {
    const totalPrice = selectedBakeries.reduce((sum, item) => {
      return (
        sum +
        (item.isPaid === 1 ? item.price * (bakeryQuantities[item.id] || 1) : 0)
      );
    }, 0);
    onBakeryPriceChange(totalPrice);
  }, [selectedBakeries, bakeryQuantities, onBakeryPriceChange]);

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
                  CHOOSE REGULAR BAKERY
                </span>
                <span>
                  {myBakery.is_required === 1 && selectedBakeries.length === 0 ? (
                    <span className="text-red-700">
                      <span className="text-sm font-semibold">Required</span>
                    </span>
                  ) : (
                    <span className="text-green-600">
                      <span className="text-sm font-semibold">
                        {selectedBakeries.length > 0 ? "Done" : "Optional"}
                      </span>
                    </span>
                  )}
                </span>
              </div>
                <h2 className="font-semibold mt-2 text-xs text-gray-900">
                  <span>Up To Select: </span>
                  <span className="text-black">
                    {selectedBakeries.length} selected
                  </span>
                </h2>
            </Disclosure.Button>
            {error && (
              <p className="text-red-500 mt-4">
                Error loading Bakery. Please try again.
              </p>
            )}
            {loading && <LoadingComponent />}
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
                                <p className="flex">💪{category.cal}</p>
                              </div>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary rounded"
                            checked={selectedBakeries.some(
                              (b) => b.id === category.id
                            )}
                            onChange={() => handleSelectBakery(category)}
                          />
                        </div>
                        {selectedBakeries.some((b) => b.id === category.id) && (
                          <div className="mt-3 ml-[90px] mx-auto items-center gap-2 text-gray-700">
                            <span className="font-medium">Quantity:</span>
                            <div className="flex items-center border p-2 w-[148px] rounded-md overflow-hidden">
                              <button
                                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition"
                                onClick={() =>
                                  handleQuantityChange(category.id, -1)
                                }
                                disabled={bakeryQuantities[category.id] <= 1}
                              >
                                -
                              </button>
                              <input
                                type="number"
                                value={bakeryQuantities[category.id] || 1}
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
                  <label className="block border border-gray-300 px-4 py-[30px] mt-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <RxCross2 className="text-4xl text-red-600" />
                        <h1 className="text-2xl font-TitleFont text-black">No Bakery</h1>
                      </div>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary rounded"
                        checked={selectedBakeries.length === 0}
                        onChange={() => {
                          setSelectedBakeries([]);
                          setBakeryQuantities({});
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

export default BakerySection;
