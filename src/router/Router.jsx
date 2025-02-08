import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/home/Home";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import FoodMenu from "../pages/FoodMenu";
import FoodDetails from "../pages/foodDetails/FoodDetails";
import Flavors from "../pages/Flavors";
import MyCart from "../pages/myCart/MyCart";
import CheckOut from "../pages/checkOut/CheckOut";
import About from "../pages/About";
import UserProfile from "../pages/UserProfile";
import TermsOfUse from "../pages/TermsOfUser";
import Privacy from "../pages/Privacy";
import MobileLogin from "../components/MobileLogin";
import FoodDetailsError from "../pages/FoodDetailsError";
import MyOrder from "../pages/MyOrder/MyOrder";
import InvoiceOrder from "../pages/MyOrder/InvoiceOrder";
import ContactUs from "../pages/ContactUs";
import Text from "../Text";
import WingsBlastFAQ from "../pages/WingsBlastFAQ";
import EmailVerify from "../pages/ForgetPassword/EmailVerify";
import EmailOTP from "../pages/ForgetPassword/EmailOTP";
import NewPassword from "../pages/ForgetPassword/NewPassword";
import ModelLocation from "../pages/myCart/ModelLocation";
import PrivetProductRoute from "./PrivetProductRoute";
import PrivetRoute from "./PrivetRoute";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/signin",
        element: <Signin></Signin>,
      },
      {
        path: "/signup",
        element: <Signup></Signup>,
      },
      {
        path: "/foodmenu",
        element: <FoodMenu></FoodMenu>,
      },
      {
        path: "/food-details/:foodDetailsID",
        element: (
          <PrivetProductRoute>
            <FoodDetails />
          </PrivetProductRoute>
        ),
      },
      {
        path: "/flavors",
        element: <Flavors></Flavors>,
      },
      {
        path: "/myCart",
        element: <MyCart></MyCart>,
      },
      {
        path: "/checkout",
        element: <CheckOut />,
      },
      {
        path: "/about",
        element: <About></About>,
      },
      {
        path: "/userprofile",
        element: (
          <PrivetRoute>
            <UserProfile />
          </PrivetRoute>
        ),
      },
      {
        path: "/myorder",
        element: (
          <PrivetRoute>
            <MyOrder />
          </PrivetRoute>
        ),
      },
      {
        path: "/termsofuser",
        element: <TermsOfUse></TermsOfUse>,
      },
      {
        path: "/privacy",
        element: <Privacy></Privacy>,
      },
      {
        path: "/contactUs",
        element: <ContactUs></ContactUs>,
      },
      {
        path: "/faq",
        element: <WingsBlastFAQ />,
      },
      {
        path: "/mobile",
        element: <MobileLogin></MobileLogin>,
      },

      {
        path: "/orderdetails/:detailsID",
        element: <InvoiceOrder></InvoiceOrder>,
      },
      {
        path: "/forgetPassword",
        element: <EmailVerify />,
      },
      {
        path: "/emailOTP",
        element: <EmailOTP />,
      },
      {
        path: "/newpass",
        element: <NewPassword />,
      },
      {
        path: "/text",
        element: <Text />,
      },
      {
        path: "/*",
        element: <FoodDetailsError />,
      },
      {
        path: "/shifat",
        element: <ModelLocation />,
      },
    ],
  },
]);
export default Router;
