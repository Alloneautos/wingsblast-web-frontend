import { useState } from "react";
import { useAllDrinksName } from "../../../api/api";
import { CgClose } from "react-icons/cg";
import LoadingComponent from "../../../components/LoadingComponent";

const CustomDrinkModal = ({ onDrinkSelect }) => {
  const { allDrinksName, isLoading } = useAllDrinksName();
  const [selectedDrink, setSelectedDrink] = useState({});

  const handleApply = () => {
    onDrinkSelect(selectedDrink.id); // Pass selectedDrink to parent
    document.getElementById("costomizeDrinkModal").close();
  };
  const handleCancel = () => {
    document.getElementById("costomizeDrinkModal").close();
  };

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <div>
      <div className="ml-[75px] -mt-[25px]">
        <button
          className="text-green-600"
          onClick={(e) => {
            e.stopPropagation();
            document.getElementById("costomizeDrinkModal").showModal();
          }}
        >
          Customize
        </button>
        <p className="text-xs">{selectedDrink?.name}</p>
      </div>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <dialog id="costomizeDrinkModal" className="modal rounded">
        <div className="modal-box rounded h-[500px]">
          <div className="sticky -top-[27px] bg-white z-30 py-5">
            <h3 className="font-bold text-lg text-center">CUSTOMIZE</h3>
            <p className="text-center text-gray-600 mt-0.5 pb-4">
              Selected: {selectedDrink?.name || "None"}
            </p>
            <div className="flex justify-end -mt-[50px]">
              <button className="text-xl" onClick={handleCancel}>
                <CgClose />
              </button>
            </div>
          </div>
          <div className="mt-4">
            {allDrinksName?.map((drink, index) => (
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
                  <input
                    type="radio"
                    name="drink"
                    className="radio radio-primary"
                    {...(index === 0 && { defaultChecked: true })}
                    onChange={() => setSelectedDrink(drink)}
                  />
                </label>
              </div>
            ))}
          </div>
          <div className="flex space-x-2 bg-white z-30 sticky -bottom-[22px]">
            <button
              className="btn rounded btn-primary w-[50%] text-white"
              onClick={() =>
                document.getElementById("costomizeDrinkModal").close()
              }
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

export default CustomDrinkModal;
