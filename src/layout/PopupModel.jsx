import { useEffect, useState } from "react";
import Apple from "../assets/images/iconbywb.png";
import { MdClose } from "react-icons/md";
import "./style.css";

const PopupModel = () => {
  const [isSmallDevice, setIsSmallDevice] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const modal = document.getElementById("my_modal_3");

    // ✅ শুধুমাত্র ছোট স্ক্রিনে মডাল দেখাও
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

          <div className="rounded-full bg-gray-100">
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
            className="ml-auto btn bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 rounded-full shadow-md"
          >
            Get
          </a>
        </div>
      </div>
    </dialog>
  );
};

export default PopupModel;
