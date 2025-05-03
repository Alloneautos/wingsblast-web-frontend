import { useState, useEffect } from "react";
import { useAllDrinksName } from "../../../api/api";
import LoadingComponent from "../../../components/LoadingComponent";
import { CgClose } from "react-icons/cg";
import { CiSquareMinus, CiSquarePlus } from "react-icons/ci";

const CustomExtraDrinkModal = ({
  allDrinks,
  categoryId,
  drinkPrice,
  onDrinkSelect,
  onClose,
  selectedDrinks: initiallySelectedDrinks,
}) => {
  const { allDrinksName, isLoading } = useAllDrinksName();
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [quantities, setQuantities] = useState({});

  // Initialize selected drinks and quantities
  useEffect(() => {
    const initialSelections = {};
    const initialQuantities = {};

    initiallySelectedDrinks.forEach((drink) => {
      initialSelections[drink.child_item_id] = true;
      initialQuantities[drink.child_item_id] = drink.quantity;
    });

    setSelectedDrinks(initiallySelectedDrinks.map((d) => d.child_item_id));
    setQuantities(initialQuantities);
  }, [initiallySelectedDrinks]);

  const handleApply = () => {
    selectedDrinks.forEach((drinkId) => {
      onDrinkSelect(drinkId, quantities[drinkId] || 1);
    });
    onClose();
  };

  const toggleDrinkSelection = (drinkId) => {
    setSelectedDrinks((prev) =>
      prev.includes(drinkId)
        ? prev.filter((id) => id !== drinkId)
        : [...prev, drinkId]
    );

    // Initialize quantity if not set
    if (!quantities[drinkId]) {
      setQuantities((prev) => ({ ...prev, [drinkId]: 1 }));
    }
  };

  const incrementQuantity = (drinkId) => {
    setQuantities((prev) => ({
      ...prev,
      [drinkId]: (prev[drinkId] || 1) + 1,
    }));
  };

  const decrementQuantity = (drinkId) => {
    setQuantities((prev) => ({
      ...prev,
      [drinkId]: Math.max(1, (prev[drinkId] || 1) - 1),
    }));
  };

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <dialog open className="modal modal-bottom sm:modal-middle">
      <div className="modal-box max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 pb-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">
              Customize Drinks -{" "}
              {allDrinks.find((c) => c.id === categoryId)?.name}
            </h3>
            <button className="btn btn-sm btn-circle" onClick={onClose}>
              <CgClose />
            </button>
          </div>
          <p className="py-2">Selected: {selectedDrinks.length} items</p>
        </div>

        <div className="space-y-4">
          {allDrinksName
            .filter(
              (drink) => !drink.categoryId || drink.categoryId === categoryId
            )
            .map((drink) => {
              const isSelected = selectedDrinks.includes(drink.id);
              const quantity = quantities[drink.id] || 1;
              const totalPrice = (quantity * drinkPrice).toFixed(2);

              return (
                <div
                  key={drink.id}
                  className="flex items-center justify-between p-2 border-b"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={drink.image}
                      alt={drink.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{drink.name}</p>
                      <p className="text-sm text-gray-500">
                        ${drinkPrice} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {isSelected && (
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-xl text-gray-600"
                          onClick={() => decrementQuantity(drink.id)}
                        >
                          <CiSquareMinus />
                        </button>
                        <span className="w-8 text-center">{quantity}</span>
                        <button
                          className="text-xl text-gray-600"
                          onClick={() => incrementQuantity(drink.id)}
                        >
                          <CiSquarePlus />
                        </button>
                        <span className="w-16 text-right">${totalPrice}</span>
                      </div>
                    )}

                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={isSelected}
                      onChange={() => toggleDrinkSelection(drink.id)}
                    />
                  </div>
                </div>
              );
            })}
        </div>

        <div className="modal-action sticky bottom-0 bg-white pt-4">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleApply}>
            Apply Selections
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default CustomExtraDrinkModal;
