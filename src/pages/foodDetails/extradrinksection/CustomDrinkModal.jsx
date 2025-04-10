import { useState } from "react";
import SpriteImg from "../../../assets/images/spriteimg.png";

const CustomDrinkModal = ({ onDrinkSelect }) => {
  const [selectedDrink, setSelectedDrink] = useState(
    "Fountain Coca-Cola Freestyle™"
  );
  const drinkOptions = [
    { name: "Fountain Coca-Cola Freestyle™", img: SpriteImg },
    { name: "Coke", img: SpriteImg },
    { name: "Diet Coke", img: SpriteImg },
    { name: "Coke Zero", img: SpriteImg },
    { name: "Sprite", img: SpriteImg },
    { name: "Fanta", img: SpriteImg },
    { name: "Dr Pepper", img: SpriteImg },
    { name: "Barq's Root Beer", img: SpriteImg },
    { name: "Caffeine Free Diet Coke", img: SpriteImg },
    { name: "Powerade Fruit Punch", img: SpriteImg },
    { name: "Powerade Orange", img: SpriteImg },
  ];

  const handleApply = () => {
    onDrinkSelect(selectedDrink); // Pass selectedDrink to parent
    document.getElementById("costomizeDrink").close();
  };

  return (
    <div>
      <div className="ml-[75px] -mt-[25px]">
        <button
          className="text-green-600"
          onClick={(e) => {
            e.stopPropagation();
            document.getElementById("costomizeDrink").showModal();
          }}
        >
          Customize
        </button>
        <p className="text-xs">{selectedDrink}</p>
      </div>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <dialog id="costomizeDrink" className="modal rounded">
        <div className="modal-box rounded h-[500px]">
          <form method="dialog">
            {/* Close button */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg text-center">CUSTOMIZE</h3>
          <p className="text-center text-gray-600 mt-2">
            Selected: {selectedDrink}
          </p>
          <div className="mt-4">
            {drinkOptions.map((drink, index) => (
              <div
                key={index}
                className={`flex items-center justify-between ${
                  index !== drinkOptions.length - 1 ? "border-b" : ""
                } py-3`}
              >
                <label className="flex items-center justify-between w-full cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <img
                      src={drink.img}
                      alt={drink.name}
                      className="w-[70px] h-12 rounded-full"
                    />
                    <span className="font-medium">{drink.name}</span>
                  </div>
                  <input
                    type="radio"
                    name="drink"
                    className="radio radio-primary"
                    {...(index === 0 && { defaultChecked: true })}
                    onChange={() => setSelectedDrink(drink.name)}
                  />
                </label>
              </div>
            ))}
          </div>
          <div className="flex space-x-2 bg-white z-30 sticky -bottom-[22px]">
            <button
              className="btn rounded btn-primary w-[50%] text-white"
              onClick={() =>
                document.getElementById("costomizeDrink").close()
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
