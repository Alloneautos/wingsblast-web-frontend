import React, { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { API, useGuestUser, useUserProfile } from "../../api/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function PayPal({ guestUsers, myOrderData, isOrderButtonDisabled }) {
  const { guestUser } = useGuestUser();
  const [success, setSuccess] = useState(false);
  const guest_user_id = guestUsers || 1;
  const { user } = useUserProfile();
  const navigate = useNavigate();

  const handleApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      const orderData = {
        ...myOrderData,
        user_id: user?.id,
        guest_user_id: guest_user_id || 1,
        first_name: user?.first_name,
        last_name: user?.last_name,
        email: user?.email,
        phone: user?.phone,
      };

      setSuccess(true);
      const response = await API.post("/orders/create", orderData);
      if (response.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your Order is Successful",
          showConfirmButton: false,
          timer: 1500,
        });
      } else if (response.status === 201) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Check Your Email",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error in handleApprove:", error);
      Swal.fire({
        title: "Order Failed",
        text: "Failed. Please try again.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  if (success) {
    const fetchData = async () => {
      try {
        const response = await API.delete(`/card/all/${guestUser}`);
        navigate("/myorder");
      } catch (error) {
        console.error("Error:", error);
      }
    };

    // Call the async function
    fetchData();
  }

  return (
    <div className="mx-2">
      <PayPalButtons
        disabled={isOrderButtonDisabled}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: parseFloat(myOrderData?.total_price || 0).toFixed(2),
                },
              },
            ],
          });
        }}
        onApprove={handleApprove}
        onError={(err) => console.error("Payment Error:", err)}
      />
    </div>
  );
}

export default PayPal;
