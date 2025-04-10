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
  const [selectedSides, setSelectedSides] = useState([]);

  const handleSelectSide = (side) => {
    let updatedSides;
    if (selectedSides.includes(side)) {
      updatedSides = selectedSides.filter((s) => s !== side);
    } else {
      updatedSides = [...selectedSides, side];
    }
    setSelectedSides(updatedSides);

    const totalPrice = updatedSides.reduce(
      (sum, s) => sum + (s.isPaid === 1 ? s.side_price : 0),
      0
    );
    onSidePriceChange(totalPrice);

    const formattedSides = updatedSides.map((s) => ({
      type: "Side",
      type_id: s.side_id,
      is_paid_type: s.isPaid,
      quantity: 1, // Assuming quantity is always 1 for sides
    }));
    onSideSelected(formattedSides); // Pass the formatted data
  };

  useEffect(() => {
    const totalPrice = selectedSides.reduce(
      (sum, side) => sum + (side.isPaid === 1 ? side.side_price : 0),
      0
    );
    onSidePriceChange(totalPrice);
  }, [selectedSides, onSidePriceChange]);

  return (
    <div className="w-full lg:w-10/12 mx-auto my-3 p-2 bg-white rounded-lg shadow-lg">
      <Disclosure>
        {() => (
          <>
            <Disclosure.Button className="grid md:flex lg:flex justify-between items-center w-full rounded-lg bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 px-6 py-3 text-left text-sm font-medium text-black hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 shadow-md transition ease-in-out duration-300">
              <div>
                <span className="text-lg font-TitleFont lg:text-xl font-semibold">
                  CHOOSE REGULAR SIDE
                </span>
                <h2 className="font-bold mt-2 text-gray-600">
                  <span>Selected: </span>
                  <span className="text-black">
                    {selectedSides.length > 0
                      ? selectedSides.map((s) => s.side_name).join(", ")
                      : "(None)"}
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
                            type="checkbox"
                            className="checkbox checkbox-primary rounded"
                            checked={selectedSides.includes(category)}
                            onChange={() => handleSelectSide(category)}
                          />
                        </div>
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
                        type="checkbox"
                        className="checkbox checkbox-primary rounded"
                        checked={selectedSides.length === 0}
                        onChange={() => setSelectedSides([])}
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

export default SideSection;
