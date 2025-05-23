import { useState, useEffect, useCallback } from "react";
import { Disclosure } from "@headlessui/react";
import { HiFire } from "react-icons/hi2";
import LoadingComponent from "../../components/LoadingComponent";
import { FaChevronRight } from "react-icons/fa";

const FlavorSelection = ({ flavor: myFlavor, loading, sendFlavorData }) => {
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [wingsDistribution, setWingsDistribution] = useState({});
  const flavor = myFlavor.data;
  const choiceFlavorReq = myFlavor.how_many_choice;
  const [choiceItem, setChoiceItem] = useState(0);

  const getWingsDistribution = useCallback(
    (count) => {
      if (count === 0) return [];
      const base = Math.floor(choiceFlavorReq / count);
      const remainder = choiceFlavorReq % count;
      return Array(count)
        .fill(base)
        .map((val, idx) => (idx < remainder ? val + 1 : val));
    },
    [choiceFlavorReq]
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

  // Update flavorSelected only when wingsDistribution or selectedOptions change
  useEffect(() => {
    const flavorSelected = Object.entries(wingsDistribution)
      .filter(([key]) => selectedOptions[key])
      .map(([key, quantity]) => {
        const selectedFlavor = flavor.find((item) => item.name === key);
        return { id: selectedFlavor?.id, quantity };
      });

    sendFlavorData(flavorSelected);
  }, [wingsDistribution, selectedOptions]);

  const handleWingsChange = (optionName, newValue) => {
    setWingsDistribution((prev) => {
      const newDistribution = {
        ...prev,
        [optionName]: Math.max(0, Math.min(newValue, choiceFlavorReq)),
      };
      const totalSelected = Object.values(newDistribution).reduce(
        (sum, val) => sum + val,
        0
      );
      let excess = totalSelected - choiceFlavorReq;

      if (excess > 0) {
        const keys = Object.keys(newDistribution).filter(
          (key) => key !== optionName
        );
        for (let key of keys) {
          if (excess <= 0) break;
          const reduceBy = Math.min(newDistribution[key], excess);
          newDistribution[key] -= reduceBy;
          excess -= reduceBy;
        }
      }

      let deficit =
        choiceFlavorReq -
        Object.values(newDistribution).reduce((sum, val) => sum + val, 0);
      if (deficit > 0) {
        const keys = Object.keys(newDistribution).filter(
          (key) => key !== optionName
        );
        for (let key of keys) {
          if (deficit <= 0) break;
          const increaseBy = Math.min(
            choiceFlavorReq - newDistribution[key],
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
  }, [choiceFlavorReq, updateWingsDistribution]);

  useEffect(() => {
    const totalSelectedWings = Object.values(wingsDistribution).reduce(
      (sum, num) => sum + num,
      0
    );
    setChoiceItem(totalSelectedWings);
  }, [wingsDistribution]);

  const categorizedFlavors = {
    wet: flavor?.filter((item) => item.isWet),
    honey: flavor?.filter((item) => item.isHoney),
    dry: flavor?.filter((item) => item.isDry),
  };

  if (loading) {
    return <LoadingComponent />;
  }
  return (
    <div className="w-full lg:w-10/12 mx-auto my-3 p-2 bg-white ">
      <Disclosure>
        {({open}) => (
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
                  CHOOSE REGULAR FLAVORS
                </h1>
                <span>
                  {myFlavor.is_required === 1 && selectedCount === 0 ? (
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
                      ({selectedCount} of {myFlavor.how_many_select} Selected)
                    </span>
                  </span>
                </h2>
                <div className="text-gray-500">
                  <h2 className="grid text-lg font-bold mb-1">
                    <span className="text-xs text-gray-900">
                      ( {choiceItem} of {choiceFlavorReq} Selected)
                    </span>
                  </h2>
                </div>
              </div>
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-700">
              {Object.entries(categorizedFlavors).map(([key, flavors]) => (
                <div key={key} className="mb-6">
                  <div className="my-3">
                    <h3 className="text-2xl font-TitleFont text-black uppercase">
                      {key} Flavors
                    </h3>
                    <p>More info about our {key} Flavors can be found</p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                    {flavors.map((category, index) => (
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
                                <p className="font-medium font-paragraphFont text-black">
                                  {category.name.toUpperCase()}
                                </p>
                                <div className="rating flex items-center my-1">
                                  {[...Array(category.flavor_rating)].map(
                                    (_, i) => (
                                      <HiFire
                                        key={i}
                                        className={`${
                                          category.flavor_rating <= 1
                                            ? "text-green-700"
                                            : category.flavor_rating <= 3
                                            ? "text-yellow-600"
                                            : "text-red-500"
                                        }`}
                                      />
                                    )
                                  )}
                                  {[...Array(5 - category.flavor_rating)].map(
                                    (_, i) => (
                                      <HiFire
                                        key={i}
                                        className={`opacity-30 ${
                                          category.flavor_rating <= 1
                                            ? "text-green-500"
                                            : category.flavor_rating <= 3
                                            ? "text-yellow-500"
                                            : "text-red-500"
                                        }`}
                                      />
                                    )
                                  )}
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
                                selectedCount >= myFlavor.how_many_select
                              }
                            />
                          </div>
                          {selectedOptions[category.name] && (
                            <div className="mt-3 ml-[90px] mx-auto items-center gap-2 text-gray-700">
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
                                  disabled={
                                    wingsDistribution[category.name] <= 0
                                  }
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
                                    choiceFlavorReq
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
              ))}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default FlavorSelection;
