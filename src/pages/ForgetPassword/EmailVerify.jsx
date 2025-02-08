import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API } from "../../api/api";
import { useState } from "react";

const EmailVerify = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    setLoading(true);
    try {
      const response = await API.post("/forgot/forgot-password", { email });
      console.log(response);
      if (response.status === 200) {
        Swal.fire({
          title: "OTP Sent!",
          text: "Please check your email for the OTP.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate(`/emailOTP?email=${encodeURIComponent(email)}`);
        });
      }
      setLoading(false);
    } catch (error) {
      Swal.fire({
        title: "Request Failed",
        text: error.response?.data?.message || "Something went wrong.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
    setLoading(false);
  };

  return (
    <section className="bg-gray-400 py-5 lg:py-[5px]">
      <div className="container mx-auto">
        <div className="flex flex-wrap">
          <div className="w-full px-4">
            <div className="relative mx-auto max-w-[525px] overflow-hidden rounded-lg bg-white px-10 py-12 dark:bg-dark-2 sm:px-12 md:px-[60px]">
              <div className="text-3xl font-semibold">Forgot Email</div>
              <p className="my-5">
                Don't worry. Enter your email address and we will send you an
                OTP to reset your password.
              </p>
              <form onSubmit={handleSendOtp}>
                <input
                  className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none"
                  type="email"
                  name="email"
                  placeholder="Enter Email Address"
                  required
                />
                {loading ? (
                  <button
                    type="submit"
                    className="btn bg-ButtonColor hover:bg-ButtonHover text-white my-3"
                  >
                    <span className="loading loading-spinner"></span>
                    Send OTP
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn bg-ButtonColor hover:bg-ButtonHover text-white my-3"
                  >
                    Send OTP
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmailVerify;
