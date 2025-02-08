import { useRef, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import Bannar from "../../src/assets/images/R.png";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import Swal from "sweetalert2";
import { Navigate } from "react-router-dom";
import { API, useGuestUser } from "../api/api";

const YOUR_GOOGLE_MAPS_API_KEY = "AIzaSyDHR63uSt3NXUnv9Ml87RMOPR_DzFsTlYY";

const FindLocation = () => {
  const { guestUser } = useGuestUser();
  const autocompleteRef = useRef(null);
  const [activeTab, setActiveTab] = useState("carryout");
  const [address, setAddress] = useState("");
  const [buildingInfo, setBuildingInfo] = useState("");

  const handleAddressChange = (e) => setAddress(e.target.value);
  const handleBuildingChange = (e) => setBuildingInfo(e.target.value);

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.formatted_address) {
        setAddress(place.formatted_address); // Update the address state
        console.log("Selected Place:", place);
      }
    }
  };

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

      if (!guestUser) {
        const response = await API.post("/guest-user/create");
        const guestUserToken = response.data.guestUserToken;
        localStorage.setItem("guestUserToken", guestUserToken);
      }
    }
    Navigate("/foodmenu");
  };

  return (
    <LoadScript
      googleMapsApiKey={YOUR_GOOGLE_MAPS_API_KEY}
      libraries={["places"]}
    >
      <div
        className="flex w-full lg:w-10/12 mx-auto hero flex-col items-center justify-center bg-white p-6 relative"
        style={{
          backgroundImage: `url(${Bannar})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
        <div className="z-10 flex flex-col items-center text-white">
          <div className="flex items-center my-3">
            <h1 className="text-3xl font-bold tracking-wide italic text-center">
              FIND YOUR MENU
            </h1>
            <FaLocationDot className="text-2xl ml-2" />
          </div>

          {/* Tab Buttons */}
          <div className="flex mb-6">
            <button
              className={`px-6 py-2 text-sm md:text-base rounded-l-full font-medium transition-all ${
                activeTab === "carryout"
                  ? "bg-ButtonColor text-white"
                  : "bg-white text-black border"
              }`}
              onClick={() => setActiveTab("carryout")}
            >
              CARRYOUT
            </button>
            <button
              className={`px-6 py-2 text-sm md:text-base rounded-r-full font-medium transition-all ${
                activeTab === "delivery"
                  ? "bg-ButtonColor text-white"
                  : "bg-white text-black border"
              }`}
              onClick={() => setActiveTab("delivery")}
            >
              DELIVERY
            </button>
          </div>

          {/* Tab Content */}
          <div className="w-full max-w-lg mx-auto">
            {activeTab === "carryout" ? (
              <div className="bg-white shadow-lg rounded-lg p-6 text-center space-y-4">
                <h1 className="text-2xl font-bold text-gray-800">
                  CARRYOUT INFORMATION
                </h1>
                <p className="text-lg font-semibold text-gray-700">
                  <span className="text-indigo-600">CarryOut Time:</span> 10:00
                  AM - 11:00 PM
                </p>
                <p className="text-lg font-semibold text-gray-700">
                  <span className="text-indigo-600">Location:</span> 255
                  Kingston Ave Brooklyn, NY 11213
                </p>
                <button className="btn bg-ButtonColor hover:bg-ButtonHover text-white w-full">
                  SELECT CARRYOUT
                </button>
              </div>
            ) : (
              <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Enter Your Delivery Address
                </label>

                <Autocomplete
                  onLoad={(autocomplete) =>
                    (autocompleteRef.current = autocomplete)
                  }
                  onPlaceChanged={onPlaceChanged}
                >
                  <input
                    type="text"
                    value={address}
                    onChange={handleAddressChange}
                    placeholder="Enter your US address"
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      color: "black",
                    }}
                  />
                </Autocomplete>

                <input
                  type="text"
                  value={buildingInfo}
                  onChange={handleBuildingChange}
                  // onChange={(e) => setBuildingInfo(e.target.value)}
                  placeholder="Building-Suite-Apt"
                  className="input text-black input-bordered input-error w-full mt-4"
                />

                <button
                  className="btn w-full py-3 bg-ButtonColor hover:bg-ButtonHover text-white mt-6"
                  onClick={saveDeliveryAddress}
                >
                  Save Delivery Address
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </LoadScript>
  );
};

export default FindLocation;
