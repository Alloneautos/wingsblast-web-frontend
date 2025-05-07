import React from "react";
import USA from "./assets/images/usa.png";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form className="w-full max-w-sm bg-white rounded-2xl shadow-md p-6">
        <div className="mb-5 relative">
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Phone Number
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500">
            <div className="flex items-center px-3 bg-gray-100 border-r border-gray-300">
              <img src={USA} alt="USA" className="w-6 h-4 mr-2" />
              <span className="text-sm text-gray-700">+1</span>
            </div>
            <input
              type="tel"
              placeholder="1234567890"
              pattern="[0-9]{10}"
              title="Must be 10 digits"
              required
              className="w-full px-3 py-2 text-gray-900 focus:outline-none focus:ring-0 placeholder-gray-400"
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">Must be 10 digits</p>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default App;
