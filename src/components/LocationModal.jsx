import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API, useGuestUser } from "../api/api";
import Swal from "sweetalert2";

const YOUR_GOOGLE_MAPS_API_KEY = "AIzaSyDHR63uSt3NXUnv9Ml87RMOPR_DzFsTlYY";

const LocationModel = ({ onClose, isOpen, foodId, activeTabHome }) => {
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
      if (window.google && window.google.maps && window.google.maps.places) {
        const autocompleteService =
          new window.google.maps.places.AutocompleteService();

        if (address) {
          autocompleteService.getPlacePredictions(
            {
              input: address,
              componentRestrictions: { country: "us" }, // Restrict to US locations
            },
            (predictions, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                setSuggestions(
                  predictions ? predictions.map((pred) => pred.description) : []
                );
              } else {
                setSuggestions([]);
              }
            }
          );
        }
      }
    };

    // Script লোড চেক
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${YOUR_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
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

    if (foodId) {
      navigate(`/food-details/${foodId}`);
    }

    window.location.reload();
    onClose();
  };

  const saveDeliveryAddress = async (event) => {
    event.preventDefault();

    try {
      let guestUserToken = localStorage.getItem("guestUserToken");

      if (!guestUserToken) {
        const response = await API.post("/guest-user/create");
        guestUserToken = response.data.guestUserToken;
        localStorage.setItem("guestUserToken", guestUserToken);
      }

      if (!guestUserToken) {
        throw new Error("Guest user creation failed. Please try again.");
      }

      const fullAddress = `${address} ~ ${aptAddress}`;
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

      if (foodId) {
        navigate(`/food-details/${foodId}`);
      }

      window.location.reload();
      onClose();
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: error.message || "Something went wrong",
        showConfirmButton: false,
      });
    }
  };

  return (
    <div>
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box rounded-lg">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <div className="flex space-x-1 mb-4 justify-center">
            <button
              className={`px-5 py-2 rounded-l-full font-TitleFont text-lg ${
                activeTab === "carryout"
                  ? "bg-ButtonColor text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setActiveTab("carryout")}
            >
              CARRYOUT
            </button>
            <button
              className={`px-5 py-2 rounded-r-full font-TitleFont text-lg ${
                activeTab === "delivery"
                  ? "bg-ButtonColor text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setActiveTab("delivery")}
            >
              DELIVERY
            </button>
          </div>

          <div className="w-full  mx-auto">
            {activeTab === "carryout" ? (
              <div className="bg-white shadow-lg rounded p-6 text-center space-y-4">
                <h1 className="text-3xl font-TitleFont text-gray-950">
                  CARRYOUT INFORMATION
                </h1>
                <p className="text-lg font-semibold text-gray-700">
                  <span className="text-blue-600">CarryOut Time:</span> 10:00 AM
                  - 11:00 PM
                </p>
                <p className="text-lg font-semibold text-gray-700">
                  <span className="text-blue-600">Location:</span> 255 Kingston
                  Ave Brookiyn NY 11213
                </p>
                <button
                  onClick={handleToCarryOut}
                  className="btn w-full py-3 font-TitleFont text-lg font-normal bg-ButtonColor text-white hover:bg-ButtonHover transition-all"
                >
                  SELECT CARRYOUT
                </button>
              </div>
            ) : (
              <form
                onSubmit={saveDeliveryAddress}
                className="bg-white shadow-lg rounded-lg p-1 lg:p-6 space-y-4 relative"
              >
                <label className="block text-lg font-TitleFont text-gray-900">
                  Enter Your Delivery Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter Your Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid cc",
                      borderRadius: "5px",
                      color: "#4b5563",
                    }}
                  />
                  {suggestions.length > 0 && (
                    <ul
                      className="absolute z-10 bg-white border rounded-lg mt-1 w-full max-h-40 overflow-y-auto shadow-lg"
                      style={{ top: "100%", left: 0 }}
                    >
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="px-2 text-sm py-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => {
                            setAddress(suggestion);
                            setSuggestions([]);
                          }}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Building-Suite-Apt"
                  onChange={(e) => setAptAddress(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    color: "black",
                  }}
                />
                <button
                  type="submit"
                  className="btn w-full py-3 hover:bg-ButtonHover bg-ButtonColor text-white mt-6"
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

export default LocationModel;
