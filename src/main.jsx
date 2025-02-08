import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import Router from "./router/Router";
import AuthProvider from "./authprovider/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

const queryClient = new QueryClient();

// Live paypal clint key 

const initialOptions = {
  "client-id":
    "AcQGl5C89ZPtDoBAzEC1a4UkGEWOfwzVIW_5NizK4ORPpcehYpBQ0e2UyATG6U5U2tAqFZNZObSS2a0l",
  currency: "USD",
};
 
// demo Paypal clinet id 

// const initialOptions = {
//   "client-id":
//     "AZGzhx4aUNGe5vtuNfpky0TWTYPwR6KJmGz5XPkoSDCWkYQCKkxHj0pIWg4BmqVAwz8ur30Zfzm8TmUN",
//   currency: "USD",
// };

// Replace with your Stripe publishable key
const stripePromise = loadStripe("your-publishable-key-here");

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <StrictMode>
      <PayPalScriptProvider options={initialOptions}>
        <QueryClientProvider client={queryClient}>
          <Elements stripe={stripePromise}>
            <RouterProvider router={Router} />
          </Elements>
        </QueryClientProvider>
      </PayPalScriptProvider>
    </StrictMode>
  </AuthProvider>
);
