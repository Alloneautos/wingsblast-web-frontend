import { BsTiktok, BsTwitterX, BsYoutube } from "react-icons/bs";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import Apple from "../assets/images/app-store.png";
import Google from "../assets/images/google-play.png";

const Footer = () => {
  return (
    <>
      <div className="h-[7px] w-full bg-ButtonColor "></div>
      <footer className="bg-black text-white py-4">
        <div className="container mx-auto px-4">
          <div className="text-center mb-2">
            <h2 className="text-3xl font-TitleFont">
              ORDER WINGS FOR DELIVERY OR CARRYOUT
            </h2>
            <p className="text-sm mt-2">
              We're making it easier than ever to bring our iconic flavors
              straight to you. Build a custom order as bold as your crew on the
              Wingblast app.
            </p>
            <div className="flex lg:flex justify-center mx-auto  gap-4 mt-3">
              <a
                target="_blank"
                href="https://apps.apple.com/us/app/wingsblast/id6738927180"
              >
                <button className="w-32 rounded">
                  <img src={Apple} alt="App Store" className="inline" />
                </button>
              </a>
              <button className="w-32">
                <img src={Google} alt="Google Play" className="" />
              </button>
            </div>
          </div>
          <nav className="grid md:flex lg:flex justify-center font-TitleFont gap-3 text-2xl">
            <div className=" flex gap-3">
              <Link to="/about">
                <a className="link link-hover text-white hover:text-white hover:underline">
                  ABOUT
                </a>
              </Link>
              <Link to="/faq">
                <a className="link link-hover text-white hover:text-white hover:underline">
                  FAQ
                </a>
              </Link>
              <Link to="/contactUs">
                <a className="link link-hover text-white hover:text-white hover:underline">
                  CONTACT US
                </a>
              </Link>
            </div>
          </nav>
          <nav className="flex flex-wrap justify-center gap-4 font-TitleFont text-xl mt-4">
            {/* <a className="link link-hover">Cookies Settings</a> */}
            <Link
              to="/promotions"
              className="link link-hover text-white hover:text-white"
            >
              Promotions & Offers
            </Link>
            <Link to="/termsofuser">
              <a className="link link-hover text-white hover:text-white">
                Terms Of User
              </a>
            </Link>
            <Link to="/privacy">
              <a className="link link-hover text-white hover:text-white">
                Privacy
              </a>
            </Link>

            <Link to="/signin">
              <a className="link link-hover text-white hover:text-white">
                Login/SignUp
              </a>
            </Link>
            <Link to="/privacy">
              <a className="link link-hover text-white hover:text-white">
                Do Not Sell My Info
              </a>
            </Link>
          </nav>
          <div
            className="divider text-white"
            style={{
              borderTop: "1px solid white", // Explicitly set the border color
              opacity: 0.5, // Optional: Adjust opacity for better visibility
            }}
          ></div>
          <nav className="flex justify-center space-x-4 md:space-x-6 mb-6">
            <a className="text-xl md:text-2xl hover:text-gray-400">
              <BsTwitterX />
            </a>
            <a className="text-xl md:text-2xl hover:text-gray-400">
              <BsYoutube />
            </a>
            <a
              href="https://www.facebook.com/wingblastny"
              target="_blank"
              className="text-xl md:text-2xl hover:text-gray-400"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/wingsblast255"
              className="text-xl md:text-2xl hover:text-gray-400"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.tiktok.com/@wingsblast"
              className="text-xl md:text-2xl hover:text-gray-400"
            >
              <BsTiktok />
            </a>
          </nav>
          <div
            className="divider text-white"
            style={{
              borderTop: "1px solid white", // Explicitly set the border color
              opacity: 0.5, // Optional: Adjust opacity for better visibility
            }}
          ></div>
          <p className="text-center text-xs">
            © Wings Blast Food Mart Inc. 2025
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
