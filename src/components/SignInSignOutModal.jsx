import { useState, useEffect, useRef } from "react";
import { BsApple } from "react-icons/bs";
import USA from "../assets/images/usa.png";
import OtpInput from "react-otp-input";
import { CgSpinner } from "react-icons/cg";
import Logo from "../assets/logobywingsblast.png";
import { FcGoogle } from "react-icons/fc";
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signInWithPopup,
} from "firebase/auth";
import Swal from "sweetalert2";
import { GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { API } from "../api/api";
const provider = new GoogleAuthProvider();

const SignInSignOutModal = ({ userRefetch }) => {
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const recaptchaVerifierRef = useRef(null);
  const dialogRef = useRef(null); // Step 1: Create ref

  useEffect(() => {
    let mounted = true;

    const initializeRecaptcha = async () => {
      try {
        // Remove destroy() call, just clear the reference if needed
        if (recaptchaVerifierRef.current) {
          // If clear() exists, call it, otherwise just set to null
          if (typeof recaptchaVerifierRef.current.clear === "function") {
            recaptchaVerifierRef.current.clear();
          }
          recaptchaVerifierRef.current = null;
        }

        recaptchaVerifierRef.current = new RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "invisible",
            callback: () => {
              if (mounted) setRecaptchaReady(true);
            },
            "expired-callback": () => {
              if (mounted) setRecaptchaReady(false);
              initializeRecaptcha(); // Re-initialize
            },
          },
          auth
        );

        await recaptchaVerifierRef.current.render();

        // Ensure it fully loads before enabling button
        setTimeout(() => {
          if (mounted) setRecaptchaReady(true);
        }, 300);
      } catch (error) {
        console.error("Recaptcha initialization error:", error);
        if (mounted) setRecaptchaReady(false);
      }
    };

    initializeRecaptcha();

    return () => {
      mounted = false;
      // Remove destroy() call, just clear the reference
      recaptchaVerifierRef.current = null;
    };
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!recaptchaReady || !recaptchaVerifierRef.current) {
      alert(
        "Security verification is still initializing. Please try again shortly."
      );
      return;
    }

    try {
      setLoading(true);
      const confirmation = await signInWithPhoneNumber(
        auth,
        `+1${phoneNumber}`,
        recaptchaVerifierRef.current
      );
      setConfirmationResult(confirmation);
      setShowOtpSection(true);
    } catch (error) {
      console.error("OTP send error:", error);
      console.log(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!confirmationResult || otp.length !== 6) return;

    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const token = result.user.accessToken;
      const first_name = "Guest";
      const last_name = "User";
      const response = await API.post("/user/firebase-login", {
        first_name,
        last_name,
        token,
      });
      localStorage.setItem("token", response.data.data.token);
      userRefetch();
      // Show success message and navigate home
      Swal.fire({
        title: "Login Successful!",
        text: "Welcome back!",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        // modal close
        if (dialogRef.current) dialogRef.current.close(); // Step 3: Close modal
      });
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();
      const displayName = user.displayName || "";
      const [first_name, last_name] = displayName.split(" ");
      const response = await API.post("/user/firebase-login", {
        first_name,
        last_name,
        token,
      });
      localStorage.setItem("token", response.data.data.token);
      if (dialogRef.current) dialogRef.current.close();
      userRefetch();
      setTimeout(() => {
        Swal.fire({
          title: "Login Successful!",
          text: "Welcome back!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      }, 300);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <button
        className="w-full p-2 font-TitleFont px-6 rounded bg-ButtonColor lg:ml-0 hover:bg-ButtonHover text-white shadow-lg transition-transform transform hover:scale-105"
        onClick={() => document.getElementById("login-modal").showModal()}
      >
        Please Login or Sign Up
      </button>
      <dialog id="login-modal" className="modal" ref={dialogRef}>
        {" "}
        {/* Step 2: Attach ref */}
        <div className="modal-box rounded">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="container mx-auto">
            <div className="flex flex-wrap">
              <div className="w-full">
                <div className="relative mx-auto max-w-[470px] overflow-hidden  px-10 py-3 text-center sm:px-12 md:px-[10px]">
                  <div className="text-center md:mb">
                    <a className="mx-auto inline-block max-w-[170px]">
                      <img src={Logo} alt="logo" />
                    </a>
                  </div>

                  {/* reCAPTCHA container - invisible */}
                  <div id="recaptcha-container"></div>

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
                            placeholder="1234567890"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full px-3 py-2 !text-gray-900 focus:outline-none focus:ring-0 placeholder-gray-400 rounded"
                          />
                        </div>
                      </div>

                      <div className="my-3">
                        {!recaptchaReady && (
                          <div className="text-sm text-yellow-600 mb-4">
                            Initializing security verification...
                          </div>
                        )}

                        <button
                          type="submit"
                          className={`w-full cursor-pointer font-TitleFont text-lg rounded px-5 py-3 font-medium transition ${
                            recaptchaReady
                              ? "bg-ButtonColor text-white hover:bg-opacity-90"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                          disabled={!recaptchaReady || loading}
                        >
                          {loading ? (
                            <CgSpinner className="animate-spin mx-auto text-xl" />
                          ) : (
                            "Send OTP"
                          )}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form
                      onSubmit={handleVerifyOtp}
                      className="bg-white space-y-6"
                    >
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
                            renderSeparator={
                              <span style={{ width: "20px" }}></span>
                            }
                            shouldAutoFocus={true}
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

                      <button
                        type="button"
                        onClick={() => {
                          setShowOtpSection(false);
                          setOtp("");
                        }}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Change Phone Number
                      </button>
                    </form>
                  )}

                  <ul className="grid font-TitleFont !text-2xl">
                    <button
                      onClick={handleGoogleLogin}
                      className="btn my-3 rounded bg-gray-200 font-normal text-lg text-black border-[#e5e5e5]"
                    >
                      <FcGoogle />
                      Login with Google
                    </button>
                    {/* <button className="btn bg-black hover:bg-gray-950 rounded font-normal text-lg text-white border-black">
                      <BsApple className="text-xl" />
                      Login with Apple
                    </button> */}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default SignInSignOutModal;
