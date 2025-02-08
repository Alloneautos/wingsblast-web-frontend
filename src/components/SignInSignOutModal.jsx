import { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import Swal from "sweetalert2";
import { API } from "../api/api";

const SignInSignOutModal = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loading, setLoading] = useState();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setSignUpLoading(true);
    const form = new FormData(e.currentTarget);
    const first_name = form.get("first_name");
    const last_name = form.get("last_name");
    const phone = form.get("phone");
    const email = form.get("email");
    const password = form.get("password");
    const confirmPassword = form.get("confirm_password");
    try {
      const response = await API.post("/user/signup", {
        first_name,
        last_name,
        phone,
        email,
        password,
        confirmPassword,
      });
      localStorage.setItem("token", response.data.token);
      setSignUpLoading(false);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Sign Up Successful!",
        showConfirmButton: false,
        timer: 1500,
      });
      window.location.reload();
    } catch (error) {
      Swal.fire({
        title: "Sign Up Failed",
        text: "Please check your credentials.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    } finally {
      setSignUpLoading(false);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    const form = new FormData(e.currentTarget);
    const email = form.get("email");
    const password = form.get("password");

    try {
      const response = await API.post("/user/login", {
        email,
        password,
      });

      // Store token in localStorage
      localStorage.setItem("token", response.data.data.token);
      Swal.fire({
        title: "Login Successful!",
        text: "Welcome back!",
        icon: "success",
        confirmButtonText: "OK",
      });
      window.location.reload();
    } catch (error) {
      // Show error message if login fails
      Swal.fire({
        title: "Login Failed",
        text: "Please check your credentials.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    } finally {
      setLoading(false);
      setLoginLoading(false);
    }
  };

  return (
    <div>
      <button
        className="p-3 px-6 rounded-lg font-semibold bg-ButtonColor ml-[30px] lg:ml-0 hover:bg-ButtonHover text-white shadow-lg transition-transform transform hover:scale-105"
        onClick={() => document.getElementById("my_modal_5").showModal()}
      >
        Please Login or Sign Up
      </button>

      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white rounded-xl p-8 shadow-xl relative">
          <button
            onClick={() => document.getElementById("my_modal_5").close()}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-600 hover:text-red-500"
          >
            ✕
          </button>

          <div className=" top-0 flex justify-center mb-6 space-x-6">
            <button
              onClick={() => setActiveTab("login")}
              className={`tab pb-2 ${
                activeTab === "login"
                  ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
                  : "text-gray-500"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`tab pb-2 ${
                activeTab === "signup"
                  ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
                  : "text-gray-500"
              }`}
            >
              Sign Up
            </button>
          </div>

          {activeTab === "login" ? (
            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Your Email Address"
                  required
                  className="input-field w-full mt-1 p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter Your Password"
                  name="password"
                  className="input-field w-full mt-1 p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3  mt-[27px] transform -translate-y-1/2 text-gray-500 cursor-pointer"
                >
                  {showPassword ? <IoEyeOff /> : <IoEye />}
                </span>
              </div>
              <div className="modal-action">
                <input
                  type="submit"
                  value="Sign In"
                  htmlFor="my_modal_5"
                  disabled={loginLoading}
                  className={`w-full cursor-pointer rounded-md bg-ButtonColor hover:bg-ButtonHover px-5 py-3 text-base font-medium text-white transition hover:bg-opacity-90 ${
                    loginLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-5">
              <div className="grid lg:flex justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    placeholder="Enter Fast Name..."
                    required
                    className="input-field w-full mt-1 p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Enter Last Name..."
                    required
                    className="input-field w-full mt-1 p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="Enter Your Phone Number..."
                  name="phone"
                  required
                  className="input-field w-full mt-1 p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Your Email...."
                  required
                  className="input-field w-full mt-1 p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter Password..."
                  name="password"
                  className="input-field w-full mt-1 p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 mt-[30px] transform -translate-y-1/2 text-gray-500 cursor-pointer"
                >
                  {showPassword ? <IoEyeOff /> : <IoEye />}
                </span>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Enter Your Confirm Password..."
                  name="confirm_password"
                  className="input-field w-full mt-1 p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400"
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 mt-[30px] transform -translate-y-1/2 text-gray-500 cursor-pointer"
                >
                  {showConfirmPassword ? <IoEyeOff /> : <IoEye />}
                </span>
              </div>
              <button
                type="submit"
                disabled={signUpLoading}
                className={`w-full cursor-pointer rounded-md bg-ButtonColor hover:bg-ButtonHover px-5 py-3 text-base font-medium text-white transition hover:bg-opacity-90 ${
                  signUpLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                SIGN UP
              </button>
            </form>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default SignInSignOutModal;
