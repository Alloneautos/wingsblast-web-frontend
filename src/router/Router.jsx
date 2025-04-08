import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/home/Home";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import FoodDetails from "../pages/foodDetails/FoodDetails";
import Flavors from "../pages/Flavors";
import MyCart from "../pages/myCart/MyCart";
import CheckOut from "../pages/checkOut/CheckOut";
import UserProfile from "../pages/UserProfile";
import MobileLogin from "../components/MobileLogin";
import FoodDetailsError from "../pages/FoodDetailsError";
import MyOrder from "../pages/MyOrder/MyOrder";
import InvoiceOrder from "../pages/MyOrder/InvoiceOrder";
import Text from "../Text";
import EmailVerify from "../pages/ForgetPassword/EmailVerify";
import EmailOTP from "../pages/ForgetPassword/EmailOTP";
import NewPassword from "../pages/ForgetPassword/NewPassword";
import PrivetProductRoute from "./PrivetProductRoute";
import PrivetRoute from "./PrivetRoute";
import FoodMenu from "../pages/foodmenu/FoodMenu";
import About from "../pages/settings/About";
import TermsOfUse from "../pages/settings/TermsOfUser";
import Privacy from "../pages/settings/Privacy";
import ContactUs from "../pages/settings/ContactUs";
import WingsBlastFAQ from "../pages/settings/WingsBlastFAQ";
import PromotionandOffers from "../pages/settings/PromotionandOffers";

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
        path: "/promotions",
        element: <PromotionandOffers />
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
    ],
  },
]);
export default Router;
