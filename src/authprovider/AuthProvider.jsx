import { createContext, useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import app from "../firebase/firebase.config";

export const AuthContext = createContext(null);
const auth = getAuth(app); // Firebase Auth instance
const provider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);


    const handleGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                setUser(result.user); // Set the authenticated user in state
            })
            .catch((error) => {
                console.error("Error during Google sign-in:", error.message);
            });
    };
    // Include user and setUser in authInfo to make them accessible in the context
    const authInfo = {
        handleGoogle,
        user, // Provide user to other components
        setUser, // Allow other components to update user if needed
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
