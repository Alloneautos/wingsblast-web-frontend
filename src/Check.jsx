import { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
// import Bannar from "../../assets/images/R.png"; // Replace with your banner path
import Swal from "sweetalert2";
import { API, useGuestUser } from "../../api/api"; // Replace with your API file path
import { useNavigate } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";
import { usePlacesWidget } from "react-google-autocomplete";

const FindLocation = () => {
  const navigate = useNavigate();
  const { guestUser } = useGuestUser();
  const [activeTab, setActiveTab] = useState("carryout");
  const [buildingInfo, setBuildingInfo] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // const centerLat = 40.6709518; // Example latitude (replace with your store's location)
  // const centerLon = -73.9417821; // Example longitude

  const handleAddressChange = (e) => setAddress(e.target.value);
  const handleBuildingChange = (e) => setBuildingInfo(e.target.value);

  // const getDistance = (lat1, lon1, lat2, lon2) => {
  //   const R = 3961; // Earth's radius in miles
  //   const dLat = (lat2 - lat1) * (Math.PI / 180);
  //   const dLon = (lon2 - lon1) * (Math.PI / 180);
  //   const a =
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos(lat1 * (Math.PI / 180)) *
  //       Math.cos(lat2 * (Math.PI / 180)) *
  //       Math.sin(dLon / 2) *
  //       Math.sin(dLon / 2);
  //   return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  // };

  // const handleGetLocation = () => {
  //   if ("geolocation" in navigator) {
  //     setLoadingLocation(true);
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         setLoadingLocation(false);
  //         const { latitude, longitude } = position.coords;
  //         const distance = getDistance(
  //           centerLat,
  //           centerLon,
  //           latitude,
  //           longitude
  //         );
  //         if (distance > 1) {
  //           setError("Error: Selected location is outside the 2-mile radius.");
  //         } else {
  //           fetch(
  //             `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`
  //           )
  //             .then((res) => res.json())
  //             .then((data) => {
  //               if (data.status === "OK") {
  //                 setAddress(data.results[0].formatted_address);
  //                 setError(null);
  //               } else {
  //                 setError("Unable to fetch address.");
  //               }
  //             })
  //             .catch(() =>
  //               setError("Failed to connect to the Geocoding service.")
  //             );
  //         }
  //       },
  //       () =>
  //         setError(
  //           "Unable to retrieve location. Please enable location services."
  //         )
  //     );
  //   } else {
  //     setError("Geolocation is not supported by your browser.");
  //   }
  // };

  const saveDeliveryAddress = async () => {
    const fullAddress = `${address}, ${buildingInfo}`;
    if (!address || !buildingInfo) {
      setError("Please provide a complete delivery address.");
      return;
    }
    localStorage.setItem("deliveryAddress", fullAddress);
    localStorage.setItem("orderStatus", "Delivery");

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
    navigate("/foodmenu");
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

  const { ref } = usePlacesWidget({
    apiKey: "AIzaSyDHR63uSt3NXUnv9Ml87RMOPR_DzFsTlYY",
    onPlaceSelected: (place) => {
      setSelectedPlace(place);
      setAddress(place.formatted_address || "");
    },
    options: {
      types: ["geocode"],
      componentRestrictions: { country: "us" },
    },
  });

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
        <h1 className="text-3xl font-bold mb-4">FIND YOUR MENU</h1>
        <div className="flex mb-6">
          <button
            className={`px-6 py-2 ${activeTab === "carryout" ? "bg-blue-600 text-white" : "bg-white text-black"}`}
            onClick={() => setActiveTab("carryout")}
          >
            CARRYOUT
          </button>
          <button
            className={`px-6 py-2 ${activeTab === "delivery" ? "bg-blue-600 text-white" : "bg-white text-black"}`}
            onClick={() => setActiveTab("delivery")}
          >
            DELIVERY
          </button>
        </div>

        {activeTab === "carryout" ? (
          <button
            onClick={handleToCarryOut}
            className="btn bg-green-500 hover:bg-green-600 text-white w-full"
          >
            SELECT CARRYOUT
          </button>
        ) : (
          <div className="bg-white p-6 rounded-lg text-black">
            <input
              ref={ref}
              type="text"
              onChange={handleAddressChange}
              placeholder="Start typing your address..."
              className="w-full p-2 border rounded mb-4"
            />
            <input
              type="text"
              value={buildingInfo}
              onChange={handleBuildingChange}
              placeholder="Building/Apt"
              className="w-full p-2 border rounded mb-4"
            />
            <button
              onClick={saveDeliveryAddress}
              className="btn bg-blue-500 text-white w-full"
            >
              Save Delivery Address
            </button>
            {/* <button
              className="w-full bg-green-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-green-600"
              onClick={handleGetLocation}
            >
              Use Current Location
            </button> */}
            {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindLocation;
