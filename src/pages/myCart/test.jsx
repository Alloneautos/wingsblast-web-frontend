import React, { useState } from "react";
import { usePlacesWidget } from "react-google-autocomplete";

function LocationInput() {
  const [selectedPlace, setSelectedPlace] = useState(null);

  const { ref } = usePlacesWidget({
    apiKey: "AIzaSyDHR63uSt3NXUnv9Ml87RMOPR_DzFsTlYY",
    onPlaceSelected: (place) => {
      console.log(place);
      setSelectedPlace(place);
    },
    options: {
      types: ["geocode"], // Suggest addresses
      componentRestrictions: { country: "us" }, // Restrict to Bangladesh
    },
  });

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Enter Your Address
      </label>
      <input
        ref={ref}
        type="text"
        placeholder="Start typing your address..."
        className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md"
      />
      {selectedPlace && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow">
          <h3 className="font-bold text-gray-800">Selected Address:</h3>
          <p className="text-gray-600">{selectedPlace.formatted_address}</p>
        </div>
      )}
    </div>
  );
}

export default LocationInput;

