import { useEffect, useState } from "react";
import { useTipsRate } from "../../api/api";

function OrderTips({ sendCustomTips, sendSelectTipsRate }) {
  const { tipsRate } = useTipsRate();
  const [isOpenCustomTips, setIsOpenCustomTips] = useState(false);
  const [customTips, setCustomTips] = useState(0);
  const [selectTipsRate, setSelectTipsRate] = useState(0);

  useEffect(() => {
    if (tipsRate.length > 1) {
      setSelectTipsRate(tipsRate[1].amount_rate);
    }
  }, [tipsRate]);

  useEffect(() => {
    sendCustomTips(customTips), sendSelectTipsRate(selectTipsRate);
  }, [customTips, selectTipsRate]);

  const handleCutomTips = () => {
    setIsOpenCustomTips(true);
  };

  const handleTips = (amount_rate) => {
    setIsOpenCustomTips(false);
    setSelectTipsRate(amount_rate);
    setCustomTips(0);
  };

  const handleCutomTipsInput = (value) => {
    value.preventDefault();
    const data = parseFloat(value.target.tips_amount.value);

    setCustomTips(data);
    setSelectTipsRate(0);
  };

  return (
    <div className="">
      <h2 className="font-TitleFont text-black text-3xl">TIP:</h2>
      <p className="text-sm text-gray-700">100% of the tip goes to your driver !</p>
      <div className="flex gap-2 mt-3">
        {tipsRate.map((tipRate) => (
          <button
            onClick={() => handleTips(tipRate.amount_rate)}
            className={`py-[5px] px-4 rounded bg-gray-200 border 
                ${
                  selectTipsRate === tipRate.amount_rate && customTips === 0
                    ? "border-lime-600"
                    : "border-gray-200"
                } hover:border-lime-600`}
            key={tipRate.id}
          >
            {tipRate.amount_rate}%
          </button>
        ))}
      </div>
      {customTips <= 0 ? (
        <button
          onClick={handleCutomTips}
          className="mt-3 py-[5px] px-4 rounded bg-gray-200 border hover:border-lime-600 "
        >
          Custom
        </button>
      ) : (
        <button
          onClick={handleCutomTips}
          className={`mt-3 py-[2px] px-5 rounded-md bg-gray-200 border 
            ${
              customTips > 0 ? "border-lime-600" : "border-gray-200"
            } hover:border-lime-600`}
        >
          <div className="text-sm">
            <p>${customTips}</p>
            Custom
          </div>
        </button>
      )}
      {isOpenCustomTips && (
        <form
          onSubmit={handleCutomTipsInput}
          className="flex items-center border rounded-md overflow-hidden  mt-5"
        >
          <div className="flex items-center justify-center px-3 py-[11px] bg-gray-100 border-r">
            <span className="text-gray-500 text-sm font-medium">$</span>
          </div>

          <input
            name="tips_amount"
            type="number"
            min="0"
            max="10000"
            className="flex-1 px-3 py-2 outline-none text-gray-700 text-sm"
            placeholder="Enter an amount between 1 and 1000"
            required
          />
          <button
            type="submit"
            className="flex items-center justify-center px-4 py-[10px] bg-ButtonColor hover:bg-ButtonHover text-white"
          >
            +
          </button>
        </form>
      )}
    </div>
  );
}

export default OrderTips;
