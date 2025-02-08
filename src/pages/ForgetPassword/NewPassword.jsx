import { useEffect, useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API } from "../../api/api";

const NewPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { email, resetCode } = location.state || {};

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Redirect if email or resetCode is missing
  useEffect(() => {
    if (!email || !resetCode) {
      Swal.fire({
        title: "Invalid Request",
        text: "Required information is missing.",
        icon: "error",
        confirmButtonText: "Go Back",
      }).then(() => {
        navigate("/emailOTP"); // Redirect to email OTP page
      });
    }
  }, [email, resetCode, navigate]);

  // Password Matching Validation
  useEffect(() => {
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  }, [newPassword, confirmPassword]);

  // Password Strength Validation
  useEffect(() => {
    if (newPassword.length < 6) {
      setPasswordStrength("Weak");
    } else if (newPassword.match(/[!@#$%^&*(),.?":{}|<>]/)) {
      setPasswordStrength("Strong");
    } else {
      setPasswordStrength("Medium");
    }
  }, [newPassword]);

  const handlePassword = async (event) => {
    event.preventDefault();
    if (!error && newPassword) {
      setIsLoading(true);
      try {
        const response = await API.post("/forgot/new-password", {
          email,
          resetCode,
          newPassword,
        });
        if (response.status === 200) {
          Swal.fire({
            title: "Password Updated!",
            text: "Your password has been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            navigate("/signin");
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Update Failed",
          text: error.response?.data?.message || "Something went wrong.",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <section className="bg-gray-400 py-5 lg:py-[5px]">
      <div className="container mx-auto">
        <div className="flex flex-wrap">
          <div className="w-full px-4">
            <div className="relative mx-auto max-w-[525px] overflow-hidden rounded-lg bg-white px-10 py-12 dark:bg-dark-2 sm:px-12 md:px-[60px]">
              <div className="text-3xl font-semibold">Create a New Password</div>
              <p className="my-5">
                Set a new password for your account and keep it
                secure.
              </p>
              <form onSubmit={handlePassword} className="gap-y-4">
                {/* New Password Input */}
                <div className="relative w-full my-3">
                  <input
                    className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <span
                    className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-black"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <IoEyeOff /> : <IoEye />}
                  </span>
                </div>

                {/* Password Strength */}
                <p
                  className={`text-sm ${
                    passwordStrength === "Strong"
                      ? "text-green-500"
                      : passwordStrength === "Medium"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {passwordStrength && `Password Strength: ${passwordStrength}`}
                </p>

                {/* Confirm Password Input */}
                <div className="relative w-full my-3">
                  <input
                    className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none"
                    type={showConPassword ? "text" : "password"}
                    name="confirmPass"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <span
                    className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-black"
                    onClick={() => setShowConPassword(!showConPassword)}
                  >
                    {showConPassword ? <IoEyeOff /> : <IoEye />}
                  </span>
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500">{error}</p>}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!!error || isLoading}
                  className={`btn bg-ButtonColor hover:bg-ButtonHover text-white my-3 w-full ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Processing..." : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewPassword;
