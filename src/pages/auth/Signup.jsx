import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../../api/api";
import Swal from "sweetalert2";
import FoodIMG from "../../assets/images/FBannar.jpg";
import { Helmet } from "react-helmet-async";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { BsApple } from "react-icons/bs";
import { IoEye, IoEyeOff } from "react-icons/io5";

const Signup = () => {
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Validate password match
  useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  }, [password, confirmPassword]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setSignUpLoading(true);
    const form = new FormData(e.currentTarget);
    const first_name = form.get("firstname");
    const last_name = form.get("lastname");
    const phone = form.get("number");
    const email = form.get("email");
    const password = form.get("password");

    try {
      const response = await API.post("/user/signup", {
        first_name,
        last_name,
        phone,
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      setSignUpLoading(false);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Sign Up Successful!",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        window.location.href = "/"; // Redirect to home page
      });
    } catch (error) {
      Swal.fire({
        title: "Sign Up Failed",
        text: error.response?.data?.message || "Please check your credentials.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    } finally {
      setSignUpLoading(false);
    }
  };

  return (
    <div
      className="bg-cover bg-center min-h-screen place-items-center place-content-center flex items-center justify-center relative"
      style={{
        backgroundImage: `url(${FoodIMG})`,
      }}
    >
      <Helmet>
        <title>Signup | Wingsblast</title>
      </Helmet>
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      <div className="w-full lg:w-8/12 mx-auto flex items-center justify-center relative z-10">
        <div className="w-full lg:w-4/6 p-8 bg-white bg-opacity-90 shadow-lg rounded-lg">
          <h1 className="text-4xl font-TitleFont mb-2 text-black text-center">
            Sign Up
          </h1>
          <h2 className="text-md font-medium mb-6 text-gray-500 text-center">
            Join our community for all-time access, absolutely free!
          </h2>

          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div>
                <label className="block text-md font-TitleFont text-gray-900">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  name="firstname"
                  placeholder="First Name..."
                  className="mt-1 p-3 w-full border rounded focus:border-gray-300 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-md font-TitleFont text-gray-900">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Last Name..."
                  name="lastname"
                  className="mt-1 p-3 w-full border rounded focus:border-gray-300 focus:outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div>
                <label className="block text-md font-TitleFont text-gray-900">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  placeholder="Your Email..."
                  className="mt-1 p-3 w-full border rounded focus:border-gray-300 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-md font-TitleFont text-gray-900">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="number"
                  placeholder="Your Phone..."
                  className="mt-1 p-3 w-full border rounded focus:border-gray-300 focus:outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="relative">
                <label className="block text-md font-TitleFont text-gray-900">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  required
                  placeholder="Enter Password..."
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 p-3 w-full border rounded focus:border-gray-300 focus:outline-none transition"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 top-7 flex items-center cursor-pointer text-gray-500"
                >
                  {showPassword ? <IoEyeOff /> : <IoEye />}
                </span>
              </div>
              <div className="relative">
                <label className="block text-md font-TitleFont text-gray-900">
                  Confirm Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  required
                  placeholder="Confirm Password..."
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 p-3 w-full border rounded focus:border-gray-300 focus:outline-none transition"
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 top-7 flex items-center cursor-pointer text-gray-500"
                >
                  {showConfirmPassword ? <IoEyeOff /> : <IoEye />}
                </span>
              </div>
            </div>

            {error && <p className="text-red-500 text-md">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={!!error || signUpLoading}
                className={`w-full p-2 rounded font-TitleFont text-xl text-white transition ${
                  !!error || signUpLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-ButtonColor hover:bg-ButtonHover"
                }`}
              >
                {signUpLoading ? "Signing Up..." : "Send OTP"}
              </button>
            </div>
          </form>

          <div className="text-md text-gray-600 text-center mt-5">
            <p>
              Already have an account?{" "}
              <Link to="/signin" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </p>
          </div>

          {/* Social Media Links */}
          <ul className="flex justify-between mt-6">
            <li className="w-full px-2">
              <a
                href="#"
                className="flex h-11 items-center justify-center rounded bg-[#4064AC] hover:bg-opacity-90"
              >
                <FaFacebookF className="text-white" />
              </a>
            </li>
            <li className="w-full px-2">
              <a
                href="#"
                className="flex h-11 items-center justify-center rounded bg-black hover:bg-opacity-90"
              >
                <BsApple className="text-white" />
              </a>
            </li>
            <li className="w-full px-2">
              <a
                href="#"
                className="flex h-11 items-center justify-center rounded bg-[#D64937] hover:bg-opacity-90"
              >
                <FaGoogle className="text-white" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Signup;
