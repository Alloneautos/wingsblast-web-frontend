import { Navigate, useLocation } from "react-router-dom";
import { useUserProfile } from "../api/api";

const PrivetRoute = ({ children }) => {
  const { user, isLoading } = useUserProfile();

  const location = useLocation();

  if (isLoading) {
    return (
      <span className="loading loading-spinner text-info ml-96 mt-64 loading-lg"></span>
    );
  }

  if (user?.email || user?.phone) {
    return children;
  }
  return <Navigate to="/signin" state={{ from: location }} replace></Navigate>;
};

export default PrivetRoute;
