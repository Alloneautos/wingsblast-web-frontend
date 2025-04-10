import Apple from "../assets/images/iconbywb.png";
import { RiDownloadCloud2Line } from "react-icons/ri";

const AppNotification = () => {
  return (
    <div className="bg-gray-100">
      <div className="flex items-center p-1 px-5">
        <div className="rounded bg-gray-300 text-white p-1">
          <img src={Apple} width={50} alt="Apple App" />
        </div>

        {/* Text Section */}
        <div className="ml-4">
          <h3 className="text-lg font-bold text-gray-800">WingsBlast</h3>
          <p className="text-xs">Wings for Delivery or Carryout</p>
        </div>

        {/* Button Section */}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://apps.apple.com/us/app/wingsblast/id6738927180"
          className="ml-auto text-[#0672E9] text-xl"
        >
          <RiDownloadCloud2Line />
        </a>
      </div>
    </div>
  );
};

export default AppNotification;
