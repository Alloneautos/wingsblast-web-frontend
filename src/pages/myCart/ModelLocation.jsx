import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API, useGuestUser } from "../../api/api";
import Swal from "sweetalert2";

const YOUR_GOOGLE_MAPS_API_KEY = "AIzaSyDHR63uSt3NXUnv9Ml87RMOPR_DzFsTlYY";

const ModelLocation = ({ onClose, isOpen, foodId, activeTabHome }) => {
  const navigate = useNavigate();
  const { guestUser } = useGuestUser();
  const dialogRef = useRef(null);
  const [activeTab, setActiveTab] = useState("carryout");
  const [address, setAddress] = useState("");
  const [aptAddress, setAptAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    if (activeTabHome) {
      setActiveTab(activeTabHome);
    }
  }, [activeTabHome]);
  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleScriptLoad = () => {
      const autocompleteService =
        new window.google.maps.places.AutocompleteService();
      if (address) {
        autocompleteService.getPlacePredictions(
          {
            input: address,
            componentRestrictions: { country: "us" }, // Restrict to US locations
          },
          (predictions) => {
            setSuggestions(
              predictions ? predictions.map((pred) => pred.description) : []
            );
          }
        );
      }
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${YOUR_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.onload = handleScriptLoad;
      document.body.appendChild(script);
    } else {
      handleScriptLoad();
    }
  }, [address]);

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

  console.log(address)
  console.log(aptAddress)
  
  const saveDeliveryAddress = async () => {
    if (activeTab === "delivery") {
      const fullAddress = `${address}, ${aptAddress}`;
      localStorage.setItem("deliveryAddress", fullAddress);
      localStorage.setItem("orderStatus", "Delivery");
      setAddress("");
      setAptAddress("");

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

  return (
    <div>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <div className="flex space-x-4 mb-4 justify-center">
            <button
              className={`px-5 py-2 rounded-full ${
                activeTab === "carryout"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("carryout")}
            >
              CARRYOUT
            </button>
            <button
              className={`px-5 py-2 rounded-full ${
                activeTab === "delivery"
                  ? "bg-blue-600 text-white"
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
                  <span className="text-blue-600">CarryOut Time:</span> 100:00 AM
                  - 11:00 PM
                </p>
                <p className="text-lg font-semibold text-gray-700">
                  <span className="text-blue-600">Location:</span> 255 Kingston
                  Ave Brookiyn NY 11213
                </p>
                <button
                  onClick={handleToCarryOut}
                  className="btn w-full py-3 bg-blue-600 text-white hover:bg-blue-700 transition-all"
                >
                  SELECT CARRYOUT
                </button>
              </div>
            ) : (
              <form
              onSubmit={saveDeliveryAddress}
               className="bg-white shadow-lg rounded-lg p-6 space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Enter Your Delivery Address
                </label>
                <input
                  type="text"
                  placeholder="Start typing your address"
                  className="input w-full"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                {suggestions.length > 0 && (
                  <ul className="bg-white border rounded-lg mt-2 max-h-40 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => {
                          setAddress(suggestion); // ইনপুট ফিল্ডে ঠিকানা বসান
                          setSuggestions([]); // সাজেশন লিস্ট লুকান
                        }}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}

                <input
                  type="text"
                  placeholder="Building-Suite-Apt"
                  className="input w-full mt-4"
                  onChange={(e) => setAptAddress(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn w-full py-3 hover:bg-blue-700 bg-blue-600 text-white mt-6"
                >
                  Save Delivery Address
                </button>
              </form>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ModelLocation;
