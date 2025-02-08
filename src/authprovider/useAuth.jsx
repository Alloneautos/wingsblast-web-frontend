import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

const useAuth = () => {
    const Auth = useContext(AuthContext);
   
    return Auth;
};

export default useAuth;