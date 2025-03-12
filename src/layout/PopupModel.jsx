import { useEffect } from "react";
import { FaDownload } from "react-icons/fa";
import Apple from "../assets/images/appleapp.png"

const PopupModel = () => {
  useEffect(() => {
    // পেজ লোড হওয়ার সাথে সাথেই মডেলটি ওপেন হবে
    const modal = document.getElementById("my_modal_3");
    if (modal) {
      modal.showModal();
    }
  }, []);

  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* ✕ বাটন ক্লিক করলে মডেল বন্ধ হবে */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div className="flex items-center bg-white p-4">
          {/* Icon Section */}
          <div className="rounded-full">
            <img src={Apple} width={100} alt="" />
          </div>

          {/* Text Section */}
          <div className="ml-4">
            <h3 className="text-lg font-bold text-gray-800">
              Download Our App!
            </h3>
          </div>

          {/* Button Section */}
          <a target="_blank" href="https://apps.apple.com/us/app/wingsblast/id6738927180" className="ml-auto btn bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded shadow-md">
            Install now
          </a>
        </div>
      </div>
    </dialog>
  );
};

export default PopupModel;
