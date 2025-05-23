import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsClock } from "react-icons/bs";
import NewFoodAddCard from "./NewFoodAddCard";
import {
  API,
  useDeleveryFee,
  useFees,
  useGuestUser,
  useMyCart,
  useOpeningClosingTime,
  useTax,
  useUserProfile,
} from "../../api/api";
import Swal from "sweetalert2";
import { FaMinus, FaPlus } from "react-icons/fa";
import LocationModal from "../../components/LocationModal";
import { RiEdit2Fill } from "react-icons/ri";
import { LuBadgeInfo } from "react-icons/lu";
import OrderTips from "./OrderTips";
import { MdEdit, MdOutlineClose } from "react-icons/md";
import LoadingComponent from "../../components/LoadingComponent";
import SignInSignOutModal from "../../components/SignInSignOutModal";
import { Helmet } from "react-helmet-async";

const MyCart = () => {
  const { tax, isTaxLoading } = useTax();
  const { fees } = useFees();
  const { deleveryFee } = useDeleveryFee();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isASAP, setIsASAP] = useState(true);
  const { guestUser } = useGuestUser();
  const { user, refetch: userRefetch } = useUserProfile();
  const { mycard, isLoading, isError, refetch } = useMyCart(guestUser);
  const { allOpeningClosingTime, isLoading: timeLoading } = useOpeningClosingTime();
  const [quantities, setQuantities] = useState({});
  const [dates, setDates] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]); // <-- new state
  const [savedAddress, setSavedAddress] = useState("");
  const [time, setTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLater, setIsLater] = useState(true);
  const [orderStatus, setOrderStatus] = useState("");
  const [error, setError] = useState("");
  const [delivaryIsFee, setDeliveryFee] = useState(0);
  const [feesData, setFeesData] = useState([]);
  const [couponPrice, setCouponPrice] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [selectTipsRate, setSelectTipsRate] = useState(0);
  const [customTips, setCustomTips] = useState(0);
  const [openNotes, setOpenNotes] = useState({});
  const [note, setNote] = useState({});
  const [firstLine, setFirstLine] = useState("");
  const [secondLine, setSecondLine] = useState("");
  const [iscountPercentage, setDiscountPercentage] = useState(0);
  const delivaryFee = deleveryFee?.fee;
  const taxRate = tax?.tax_rate;
  const navigate = useNavigate();

  // open note funtion
  const handleOpenNote = (id) => {
    setOpenNotes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // note change
  const handleNoteChange = (id, value) => {
    setNote((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const checkASAPAvailability = () => {
    // Get today's day name
    if(timeLoading){
      return <LoadingComponent />
    }
    const today = new Date();
    const dayName = today.toLocaleDateString("en-US", { weekday: "long" });

    // Find today's opening/closing info
    const todayData = allOpeningClosingTime?.data?.find(
      (d) => d.day_info.day === dayName
    );

    // If not found, fallback to previous logic
    if (!todayData || todayData.day_info.is_day_on !== 1) return false;

    // Parse start_time and end_time (format: "HH:mm:ss")
    const [startHour, startMin] = todayData.day_info.start_time
      .split(":")
      .map(Number);
    const [endHour, endMin] = todayData.day_info.end_time
      .split(":")
      .map(Number);

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  };

 
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
    setQuantities((prev) => {
      const newQuantity = Math.max(0, (prev[id] || 1) - 1);

      if (newQuantity === 0) {
        const itemToDelete = mycard.find((item) => item.id === id);
        setSelectedItem(itemToDelete);
        const modal = document.getElementById("my_modal_3");
        if (modal) modal.showModal();
      }

      return {
        ...prev,
        [id]: newQuantity,
      };
    });
  };

  // set Coupon
  const handleCoupons = async (event) => {
    event.preventDefault();
    const code = event.target.elements.code.value;
    const food_ids = mycard.map((item) => ({
      food_id: item.food_details_id,
      quentity: quantities[item.id], // or item.qty jodi field ta different hoy
    }));

    // const user_id = guestUser || 1;
    const delivery_type = orderStatus === "Delivery" ? "delivery" : "carryout";

    const data = {
      code,
      user_id: user.id,
      delivery_type,
      food_ids,
    };
    try {
      const response = await API.post("/offer/check-offer", data);
      const discountData = response.data.data;
      if (response.status === 200) {
        setCouponCode(discountData.code);
        if (discountData.is_discount_amount === 1) {
          setCouponPrice(discountData.discount_amount);
          Swal.fire({
            icon: "success",
            html: `
               <div style="text-transform: capitalize; font-size: 24px; font-weight: bold;">
              🎉 ${discountData.type} Applied
               </div>
               <div style="margin-top:10px; font-size:18px;">
               Amount Saved: $${discountData.discount_amount.toFixed(2)}
               </div>
            `,
            showConfirmButton: true,
            confirmButtonText: "Awesome!",
            confirmButtonColor: "#6366F1",
            background: "#f0f9ff",
          });
        } else if (discountData.is_discount_percentage === 1) {
          const discountAmount =
            (cartSubtotal * discountData.discount_percentage) / 100;
          setDiscountPercentage(discountData.discount_percentage);
          setCouponPrice(discountAmount);
          Swal.fire({
            icon: "success",
            html: `
               <div style="text-transform: uppercase; font-size: 24px; font-weight: bold;">
              🎉  ${discountData.type} Applied
               </div>
               <div style="margin-top:10px; font-size:18px;">
               Discount: ${discountData.discount_percentage}%<br/>
               Amount Saved: $${discountAmount.toFixed(2)}
               </div>
            `,
            showConfirmButton: true,
            confirmButtonText: "Awesome!",
            confirmButtonColor: "#6366F1", // nice indigo color
            background: "#f0f9ff", // light blue background
          });
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "warning",
        title: "Invalid Coupon",
        text: `${error.response.data.message}`,
      });
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

  // handle dates
  useEffect(() => {
    // Helper to get day name from Date object
    const getDayName = (date) => {
      return date.toLocaleDateString("en-US", { weekday: "long" });
    };

    const generateNext7Days = () => {
      if (!allOpeningClosingTime?.data) return;
      const today = new Date();
      const daysArray = [];
      for (let i = 0; i < 7; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        const dayName = getDayName(nextDate);

        // Find the corresponding day_info from allOpeningClosingTime
        const dayData = allOpeningClosingTime.data.find(
          (d) => d.day_info.day === dayName
        );
        daysArray.push({
          label: nextDate.toDateString(),
          value: nextDate.toDateString(),
          dayName,
          is_day_on: dayData ? dayData.day_info.is_day_on : 0,
          timeSlots: dayData ? dayData.timeSlots : [],
        });
      }
      setDates(daysArray);
    };
    generateNext7Days();
  }, [allOpeningClosingTime]);

  // Update available time slots when selectedDate changes
  useEffect(() => {
    if (!selectedDate || !dates.length) {
      setAvailableTimeSlots([]);
      return;
    }
    const selectedDay = dates.find((d) => d.value === selectedDate);
    setAvailableTimeSlots(
      selectedDay && selectedDay.is_day_on === 1
        ? selectedDay.timeSlots
        : []
    );
    // Reset selectedTime if not available
    setSelectedTime("");
  }, [selectedDate, dates]);

  // handle time
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // handle order status
  useEffect(() => {
    const orderStatus = localStorage.getItem("orderStatus");
    const delivery = localStorage.getItem("deliveryAddress");
    setSavedAddress(delivery);
    setOrderStatus(orderStatus);
  }, []);

  // handle delete
  const handleDelete = async (id) => {
    try {
      await API.delete(`/card/delete/${id}`);
      Swal.fire({
        title: "Deleted!",
        text: "Your item has been deleted.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      document.getElementById("my_modal_3").close();
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
  };

  // handle order
  const myOrder = {
    delivery_type: orderStatus,
    delevery_address: savedAddress,
    building_suite_apt: "building_suite_apt",
    tips: tipsPrice,
    fees: totalFeesAndTax,
    delivery_fee: delivaryIsFee,
    coupon_discount: couponPrice,
    tax: totalFeesAndTax,
    sub_total: cartSubtotal,
    total_price: cartTotalPrice,
    isLater: isLater,
    later_date: selectedDate,
    later_slot: selectedTime,
    offer_code: couponCode,
    foods: mycard?.map((item) => ({
      food_details_id: item.food_details_id,
      name: item.food_name,
      image: item.food_image,
      price: (item.price * quantities[item.id]).toFixed(2),
      quantity: quantities[item.id],
      description: "Hand-breaded boneless wings",
      buy_one_get_one_id: item.buy_one_get_one.id || "",
      buy_one_get_one_name: item.buy_one_get_one.name || "",
      note: note[item.id] || "",
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
        sauce: item?.sauce?.map((sc) => ({
          name: sc.name,
          price: sc.price,
          isPaid: sc.is_paid_type,
          quantity: sc.quantity,
        })),
        ricePlatter: item?.ricePlatter?.map((rp) => ({
          name: rp.name,
          price: rp.price,
          isPaid: rp.is_paid_type,
          quantity: rp.quantity,
        })),
        fishChoice: item?.fishChoice?.map((fish) => ({
          name: fish.name,
          price: fish.price,
          isPaid: fish.is_paid_type,
          quantity: fish.quantity,
        })),
      },
    })),
  };

  const handleToCheckout = () => {
    if (cartSubtotal < 20) {
      Swal.fire({
        icon: "warning",
        title: "Minimum Order Amount",
        text: "Your order subtotal must be at least $20 to proceed to checkout.",
        confirmButtonText: "OK",
      });
      return;
    }
    setError("");
    navigate("/checkout", { state: { orderData: myOrder } });
  };
  // handle custom tips
  const sendCustomTips = (data) => {
    setCustomTips(data);
  };
  // handle select tips
  const sendSelectTipsRate = (data) => {
    setSelectTipsRate(data);
  };
  // handle address
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

  const textareaRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const activeId = Object.keys(openNotes).find((id) => openNotes[id]);

      if (
        activeId &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target)
      ) {
        setOpenNotes((prev) => ({
          ...prev,
          [activeId]: false,
        }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openNotes]);

  return (
    <section className="text-gray-600 body-font mx-auto">
      <Helmet>
        <title>My Cart | Wingsblast</title>
      </Helmet>
      <div className="container px-0 lg:px-5 py-2 lg:py-4 mx-auto flex flex-wrap w-full lg:w-10/12">
        <div className="lg:w-4/6 md:w-1/2 w-full  rounded-lg mb-10 lg:mb-0">
          <NewFoodAddCard />
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-TitleFont text-black mt-3 ml-3">
                Review Order
              </h1>
            </div>

            {isLoading ? (
              <LoadingComponent />
            ) : mycard.length > 0 ? (
              mycard.map((item) => (
                <div key={item.id} className="my-3 mx-4 text-black">
                  <div className="divider"></div>
                  <div className="flex justify-between text-xl sm:text-2xl">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-TitleFont">
                        {item.food_name}
                      </h2>
                      <div className="flex gap-2">
                        <Link to={`/food-details/${item.food_details_id}`}>
                          <button className=" rounded-full p-1.5 bg-gray-100 hover:bg-gray-200 transition-all duration-300">
                            <MdEdit className="text-2xl text-black " />
                          </button>
                        </Link>
                      </div>
                    </div>
                    {/* delete model show  */}
                    <dialog id="my_modal_3" className="modal">
                      <div className="modal-box w-[350px] lg:w-[400px] !rounded">
                        <form method="dialog"></form>
                        <h3 className="font-TitleFont text-5xl text-black text-center">
                          REMOVE ITEM?
                        </h3>
                        <p className="py-4 text-sm">
                          Are you sure you want to remove{" "}
                          <strong>{selectedItem?.food_name}</strong> from your
                          order?
                        </p>
                        <button
                          onClick={() => {
                            handleDelete(selectedItem?.id);
                            document.getElementById("my_modal_3").close();
                          }}
                          className="font-TitleFont w-full text-white bg-ButtonColor hover:bg-ButtonHover rounded p-1.5"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => {
                            // Close modal
                            document.getElementById("my_modal_3").close();

                            // Restore quantity to 1
                            if (selectedItem) {
                              setQuantities((prev) => ({
                                ...prev,
                                [selectedItem.id]: 1,
                              }));
                            }
                          }}
                          className="font-TitleFont w-full text-black bg-gray-200 border border-gray-400 mt-3 rounded p-1.5"
                        >
                          Cancel
                        </button>
                      </div>
                    </dialog>
                    <h1 className="font-TitleFont">${item.food_price}</h1>
                  </div>
                  {item.buy_one_get_one.name && (
                    <div className="flex items-center justify-between">
                      <h1 className="text-lg font-medium font-TitleFont text-gray-800">
                        {item.buy_one_get_one.name}
                      </h1>
                      <span className="font-TitleFont text-red-600">Free</span>
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium">
                      {/* toppings */}
                      {item.topping.length > 0 && (
                        <h4 className="font-TitleFont text-lg">Toppings: </h4>
                      )}
                      {item?.topping?.map((topping, index) => (
                        <div
                          key={index}
                          className="flavor-item ml-3 cursor-pointer flex items-center justify-between"
                        >
                          <h1 title="topping" className="flex items-center">
                            {topping.name}{" "}
                          </h1>
                          <span className="font-TitleFont">
                            {topping.is_paid_type === 1
                              ? `$${(topping.price * topping.quantity).toFixed(
                                  2
                                )}`
                              : ""}
                          </span>
                        </div>
                      ))}
                      {/* flavors */}
                      {item.flavors.length > 0 && (
                        <h4 className="font-TitleFont text-lg">Flavors: </h4>
                      )}
                      {item?.flavors?.length > 0 &&
                        item.flavors.map((flavor, index) => (
                          <div
                            key={index}
                            className="flavor-item cursor-pointer ml-3"
                          >
                            <h1 title="Flavor">
                              {flavor.flavor_name} X{flavor.quantity}
                            </h1>
                          </div>
                        ))}
                      {/* dips */}
                      {item.dips.length > 0 && (
                        <h4 className="font-TitleFont text-lg">Dip: </h4>
                      )}
                      {item.dips.map((dip, index) => (
                        <div
                          key={index}
                          className="flavor-item ml-3 cursor-pointer flex items-center justify-between"
                        >
                          <h1 title="Dip" className="flex items-center">
                            {dip.name} X{dip.quantity}{" "}
                          </h1>
                          <span className="font-TitleFont">
                            {dip.is_paid_type === 1
                              ? `$${(dip.price * dip.quantity).toFixed(2)}`
                              : ""}
                          </span>
                        </div>
                      ))}
                      {/* sides */}
                      {item.sides.length > 0 && (
                        <h4 className="font-TitleFont text-lg">Sides: </h4>
                      )}
                      {item.sides.map((side, index) => (
                        <div
                          key={index}
                          className="flavor-item ml-3 cursor-pointer flex justify-between"
                        >
                          <h1 title="side" className="flex items-center">
                            {side.name} X {side.quantity}
                          </h1>
                          <span className="font-TitleFont">
                            {side.is_paid_type === 1
                              ? `$${(side.price * side.quantity).toFixed(2)}`
                              : ""}
                          </span>
                        </div>
                      ))}
                      {/* bakery */}
                      {item.bakery.length > 0 && (
                        <h4 className="font-TitleFont text-lg">Bakery: </h4>
                      )}
                      {item?.bakery?.map((bakery, index) => (
                        <div
                          key={index}
                          className="flavor-item ml-3 cursor-pointer flex items-center justify-between"
                        >
                          <h1 title="bakery" className="flex items-center">
                            {bakery.name} (<MdOutlineClose />
                            {bakery.quantity}){" "}
                          </h1>
                          <span className="font-TitleFont">
                            {bakery.is_paid_type === 1
                              ? `$${(bakery.price * bakery.quantity).toFixed(
                                  2
                                )}`
                              : ""}
                          </span>
                        </div>
                      ))}
                      {/* sandwich */}
                      {item.sandwich.length > 0 && (
                        <h4 className="font-TitleFont text-lg">Sandwich: </h4>
                      )}
                      {item?.sandwich?.map((sandCust, index) => (
                        <div
                          key={index}
                          className="flavor-item ml-3 cursor-pointer flex items-center justify-between"
                        >
                          <h1 title="sandCust" className="flex items-center">
                            {sandCust.name} X1{" "}
                          </h1>
                          <span className="font-TitleFont">
                            {sandCust.is_paid_type === 1
                              ? `$${(
                                  sandCust.price * sandCust.quantity
                                ).toFixed(2)}`
                              : ""}
                          </span>
                        </div>
                      ))}
                      {/* ricePlatter */}
                      {item.ricePlatter.length > 0 && (
                        <h4 className="font-TitleFont text-lg">
                          Rice Platter:{" "}
                        </h4>
                      )}
                      {item?.ricePlatter?.map((ricePlatter, index) => (
                        <div
                          key={index}
                          className="flavor-item ml-3 cursor-pointer flex items-center justify-between"
                        >
                          <h1 title="ricePlatter" className="flex items-center">
                            {ricePlatter.name} X{ricePlatter.quantity}{" "}
                          </h1>
                          <span className="font-TitleFont">
                            {ricePlatter.is_paid_type === 1
                              ? `$${(
                                  ricePlatter.price * ricePlatter.quantity
                                ).toFixed(2)}`
                              : ""}
                          </span>
                        </div>
                      ))}
                      {/* sauce */}
                      {item.sauce.length > 0 && (
                        <h4 className="font-TitleFont text-lg">Sauce: </h4>
                      )}
                      {/* fish choiche */}
                      {item.fishChoice.length > 0 && (
                        <h4 className="font-TitleFont text-lg">
                          Fish Choice:{" "}
                        </h4>
                      )}
                      {item?.fishChoice?.map((fishChoice, index) => (
                        <div
                          key={index}
                          className="flavor-item ml-3 cursor-pointer flex items-center justify-between"
                        >
                          <h1 title="fishChoice" className="flex items-center">
                            {fishChoice.name} X{fishChoice.quantity}{" "}
                          </h1>
                          <span className="font-TitleFont">
                            {fishChoice.is_paid_type === 1
                              ? `$${(
                                  fishChoice.price * fishChoice.quantity
                                ).toFixed(2)}`
                              : ""}
                          </span>
                        </div>
                      ))}
                      {item?.sauce?.map((sauce, index) => (
                        <div
                          key={index}
                          className="flavor-item ml-3 cursor-pointer flex items-center justify-between"
                        >
                          <h1 title="sauce" className="flex items-center">
                            {sauce.name} X{sauce.quantity}{" "}
                          </h1>
                        </div>
                      ))}
                      {/* drinks */}
                      {item.drinks.length > 0 && (
                        <h4 className="font-TitleFont text-lg">Drinks: </h4>
                      )}
                      {item.drinks.map((drink, index) => (
                        <div
                          key={index}
                          className="flavor-item ml-3 flex items-center justify-between cursor-pointer"
                        >
                          <h1 title="drink" className="flex items-center">
                            {drink?.size_name}({drink?.brand_name}) (
                            <MdOutlineClose /> {drink.quantity}){" "}
                          </h1>
                          <span className="font-TitleFont">
                            {drink.is_paid_type === 1
                              ? `$${(drink.price * drink.quantity).toFixed(2)}`
                              : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div>
                      {!openNotes[item.id] && !note[item.id] && (
                        <button
                          className="flex gap-1 items-center border border-gray-300 rounded px-2 py-1 mt-2 transition-all text-sm font-TitleFont"
                          onClick={() => handleOpenNote(item.id)}
                        >
                          <FaPlus className="text-xs" />
                          <span>Add Note</span>
                        </button>
                      )}

                      {openNotes[item.id] && ""}

                      {openNotes[item.id] && (
                        <div className="mt-2" ref={textareaRef}>
                          <textarea
                            name="note"
                            rows="1"
                            placeholder="Type your message"
                            className="w-full max-w-md bg-white rounded border border-gray-300 p-3 focus:ring-1 focus:ring-primary focus:outline-none"
                            value={note[item.id] || ""}
                            onChange={(e) =>
                              handleNoteChange(item.id, e.target.value)
                            }
                          />
                        </div>
                      )}

                      {!openNotes[item.id] && note[item.id] && (
                        <div
                          className="mt-2"
                          onClick={() => handleOpenNote(item.id)}
                        >
                          <p className="w-full max-w-md text-sm">
                            <span className="font-TitleFont text-md">
                              Note :
                            </span>{" "}
                            {note[item.id]}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <button
                        className="p-1.5 text-sm border rounded border-gray-300 hover:bg-gray-100"
                        onClick={() => decrementQuantity(item.id)}
                      >
                        <FaMinus />
                      </button>
                      <span className="p-2 border-gray-300 text-xl font-TitleFont">
                        {quantities[item.id]}
                      </span>
                      <button
                        className="p-1.5 text-sm border rounded border-gray-300 hover:bg-gray-100"
                        onClick={() => incrementQuantity(item.id)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <span className="text-3xl font-TitleFont flex items-baseline gap-1">
                      {/* <p className="line-through text-2xl text-gray-800"> {item.price === item.food_price ? "" : `$${calculateSubtotal(item.food_price,quantities[item.id]).toFixed(2)}`} </p> */}
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
                <div className="max-w-md w-full bg-white p-6 text-center border-gray-300">
                  <div className="text-5xl mb-4">🛒</div>
                  <h2 className="text-xl font-TitleFont text-gray-800 mb-2">
                    Your cart is empty
                  </h2>
                  <p className="text-gray-600">
                    Looks like you do not have any items in your order.
                  </p>
                  <Link to="/foodmenu" className="w-full">
                    <button className=" mx-auto btn rounded bg-ButtonColor hover:bg-ButtonHover text-white block font-TitleFont font-medium text-lg mt-2 lg:text-xl">
                      Continue Shopping
                    </button>
                  </Link>
                </div>
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
          <div className="divider"></div>

          {/* Time Selection */}
          <div className="flex items-center justify-between">
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

          {/* Date and Time Selection */}
          {!isASAP && (
            <div className="flex flex-col sm:flex-row gap-2 bg-gray-50 rounded-lg mb-2">
              <div className="w-full">
                <label className="block font-TitleFont text-lg text-black mb-1">
                  Date :
                </label>
                {timeLoading ? (
                  <div className="py-2 text-center">
                    <span className="loading loading-spinner"></span>
                  </div>
                ) : (
                  <select
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="select w-full border rounded border-red-900 focus:border-red-800 px-3 py-2 text-black"
                    value={selectedDate || ""}
                    disabled={timeLoading}
                  >
                    <option disabled value="" className="">
                      Select Date
                    </option>
                    {dates.map((date, index) => (
                      <option
                        key={index}
                        value={date.value}
                        className="text-black"
                        disabled={date.is_day_on !== 1}
                      >
                        {date.label} {date.is_day_on !== 1 ? "(Closed)" : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="w-full">
                <label className="block text-lg font-TitleFont text-black mb-1">
                  Time :
                </label>
                {timeLoading ? (
                  <div className="py-2 text-center">
                    <span className="loading loading-spinner"></span>
                  </div>
                ) : (
                  <select
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="select w-full border text-black border-red-900 focus:border-red-800 rounded px-3 py-2"
                    value={selectedTime || ""}
                    disabled={timeLoading || !selectedDate || !availableTimeSlots.length}
                  >
                    <option disabled value="">
                      Select Time
                    </option>
                    {availableTimeSlots.map((slot, idx) => (
                      <option key={idx} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          )}
          {/* ASAP Availability Message */}
          {!isASAP &&
            (!selectedDate || !selectedTime) &&
            !checkASAPAvailability() && (
              <div className="border border-red-400 px-4 py-1.5 rounded-sm my-1">
                <h1 className="text-red-700 font-semibold">ASAP Unavailable</h1>
                <p className="text-red-500">
                  We are not currently accepting ASAP orders. Please select a
                  later time to continue with your order.
                </p>
              </div>
            )}

          {/* tips */}
          {orderStatus === "Delivery" && (
            <div>
              <div className="divider"></div>
              <OrderTips
                sendCustomTips={sendCustomTips}
                sendSelectTipsRate={sendSelectTipsRate}
              />
            </div>
          )}

          <div className="divider "></div>

          {/* Pricing Table */}
          <table className="w-full text-lg text-gray-900">
            <tbody>
              <tr className="font-TitleFont">
                <td className="py-0.5 font-TitleFont">Subtotal</td>
                <td className="text-right">${cartSubtotal.toFixed(2)}</td>
              </tr>

              {orderStatus === "Delivery" ? (
                <tr className="font-TitleFont">
                  <td className="py-0.5 flex items-center gap-1">
                    <span>Tax & Fees</span>
                    <span
                      className="cursor-pointer"
                      onClick={() =>
                        document.getElementById("tax_fee").showModal()
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
                <tr className="font-TitleFont">
                  <td className="py-0.5">Tax</td>
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

              <dialog id="tax_fee" className="modal">
                <div className="modal-box rounded">
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
                <tr className="font-TitleFont">
                  <td className="py-0.5">Delivery Fee</td>
                  <td className="text-right">+ ${delivaryFee}</td>
                </tr>
              )}

              {orderStatus === "Delivery" && (
                <tr className="font-TitleFont">
                  <td className="py-0.5">Tips</td>
                  <td className="text-right">+ ${tipsPrice.toFixed(2)}</td>
                </tr>
              )}

              {couponPrice > 0 ? (
                <tr className="font-TitleFont">
                  <td className="py-0.5">
                    Coupon Discount ({iscountPercentage}% Off)
                  </td>
                  <td className="text-right">- ${couponPrice.toFixed(2)}</td>
                </tr>
              ) : (
                ""
              )}
            </tbody>
          </table>

          {user.id ? (
            <div className="w-full my-3">
              <form onSubmit={handleCoupons} className="relative">
                <input
                  type="text"
                  name="code"
                  className="w-full border border-gray-300 text-sm rounded px-4 py-3 text-gray-700 focus:border-green-600 placeholder-gray-500"
                  placeholder="Enter Offer Code"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bg-ButtonColor text-white rounded px-4 py-[10px] text-xs font-bold uppercase transition hover:bg-ButtonHover"
                >
                  Submit
                </button>
              </form>
            </div>
          ) : (
            // Sign In Sign Out Modal
            <div className="">
              <p className="pb-2">Please Login to Get Offer</p>
              <SignInSignOutModal userRefetch={userRefetch} />
            </div>
          )}

          <div className="flex items-center justify-between text-2xl text-gray-800">
            <h1 className="font-TitleFont">Total</h1>
            <p className="text-right font-TitleFont font-normal">
              ${cartTotalPrice.toFixed(2)}
            </p>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="divider hidden md:block lg:block"></div>
          {/* Checkout Button */}
          {!isASAP && (!selectedDate || !selectedTime) && (
            <p className="text-red-500 text-base mb-4 bg-gray-100 p-3 rounded">
              <span className="text-2xl font-TitleFont text-black">Note: </span>
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

      <div className="fixed bottom-0 left-0 w-full bg-white p-1.5 shadow-lg z-50 block md:hidden lg:hidden">
        <button
          onClick={handleToCheckout}
          disabled={!isASAP && (!selectedDate || !selectedTime)}
          className={`w-full py-3 rounded shadow-lg transition font-TitleFont text-xl text-white ${
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
