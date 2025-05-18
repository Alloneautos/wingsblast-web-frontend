import { getAuth, signInWithPopup, OAuthProvider } from "firebase/auth";
import { FaApple } from "react-icons/fa";

const auth = getAuth();
const appleProvider = new OAuthProvider("apple.com");

const SignInText = () => {
  const handleAppleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, appleProvider);
      const user = result.user;
      console.log(`Signed in as ${user.displayName || user.email}`);
      console.log("Apple user:", user);
    } catch (error) {
      console.error("Apple sign-in error:", error);
      console.error("Apple login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <button
        onClick={handleAppleLogin}
        className="btn px-6 py-3 bg-black text-white rounded-lg shadow hover:bg-gray-800 flex items-center gap-2"
      >
        <FaApple className="text-xl" />
        Sign in with Apple
      </button>
    </div>
  );
};

export default SignInText;
