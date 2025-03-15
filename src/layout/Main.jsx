import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PopupModel from "./PopupModel";

const Main = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className="block lg:hidden">
            <PopupModel />
            </div>
            <div className="mt-[88px]">
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default Main;