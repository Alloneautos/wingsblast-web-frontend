import { useEffect, useState } from "react";
import Apple from "../assets/images/iconbywb.png";
import { MdClose } from "react-icons/md";
import "./style.css";
import { RiDownloadCloud2Line } from "react-icons/ri";

const PopupModel = () => {
  const [isSmallDevice, setIsSmallDevice] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const modal = document.getElementById("my_modal_3");

    // 📌 Show modal on small devices
    if (modal && isSmallDevice) {
      modal.showModal();
    }

    // 📌 Function to check screen size and update state
    const handleResize = () => {
      setIsSmallDevice(window.innerWidth < 1024);
    };

    // 📌 Add event listener when component mounts
    window.addEventListener("resize", handleResize);

    // 📌 Cleanup event listener when component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isSmallDevice]);

  const closeModal = () => {
    const modal = document.getElementById("my_modal_3");
    if (modal) {
      modal.close();
    }
  };

  // ✅ বড় স্ক্রিনে মডেল লোডই হবে না
  if (!isSmallDevice) return null;

  return (
    <dialog id="my_modal_3" className="modal modal-top">
      <div className="modal-box relative">
        <div className="flex items-center bg-white p-1">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <MdClose />
          </button>

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
    </dialog>
  );
};

export default PopupModel;
