import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API, useGuestUser, useUserProfile } from "../../api/api";
import Swal from "sweetalert2";
import SignInSignOutModal from "../../components/SignInSignOutModal";
import PayPal from "./PayPal";

const CheckOut = () => {
  const { guestUser } = useGuestUser();
  const { user, loading, refetch } = useUserProfile();
  const [saveLocation, setSaveLocation] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();
  const orderStatus = localStorage.getItem("orderStatus");
  const myOrderData = location.state?.orderData;
  const navigate = useNavigate();

  // Load saved address
  useEffect(() => {
    const carryout = localStorage.getItem("carryoutAddress");
    const delivery = localStorage.getItem("deliveryAddress");
    setSaveLocation(carryout || delivery || "");
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin");
    }
  }, [loading, user, navigate]);

  // Save user information from form
  const handleSaveInfo = async (value) => {
    value.preventDefault();
    setIsEditing(true);
    const form = new FormData(value.currentTarget);
    const first_name = form.get("first_name");
    const last_name = form.get("last_name");
    const email = form.get("email");
    const phone = form.get("phone");

    const newUserInf = {
      first_name,
      last_name,
      email,
      phone,
    };

    try {
      await API.put("/user/update", newUserInf);
      Swal.fire({
        icon: "success",
        title: "Information Updated!",
        text: "Your contact information has been successfully updated.",
        confirmButtonText: "OK",
      });

      refetch();
      setIsEditing(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "There was an issue updating your contact information. Please try again.",
      });
      setIsEditing(false);
    }
  };

  const isOrderButtonDisabled = !user.first_name || !user.phone;

  return (
    <section className="text-gray-600 bg-gray-50 body-font  mx-auto">
      <div className="container px-0 lg:px-5 rounded-lg shadow-lg my-3 py-2 lg:py-3 w-full lg:w-10/12 mx-auto flex flex-wrap ">
        {/* Left side section  */}
        <div className="w-full lg:w-4/6 md:w-1/2 mx-auto border-r">
          <div className=" rounded-t-md">
            <h1 className="font-TitleFont text-4xl text-gray-900 px-4 text-center lg:text-start">
              CHECKOUT
            </h1>
          </div>
          <div className="divider"></div>
          <div className="my-3 mx-4 text-black">
            <div className="flex justify-between text-center font-TitleFont text-2xl">
              <h1>CONTACT INFORMATION</h1>
            </div>
          </div>
          <div className=" w-full lg:max-w-4xl p-6 mx-auto bg-white rounded-md">
            {user.id > 0 ? (
              <form onSubmit={handleSaveInfo}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-gray-700">Fast Name *</label>
                    <input
                      type="text"
                      name="first_name"
                      defaultValue={user?.first_name}
                      required
                      placeholder="Fast Name"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-800 rounded focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    />
                  </div>
                  <div>
                    <label className="text-gray-700">Last Name *</label>
                    <input
                      name="last_name"
                      defaultValue={user?.last_name}
                      required
                      placeholder="Last Name"
                      type="text"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-800 rounded focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    />
                  </div>

                  <div>
                    <label className="text-gray-700">Email Address *</label>
                    <input
                      name="email"
                      defaultValue={user?.email}
                      required
                      readOnly
                      placeholder="Email Address"
                      type="email"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-800 rounded focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    />
                  </div>

                  <div>
                    <label className="text-gray-700">Phone *</label>
                    <input
                      name="phone"
                      required
                      defaultValue={user?.phone}
                      placeholder="xxx xxx xxxx"
                      type="text"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-800 rounded focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    />
                  </div>
                </div>
                <div className="flex gap-2"></div>
                <div className="mx-auto text-center">
                  <input
                    type="submit"
                    value={isEditing ? "Saving..." : "Save Information"}
                    disabled={isEditing}
                    className={`btn bg-ButtonColor text-white hover:bg-ButtonHover font-TitleFont font-normal text-xl rounded px-12 mx-auto text-center mt-4 ${
                      isEditing ? "btn-disabled cursor-not-allowed" : ""
                    }`}
                  />
                </div>
              </form>
            ) : (
              <SignInSignOutModal />
            )}
          </div>

          <div>
            {loading && (
              <span className="loading loading-spinner text-linear-to-bl from-violet-500 to-fuchsia-500"></span>
            )}
            {myOrderData?.foods?.map((food, foodIndex) => (
              <div key={foodIndex} className="p-4 text-black">
                <div className="divider"></div>
                <h3 className="text-2xl font-TitleFont">{food.name}</h3>
                {food.note && (
                  <p>
                    <strong className="font-TitleFont text-lg font-normal">
                      NOTE:
                    </strong>
                    {""} {food.note}
                  </p>
                )}
                {/* Flavor Addons */}
                {food?.addons?.flavor?.length > 0 && (
                  <h1 className="font-TitleFont">Flavor:</h1>
                )}
                {food?.addons?.flavor?.map((flavor, flavorIndex) => (
                  <div
                    key={flavorIndex}
                    title="Flavor"
                    className="flex justify-between ml-3"
                  >
                    <div className="flex gap-2">
                      <p className="text-sm">{flavor.name}</p>
                      <span className="text-sm">X{flavor.quantity}</span>
                    </div>
                  </div>
                ))}
                {/* Topping Addons */}
                {food?.addons?.toppings?.length > 0 && (
                  <h1 className="font-TitleFont">Toppings:</h1>
                )}
                {food?.addons?.toppings?.map((topping, toppingIndex) => (
                  <div
                    key={toppingIndex}
                    title="Topping"
                    className="flex justify-between ml-3"
                  >
                    <div className="flex gap-2">
                      <p className="text-sm">{topping.name}</p>
                      <span className="text-sm">X{topping.quantity}</span>
                    </div>
                    {topping.isPaid == 1 && (
                      <span className="text-sm font-TitleFont">
                        ${(topping.price * topping.quantity).toFixed(2)}
                      </span>
                    )}
                  </div>
                ))}
                {/* Sandwich Addons */}
                {food?.addons?.sandCust?.length > 0 && (
                  <h1 className="font-TitleFont">Sandwich:</h1>
                )}
                {food?.addons?.sandCust?.map((sandwich, sandwichIndex) => (
                  <div
                    key={sandwichIndex}
                    title="Sandwich"
                    className="flex items-center justify-between ml-3"
                  >
                    <div className="flex gap-2">
                      <p className="text-sm">{sandwich.name}</p>
                      <span className="text-sm">X{sandwich.quantity}</span>
                    </div>
                    {sandwich.isPaid == 1 && (
                      <span className="text-sm font-TitleFont">
                        ${(sandwich.price * sandwich.quantity).toFixed(2)}
                      </span>
                    )}
                  </div>
                ))}
                {/* Side Addons */}
                {food.addons?.side?.length > 0 && (
                  <h1 className="font-TitleFont">Side:</h1>
                )}
                {food.addons?.side?.map((side, sideIndex) => (
                  <div
                    key={sideIndex}
                    title="Side"
                    className="flex items-center justify-between ml-3"
                  >
                    <div className="flex gap-2">
                      <p className="text-sm">{side.name}</p>
                      <span className="text-sm">X{side.quantity}</span>
                    </div>
                    {side.isPaid == 1 && (
                      <span className="text-sm font-TitleFont">
                        ${(side.price * side.quantity).toFixed(2)}
                      </span>
                    )}
                  </div>
                ))}
                {/* Dip Addons */}
                {food.addons?.dip?.length > 0 && (
                  <h1 className="font-TitleFont">Dip:</h1>
                )}
                {food.addons?.dip?.map((dip, dipIndex) => (
                  <div
                    key={dipIndex}
                    title="Dip"
                    className="flex items-center justify-between ml-3"
                  >
                    <div className="flex gap-2">
                      <p className="text-sm">{dip.name}</p>
                      <span className="text-sm">X{dip.quantity}</span>
                    </div>
                    {dip.isPaid == 1 && (
                      <span className="text-sm font-TitleFont">
                        ${(dip.price * dip.quantity).toFixed(2)}
                      </span>
                    )}
                  </div>
                ))}
                {/* Bakery Addons */}
                {food.addons?.beverage?.length > 0 && (
                  <h1 className="font-TitleFont">Beverage:</h1>
                )}
                {food.addons?.beverage?.map((bakery, bakeryIndex) => (
                  <div
                    key={bakeryIndex}
                    title="Bakery"
                    className="flex items-center justify-between ml-3"
                  >
                    <div className="flex gap-2">
                      <p className="text-sm">{bakery.name}</p>
                      <span className="text-sm">X{bakery.quantity}</span>
                    </div>
                    {bakery.isPaid == 1 && (
                      <span className="text-sm font-TitleFont">
                        ${(bakery.price * bakery.quantity).toFixed(2)}
                      </span>
                    )}
                  </div>
                ))}
                {/* Rice Platter Addons */}
                {food.addons?.ricePlatter?.length > 0 && (
                  <h1 className="font-TitleFont">Rice Platter:</h1>
                )}
                {food.addons?.ricePlatter?.map((rice, riceIndex) => (
                  <div
                    key={riceIndex}
                    title="Rice Platter"
                    className="flex items-center justify-between ml-3"
                  >
                    <div className="flex gap-2">
                      <p className="text-sm">{rice.name}</p>
                      <span className="text-sm">X{rice.quantity}</span>
                    </div>
                    {rice.isPaid == 1 && (
                      <span className="text-sm font-TitleFont">
                        ${(rice.price * rice.quantity).toFixed(2)}
                      </span>
                    )}
                  </div>
                ))}
                {/* Sauce Addons */}
                {food.addons?.sauce?.length > 0 && (
                  <h1 className="font-TitleFont">Sauce:</h1>
                )}
                {food.addons?.sauce?.map((sauce, sauceIndex) => (
                  <div
                    key={sauceIndex}
                    title="Sauce"
                    className="flex items-center justify-between ml-3"
                  >
                    <div className="flex gap-2">
                      <p className="text-sm">{sauce.name}</p>
                      <span className="text-sm">X{sauce.quantity}</span>
                    </div>
                    {sauce.isPaid == 1 && (
                      <span className="text-sm font-TitleFont">
                        ${(sauce.price * sauce.quantity).toFixed(2)}
                      </span>
                    )}
                  </div>
                ))}
                {/* Fish Addons */}
                {food.addons?.fishChoice?.length > 0 && (
                  <h1 className="font-TitleFont">Fish:</h1>
                )}
                {food.addons?.fishChoice?.map((fish, fishIndex) => (
                  <div
                    key={fishIndex}
                    title="Fish"
                    className="flex items-center justify-between ml-3"
                  >
                    <div className="flex gap-2">
                      <p className="text-sm">{fish.name}</p>
                      <span className="text-sm">X{fish.quantity}</span>
                    </div>
                    {fish.isPaid == 1 && (
                      <span className="text-sm font-TitleFont">
                        ${(fish.price * fish.quantity).toFixed(2)}
                      </span>
                    )}
                  </div>
                ))}
                {/* Drink Addons */}
                {food.addons?.drink?.length > 0 && (
                  <h1 className="font-TitleFont">Drink:</h1>
                )}
                {food.addons?.drink?.map((drink, drinkIndex) => (
                  <div
                    key={drinkIndex}
                    title="Drink"
                    className="flex items-center justify-between ml-3"
                  >
                    <div className="flex gap-2">
                      <p className="text-sm">
                        {drink.name}({drink.child_item_name})
                      </p>
                      <span className="text-sm">X{drink.quantity}</span>
                    </div>
                    {drink.isPaid == 1 && (
                      <span className="text-sm font-TitleFont">
                        ${(drink.price * drink.quantity).toFixed(2)}
                      </span>
                    )}
                  </div>
                ))}
                <div className="flex justify-between">
                  <p>
                    <span className="font-TitleFont">Quantity:</span>{" "}
                    {food.quantity}
                  </p>
                  <p className="font-TitleFont text-lg">Price: ${food.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side section  */}
        <div className="lg:w-2/6 md:w-1/2 rounded  flex flex-col md:ml-auto w-full mt-10 md:mt-0">
          <div className="px-4 pt-2">
            <h2 className="text-black text-2xl font-TitleFont text-center lg:text-start">
              {orderStatus == "Delivery" ? "DELIVERY ADDRESS" : "CARRYOUT"}
            </h2>
            {orderStatus == "Delivery" ? (
              <p className="text-gray-900 text-sm mt-2 flex justify-center lg:justify-start">
                {saveLocation}
              </p>
            ) : (
              ""
            )}
          </div>

          <div className="divider"></div>
          <div className="bg-white w-full rounded-lg p-4 mx-auto">
            <h2 className="text-3xl font-TitleFont text-gray-950 text-center mb-4">
              Order Summary
            </h2>
            <table className="w-full text-lg text-left text-gray-700">
              <thead className="text-xl text-gray-900 uppercase ">
                <tr>
                  <th
                    scope="col"
                    className="py-1 px-6 font-TitleFont font-normal"
                  >
                    Item
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-6 text-right font-TitleFont font-normal"
                  >
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-50 text-gray-800 border-b font-TitleFont  border-gray-200">
                  <td className="py-3 px-6 font-TitleFont text-base text-black">
                    Subtotal
                  </td>
                  <td className="py-3 px-6 text-right">
                    ${parseFloat(myOrderData?.sub_total || 0).toFixed(2)}
                  </td>
                </tr>

                {orderStatus == "Delivery" && (
                  <tr className="bg-white text-gray-800 font-TitleFont  border-b border-gray-200">
                    <td className="py-3 px-6 text-base text-black">
                      Delivary Fee
                    </td>
                    <td className="py-3 px-6 text-right">
                      + ${myOrderData?.delivery_fee}
                    </td>
                  </tr>
                )}

                {/* Service Fee */}
                {orderStatus == "Delivery" && (
                  <tr className="bg-white text-gray-800 border-b font-TitleFont border-gray-200">
                    <td className="py-3 px-6 font-TitleFont text-base text-black">
                      Tips
                    </td>
                    <td className="py-3 px-6 text-right">
                      + ${myOrderData?.tips.toFixed(2)}
                    </td>
                  </tr>
                )}

                <tr className="bg-gray-50 text-gray-800 font-TitleFont border-b border-gray-200">
                  <td className="py-3 px-6 font-TitleFont text-base text-black">
                    {orderStatus == "Delivery" ? "Tax & Fees" : "Tax"}{" "}
                  </td>
                  <td className="py-3 px-6 text-right">
                    ${parseFloat(myOrderData?.tax || 0).toFixed(2)}
                  </td>
                </tr>

                {myOrderData?.coupon_discount > 0 && (
                  <tr className="bg-gray-50 text-gray-800 font-TitleFont border-b border-gray-200">
                    <td className="py-3 px-6 font-TitleFont text-base text-black">
                      Coupon Discount
                    </td>
                    <td className="py-3 px-6 text-right">
                      -$
                      {parseFloat(myOrderData?.coupon_discount || 0).toFixed(2)}
                    </td>
                  </tr>
                )}

                <tr className="bg-white text-gray-900  font-TitleFont text-2xl">
                  <td className="py-4 px-6 ">Total</td>
                  <td className="py-4 px-6 text-right">
                    ${parseFloat(myOrderData?.total_price || 0).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="z-10">
            <PayPal
              guestUsers={guestUser}
              myOrderData={myOrderData}
              isOrderButtonDisabled={isOrderButtonDisabled}
            />
            {/* <ApplePay /> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckOut;
