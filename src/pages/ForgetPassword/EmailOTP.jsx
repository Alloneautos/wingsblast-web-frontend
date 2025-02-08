import { useState } from "react";
import OtpInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { API } from "../../api/api";

const EmailOTP = () => {
  const navigate = useNavigate();
  const [resetCode, setResetCode] = useState("");
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const [loading, setLoading] = useState(false);

  const handleVeityOTP = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await API.post("/forgot/verify-reset-code", {
        email,
        resetCode,
      });
      if (response.status === 200) {
        Swal.fire({
          title: "OTP Verified!",
          text: "You can now reset your password.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/newpass", { state: { email, resetCode } });
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Verification Failed",
        text: error.response?.data?.message || "Something went wrong.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
    setLoading(false);
  };
  const handleReOTP = async () => {
    try {
      const response = await API.post("/forgot/forgot-password", { email });
      console.log(response);
      if (response.status === 200) {
        Swal.fire({
          title: "OTP Sent!",
          text: "Please check your email for the OTP.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Request Failed",
        text: error.response?.data?.message || "Something went wrong.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto">
        <div className="flex justify-center items-center">
          <div className="w-full max-w-md px-8 py-10 bg-white rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-center text-gray-800">
              OTP Verification
            </h2>
            <p className="mt-4 text-sm text-gray-600 text-center">
              Please enter the 6-digit verification code sent to your email
              address.
            </p>
            <form onSubmit={handleVeityOTP} className="mt-8">
              <h3 className="text-center text-lg text-gray-700 mb-4">
                Your Email:
                <span className="font-medium text-blue-600">{email}</span>
              </h3>
              <div className="flex justify-center items-center w-full">
                <OtpInput
                  value={resetCode}
                  onChange={setResetCode}
                  numInputs={6}
                  renderSeparator={<span className="text-lg">-</span>}
                  renderInput={(props) => (
                    <input {...props} className="m-2 rounded bg-gray-200" />
                  )}
                />
              </div>
              {loading ? (
                <button
                  type="submit"
                  className="btn w-full bg-ButtonColor hover:bg-ButtonHover text-white font-semibold py-3 mt-6 rounded-lg shadow-md transition duration-300"
                >
                  <span className="loading loading-spinner"></span> Verify OTP
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn w-full bg-ButtonColor hover:bg-ButtonHover text-white font-semibold py-3 mt-6 rounded-lg shadow-md transition duration-300"
                >
                  Verify OTP
                </button>
              )}
            </form>
            <p className="mt-6 text-sm text-center text-gray-500">
              Didn’t receive the code?
              <button
                onClick={handleReOTP}
                className="text-blue-600 font-medium hover:underline"
              >
                Resend OTP
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmailOTP;
