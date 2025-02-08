import { useRef, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import Bannar from "../../assets/images/R.png";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import Swal from "sweetalert2";
import { API, useGuestUser } from "../../api/api";
import { useNavigate } from "react-router-dom";
import Loader from "../../assets/images/loader.gif";

const YOUR_GOOGLE_MAPS_API_KEY = "AIzaSyDHR63uSt3NXUnv9Ml87RMOPR_DzFsTlYY";

const DelivaryLocation = () => {
  const navigate = useNavigate();
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

      // Check if the address is within the USA
      if (place.address_components) {
        const country = place.address_components.find((comp) =>
          comp.types.includes("country")
        );
        if (country && country.short_name !== "US") {
          Swal.fire({
            icon: "error",
            title: "Invalid Address",
            text: "Please select an address within the USA.",
          });
          return;
        }
      }

      if (place && place.formatted_address) {
        setAddress(place.formatted_address); // Update the address state
      }
    }
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

      const fullAddress = `${address} ~ ${buildingInfo}`;
      localStorage.setItem("deliveryAddress", fullAddress);
      localStorage.setItem("orderStatus", "Delivery");

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Delivery Address Added Successfully",
        showConfirmButton: false,
        timer: 1000,
      });

      navigate("/foodmenu");
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: error.message || "Something went wrong",
        showConfirmButton: false,
      });
    }
  };

  const handleToCarryOut = async () => {
    if (!guestUser) {
      const response = await API.post("/guest-user/create");
      const guestUserToken = response.data.guestUserToken;
      localStorage.setItem("guestUserToken", guestUserToken);
    }
    localStorage.setItem("orderStatus", "CarryOut");
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Carry Out Added Successfully",
      showConfirmButton: false,
      timer: 1000,
    });
    navigate("/foodmenu");
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: YOUR_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center">
        <img src={Loader} alt="Loading..." className="w-[150px]" />
      </div>
    );
  }

  return (
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
                <span className="text-indigo-600">CarryOut Time:</span> 10:00 AM
                - 11:00 PM
              </p>
              <p className="text-lg font-semibold text-gray-700">
                <span className="text-indigo-600">Location:</span> 255 Kingston
                Ave Brooklyn, NY 11213
              </p>
              <button
                className="btn bg-ButtonColor hover:bg-ButtonHover text-white w-full"
                onClick={handleToCarryOut}
              >
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
                options={{
                  componentRestrictions: { country: "us" }, // Restrict to US addresses
                  fields: ["formatted_address", "geometry", "name"], // Specify required fields
                }}
              >
                <input
                  type="text"
                  value={address}
                  onChange={handleAddressChange}
                  placeholder="Enter US Address Only"
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
                placeholder="Building-Suite-Apt"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  color: "black",
                }}
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
  );
};

export default DelivaryLocation;
