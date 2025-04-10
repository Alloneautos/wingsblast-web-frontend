import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AppNotification from "../components/AppNotification";

const Main = () => {
  return (
    <div>
      <div className="block md:hidden lg:hidden">
        <AppNotification />
      </div>
      <Navbar></Navbar>
      <div>
        <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Main;
