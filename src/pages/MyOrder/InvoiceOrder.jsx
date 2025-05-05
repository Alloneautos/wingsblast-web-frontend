import { useState } from "react";
import { useParams } from "react-router-dom";
import { useOrderDetails } from "../../api/api";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import { LuDownload, LuPrinter } from "react-icons/lu";

const InvoiceOrder = () => {
  const { detailsID } = useParams();
  const { orderDetails } = useOrderDetails(detailsID);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);
  console.log(orderDetails, "orderDetails");
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
    delivery_fee,
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
    <div className="bg-gray-200 p-0 sm:p-6 lg:p-8">
      <div className="w-full lg:w-8/12 mx-auto">
        {/* Status Steps */}
        <ul className="relative flex flex-row gap-x-2 py-4 px-3 bg-gray-50 rounded-lg border border-gray-200 overflow-x-auto">
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

      <div className="py-5 flex items-center justify-center">
        <div className="w-11/12 lg:w-8/12">
          <div
            id="content"
            className="bg-white shadow-2xl rounded-lg w-full overflow-hidden"
          >
            {/* Invoice Header */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-TitleFont text-center my-5 text-black">
              Invoice
            </h1>

            {/* Customer Information */}
            <div className="flex flex-col md:flex-row justify-between bg-teal-50 p-4 sm:p-6 border-b border-teal-600">
              <div>
                <p>
                  <span className="font-TitleFont text-lg">Order ID:</span>{" "}
                  {order_id || orderDetails.id}
                </p>
                <p className="text-gray-800 text-md">
                  <span className="font-TitleFont text-lg">Name:</span>{" "}
                  {first_name} {last_name}
                </p>
                <p className="text-gray-800 text-md">
                  <span className="font-TitleFont text-lg">Phone:</span> {phone}
                </p>
                <p className="text-gray-800 text-md">
                  <span className="font-TitleFont text-lg">Email:</span> {email}
                </p>
                <p className="text-gray-800 text-md">
                  <span className="font-TitleFont text-lg">
                    Delivery Type:{" "}
                  </span>
                  {delivery_type === "CarryOut" ? "Carryout" : "Delivery"}
                </p>
                {delivery_type === "Delivery" && (
                  <p className="text-gray-800 text-lg">
                    <span className="font-TitleFont">Address:</span>{" "}
                    {delevery_address}
                  </p>
                )}
              </div>
              <div className="text-right mt-4 md:mt-0">
                <p className="text-2xl font-TitleFont text-gray-800">Invoice</p>
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
                <h2 className="font-TitleFont text-2xl text-black">
                  Scheduled Delivery
                </h2>
                <p className="text-gray-800">
                  <span className="font-TitleFont text-lg">Date:</span>{" "}
                  {formattedDate}
                </p>
                <p className="text-gray-800">
                  <span className="font-TitleFont text-lg">Time Slot:</span>{" "}
                  {later_slot}
                </p>
              </div>
            ) : (
              ""
            )}

            {/* Order Items */}
            <div className="p-4 sm:p-6">
              <h2 className="font-TitleFont text-3xl text-gray-800 mb-4">
                Order Items
              </h2>
              <div className="rounded border">
                <div className="grid grid-cols-3 gap-3 justify-around font-TitleFont text-xl bg-yellow-100 text-gray-900 py-3 px-4 border-b border-yellow-200">
                  <span>Item</span>
                  <span className="text-center">Qty</span>
                  <span className="text-center">Total</span>
                </div>
                {foods?.map((food, index) => (
                  <div
                    key={food.id}
                    className="grid grid-cols-3 justify-around py-3 px-4 border-b border-gray-200"
                  >
                    <div>
                      <span className="text-xl font-TitleFont text-black">
                        {index + 1}. {food.name}
                      </span>
                      {food.buy_one_get_one_id > 0 && (
                        <p className="text-sm text-green-700">
                          <span className=" text-black">
                            {food.buy_one_get_one_name}
                          </span>{" "}
                          (Free)
                        </p>
                      )}
                      <p className="text-sm">
                        <span className="font-TitleFont text-black">Note:</span>{" "}
                        {food.note}
                      </p>
                    </div>

                    <span className="text-black font-TitleFont text-xl text-center">
                      {food?.quantity || 0}
                    </span>
                    <span className="text-black text-xl text-center font-TitleFont">
                      ${food?.quantity * food.price.toFixed(2)}
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
                      {/* toppings addon  */}
                      {food.addons?.toppings && (
                        <div>
                          <h1 className="font-semibold text-black">
                            {food.addons.toppings.length > 0 && "Topping:"}
                          </h1>
                          {food.addons.toppings.map((addon, idx) => (
                            <div key={idx} className="ml-4">
                              {addon.name ? (
                                <p>
                                  {addon.name} X{addon.quantity}{" "}
                                  {addon.isPaid === 1 && (
                                    <span>(${addon.price})</span>
                                  )}
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {/* sandCust Addon  */}
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
                                  {addon.isPaid === 1 && (
                                    <span>(${addon.price})</span>
                                  )}
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Dip Addon */}
                      {food.addons?.dip && (
                        <div>
                          <h1 className="font-semibold text-black">
                            {food.addons.dip.length > 0 && "Dip:"}
                          </h1>
                          {food.addons.dip.map((addon, idx) => (
                            <div key={idx} className="ml-4">
                              {addon.name ? (
                                <p>
                                  {addon.name}{" "}
                                  {addon.quantity ? ` X ${addon.quantity}` : ""}
                                  {addon.isPaid === 1 && (
                                    <span>(${addon.price})</span>
                                  )}
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Side Addon */}
                      {food.addons?.side && (
                        <div>
                          <h1 className="font-semibold text-black">
                            {food.addons.side.length > 0 && "Side:"}
                          </h1>
                          {food.addons.side.map((addon, idx) => (
                            <div key={idx} className="ml-4">
                              {addon.name ? (
                                <p>
                                  {addon.name}{" "}
                                  {addon.quantity ? ` X ${addon.quantity}` : ""}
                                  {addon.isPaid === 1 && (
                                    <span>(${addon.price})</span>
                                  )}
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Drink Addon */}
                      {food.addons?.drink && (
                        <div>
                          <h1 className="font-semibold text-black">
                            {food.addons.drink.length > 0 && "Drink:"}
                          </h1>
                          {food.addons.drink.map((addon, idx) => (
                            <div key={idx} className="ml-4">
                              {addon.name ? (
                                <p>
                                  {addon.name} ({addon.child_item_name})
                                  {addon.quantity ? ` X ${addon.quantity}` : ""}
                                  {addon.isPaid === 1 && (
                                    <span>(${addon.price})</span>
                                  )}
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Beverage (Bakery) Addon */}
                      {food.addons?.beverage && (
                        <div>
                          <h1 className="font-semibold text-black">
                            {food.addons.beverage.length > 0 && "Bakery:"}
                          </h1>
                          {food.addons.beverage.map((addon, idx) => (
                            <div key={idx} className="ml-4">
                              {addon.name ? (
                                <p>
                                  {addon.name}{" "}
                                  {addon.quantity ? ` X${addon.quantity}` : ""}
                                  {addon.isPaid === 1 && (
                                    <span>(${addon.price})</span>
                                  )}
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Rice Platter Addon */}
                      {food.addons?.ricePlatter && (
                        <div>
                          <h1 className="font-semibold text-black">
                            {food.addons.ricePlatter.length > 0 &&
                              "Rice Platter:"}
                          </h1>
                          {food.addons.ricePlatter.map((addon, idx) => (
                            <div key={idx} className="ml-4">
                              {addon.name ? (
                                <p>
                                  {addon.name}{" "}
                                  {addon.quantity ? ` X ${addon.quantity}` : ""}
                                  {addon.isPaid === 1 && (
                                    <span>(${addon.price})</span>
                                  )}
                                </p>
                              ) : (
                                ""
                              )}
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
            <div className="my-4 sm:my-6 text-right px-4 sm:px-6 text-lg font-TitleFont">
              <p className="text-gray-900">Subtotal: ${sub_total.toFixed(2)}</p>
              <p className="text-gray-900">Tax: ${tax.toFixed(2)}</p>
              {delivery_type === "Delivery" && (
                <p className="text-gray-900">Delivery Fee: ${delivery_fee}</p>
              )}
              {coupon_discount > 0 && (
                <p>Coupon Discount: (-${coupon_discount.toFixed(2)})</p>
              )}
              <p className="text-xl text-gray-800">
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
              <button className="btn bg-blue-400">
                <span className="loading loading-spinner"></span> Loading
              </button>
            ) : (
              <button
                className="btn bg-blue-700 hover:bg-blue-900 text-white"
                onClick={downloadPDF}
              >
                <LuDownload /> Download PDF
              </button>
            )}
            {printLoading ? (
              <button className="btn btn-primary">
                <span className="loading loading-spinner"></span> Loading
              </button>
            ) : (
              <button
                className="btn bg-ButtonColor hover:bg-ButtonHover text-white"
                onClick={printInvoice}
              >
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
