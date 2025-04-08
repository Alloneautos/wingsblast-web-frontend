import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsClock } from "react-icons/bs";
import NewFoodAddCard from "./NewFoodAddCard";
import {
  API,
  useDeleveryFee,
  useFees,
  useGuestUser,
  useMyCart,
  useTax,
  useUserProfile,
} from "../../api/api";
import Swal from "sweetalert2";
import { FaMinus, FaPlus } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import LocationModal from "../../components/LocationModal";
import { RiEdit2Fill } from "react-icons/ri";
import { LuBadgeInfo } from "react-icons/lu";
import OrderTips from "./OrderTips";
import { MdEditNote } from "react-icons/md";
import Loader from "../../assets/images/loader.gif";
import MakeOffer from "./MakeOffer";

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
  const { user } = useUserProfile();

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

  useEffect(() => {
    if (orderStatus === "Delivery") {
      setDeliveryFee(delivaryFee);
      setFeesData(fees);
    } else {
      setDeliveryFee(0);
      setFeesData([]);
    }
  }, [orderStatus, delivaryFee, fees]);

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

  useEffect(() => {
    const initialQuantities = {};
    mycard.forEach((item) => {
      initialQuantities[item.id] = item.quantity || 1;
    });
    setQuantities(initialQuantities);
  }, [mycard]);

  const incrementQuantity = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 1) + 1 }));
  };

  const decrementQuantity = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) - 1),
    }));
  };

  const handleCoupons = async (event) => {
    event.preventDefault();
    const code = event.target.elements.code.value;

    if (code === "GRAND20") {
      const discount = cartSubtotal * 0.2; // 20% discount
      setCouponPrice(discount);

      Swal.fire({
        title: "Coupon Applied!",
        text: `You have received a discount of $${discount.toFixed(2)}.`,
        icon: "success",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        title: "Invalid Coupon",
        text: "Please provide a valid coupon code.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
      setCouponPrice(0);
    }
  };

  const handleDiscount = () => {
    const discount = cartSubtotal * 0.2;
    setCouponPrice(discount);
    Swal.fire({

      title: "Discount Applied!",
      text: `You have received a discount of $${discount.toFixed(2)}.`,
      icon: "success",
      confirmButtonText: "OK",
    });

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

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await API.delete(`/card/delete/${id}`);
          Swal.fire({
            title: "Deleted!",
            text: "Your item has been deleted.",
            icon: "success",
            confirmButtonColor: "#3085d6",
          });
          refetch(); // Refresh data after deletion
        } catch (error) {
          console.error("Error deleting item:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to delete the item.",
            icon: "error",
            confirmButtonColor: "#3085d6",
          });
        }
      }
    });
  };

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
    foods: mycard.map((item) => ({
      name: item.food_name,
      image: item.food_image,
      price: (item.price * quantities[item.id]).toFixed(2),
      quantity: quantities[item.id],
      description: "Hand-breaded boneless wings",
      note: note[item.id] || "note nai",
      addons: {
        flavor: item?.flavors?.map((flavor) => ({
          name: flavor.flavor_name,
          image: flavor.flavor_image,
          quantity: flavor.quantity,
          rating: "4",
        })),
        toppings: item?.toppings?.map((topping) => ({
          name: topping.toppings_name,
          image: topping.toppings_image,
          quantity: topping.price,
          isPaid: topping.isPaid,
        })),
        sandCust: item?.sandCust?.map((sandwich) => ({
          name: sandwich.sandCust_name,
          image: sandwich.sandCust_image,
          price: sandwich.price,
          isPaid: sandwich.isPaid,
        })),

        dip: [
          {
            name: item.dip_name,
            image: item.dip_image,
            price: item.dip_price,
            isPaid: item.is_dip_paid,
          },
        ],
        side: [
          {
            name: item.side_name,
            image: item.side_image,
            price: item.side_price,
            isPaid: item.is_side_paid,
          },
        ],
        drink: [
          {
            name: item.drink_name,
            image: item.drink_image,
            price: item.drink_price,
            isPaid: item.is_drink_paid,
          },
        ],
        bakery: [
          {
            name: item.bakery_name,
            image: item.bakery_image,
            price: item.bakery_price,
            isPaid: item.is_bakery_paid,
          },
        ],
      },
    })),
  };

  const navigate = useNavigate();
  const handleToCheckout = () => {
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
      <div className="container px-0 lg:px-5 py-2 lg:py-12 mx-auto flex flex-wrap w-full lg:w-10/12">
        <div className="lg:w-4/6 md:w-1/2 w-full  rounded-lg mb-10 lg:mb-0">
          <NewFoodAddCard />
          <div>
            <h1 className="text-4xl font-sans font-semibold text-black mt-3 ml-3">
              Review Order
            </h1>

            {isLoading ? (
              <div className="flex items-center justify-center">
                <img src={Loader} alt="Loading..." className="w-[150px]" />
              </div>
            ) : mycard.length > 0 ? (
              mycard.map((item) => (
                <div key={item.id} className="my-3 mx-4 text-black">
                  <div className="divider"></div>
                  <div className="flex justify-between text-xl sm:text-2xl">
                    <h2 className="text-xl font-semibold">{item.food_name}</h2>
                    <div className="flex gap-2">
                      <button className="bg-red-600 rounded-full p-1.5 hover:bg-red-800 transition-all duration-300">
                        <RiDeleteBin6Line
                          onClick={() => handleDelete(item.id)}
                          className="text-2xl text-white "
                        />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p>
                      {item.sandCust && item.sandCust.length > 0 ? (
                        item.sandCust.map((flavor, index) => (
                          <div
                            key={index}
                            className="flavor-item cursor-pointer"
                          >
                            <h1 title="Sandwich">{flavor.sandCust_name}</h1>
                          </div>
                        ))
                      ) : (
                        <p> </p>
                      )}
                      {item.flavors && item.flavors.length > 0 ? (
                        item.flavors.map((flavor, index) => (
                          <div
                            key={index}
                            className="flavor-item cursor-pointer"
                          >
                            <h1 title="Flavor">
                              {flavor.flavor_name} X{flavor.quantity}
                            </h1>
                          </div>
                        ))
                      ) : (
                        <p> </p>
                      )}
                    </p>
                    {item.toppings && item.toppings.length > 0 ? (
                      item.toppings.map((topping, index) => (
                        <div key={index} className="flavor-item">
                          <h1 title="Toppings">
                            {topping.toppings_name}
                            {topping.isPaid === 1 && (
                              <span> (${topping.price})</span>
                            )}
                          </h1>
                        </div>
                      ))
                    ) : (
                      <p></p>
                    )}
                    <p title="Dip">
                      {item.dip_name}{" "}
                      {item.is_dip_paid ? `$(${item.dip_price})` : ""}
                    </p>
                    <p title="Side">
                      {item.side_name}{" "}
                      {item.is_side_paid ? `$(${item.side_price})` : ""}{" "}
                    </p>
                    <p title="Drink">
                      {item.drink_name}{" "}
                      {item.is_drink_paid ? `$(${item.drink_price})` : ""}
                    </p>
                    <p title="Bakery">
                      {item.bakery_name}{" "}
                      {item.is_bakery_paid ? `$(${item.bakery_price})` : ""}
                    </p>
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
                    <span className="text-2xl font-semibold">
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
              <h2 className="text-gray-800 text-2xl font-semibold">
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
            <span className="text-lg font-semibold text-gray-700">
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

          {/* Date and Time Selection */}
          {!isASAP && (
            <div className="flex flex-col sm:flex-row gap-2 bg-gray-50 rounded-lg mb-2">
              <div className="w-full">
                <label className="block text-sm text-gray-700 mb-1">Date</label>
                <select
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="select w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
                  value={selectedDate || ""}
                >
                  <option disabled value="">
                    Select Date
                  </option>
                  {dates.map((date, index) => {
                    const isSunday = new Date(date).getDay() === 0; // Check if the day is Sunday
                    return (
                      <option key={index} value={date} disabled={isSunday}>
                        {date} {isSunday ? "(Close)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="w-full">
                <label className="block text-sm text-gray-700 mb-1">Time</label>
                <select
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="select w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
                  value={selectedTime || ""}
                >
                  <option disabled value="">
                    Select Time
                  </option>
                  <option>10:00 AM - 11:00 AM</option>
                  <option>11:00 AM - 12:00 PM</option>
                  <option>12:00 PM - 1:00 PM</option>
                  <option>1:00 PM - 2:00 PM</option>
                  <option>2:00 PM - 3:00 PM</option>
                  <option>3:00 PM - 4:00 PM</option>
                  <option>4:00 PM - 5:00 PM</option>
                  <option>5:00 PM - 6:00 PM</option>
                  <option>6:00 PM - 7:00 PM</option>
                  <option>7:00 PM - 8:00 PM</option>
                  <option>8:00 PM - 9:00 PM</option>
                  <option>9:00 PM - 10:00 PM</option>
                  <option>10:00 PM - 11:00 PM</option>
                </select>
              </div>
            </div>
          )}

          {!checkASAPAvailability() ? (
            <div className="border border-red-400 px-4 py-1.5 rounded-sm my-1">
              <h1 className="text-red-700 font-semibold">ASAP Unavailable</h1>
              <p className="text-red-500">
                We are not currently accepting ASAP orders. Please select a
                later time to continue with your order.
              </p>
            </div>
          ) : null}

          <div className="divider mb-3"></div>
          <div className="flex items-center justify-between bg-red-100 rounded-lg py-1">
            <MakeOffer handleDiscount={handleDiscount} />
          </div>
          {/* <div className="divider mb-3">or</div> */}

          {/* Coupon Code */}
          <form onSubmit={handleCoupons} className="relative hidden ">
            <input
              type="text"
              name="code"
              className="w-full border border-gray-300 rounded-lg px-4 py-4 text-gray-700 focus:border-green-600 placeholder-gray-500"
              placeholder="Enter Your Coupon Code"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bg-ButtonColor text-white rounded-lg px-4 py-3 text-xs font-bold uppercase transition hover:bg-ButtonHover"
            >
              Submit
            </button>
          </form>

          {/* <label className="block text-gray-700 text-sm font-bold mb-2 mt-4">
            <span className="block text-lg font-medium text-gray-800 mb-1">
              Phone Number
            </span>
            <div className="relative">
              <input
                type="number"
                name="phone"
                defaultValue={user?.phone}
                placeholder="Enter Your Phone Number"
                className="w-full px-4 py-4 border border-gray-300 rounded focus:outline-none focus:ring-1 text-gray-700 placeholder-gray-700"
              />
              <span className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                📞
              </span>
            </div>
          </label>

          <div className="mt-2">
            <div className="flex items-center gap-5 mb-2">
              <input
                type="checkbox"
                className="checkbox checkbox-md !rounded checkbox-primary"
              />

              <p>Use this number in future?</p>
            </div>
          </div> */}

          {/* <div className="w-full mt-4 mb-2">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              <textarea
                type="text"
                placeholder="Add Note..."
                className="textarea textarea-info w-full h-24 border border-gray-300 rounded px-4 py-2 text-gray-700 placeholder-gray-500"
              ></textarea>
            </label> 
          </div> */}

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

          {/* Pricing Table */}
          <table className="w-full text-lg text-gray-700 mb-3">
            <tbody>
              <tr>
                <td className="py-2">Subtotal</td>
                <td className="text-right">${cartSubtotal.toFixed(2)}</td>
              </tr>

              {orderStatus === "Delivery" ? (
                <tr>
                  <td className="py-2 flex items-center gap-1">
                    <span>Tax & Fees</span>
                    <span
                      className="cursor-pointer"
                      onClick={() =>
                        document.getElementById("my_modal_3").showModal()
                      }
                    >
                      <LuBadgeInfo />
                    </span>
                  </td>
                  <td className="text-right">
                    + ${totalFeesAndTax.toFixed(2)}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td className="py-2">Tax</td>
                  <td className="text-right">
                    + $
                    {isTaxLoading ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      totalFeesAndTax.toFixed(2)
                    )}
                  </td>
                </tr>
              )}

              <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                  <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                      ✕
                    </button>
                  </form>
                  <h3 className="font-bold text-2xl text-center">Tax & Fees</h3>
                  <p className="pt-4 text-sm">
                    <strong>Tax:</strong> ${cartTax.toFixed(2)}
                  </p>

                  {feesData?.map((fd) => (
                    <p key={fd?.id} className="pt-4 text-sm">
                      <strong>{fd?.fee_name}:</strong> ${fd?.fee_amount} <br />
                      {fd?.fee_description}
                    </p>
                  ))}
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button>close</button>
                </form>
              </dialog>

              {orderStatus === "Delivery" && (
                <tr>
                  <td className="py-2">Delivery Fee</td>
                  <td className="text-right">+ ${delivaryFee}</td>
                </tr>
              )}

              {orderStatus === "Delivery" && (
                <tr>
                  <td className="py-2">Tips</td>
                  <td className="text-right">+ ${tipsPrice.toFixed(2)}</td>
                </tr>
              )}

              {couponPrice > 0 ? (
                <tr>
                  <td className="py-2">Coupon Discount</td>
                  <td className="text-right">- ${couponPrice.toFixed(2)}</td>
                </tr>
              ) : (
                ""
              )}

              <tr className="font-bold text-2xl text-gray-800">
                <td className="py-2">Total</td>
                <td className="text-right">${cartTotalPrice.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
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
            className={`w-full py-3 rounded-lg shadow-lg transition font-bold text-white hidden md:block lg:block ${
              !isASAP && (!selectedDate || !selectedTime)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-ButtonColor hover:bg-ButtonHover"
            }`}
          >
            Checkout <span>${cartTotalPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-lg z-50 block md:hidden lg:hidden">
        <button
          onClick={handleToCheckout}
          disabled={!isASAP && (!selectedDate || !selectedTime)}
          className={`w-full py-3 rounded-lg shadow-lg transition font-bold text-white ${
            !isASAP && (!selectedDate || !selectedTime)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-ButtonColor hover:bg-ButtonHover"
          }`}
        >
          Checkout <span>${cartTotalPrice.toFixed(2)}</span>
        </button>
      </div>

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </section>
  );
};

export default MyCart;
