import { BsTwitter, BsYoutube } from "react-icons/bs";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer footer-center bg-black text-white p-1 lg:p-6 md:p-10">
      <div className="container mx-auto py-4">
        {/* Top Links Section */}

        <nav className="grid md:flex lg:flex gap-3 text-xl">
          <div className=" flex gap-3">
            <Link to="/about">
              <a className="link link-hover text-white hover:text-white hover:underline">ABOUT</a>
            </Link>
            <Link to="/faq">
              <a className="link link-hover text-white hover:text-white hover:underline">FAQ</a>
            </Link>
            <Link to="/contactUs">
              <a className="link link-hover text-white hover:text-white hover:underline">CONTACT US</a>
            </Link>
          </div>
        </nav>
        {/* Secondary Links Section */}
        {/* <nav className="grid grid-cols-2 gap-1 mt-4 text-center text-xs sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-11 justify-center"> */}
        <nav className="flex flex-wrap justify-center gap-4">
          {/* <a className="link link-hover">Cookies Settings</a> */}
          <a className="link link-hover text-white hover:text-white">Promotions & Offers</a>
          <Link to="/termsofuser">
            <a className="link link-hover text-white hover:text-white">Terms Of User</a>
          </Link>
          <Link to="/privacy">
            <a className="link link-hover text-white hover:text-white">Privacy</a>
          </Link>
          {/* <a className="link link-hover">Own a Wingblast</a> */}
          {/* <a className="link link-hover">FAQ</a> */}
          <Link to="/signin">
            <a className="link link-hover text-white hover:text-white">Login/SignUp</a>
          </Link>
          <Link to="/privacy">
            <a className="link link-hover text-white hover:text-white">Do Not Sell My Info</a>
          </Link>
        </nav>

        {/* Divider */}
        <span className="h-[1px] my-4 bg-white w-full"></span>

        {/* Social Icons Section */}
        <nav className="flex justify-center space-x-4 md:space-x-6 mb-6">
          <a
            href="https://www.facebook.com/wingblastny"
            target="_blank"
            className="text-xl md:text-2xl hover:text-gray-400"
          >
            <FaFacebook />
          </a>
          <a className="text-xl md:text-2xl hover:text-gray-400">
            <BsYoutube />
          </a>
          <a className="text-xl md:text-2xl hover:text-gray-400">
            <FaInstagram />
          </a>
          <a className="text-xl md:text-2xl hover:text-gray-400">
            <BsTwitter />
          </a>
        </nav>

        {/* Divider */}
        <span className="h-[1px] bg-white w-full"></span>

        {/* Copyright Section */}
        <aside className="text-center text-xs md:text-sm mt-4">
          <p>
            Copyright © - Wingsblast Restaurants, Inc.{" "}
            {new Date().getFullYear()}
          </p>
        </aside>
      </div>
    </footer>
  );
};

export default Footer;
