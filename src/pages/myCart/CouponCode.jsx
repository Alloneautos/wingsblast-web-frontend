import Swal from "sweetalert2";

const CouponCode = () => {
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

  return (
    <div>
      {/* Coupon Code */}
      <form onSubmit={handleCoupons} className="relative">
        <input
          type="text"
          name="code"
          className="w-full border border-gray-300 text-sm rounded px-4 py-3 text-gray-700 focus:border-green-600 placeholder-gray-500"
          placeholder="Coupon Code"
        />
        <button
          type="submit"
          className="absolute right-1 top-1 bg-ButtonColor text-white rounded px-4 py-[10px] text-xs font-bold uppercase transition hover:bg-ButtonHover"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CouponCode;
