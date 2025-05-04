import { useState, useEffect, useCallback } from "react";
import { Disclosure } from "@headlessui/react";
import { HiFire } from "react-icons/hi2";
import LoadingComponent from "../../components/LoadingComponent";
import { FaChevronRight } from "react-icons/fa";
import { BiSolidError } from "react-icons/bi";

const SideSection = ({ sides: mySides, loading, onSideSelected }) => {
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [wingsDistribution, setWingsDistribution] = useState({});
  const sides = mySides.data;
  const howManySides = mySides.how_many_select;
  const howManyChoiceSides = mySides.how_many_choice;
  const [choiceItem, setChoiceItem] = useState(0);

  const getWingsDistribution = useCallback(
    (count) => {
      if (count === 0) return [];
      const base = Math.floor(howManyChoiceSides / count);
      const remainder = howManyChoiceSides % count;
      return Array(count)
        .fill(base)
        .map((val, idx) => (idx < remainder ? val + 1 : val));
    },
    [howManyChoiceSides]
  );

  const updateWingsDistribution = useCallback(
    (newSelectedOptions) => {
      const selectedKeys = Object.keys(newSelectedOptions).filter(
        (key) => newSelectedOptions[key]
      );
      const distribution = getWingsDistribution(selectedKeys.length);
      const newDistribution = {};
      selectedKeys.forEach((key, index) => {
        newDistribution[key] = distribution[index];
      });
      setWingsDistribution(newDistribution);
    },
    [getWingsDistribution]
  );

  const handleSelection = (optionName, checked) => {
    setSelectedOptions((prev) => {
      const newSelectedOptions = { ...prev, [optionName]: checked };
      const newCount = Object.values(newSelectedOptions).filter(Boolean).length;
      setSelectedCount(newCount);
      updateWingsDistribution(newSelectedOptions);
      return newSelectedOptions;
    });
  };

  // Update sideSelected only when wingsDistribution or selectedOptions change
  useEffect(() => {
    const sideSelected = Object.entries(wingsDistribution)
      .filter(([key]) => selectedOptions[key])
      .map(([key, quantity]) => {
        const selectedSides = sides.find((item) => item.name === key);
        return { id: selectedSides?.id, quantity };
      });

    onSideSelected(sideSelected);
    console.log(sideSelected);
  }, [wingsDistribution, selectedOptions]);

  const handleWingsChange = (optionName, newValue) => {
    setWingsDistribution((prev) => {
      const newDistribution = {
        ...prev,
        [optionName]: Math.max(0, Math.min(newValue, howManyChoiceSides)),
      };
      const totalSelected = Object.values(newDistribution).reduce(
        (sum, val) => sum + val,
        0
      );
      let excess = totalSelected - howManyChoiceSides;

      if (excess > 0) {
        const keys = Object.keys(newDistribution).filter(
          (key) => key !== optionName
        );
        for (let key of keys) {
          if (excess < 0) break;
          const reduceBy = Math.min(newDistribution[key], excess);
          newDistribution[key] -= reduceBy;
          excess -= reduceBy;
        }
      }

      let deficit =
        howManyChoiceSides -
        Object.values(newDistribution).reduce((sum, val) => sum + val, 0);
      if (deficit > 0) {
        const keys = Object.keys(newDistribution).filter(
          (key) => key !== optionName
        );
        for (let key of keys) {
          if (deficit <= 0) break;
          const increaseBy = Math.min(
            howManyChoiceSides - newDistribution[key],
            deficit
          );
          newDistribution[key] += increaseBy;
          deficit -= increaseBy;
        }
      }

      return newDistribution;
    });
  };

  
  
  useEffect(() => {
    updateWingsDistribution(selectedOptions);
  }, [howManyChoiceSides, updateWingsDistribution]);

  useEffect(() => {
    const totalSelectedWings = Object.values(wingsDistribution).reduce(
      (sum, num) => sum + num,
      0
    );
    setChoiceItem(totalSelectedWings);
  }, [wingsDistribution]);

  if (loading) {
    return <LoadingComponent />;
  }
  return (
    <div className="w-full lg:w-10/12 mx-auto my-3 p-2 bg-white ">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="grid w-full rounded-lg  px-6 py-3 text-left text-sm font-medium text-black bg-blue-50 hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75">
              <div className="flex justify-between items-center w-full">
                <h1 className="font-TitleFont text-2xl flex items-center gap-1">
                  <span
                    className={`text-lg transform transition-transform duration-300 ${
                      open ? "rotate-90" : "rotate-0"
                    }`}
                  >
                    <FaChevronRight />
                  </span>{" "}
                  CHOOSE REGULER SIDE
                </h1>
                <span>
                  {mySides.is_required === 1 && selectedCount === 0 ? (
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
                    <span className="text-black">
                      ({selectedCount} of {howManySides} Selected)
                    </span>
                  </span>
                </h2>
                <div className="text-gray-500">
                  <h2 className="grid text-lg font-bold mb-1">
                    <span className="text-xs text-gray-900">
                      ( {choiceItem} of {howManyChoiceSides} Selected)
                    </span>
                  </h2>
                </div>
              </div>
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-700">
              <div className="mb-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                  {sides.map((category, index) => (
                    <div key={index} className="w-full">
                      <label className="block border border-gray-300 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <img
                              className="w-[72px] h-[72px] rounded-full"
                              src={category.image}
                              alt=""
                            />
                            <div>
                              <p className="font-medium text-gray-800">
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
                            required
                            className="form-checkbox h-5 w-5 text-green-600 transition duration-200 ease-in-out transform hover:scale-110"
                            onChange={(e) =>
                              handleSelection(category.name, e.target.checked)
                            }
                            checked={selectedOptions[category.name] || false}
                            disabled={
                              !selectedOptions[category.name] &&
                              selectedCount >= mySides.how_many_select
                            }
                          />
                        </div>
                        {selectedOptions[category.name] && (
                          <div className="mt-3 ml-[90px] mx-auto items-center gap-2 text-gray-700 hidden">
                            <span className="font-medium">
                              Number of Wings:
                            </span>
                            <div className="flex items-center border p-2 w-[148px] rounded-md overflow-hidden">
                              <button
                                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition"
                                onClick={() =>
                                  handleWingsChange(
                                    category.name,
                                    wingsDistribution[category.name] - 1
                                  )
                                }
                                disabled={wingsDistribution[category.name] <= 0}
                              >
                                -
                              </button>
                              <input
                                type="number"
                                value={wingsDistribution[category.name] || 0}
                                onChange={(e) =>
                                  handleWingsChange(
                                    category.name,
                                    Number(e.target.value)
                                  )
                                }
                                className="w-16 text-center text-lg border-l border-r outline-none"
                              />
                              <button
                                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition"
                                onClick={() =>
                                  handleWingsChange(
                                    category.name,
                                    wingsDistribution[category.name] + 1
                                  )
                                }
                                disabled={
                                  wingsDistribution[category.name] >=
                                  howManyChoiceSides
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
