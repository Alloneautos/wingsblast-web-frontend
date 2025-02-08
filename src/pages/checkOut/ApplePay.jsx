import React, { useEffect, useRef } from "react";
import dropin from "braintree-web-drop-in";

const ApplePay = () => {
  const instanceRef = useRef(null);

  useEffect(() => {
    dropin.create(
      {
        authorization: "YOUR_CLIENT_TOKEN", // Replace with your Braintree client token
        container: "#dropin-container",
        applePay: {
          displayName: "Your Business Name",
          paymentRequest: {
            total: {
              label: "Your Business Name",
              amount: "10.00",
            },
          },
        },
      },
      (err, instance) => {
        if (err) {
          console.error(err);
          return;
        }
        instanceRef.current = instance;
      }
    );

    return () => {
      if (instanceRef.current) {
        instanceRef.current.teardown(() => {
          instanceRef.current = null;
        });
      }
    };
  }, []);

  const handlePayment = () => {
    instanceRef.current.requestPaymentMethod((err, payload) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Payment payload:", payload);
    });
  };

  return (
    <div>
      <div id="dropin-container"></div>
      <button onClick={handlePayment}>Pay</button>
    </div>
  );
};

export default ApplePay;
