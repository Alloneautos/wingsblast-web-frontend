import { useState, useEffect, useRef } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import Swal from "sweetalert2";
import { API, useGuestUser } from "../api/api";
import { useNavigate } from "react-router-dom";

function LocationModal({ onClose, isOpen, foodId, activeTabHome }) {
  const navigate = useNavigate();
  const dialogRef = useRef(null); // Reference for the dialog element
  const { guestUser } = useGuestUser();
  const [activeTab, setActiveTab] = useState("carryout");
  const [buildingInfo, setBuildingInfo] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    if (activeTabHome) {
      setActiveTab(activeTabHome);
    }
  }, [activeTabHome]);

  // Open/Close dialog based on `isOpen` prop
  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  const handleAddressChange = (e) => setAddress(e.target.value);
  const handleBuildingChange = (e) => setBuildingInfo(e.target.value);

  const saveDeliveryAddress = async () => {
    if (activeTab === "delivery") {
      const fullAddress = `${address}, ${buildingInfo}`;
      localStorage.setItem("deliveryAddress", fullAddress);
      localStorage.setItem("orderStatus", "Delivery");
      setAddress("");
      setBuildingInfo("");

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Delivery Address Added Successfully",
        showConfirmButton: false,
        timer: 1000,
      });
      window.location.reload();
      if (!guestUser) {
        const response = await API.post("/guest-user/create");
        const guestUserToken = response.data.guestUserToken;
        localStorage.setItem("guestUserToken", guestUserToken);
      }

      onClose(); // Close modal after saving address
      if (foodId) {
        navigate(`/food-details/${foodId}`);
      }
    }
  };

  const handleToCarryOut = async () => {
    if (!guestUser) {
      const response = await API.post("/guest-user/create");
      const guestUserToken = response.data.guestUserToken;
      localStorage.setItem("guestUserToken", guestUserToken);
    }
    localStorage.setItem("orderStatus", "CarryOut");
    window.location.reload();
    onClose(); // Close modal after carryout selection
    if (foodId) {
      navigate(`/food-details/${foodId}`);
    }
  };

  
  return (
    <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost text-red-600 hover:bg-red-100 absolute top-4 right-4"
        >
          ✕
        </button>

        <div className="flex space-x-4 mb-4 justify-center">
          <button
            className={`px-5 py-2 rounded-full ${
              activeTab === "carryout"
                ? "bg-ButtonColor text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("carryout")}
          >
            CARRYOUT
          </button>
          <button
            className={`px-5 py-2 rounded-full ${
              activeTab === "delivery"
                ? "bg-ButtonColor text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("delivery")}
          >
            DELIVERY
          </button>
        </div>

        <div className="w-full max-w-lg mx-auto">
          {activeTab === "carryout" ? (
            <div className="bg-white shadow-lg rounded-lg p-6 text-center space-y-4">
              <h1 className="text-2xl font-bold text-gray-800">
                CARRYOUT INFORMATION
              </h1>
              <p className="text-lg font-semibold text-gray-700">
                <span className="text-indigo-600">CarryOut Time:</span> 10:00 AM
                - 11:00 PM
              </p>
              <p className="text-lg font-semibold text-gray-700">
                <span className="text-indigo-600">Location:</span> 255 Kingston
                Ave Brookiyn NY 11213
              </p>
              <button
                onClick={handleToCarryOut}
                className="btn w-full py-3 bg-ButtonColor text-white hover:bg-ButtonHover transition-all"
              >
                SELECT CARRYOUT
              </button>
            </div>
          ) : (
            <form
              onSubmit={saveDeliveryAddress}
              className="bg-white shadow-lg rounded-lg p-6 space-y-4"
            >
              <label className="block text-sm font-semibold text-gray-700">
                Enter Your Delivery Address
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={handleAddressChange}
                placeholder="Current Address"
                className="input w-full"
              />
              <input
                type="text"
                required
                value={buildingInfo}
                onChange={handleBuildingChange}
                placeholder="Building-Suite-Apt"
                className="input w-full mt-4"
              />

              <button
                type="submit"
                className="btn w-full py-3 hover:bg-ButtonHover bg-ButtonColor text-white mt-6"
              >
                Save Delivery Address
              </button>
              {error && (
                <div className="text-center mt-4 text-red-600 flex items-center justify-center">
                  <FiAlertTriangle className="mr-2" /> <p>{error}</p>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </dialog>
  );
}

export default LocationModal;
