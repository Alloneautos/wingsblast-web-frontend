import { useEffect, useState } from "react";
import { useAllDrinksName } from "../../../api/api";
import LoadingComponent from "../../../components/LoadingComponent";
import { CgClose } from "react-icons/cg";
import { CiSquareMinus, CiSquarePlus } from "react-icons/ci";

const CustomExtraDrinkModal = ({ onDrinkSelect, drinkPrice }) => {
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [drinkQuantities, setDrinkQuantities] = useState({});
  const {allDrinksName, isLoading } = useAllDrinksName();


  const handleApply = () => {
    selectedDrinks.forEach((drink) => {
      const quantity = drinkQuantities[drink.id] || 1;
      onDrinkSelect(drink.id, quantity);
    });
    document.getElementById("costomizeDrink").close();
  };

  const handleCancel = () => {
    document.getElementById("costomizeDrink").close();
  };

  const incrementQuantity = (id) => {
    setDrinkQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };

  const decrementQuantity = (id) => {
    setDrinkQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) - 1),
    }));
  };

  const toggleDrinkSelection = (drink) => {
    setSelectedDrinks((prev) => {
      if (prev.some((d) => d.id === drink.id)) {
        return prev.filter((d) => d.id !== drink.id);
      }
      return [...prev, drink];
    });
  };

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <div>
      <div className="ml-[74px] -mt-[20px]">
        <button
          className="text-green-600"
          onClick={(e) => {
            e.stopPropagation();
            document.getElementById("costomizeDrink").showModal();
          }}
        >
          Customize
        </button>
        <p className="text-xs">
          {selectedDrinks.map((drink) => drink.name).join(", ")}
        </p>
      </div>

      <dialog id="costomizeDrink" className="modal rounded">
        <div className="modal-box rounded h-[500px]">
          <div className="sticky -top-[27px] bg-white z-30 py-5">
            <h3 className="font-bold text-lg text-center">CUSTOMIZE</h3>
            <p className="text-center text-gray-600 mt-0.5 pb-4">
              Selected: {selectedDrinks.map((drink) => drink.name).join(", ")}
            </p>
            <div className="flex justify-end -mt-[50px]">
              <button className="text-xl" onClick={handleCancel}>
                <CgClose />
              </button>
            </div>
          </div>

          <div className="mt-4">
            {allDrinksName.map((drink, index) => {
              const quantity = drinkQuantities[drink.id] || 1;
              const totalPrice = (quantity * drinkPrice).toFixed(2);
              const isSelected = selectedDrinks.some((d) => d.id === drink.id);

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between ${
                    index !== allDrinksName.length - 1 ? "border-b" : ""
                  } py-3`}
                >
                  <label className="flex items-center justify-between w-full cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <img
                        src={drink.image}
                        alt={drink.name}
                        className="w-14 h-14 rounded-full"
                      />
                      <span className="font-medium">{drink.name}</span>
                    </div>
                    <div className="flex items-center">
                      {isSelected && (
                        <div className="flex items-center justify-center space-x-2 bg-white px-4 py-2 rounded-xl w-fit">
                          <button
                            className="text-2xl text-black"
                            onClick={(e) => {
                              e.stopPropagation();
                              decrementQuantity(drink.id);
                            }}
                          >
                            <CiSquareMinus />
                          </button>
                          <span className="text-lg font-TitleFont text-black">
                            {quantity}
                          </span>
                          <button
                            className="text-2xl text-black"
                            onClick={(e) => {
                              e.stopPropagation();
                              incrementQuantity(drink.id);
                            }}
                          >
                            <CiSquarePlus />
                          </button>
                          <p className="ml-4 text-md font-light font-TitleFont text-black">
                            ${totalPrice}
                          </p>
                        </div>
                      )}

                      <input
                        type="checkbox"
                        name="drink"
                        className="checkbox checkbox-primary rounded text-white ml-3"
                        checked={isSelected}
                        onChange={() => toggleDrinkSelection(drink)}
                      />
                    </div>
                  </label>
                </div>
              );
            })}
          </div>

          <div className="flex space-x-2 bg-white z-30 sticky -bottom-[22px]">
            <button
              className="btn rounded btn-primary w-[50%] text-white"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="btn rounded btn-primary w-[50%] text-white"
            >
              Apply
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default CustomExtraDrinkModal;
