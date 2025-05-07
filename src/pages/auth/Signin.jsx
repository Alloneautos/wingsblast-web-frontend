import { useState } from "react";
import { BsApple } from "react-icons/bs";
import USA from "../../assets/images/usa.png";
import OtpInput from "react-otp-input";
import { CgSpinner } from "react-icons/cg";
import Logo from "../../assets/images/Web Logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FcGoogle } from "react-icons/fc";
const Signin = () => {
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // const location = useLocation();
  // const from = location.state?.from?.pathname || "/";
  // const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();
    setShowOtpSection(true);
    // Simulate OTP send logic here
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("OTP Verified: " + otp);
      setShowOtpSection(false);
    }, 2000);
  };

  return (
    <section className="bg-[#EDEDED] h-screen place-content-center place-items-center">
      <Helmet>
        <title>Signin | Wingsblast</title>
      </Helmet>
      <div className="container mx-auto">
        <div className="flex flex-wrap">
          <div className="w-full">
            <div className="relative mx-auto max-w-[470px] shadow-md overflow-hidden rounded bg-white px-10 py-3 text-center sm:px-12 md:px-[60px]">
              <div className="text-center md:mb">
                <a className="mx-auto inline-block max-w-[200px]">
                  <img src={Logo} alt="logo" />
                </a>
              </div>

              {!showOtpSection ? (
                <form onSubmit={handleSendOtp}>
                  <div className="mb-5 relative">
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Phone Number
                    </label>
                    <div className="flex items-center border border-gray-300 rounded py-1 overflow-hidden bg-white">
                      <div className="flex items-center px-3 bg-gray-100 border-r border-gray-300">
                        <img src={USA} alt="USA" className="w-6 h-4 mr-2" />
                        <span className="text-sm text-gray-700">+1</span>
                      </div>
                      <input
                        type="tel"
                        placeholder="(123)-456-7890"
                        pattern="[0-9]{10}"
                        title="Must be 10 digits"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-3 py-2 !text-gray-900 focus:outline-none focus:ring-0 placeholder-gray-400 rounded"
                      />
                    </div>
                  </div>

                  <div className="my-3">
                    <input
                      type="submit"
                      value="Send OTP"
                      className="w-full cursor-pointer font-TitleFont text-lg rounded bg-ButtonColor px-5 py-3 font-medium text-white transition hover:bg-opacity-90"
                    />
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="bg-white space-y-6">
                  <div className="relative">
                    <label className="block text-base text-gray-800 text-start mb-2">
                      Please Check Your Phone for OTP
                    </label>
                    <div className="flex justify-center gap-2 font-TitleFont">
                      <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        isInputNum={true}
                        shouldAutoFocus={true}
                        renderSeparator={<span style={{ width: "20px" }}></span>}
                        inputStyle={{
                          border: "1px solid transparent",
                          borderRadius: "3px",
                          width: "41px",
                          height: "40px",
                          backgroundColor: "#d1d5db",
                          fontSize: "20px",
                          color: "#000",
                          fontWeight: "400",
                          caretColor: "blue",
                        }}
                        focusStyle={{
                          border: "none",
                          outline: "none",
                        }}
                        renderInput={(props) => (
                          <input
                            {...props}
                            className="w-12 h-12 md:w-14 md:h-14 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-center text-lg md:text-xl text-gray-800 transition duration-150"
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="btn bg-ButtonColor hover:bg-ButtonHover w-full text-white font-TitleFont font-normal text-lg rounded md:text-lg flex items-center justify-center gap-2"
                      disabled={loading}
                    >
                      {loading && (
                        <CgSpinner className="animate-spin text-xl" />
                      )}
                      <span>Verify OTP</span>
                    </button>
                  </div>
                </form>
              )}

              <ul className="grid font-TitleFont !text-2xl">
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
    </section>
  );
};

export default Signin;
