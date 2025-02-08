import { Navigate, useLocation } from "react-router-dom";
import { useUserProfile } from "../api/api";

const PrivetRoute = ({ children }) => {
  const { user, loading } = useUserProfile();

  const location = useLocation();

  if (loading) {
    return (
      <span className="loading loading-spinner text-info ml-96 mt-64 loading-lg"></span>
    );
  }

  if (user?.email) {
    return children;
  }
  return <Navigate to="/signin" state={{ from: location }} replace></Navigate>;
};

export default PrivetRoute;
