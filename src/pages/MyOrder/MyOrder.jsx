import { Link } from "react-router-dom";
import { useMyOrder, useUserProfile } from "../../api/api";
import Loader from "../../assets/images/loader.gif";
import { IoMdEye } from "react-icons/io";
import { Helmet } from "react-helmet-async";

const MyOrder = () => {
  const { user } = useUserProfile();
  const { myorder, isLoading } = useMyOrder(user.id);

  return (
    <div className="container min-h-96 mx-auto mt-16 px-4 lg:px-0 w-full lg:w-10/12">
      <Helmet>
        <title>My Order | Wingsblast</title>
      </Helmet>
      <div className="flex flex-wrap -mx-3">
        <div className="w-full max-w-full px-3 mb-6">
          <div className="bg-gray-100 rounded-lg shadow-lg">
            <div className="border-dashed border rounded-2xl border-gray-200 bg-light/30">
              <div className="px-6 py-4 flex justify-between items-center bg-gradient-to-r from-pink-500 via-pink-300 to-pink-400 rounded-t-lg">
                <h3 className="text-3xl text-white font-TitleFont">My Order</h3>
              </div>
              <div className="">
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-200 table-zebra">
                    <thead className="bg-orange-100">
                      <tr className="text-left text-sm text-black uppercase">
                        <th className="px-4 py-2">Order ID</th>
                        <th className="px-4 py-2">Address</th>
                        <th className="px-4 py-2">Type</th>
                        <th className="px-4 py-2 text-center">Price</th>
                        <th className="px-4 py-2 text-center">Time</th>
                        <th className="px-4 py-2 text-center">Date</th>
                        <th className="px-4 py-2 text-center">Phone</th>
                        <th className="px-4 py-2 text-center">Status</th>
                        <th className="px-4 py-2 text-center">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan="9" className="text-center py-8">
                            <div className="flex items-center justify-center">
                              <img
                                src={Loader}
                                alt="Loading..."
                                className="w-[150px]"
                              />
                            </div>
                          </td>
                        </tr>
                      ) : myorder?.length > 0 ? (
                        myorder.map((orderMenu, index) => (
                          <tr
                            key={index}
                            className={`border-b ${
                              index % 2 === 0 ? "bg-gray-50" : "bg-white"
                            } hover:bg-gray-100 transition-all`}
                          >
                            <td className="px-4 py-2">{orderMenu.order_id}</td>
                            <td className="px-4 py-2">
                              {orderMenu.delivery_type == "Delivery" &&  
                                orderMenu.delevery_address}
                            </td>
                            <td className="px-4 py-2">
                              {orderMenu.delivery_type}
                            </td>
                            <td className="px-4 py-2 text-center">
                              $
                              {parseFloat(orderMenu.total_price || 0).toFixed(
                                2
                              )}
                            </td>
                            <td className="px-4 py-2 text-center">
                              <span className="inline-flex whitespace-nowrap px-2 py-1 rounded-md bg-green-100 text-green-600">
                                {orderMenu.later_slot}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center whitespace-nowrap">
                              {new Date(
                                orderMenu.later_date
                              ).toLocaleDateString("en-US", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })}
                            </td>
                            <td className="px-4 py-2 text-center">
                              {orderMenu.phone}
                            </td>
                            <td className="px-4 py-2 text-center">
                              <span
                                className={`px-2 py-1 rounded whitespace-nowrap ${
                                  orderMenu.status === "Completed"
                                    ? "bg-green-200 text-green-800"
                                    : "bg-red-200 text-red-800"
                                }`}
                              >
                                {orderMenu.status}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center">
                              <Link to={`/orderdetails/${orderMenu.id}`}>
                                <button className="text-white text-xs p-1.5 gap-1 rounded flex items-center bg-ButtonColor hover:bg-ButtonHover">
                                  <IoMdEye /> Details
                                </button>
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="9"
                            className="text-center py-8 text-gray-600"
                          >
                            You have no orders.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrder;
