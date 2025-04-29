import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  API,
  useDeleveryFee,
  useFees,
  useGuestUser,
  useMyCart,
  useTax,
} from "../../api/api";
import Swal from "sweetalert2";

const MyCart = () => {
  const { tax, isTaxLoading } = useTax();
  const { fees } = useFees();
  const { deleveryFee } = useDeleveryFee();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isASAP, setIsASAP] = useState(true);
  const { guestUser } = useGuestUser();
  const { mycard, isLoading, isError, refetch } = useMyCart(guestUser);
  const [quantities, setQuantities] = useState({});
  const [dates, setDates] = useState([]);
  const [savedAddress, setSavedAddress] = useState("");
  const [time, setTime] = useState(new Date());
  const taxRate = tax?.tax_rate;
  const delivaryFee = deleveryFee?.fee;
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [isLater, setIsLater] = useState(true);
  const [orderStatus, setOrderStatus] = useState("");
  const [error, setError] = useState("");
  const [delivaryIsFee, setDeliveryFee] = useState(0);
  const [feesData, setFeesData] = useState([]);
  const [couponPrice, setCouponPrice] = useState(0);
  const [selectTipsRate, setSelectTipsRate] = useState(0);
  const [customTips, setCustomTips] = useState(0);

  const [openNotes, setOpenNotes] = useState({});
  const [note, setNote] = useState({});
  const [firstLine, setFirstLine] = useState("");
  const [secondLine, setSecondLine] = useState("");

  const handleOpenNote = (id) => {
    setOpenNotes((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the specific item's note open/close state
    }));
  };

  const handleNoteChange = (id, value) => {
    setNote((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const checkASAPAvailability = () => {
    const currentHour = time.getHours();
    return currentHour >= 10 && currentHour < 23;
  };

 // set delivery fee
  useEffect(() => {
    if (orderStatus === "Delivery") {
      setDeliveryFee(delivaryFee);
      setFeesData(fees);
    } else {
      setDeliveryFee(0);
      setFeesData([]);
    }
  }, [orderStatus, delivaryFee, fees]);

 // Set `isLater` based on the value of `isASAP`
  useEffect(() => {
    if (isASAP && !checkASAPAvailability()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "ASAP Unavailable this Time!",
      });
      setIsASAP(false); // Set back to 'Later' since ASAP is unavailable
    } else {
      // Set `isLater` based on the value of `isASAP`
      setIsLater(!isASAP);
    }
  }, [isASAP]);

// set quantity
  useEffect(() => {
    const initialQuantities = {};
    mycard.forEach((item) => {
      initialQuantities[item.id] = item.quantity || 1;
    });
    setQuantities(initialQuantities);
  }, [mycard]);
 // set quantity
  const incrementQuantity = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 1) + 1 }));
  };
 // set quantity
  const decrementQuantity = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) - 1),
    }));
  };
 // set Coupon
  const handleCoupons = async (event) => {
    event.preventDefault();
    const code = (event.target.elements.code.value).toUpperCase();

// erokom akare data post api er madhome pathte hobe
const{
  "code": "test2025code",
  "user_id": 1,
  "delivery_type": "carryout", // carryout, delivery
  "food_ids": [
      1,
      5,
      7
  ]
}

  };
 
  const calculateSubtotal = (price, quantity) => price * quantity;
  const calculateTax = (subtotal) => (subtotal * taxRate) / 100;

  const calculateTotalPrice = (
    subtotal,
    totalFeesAndTax,
    delivaryIsFee,
    tipsPrice,
    couponPrice
  ) => subtotal + totalFeesAndTax + delivaryIsFee + tipsPrice - couponPrice;

  const cartSubtotal = mycard.reduce(
    (acc, item) =>
      acc + calculateSubtotal(item.price, quantities[item.id] || 1),
    0
  );
  const cartTax = calculateTax(cartSubtotal);

  const calculateTipsRate = (cartSubtotal * selectTipsRate) / 100;

  const tipsPrice =
    calculateTipsRate > customTips ? calculateTipsRate : customTips;

  const totalFees = feesData.reduce(
    (sum, fData) => sum + (parseFloat(fData.fee_amount) || 0),
    0
  );
  const totalFeesAndTax = totalFees + cartTax;

  const cartTotalPrice = calculateTotalPrice(
    cartSubtotal,
    totalFeesAndTax,
    delivaryIsFee,
    tipsPrice,
    couponPrice
  );

  useEffect(() => {
    const generateNext7Days = () => {
      const today = new Date();
      const daysArray = [];
      for (let i = 0; i < 7; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        daysArray.push(nextDate.toDateString());
      }
      setDates(daysArray);
    };
    generateNext7Days();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const orderStatus = localStorage.getItem("orderStatus");
    const delivery = localStorage.getItem("deliveryAddress");
    setSavedAddress(delivery);
    setOrderStatus(orderStatus);
  }, []);


  const myOrder = {
    sub_total: cartSubtotal,
    tax: totalFeesAndTax,
    fees: totalFeesAndTax,
    delivery_fee: delivaryIsFee,
    coupon_discount: couponPrice,
    tips: tipsPrice,
    total_price: cartTotalPrice,
    isLater: isLater,
    delivery_type: orderStatus,
    delevery_address: savedAddress,
    building_suite_apt: "building_suite_apt",
    later_date: selectedDate,
    later_slot: selectedTime,
    foods: mycard?.map((item) => ({
      name: item.food_name,
      image: item.food_image,
      price: (item.price * quantities[item.id]).toFixed(2),
      quantity: quantities[item.id],
      description: "Hand-breaded boneless wings",
      note: note[item.id] || "note nai",
      addons: {
        flavor: item?.flavors?.map((flavor) => ({
          name: flavor.flavor_name,
          quantity: flavor.quantity,
        })),

        toppings: item?.topping?.map((tp) => ({
          name: tp.name,
          price: tp.price,
          isPaid: tp.is_paid_type,
          quantity: tp.quantity,
        })),

        sandCust: item?.sandwich?.map((sw) => ({
          name: sw.name,
          price: sw.price,
          isPaid: sw.is_paid_type,
          quantity: sw.quantity,
        })),

        drink: item?.drinks?.map((d) => ({
          name: d.size_name,
          child_item_name: d.brand_name,
          price: d.price,
          isPaid: d.is_paid_type,
          quantity: d.quantity,
        })),

        dip: item?.dips?.map((dp) => ({
          name: dp.name,
          price: dp.price,
          isPaid: dp.is_paid_type,
          quantity: dp.quantity,
        })),

        side: item?.sides?.map((sd) => ({
          name: sd.name,
          price: sd.price,
          isPaid: sd.is_paid_type,
          quantity: sd.quantity,
        })),

        beverage: item?.bakery?.map((bk) => ({
          name: bk.name,
          price: bk.price,
          isPaid: bk.is_paid_type,
          quantity: bk.quantity,
        })),
      },
    })),
  };

  const navigate = useNavigate();
  const handleToCheckout = () => {
    if (cartSubtotal < 20) {
      Swal.fire({
        icon: "warning",
        title: "Minimum Order Amount",
        text: "Your order subtotal must be at least $20 to proceed to checkout.",
        confirmButtonText: "OK",
      });
      return; // Prevent navigation to checkout
    }
    setError("");
    navigate("/checkout", { state: { orderData: myOrder } });
  };

  const sendCustomTips = (data) => {
    setCustomTips(data);
  };
  const sendSelectTipsRate = (data) => {
    setSelectTipsRate(data);
  };

  useEffect(() => {
    if (orderStatus === "Delivery") {
      const splitAddress = (savedAddress) => {
        if (!savedAddress || typeof savedAddress !== "string") {
          return { firstLine: "", secondLine: "" };
        }

        const parts = savedAddress.split("~");

        const firstLine = parts[0]?.trim() || "";
        const secondLine = parts.slice(1).join("~").trim() || "";

        return { firstLine, secondLine };
      };

      const { firstLine, secondLine } = splitAddress(savedAddress);

      setFirstLine(firstLine);
      setSecondLine(secondLine);
    }
  }, [orderStatus, savedAddress]);

  return (
    <section className="text-gray-600 body-font mx-auto">
      <div className="container px-0 lg:px-5 py-2 lg:py-4 mx-auto flex flex-wrap w-full lg:w-10/12">
        <div className="lg:w-4/6 md:w-1/2 w-full  rounded-lg mb-10 lg:mb-0">
          <NewFoodAddCard />
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-TitleFont text-black mt-3 ml-3">
                Review Order
              </h1>
              {mycard.length > 1 && (
                <button
                  onClick={handleDeleteAll}
                  className="btn rounded bg-ButtonColor hover:bg-ButtonHover text-white text-lg font-normal font-TitleFont"
                >
                  <RiDeleteBin6Line /> Delete All
                </button>
              )}
            </div>

            {isLoading ? (
              <LoadingComponent />
            ) : mycard.length > 0 ? (
              mycard.map((item) => (
                <div key={item.id} className="my-3 mx-4 text-black">
                  <div className="divider"></div>
                  <div className="flex justify-between text-xl sm:text-2xl">
                    <h2 className="text-2xl font-TitleFont">
                      {item.food_name}
                    </h2>
                    <div className="flex gap-2">
                      <button className="bg-red-600 rounded-full p-1.5 hover:bg-red-800 transition-all duration-300">
                        <RiDeleteBin6Line
                          onClick={() => handleDelete(item.id)}
                          className="text-2xl text-white "
                        />
                      </button>
                      <Link to={`/food-details/${item.food_details_id}`}>
                        <button className="bg-green-600 rounded-full p-1.5 hover:bg-green-800 transition-all duration-300">
                          <FiEdit className="text-2xl text-white " />
                        </button>
                      </Link>
                    </div>
                  </div>
                  <div>
                    <button
                      className="flex gap-2 items-center bg-gray-200 rounded px-2.5 py-1.5 mt-2 transition-all text-sm font-semibold"
                      onClick={() => handleOpenNote(item.id)}
                    >
                      <MdEditNote className="" />
                      <span>Add Note</span>
                    </button>
                    {openNotes[item.id] && (
                      <div className="mt-2">
                        <textarea
                          name="note"
                          rows="3"
                          placeholder="Type your message"
                          className="w-full max-w-md bg-white rounded border border-gray-300 p-3 shadow-md focus:ring-1 focus:ring-primary focus:outline-none"
                          value={note[item.id] || ""}
                          onChange={(e) =>
                            handleNoteChange(item.id, e.target.value)
                          }
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <button
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-100"
                        onClick={() => decrementQuantity(item.id)}
                      >
                        <FaMinus />
                      </button>
                      <span className="p-2 border-gray-300 text-xl font-semibold">
                        {quantities[item.id]}
                      </span>
                      <button
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-100"
                        onClick={() => incrementQuantity(item.id)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <span className="text-3xl font-TitleFont">
                      $
                      {calculateSubtotal(
                        item.price,
                        quantities[item.id]
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center mt-5">
                <h2 className="font-semibold text-2xl">Your Cart is Empty</h2>
                <p>Looks like you do not have any items in your order.</p>
                <Link to="/foodmenu" className="w-full">
                  <button className=" mx-auto btn bg-ButtonColor hover:bg-ButtonHover text-white block">
                    Browse The Menu
                  </button>
                </Link>
              </div>
            )}
            {isError && (
              <div className="text-red-500">Error: Something went wrong</div>
            )}
          </div>
        </div>
        <div className="lg:w-2/6 md:w-1/2 w-full  rounded-lg flex flex-col p-6 md:ml-auto mt-10 md:mt-0 bg-white">
          {/* Order Summary and Checkout */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-800 text-4xl font-TitleFont">
                {orderStatus}
              </h2>

              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="p-2 rounded-full shadow-lg bg-ButtonColor text-white hover:bg-ButtonHover transition-all"
              >
                <RiEdit2Fill size={24} />
              </button>
            </div>
            {orderStatus === "Delivery" && (
              <div className="mt-2 text-green-700 font-medium">
                <h3 title="Address">{firstLine}</h3>
                <h3 title="Building Address">{secondLine}</h3>
              </div>
            )}
          </div>

          {/* Order Time */}
          <div className="flex items-center gap-2 text-gray-700 mb-4">
            <BsClock size={20} />
            <span>Rasturent Open 10:00 AM To 11:00 PM</span>
          </div>
          <div className="divider mb-3"></div>

          {/* Time Selection */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-2xl font-TitleFont text-gray-900">
              Select Time
            </span>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="time-selection"
                  className="radio radio-error"
                  checked={isASAP}
                  onChange={() => setIsASAP(true)}
                />
                <span className="text-gray-700">ASAP</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="time-selection"
                  className="radio radio-error"
                  checked={!isASAP}
                  onChange={() => setIsASAP(false)}
                />
                <span className="text-gray-700">Later</span>
              </label>
            </div>
          </div>

          <div className="divider mb-3"></div>
          {/* Coupon Code */}
          <form onSubmit={handleCoupons} className="relative">
            <input
              type="text"
              name="code"
              className="w-full border uppercase border-gray-300 text-sm rounded px-4 py-3 text-gray-700 focus:border-green-600 placeholder-gray-500"
              placeholder="Coupon Code"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bg-ButtonColor text-white rounded px-4 py-[10px] text-xs font-bold uppercase transition hover:bg-ButtonHover"
            >
              Submit
            </button>
          </form>

          {/* tips */}
          {orderStatus === "Delivery" && (
            <div>
              <div className="divider "></div>
              <OrderTips
                sendCustomTips={sendCustomTips}
                sendSelectTipsRate={sendSelectTipsRate}
              />
            </div>
          )}

          <div className="divider "></div>

          {error && <p className="text-red-500">{error}</p>}
          <div className="divider hidden md:block lg:block"></div>
          {/* Checkout Button */}
          {!isASAP && (!selectedDate || !selectedTime) && (
            <p className="text-red-600 text-base font-semibold mb-4 bg-gray-200 p-3 rounded">
              <span className="text-xl font-semibold text-black">Note: </span>
              Please select a date and time to proceed with checkout.
            </p>
          )}
          <button
            onClick={handleToCheckout}
            disabled={!isASAP && (!selectedDate || !selectedTime)}
            className={`w-full py-2 rounded shadow-lg transition font-TitleFont text-2xl text-white hidden md:block lg:block ${
              !isASAP && (!selectedDate || !selectedTime)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-ButtonColor hover:bg-ButtonHover"
            }`}
          >
            Checkout <span>${cartTotalPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>

    </section>
  );
};

export default MyCart;
