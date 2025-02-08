import React, { useState } from "react";
import { SiFampay } from "react-icons/si";
import { FcGoogle } from "react-icons/fc";
import { useUserProfile } from "../api/api";

const Checkout = () => {
  const { user } = useUserProfile();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Sandqvist Zack",
      size: "35L",
      quantity: 2,
      price: 110.99,
      image: "https://via.placeholder.com/50",
    },
    {
      id: 2,
      name: "Sandqvist Bernt",
      size: "30L",
      quantity: 1,
      price: 159.99,
      image: "https://via.placeholder.com/50",
    },
    {
      id: 3,
      name: "Sandqvist Zack S",
      size: "25L",
      quantity: 1,
      price: 89.99,
      image: "https://via.placeholder.com/50",
    },
  ]);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = 0;
  const total = subtotal + shipping;

  const handleQuantityChange = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
          : item
      )
    );
  };

  return (
    <section className="bg-gray-100">
      <div className="container mx-auto p-6 md:flex md:space-x-6 min-h-screen">
        {/* Shopping Cart Section */}
        <div className="md:w-2/3 p-6 bg-white border border-gray-300 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Shopping Cart
          </h1>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">Item</th>
                  <th className="px-4 py-2 text-left">Size</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-2 flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg mr-4"
                      />
                      <span>{item.name}</span>
                    </td>
                    <td className="px-4 py-2">{item.size}</td>
                    <td className="px-4 py-2">{item.quantity}</td>
                    <td className="px-4 py-2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 flex space-x-2">
                      <button
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        onClick={() => handleQuantityChange(item.id, -1)}
                      >
                        -
                      </button>
                      <button
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        +
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-right mt-6">
            <p className="text-lg">
              Subtotal:{" "}
              <span className="font-bold">${subtotal.toFixed(2)}</span>
            </p>
            <p className="text-lg">
              Shipping: <span className="font-bold">Free</span>
            </p>
            <p className="text-2xl font-bold mt-2">
              Total: ${total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Payment Info Section */}
        <div className="md:w-1/3 p-6 bg-white border border-gray-300 rounded-lg shadow-lg mt-6 md:mt-0">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Payment Info
          </h2>
          <div className="flex justify-center w-full mt-4 gap-5">
            <button className="bg-yellow-400 flex items-center text-black font-semibold py-3 px-16 rounded">
              <SiFampay />
              <span className="text-sky-500">Pay</span> pal{" "}
            </button>
            <button className="bg-black flex items-center text-white font-semibold px-16 py-3 rounded">
              <FcGoogle /> Pay
            </button>
          </div>

          {/* Payment Form */}
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">Name on Card</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Card Number</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex mb-4 space-x-4">
              <div className="w-1/2">
                <label className="block text-gray-700">Expiration Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-gray-700">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </form>
          {user.id > 0 ? (
            <form>
              <div>
                <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                  <div>
                    <label className="text-gray-700">Fast Name *</label>
                    <input
                      type="text"
                      name="first_name"
                      defaultValue={user?.first_name}
                      required
                      placeholder="Fast Name"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-800 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
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
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-800 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    />
                  </div>
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
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-800 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
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
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-800 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                  />
                </div>
              </div>

              <button className="w-full my-3 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all">
                Check Out
              </button>
            </form>
          ) : (
            ""
          )}
        </div>
      </div>
    </section>
  );
};

export default Checkout;
