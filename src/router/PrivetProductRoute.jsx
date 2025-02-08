import { useState } from "react";
import { useGuestUser } from "../api/api";
import LocationModal from "../components/LocationModal";

const PrivetProductRoute = ({ children }) => {
  const { guestUser, loading } = useGuestUser();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  if (loading) {
    return (
      <span className="loading loading-spinner text-info ml-96 mt-64 loading-lg"></span>
    );
  }

  if (guestUser) {
    return children;
  }

  return (
    <>
      <LocationModal
        isOpen={!guestUser}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </>
  );
};

export default PrivetProductRoute;
