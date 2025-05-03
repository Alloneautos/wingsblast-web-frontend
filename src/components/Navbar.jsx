import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";
import { MdOutlineBorderColor, MdRestaurantMenu } from "react-icons/md";
import { Link } from "react-router-dom";
import Language from "./Language";
import Search from "./Search";
import ProfileIcon from "../assets/images/profile.png";
import {
  signOutUser,
  useGuestUser,
  useMyCart,
  useUserProfile,
} from "../api/api";
import { IoFastFood, IoNotificationsOutline } from "react-icons/io5";
import { LuUserCog } from "react-icons/lu";
import { CgLogOut } from "react-icons/cg";
import { RiMenu2Fill } from "react-icons/ri";
import { VscChromeClose } from "react-icons/vsc";
import Logo from "../assets/images/website Logo.png";
import LocationModal from "./LocationModal";
import Notification from "./Notification";
// import SideDrawer from "./SideDrawer";
import { BiSearch } from "react-icons/bi";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [savedAddress, setSavedAddress] = useState("");
  const { guestUser } = useGuestUser();
  const { user } = useUserProfile();
  const [unreadCount, setUnreadCount] = useState(0);
  const { mycard, refetch } = useMyCart(guestUser);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const delivery = localStorage.getItem("deliveryAddress");
    refetch();
    setSavedAddress(delivery || "");
  }, []);

  const maxAddressLength = 20;
  const displayAddress =
    savedAddress.length > maxAddressLength
      ? `${savedAddress.slice(0, maxAddressLength)} [...]`
      : savedAddress;

  const handleSignOut = () => {
    // console.log("Hello")
    signOutUser();
  };
  const orderStatus = localStorage.getItem("orderStatus");

  const sendUnreadCount = (data) => {
    setUnreadCount(data);
  };
  const shortAddress = savedAddress.split(",")[0];

  return (
    <nav className="bg-white w-full sticky top-0 border-b !z-50">
      <div className="container flex justify-between items-center py-2 lg:py-[5px] px-4 lg:px-0 w-full lg:w-10/12 mx-auto">
        {/* Left side: Logo */}
        <div className="flex justify-between items-center space-x-4">
          {/* Mobile Menu Button */}
          {/* <SideDrawer /> */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-black text-3xl focus:outline-none"
          >
            {isOpen ? <VscChromeClose /> : <RiMenu2Fill />}
          </button>
          <div className="flex items-center justify-center mx-auto ml-[80px] lg:ml-0">
            {/* Logo for mobile view */}
            <Link to="/">
              <img
                className="w-[175px] lg:w-[175px] h-[50px] lg:h-[60px] ml-[50px] md:ml-0 lg:ml-0"
                src={Logo}
                alt="WingsBlast Logo"
              />
            </Link>
          </div>
          <div className="hidden md:flex space-x-5 text-lg lg:text-xl">
            <Link to="/foodmenu">
              <span className="text-black text-2xl font-TitleFont hover:text-green-500">
                MENU
              </span>
            </Link>
            <Link to="/flavors">
              <span className="text-black text-2xl font-TitleFont hover:text-green-500">
                FLAVORS
              </span>
            </Link>
          </div>
        </div>

        {/* Right side: Address, icons, profile dropdown */}
        <div className="flex items-center space-x-1 md:space-x-3 lg:space-x-4">
          {savedAddress && (
            <div className="hidden lg:grid items-center text-sm text-gray-700">
              <span>
                {orderStatus === "CarryOut" && (
                  <span className="text-2xl font-TitleFont text-black">
                    {orderStatus}
                    <span
                      onClick={() => setIsLocationModalOpen(true)}
                      className="text-rose-500 font-sans text-sm font-medium hover:no-underline cursor-pointer"
                    >
                      (Change)
                    </span>
                  </span>
                )}
                {orderStatus === "Delivery" && (
                  <p className="grid">
                    <span className="text-2xl font-TitleFont text-black">
                      {orderStatus} Address
                    </span>
                    <a className="ml-1 text-black hover:underline cursor-pointer">
                      {displayAddress}
                      <span
                        onClick={() => setIsLocationModalOpen(true)}
                        className="text-rose-500 hover:no-underline cursor-pointer"
                      >
                        (Change)
                      </span>
                    </a>
                  </p>
                )}
              </span>
            </div>
          )}

          <button
            className="text-black hover:text-green-500 hidden md:block lg:block"
            onClick={() => document.getElementById("search").showModal()}
          >
            <FaSearch className="text-xl md:text-2xl lg:text-3xl" />
          </button>

          {user.id && (
            <div className="hidden md:block lg:block relative">
              <label
                htmlFor="my-drawer-4"
                className="cursor-pointer flex items-center justify-center"
              >
                <IoNotificationsOutline className="text-xl md:text-3xl lg:text-4xl text-gray-700 hover:text-green-500 transition duration-300" />
                <span className="absolute top-0 right-0 bg-red-700 text-white rounded-full px-1 py-0.5 text-xs font-medium shadow-md">
                  {unreadCount}
                </span>
              </label>
              <div className="absolute top-10 right-0 bg-white shadow-lg rounded-lg p-0 w-64 z-50">
                <Notification sendUnreadCount={sendUnreadCount} />
              </div>
            </div>
          )}

          <Link
            to="/myCart"
            className="relative text-black hover:text-green-500"
          >
            <FaBagShopping className="text-3xl md:text-2xl lg:text-3xl" />
            <span className="absolute top-0 right-0 bg-red-700 text-white rounded-full px-1 text-xs">
              {mycard.length}
            </span>
          </Link>

          <div className="hidden md:block lg:block">
            {/* Profile Dropdown */}
            {user.id ? (
              <div className="dropdown dropdown-en">
                <div className="dropdown dropdown-end">
                  <button
                    tabIndex={0}
                    className="focus:outline-none"
                    onClick={toggleDropdown}
                  >
                    <img
                      src={ProfileIcon}
                      className="w-7 mt-1 lg:w-10 md:w-12"
                      alt="Profile"
                    />
                  </button>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box !z-30 w-52 p-2 shadow"
                  >
                    <li>
                      <Link
                        to="/userprofile"
                        className="text-lg text-black font-TitleFont flex items-center"
                      >
                        <LuUserCog /> User Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/myorder"
                        className="text-lg text-black font-TitleFont flex items-center"
                      >
                        <MdOutlineBorderColor /> My Order
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleSignOut}>
                        <span className="text-lg text-black font-TitleFont flex items-center gap-2 cursor-pointer">
                          <CgLogOut /> Log Out
                        </span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <li className="list-none">
                <Link
                  to="/signin"
                  className="text-base font-semibold flex items-center"
                >
                  <button className="px-[6px] lg:px-3 py-1 lg:py-2 bg-ButtonColor hover:bg-ButtonHover rounded text-white">
                    Login
                  </button>
                </Link>
              </li>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white py-4 px-6 !z-50">
          <div>
            <span
              onClick={() => {
                document.getElementById("search").showModal();
                setIsOpen(false); // Close the menu
              }}
              className="text-black font-TitleFont text-xl mb-2 flex gap-2 items-center"
            >
              <BiSearch /> SEARCH
            </span>
            {/* MENU Link */}
            <Link
              to="/foodmenu"
              onClick={() => setIsOpen(false)} // Hide menu on click
            >
              <span className="text-black font-TitleFont text-xl mb-2 flex gap-2 items-center">
                <MdRestaurantMenu /> MENU
              </span>
            </Link>

            {/* FLAVORS Link */}
            <Link
              to="/flavors"
              onClick={() => setIsOpen(false)} // Hide menu on click
            >
              <span className="text-black font-TitleFont text-xl mb-2 flex gap-2 items-center">
                <IoFastFood /> FLAVORS
              </span>
            </Link>

            {/* profile Section */}

            {user.id ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/userprofile"
                  onClick={() => setIsOpen(false)} // Hide menu on click
                >
                  <span className="text-black font-TitleFont text-xl flex gap-2 items-center">
                    <LuUserCog /> USER PROFILE
                  </span>
                </Link>
                <Link
                  to="/myorder"
                  onClick={() => setIsOpen(false)} // Hide menu on click
                >
                  <span className="text-black font-TitleFont text-xl flex gap-2 items-center">
                    <MdOutlineBorderColor /> MY ORDER
                  </span>
                </Link>
                <button onClick={handleSignOut}>
                  <span className="text-black font-TitleFont text-xl flex gap-2 items-center cursor-pointer">
                    <CgLogOut /> LOG OUT
                  </span>
                </button>
              </div>
            ) : (
              <Link to="/signin" onClick={() => setIsOpen(false)}>
                <button className="px-[6px] lg:px-3 py-1 lg:py-2 bg-ButtonColor hover:bg-ButtonHover rounded text-white">
                  LOGIN
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
      <Language />
      <Search />
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
      <div className="block lg:hidden">
        {orderStatus ? (
          orderStatus === "Delivery" ? (
            <div className="border-t p-1">
              <h1 className="text-gray-800 text-center flex justify-center items-center">
                DELIVERY:
                <span className="ml-1 text-black">{shortAddress}</span>
              </h1>
            </div>
          ) : (
            <div className="border-t p-1">
              <h1 className="text-black text-center flex justify-center items-center">
                CARRYOUT
              </h1>
            </div>
          )
        ) : (
          <div className="border-t p-1">
            <h1 className="text-black text-center flex justify-center items-center">
              PLEASE SELECT ORDER TYPE
            </h1>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
