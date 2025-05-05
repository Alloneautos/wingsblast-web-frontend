import { useContext, useState } from "react";
import { BsApple } from "react-icons/bs";

// import { AuthContext } from "../authprovider/AuthProvider";
import OtpInput from "react-otp-input";
import { CgSpinner } from "react-icons/cg";
import { API } from "../../../api/api";
import Logo from "../../../assets/images/Web Logo.png";
import Swal from "sweetalert2";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ImMobile } from "react-icons/im";
import { FcGoogle } from "react-icons/fc";

const Signin = () => {
  const [showMobileLogin, setShowMobileLogin] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const navigate = useNavigate();

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
      // Show success message and navigate home
      Swal.fire({
        title: "Login Successful!",
        text: "Welcome back!",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate(from, { replace: true });
        window.location.reload();
      });
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

  // ================
  const handleSendOtp = (e) => {
    e.preventDefault();
    setShowMobileLogin(false); // Close the mobile input modal
    setShowOtpModal(true); // Open the OTP modal
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    // Logic to verify OTP
  };

  return (
    <section className="bg-[#EDEDED] h-screen place-content-center place-items-center">
      <Helmet>
        <title>Signin | Wingsblast</title>
      </Helmet>
      <div className="container mx-auto">
        <div className="flex flex-wrap">
          <div className="w-full">
            <div className="relative mx-auto max-w-[470px] shadow-md  overflow-hidden rounded bg-white px-10 py-3 text-center sm:px-12 md:px-[60px]">
              <div className="text-center md:mb">
                <a className="mx-auto inline-block max-w-[200px]">
                  <img src={Logo} alt="logo" />
                </a>
              </div>
              <form onSubmit={handleLogin}>
                <input
                  className="w-full rounded border  border-TextColor  placeholder:text-gray-800 px-5 py-2.5 text-base text-body-color outline-none"
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                />
                <div className="relative w-full my-3">
                  <input
                    className="w-full rounded border  border-TextColor placeholder:text-gray-800 px-5 py-2.5  text-base text-body-color outline-none"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    required
                  />

                  {/* Show/Hide Password Icon */}
                  <span
                    className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-black"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <IoEyeOff /> : <IoEye />}
                  </span>
                </div>
                <Link to="/forgetPassword">
                  <h3 className="text-left text-sm -mt-[10px] hover:underline text-red-400">
                    Forget Password?
                  </h3>
                </Link>
                <div className="my-3">
                  <input
                    type="submit"
                    value="Sign In"
                    disabled={loginLoading}
                    className={`w-full cursor-pointer font-TitleFont text-lg rounded bg-ButtonColor px-5 py-3 font-medium text-white transition hover:bg-opacity-90 ${
                      loginLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
              </form>
              <ul className="grid font-TitleFont !text-2xl">
                {/* phone */}
                <button className="btn rounded bg-[#03C755] hover:bg-[#00b544] text-lg font-normal text-white border-[#00b544]">
                  <ImMobile />
                  Login with Phone{" "}
                </button>
                {/* Google */}
                <button className="btn my-3 rounded bg-gray-200 font-normal text-lg text-black border-[#e5e5e5]">
                  <FcGoogle />
                  Login with Google
                </button>
                {/* Apple */}
                <button className="btn bg-black hover:bg-gray-950 rounded font-normal text-lg text-white border-black">
                  <BsApple className="text-xl" />
                  Login with Apple
                </button>
              </ul>
              <p className="text-sm mt-1 text-body-color dark:text-dark-6">
                <span className="pr-0.5">Not a member yet?</span>
                <Link to="/signup" className="text-primary hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Login Form Modal */}
      {showMobileLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-emerald-700 rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl mb-4 text-white">Mobile Login</h2>
            <form onSubmit={handleSendOtp}>
              <input
                className="w-full rounded-md border border-stroke placeholder:text-gray-800 px-5 py-3 mb-4 text-base text-white outline-none focus:border-primary focus-visible:shadow-none"
                type="tel"
                name="mobile"
                placeholder="Enter your mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
              <button
                type="submit"
                className="px-5 py-2 bg-primary text-white rounded-md w-full"
              >
                Send OTP
              </button>
              <button
                type="button"
                onClick={() => setShowMobileLogin(false)}
                className="mt-3 px-5 py-2 bg-gray-500 text-white rounded-md w-full"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-emerald-700 rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl mb-4">Enter OTP</h2>
            <form onSubmit={handleVerifyOtp}>
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span className="">-</span>}
                renderInput={(props) => <input {...props} />}
                inputStyle={{
                  width: "2rem",
                  height: "2rem",
                  margin: "0 0.5rem",
                  fontSize: "1.5rem",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  textAlign: "center",
                }}
                autoFocus
              />
              <button
                type="submit"
                className="mt-4 px-5 py-2 bg-primary text-white rounded-md w-full"
              >
                {loading && <CgSpinner className="mt-1 animate-spin" />}
                <span>Verify OTP</span>
              </button>
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="mt-3 px-5 py-2 bg-gray-500 text-white rounded-md w-full"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Signin;
