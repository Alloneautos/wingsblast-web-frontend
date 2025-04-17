import { useEffect, useMemo, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import LoadingComponent from "../../components/LoadingComponent";
import { BiSolidError } from "react-icons/bi";
import { FaChevronRight } from "react-icons/fa";

const ToppingSection = ({
  myTopping,
  loading,
  error,
  onToppingsChange,
  onToppingsPriceChnge,
}) => {
  const [selectedToppings, setSelectedToppings] = useState([]);
  const toppings = myTopping.data;
  const selectTop = useMemo(() => {
    return selectedToppings.map((topping) => ({
      id: topping.toppings_id,
      isPaid: topping.isPaid,
    }));
  }, [selectedToppings]);

  useEffect(() => {
    onToppingsChange(selectTop);
  }, [selectTop, onToppingsChange]);

  // Function to handle topping selection
  const handleSelectTopping = (topping) => {
    setSelectedToppings((prev) => {
      const updatedToppings = prev.includes(topping)
        ? prev.filter((item) => item !== topping) // যদি সিলেক্ট থাকে, তাহলে রিমুভ করুন
        : [...prev, topping]; // যদি না থাকে, তাহলে অ্যাড করুন
      return updatedToppings;
    });
  };
  useEffect(() => {
    const totalPrice = selectedToppings.reduce((acc, topping) => {
      return acc + topping.price;
    }, 0);
    onToppingsPriceChnge(totalPrice);
  }, [selectedToppings, onToppingsPriceChnge]);

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
                  CHOOSE REGULER TOPPINGS
                </span>
                <h2 className="font-bold mt-2 text-gray-600">
                  <span>Up To Select: </span>
                  <span className="text-black">
                    {selectedToppings.length} selected
                  </span>
                </h2>
              </div>
            </Disclosure.Button>
            {error && (
              <p className="text-red-500 mt-4">
                Error loading toppings. Please try again.
              </p>
            )}
            {loading && <LoadingComponent />}
            <Disclosure.Panel className="px-4 pt-6 pb-4 text-sm text-gray-700">
              <div className="flavor-selection grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {!loading &&
                  toppings.map((category, index) => (
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
                              <p className="font-TitleFont text-lg text-black">
                                {category.name}
                              </p>
                              <div className="flex gap-2 text-gray-900">
                                <p>+${category.price}</p>
                                <p className="flex items-center gap-1">
                                  <BiSolidError /> {category.cal}
                                </p>
                              </div>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            name="topping"
                            className="checkbox checkbox-primary"
                            checked={selectedToppings.includes(category)}
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
                        className="checkbox checkbox-primary"
                        checked={selectedToppings.length === 0}
                        onChange={() => {
                          setSelectedToppings([]);
                          onToppingsChange([]); // Clear all selections
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
