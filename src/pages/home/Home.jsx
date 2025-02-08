import { FaPeopleCarry } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { useState } from "react";
import LocationModal from "../../components/LocationModal";
import Banner from "./Banner";
import BestFood from "./BestFood";
import FindFlavor from "./FindFlavor";
import OtherCompany from "./OtherCompany";
import DelivaryLocation from "./DelivaryLocation";

const Home = () => {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [homeActiveTab, setHomeActiveTab] = useState("carryout"); // CARRYOUT or DELIVERY
  const openModal = (tab) => {
    setHomeActiveTab(tab); // Set the active tab based on the button clicked
    setIsLocationModalOpen(true);
  };
  const orderStatus = localStorage.getItem("orderStatus");
  console.log(orderStatus);

  return (
    <div> 
      <Banner />
      <div className="hidden lg:block">
        <DelivaryLocation />
      </div>
      <BestFood />
      <FindFlavor />
      <div className="hidden lg:block">
        <OtherCompany />
      </div>
      {!orderStatus && (
        <div className="fixed flex items-center bottom-0 left-0 right-0 bg-white shadow-lg lg:hidden z-50">
          <button
            onClick={() => openModal("carryout")}
            className="flex items-center justify-center w-1/2 py-4 bg-ButtonColor text-white font-semibold shadow-md hover:bg-ButtonHover transition duration-300"
          >
            <FaPeopleCarry className="mr-2 text-xl" />
            CARRYOUT
          </button>
          <div className="h-10 w-[2px] bg-gray-200"></div>
          <button
            onClick={() => openModal("delivery")}
            className="flex items-center justify-center w-1/2 py-4 bg-ButtonColor text-white font-semibold shadow-md hover:bg-ButtonHover transition duration-300"
          >
            <TbTruckDelivery className="mr-2 text-xl" />
            DELIVERY
          </button>
        </div>
      )}

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        activeTabHome={homeActiveTab} // Pass the activeTab to the modal
        setActiveTab={homeActiveTab}
      />
    </div>
  );
};

export default Home;
