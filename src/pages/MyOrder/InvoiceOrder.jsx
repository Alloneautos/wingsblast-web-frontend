import { useState } from "react";
import { useParams } from "react-router-dom";
import { useOrderDetails } from "../../api/api";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import { LuDownload, LuPrinter } from "react-icons/lu";

const InvoiceOrder = () => {
  const { detailsID } = useParams();
  const { orderDetails } = useOrderDetails(detailsID);
  console.log(orderDetails);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);
  const {
    order_id,
    first_name,
    last_name,
    phone,
    email,
    delivery_type,
    delevery_address,
    sub_total = 0,
    tax = 0,
    total_price = 0,
    isLater,
    later_date,
    later_slot,
    status,
    created_at,
    foods,
    coupon_discount,
  } = orderDetails || {};

  const dateObject = new Date(later_date);
  const formattedDate = dateObject.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const downloadPDF = () => {
    setDownloadLoading(true);
    const element = document.getElementById("content");
    toPng(element).then((imgData) => {
      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(
        imgData,
        "JPEG",
        0,
        0,
        pdfWidth,
        pdfHeight,
        undefined,
        "FAST"
      );
      pdf.save("invoice.pdf");
      setDownloadLoading(false);
    });
  };

  const printInvoice = () => {
    setPrintLoading(true);
    const element = document.getElementById("content");
    toPng(element)
      .then((imgData) => {
        const pdf = new jsPDF();
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.autoPrint();
        const pdfBlob = pdf.output("bloburl");
        const iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.width = "0px";
        iframe.style.height = "0px";
        iframe.style.border = "none";
        iframe.src = pdfBlob;
        document.body.appendChild(iframe);
        iframe.onload = () => {
          iframe.contentWindow.print();
        };
        setPrintLoading(false);
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        setPrintLoading(false);
      });
  };

  return (
    <div className="bg-gray-100 min-h-screen p-0 sm:p-6 lg:p-8">
      <div className="w-full lg:w-8/12 mx-auto">
        {/* Status Steps */}
        <ul className="relative flex flex-row gap-x-2 py-4 px-3 bg-gray-50 rounded-lg shadow-xl border border-gray-200 overflow-x-auto">
          {["Pending", "Processing", "Completed", "Cancelled"].map(
            (stepLabel, index, array) => {
              const stepIndex =
                array.findIndex(
                  (stepLabel) =>
                    stepLabel.toLowerCase() === status?.toLowerCase()
                ) ?? 0;
              const stepStatus =
                index < stepIndex
                  ? "Completed"
                  : index === stepIndex
                  ? "active"
                  : "inactive";

              return (
                <li
                  key={index}
                  className={`flex items-center gap-x-4 flex-1 group ${
                    stepStatus === "Completed"
                      ? "text-green-600"
                      : stepStatus === "active"
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                >
                  <div className="flex items-center">
                    <span
                      className={`w-8 h-8 flex justify-center items-center text-sm font-semibold rounded-full ${
                        stepStatus === "Completed"
                          ? "bg-green-600 text-white"
                          : stepStatus === "active"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="ms-3 text-sm font-medium">
                      {stepLabel}
                    </span>
                  </div>
                  {index < array.length - 1 && (
                    <div
                      className={`flex-1 h-1 transition-all ${
                        stepStatus === "Completed" || stepStatus === "active"
                          ? "bg-green-600"
                          : "bg-gray-300"
                      }`}
                    ></div>
                  )}
                </li>
              );
            }
          )}
        </ul>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div>
          <div
            id="content"
            className="bg-white shadow-2xl rounded-lg w-full overflow-hidden"
          >
            {/* Invoice Header */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center my-5 text-yellow-400">
              Invoice
            </h1>

            {/* Customer Information */}
            <div className="flex flex-col md:flex-row justify-between bg-yellow-50 p-4 sm:p-6 border-b border-yellow-200">
              <div>
                <p>Order ID: {order_id || orderDetails.id}</p>
                <h2 className="font-semibold text-lg text-gray-800">
                  Invoice To:
                </h2>
                <p className="font-bold text-gray-800">
                  {first_name} {last_name}
                </p>
                <p className="text-gray-700">Phone: {phone}</p>
                <p className="text-gray-700">Email: {email}</p>
                <p className="text-gray-700">
                  Delivery Type:{" "}
                  {delivery_type === "CarryOut" ? "CARRYOUT" : "DELIVERY"}
                </p>
                {delivery_type === "Delivery" && (
                  <p className="text-gray-700">Address: {delevery_address}</p>
                )}
              </div>
              <div className="text-right mt-4 md:mt-0">
                <p className="text-xl font-semibold text-gray-800">Invoice</p>
                <p className="text-sm text-gray-600">
                  Date:{" "}
                  {created_at
                    ? new Date(created_at).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
            {/* Scheduled Delivery */}
            {isLater ? (
              <div className="p-6 bg-gray-100 border-b border-gray-200">
                <h2 className="font-semibold text-lg text-gray-800">
                  Scheduled Delivery
                </h2>
                <p className="text-gray-700">
                  Date:
                  {formattedDate}
                </p>
                <p className="text-gray-700">Time Slot:{later_slot}</p>
              </div>
            ) : (
              ""
            )}

            {/* Order Items */}
            <div className="p-4 sm:p-6">
              <h2 className="font-semibold text-2xl text-gray-800 mb-4">
                Order Items
              </h2>
              <div className="rounded-lg border shadow-md">
                <div className="grid grid-cols-3 gap-3 justify-around font-semibold bg-yellow-100 text-gray-800 py-3 px-4 border-b border-yellow-200">
                  <span>Item</span>
                  <span className="text-center">Qty</span>
                  <span className="text-center">Total</span>
                </div>
                {foods?.map((food, index) => (
                  <div
                    key={food.id}
                    className="grid grid-cols-3 justify-around py-3 px-4 border-b border-gray-200"
                  >
                    <span className="font-medium text-gray-800">
                      {index + 1}. {food.name}
                    </span>
                    <span className="text-gray-700 text-center">
                      {food?.quantity || 0}
                    </span>
                    <span className="text-gray-700 text-center">
                      ${sub_total.toFixed(2)}
                    </span>

                    {/* Addons (collapsible) */}
                    <div className="col-span-5 ml-4 mt-2 text-gray-800 text-sm">
                      {/* Flavor Addon */}
                      {food.addons?.flavor && (
                        <div>
                          <h1 className="font-semibold text-black">
                            {food.addons.flavor.length > 0 && "Flavor:"}
                          </h1>
                          {food.addons.flavor.map((addon, idx) => (
                            <div key={idx} className="ml-4">
                              {addon.name ? (
                                <p>
                                  {addon.name}{" "}
                                  {addon.quantity ? ` X ${addon.quantity}` : ""}
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {food.addons?.toppings && (
                        <div>
                          <h1 className="font-semibold text-black">
                            {food.addons.toppings.length > 0 && "Topping:"}
                          </h1>
                          {food.addons.toppings.map((addon, idx) => (
                            <div key={idx} className="ml-4">
                              {addon.name ? (
                                <p>
                                  {addon.name}-${addon.price}{" "}
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {food.addons?.sandCust && (
                        <div>
                          <h1 className="font-semibold text-black">
                            {food.addons.sandCust.length > 0 && "SandWich:"}
                          </h1>
                          {food.addons.sandCust.map((addon, idx) => (
                            <div key={idx} className="ml-4">
                              {addon.name ? (
                                <p>
                                  {addon.name}{" "}
                                  {addon.quantity ? ` X ${addon.quantity}` : ""}
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Dip Addon */}
                      {food.addons?.dip ? (
                        <div>
                          <p className="font-semibold capitalize text-gray-700"></p>
                          {food.addons.dip.map((addon, idx) => (
                            <div key={idx} className="ml-4">
                              <p>
                                {addon.name ? (
                                  <>
                                    Dip: {addon.name} -{" "}
                                    {addon.price
                                      ? `$${addon.price.toFixed(2)}`
                                      : " "}
                                  </>
                                ) : (
                                  ""
                                )}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        ""
                      )}

                      {/* Side Addon */}
                      {food.addons?.side ? (
                        <div>
                          <p className="font-semibold capitalize text-gray-700"></p>
                          {food.addons.side.map((addon, idx) => (
                            <div key={idx} className="ml-4">
                              <p>
                                {addon.name ? (
                                  <>
                                    Dip: {addon.name} -{" "}
                                    {addon.price
                                      ? `$${addon.price.toFixed(2)}`
                                      : " "}
                                  </>
                                ) : (
                                  ""
                                )}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        ""
                      )}

                      {/* Drink Addon */}
                      {food.addons?.drink && (
                        <div>
                          {food.addons.drink.map((addon, idx) => (
                            <div key={idx} className="ml-4">
                              <p>
                                {addon.name ? (
                                  <span>
                                    Side: {addon.name} -{" "}
                                    {addon.price
                                      ? `$${addon.price.toFixed(2)}`
                                      : " "}
                                  </span>
                                ) : (
                                  ""
                                )}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Beverage (Bakery) Addon */}
                      {food.addons?.bakery && (
                        <div>
                          {food.addons.bakery.map((addon, idx) => (
                            <div key={idx} className="ml-4">
                              <p>
                                {addon.name ? (
                                  <span>
                                    Side: {addon.name} -{" "}
                                    {addon.price
                                      ? `$${addon.price.toFixed(2)}`
                                      : " "}
                                  </span>
                                ) : (
                                  ""
                                )}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="my-4 sm:my-6 text-right px-4 sm:px-6">
              <p className="text-lg font-medium text-gray-800">
                Subtotal: ${sub_total.toFixed(2)}
              </p>
              <p className="text-gray-700">Tax: ${tax.toFixed(2)}</p>
              {delivery_type === "Delivery" && (
                <p className="text-gray-700">Delivery Fee: $4.99</p>
              )}
              {coupon_discount && <p>Coupon Discount: -$ {coupon_discount}</p>}
              <p className="text-xl font-bold text-gray-800">
                Total: ${total_price.toFixed(2)}
              </p>
            </div>

            <div className="mt-8 text-center text-sm text-gray-600 pb-6">
              <p>Thank you for your business!</p>
              <p>Contact us: +1 (718) 737-3202 | suport.wingblast@gmail.com</p>
              <p>Website: www.wingsblast.com</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {downloadLoading ? (
              <button className="btn btn-primary">
                <span className="loading loading-spinner"></span> Loading
              </button>
            ) : (
              <button className="btn btn-primary" onClick={downloadPDF}>
                <LuDownload /> Download PDF
              </button>
            )}
            {printLoading ? (
              <button className="btn btn-primary">
                <span className="loading loading-spinner"></span> Loading
              </button>
            ) : (
              <button className="btn btn-primary" onClick={printInvoice}>
                <LuPrinter /> Print Invoice
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceOrder;
