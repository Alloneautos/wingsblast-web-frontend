import Swal from "sweetalert2";
import { BiEdit, BiUser } from "react-icons/bi";
import { FaCamera } from "react-icons/fa";
import Profile from "../assets/images/profile.png";
import { API, useUserProfile } from "../api/api";
import { useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Loader from "../assets/images/loader.gif";
import { Helmet } from "react-helmet-async";

const UserProfile = () => {
  const { user, isLoading, isError, error, refetch } = useUserProfile();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const filePreview = URL.createObjectURL(selectedFile); // প্রিভিউ URL তৈরি করুন
    setPreview(filePreview);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("profile_pic", file);

    try {
      const response = await API.put("/user/update/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      if (response.status === 200) {
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        const modal = document.getElementById("profile_pic");
        modal.close();
      }
      setUploading(false);
      refetch();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
    setUploading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img src={Loader} alt="Loading..." className="w-[150px]" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString); // Create Date object from the string
    const day = String(date.getDate()).padStart(2, "0"); // Get day and ensure two digits
    const month = date.toLocaleString("default", { month: "short" }); // Get the 3-letter month abbreviation
    const year = date.getFullYear(); // Get the full year

    return `${day} ${month},${year}`; // Return formatted date
  };

  const userInfoEdit = async (event) => {
    event.preventDefault();
    const form = event.target;

    const first_name = form.first_name.value;
    const last_name = form.last_name.value;
    const phone = form.phone.value;
    const street_address = form.street_address.value;
    const city = form.city.value;
    const postal_or_zip_code = form.postal_or_zip_code.value;
    const country = form.country.value;
    const birth_day = form.birth_day.value;

    const updateInfo = {
      first_name,
      last_name,
      phone,
      street_address,
      city,
      postal_or_zip_code,
      country,
      birth_day,
    };
    try {
      await API.put("/user/update", updateInfo);
      const modal = document.getElementById("profile_edit");
      if (modal) {
        modal.close(); // Close modal programmatically
      }
      refetch();
      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        text: "Your profile has been successfully updated.",
        showConfirmButton: false,
        timer: 1500,
      });
      setEditLoading(true);
    } catch (error) {
      console.error("Profile update failed", error);
      // Show error notification
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "There was an issue updating your profile. Please try again.",
      });
    }
    setEditLoading(false);
  };
  const handleAccountDelete = (id) => {
    Swal.fire({
      title: "Are you absolutely sure? 🥺",
      text: "Deleting your account is permanent and cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF6B6B",
      cancelButtonColor: "#6C757D",
      confirmButtonText: "Yes, delete it! 💔",
      cancelButtonText: "No, keep my account 😊",
      customClass: {
        title: "text-lg font-semibold",
        popup: "rounded-xl shadow-lg",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await API.delete(`/user/delete/${id}`);
          Swal.fire({
            title: "Goodbye! 🕊️",
            text: "Your account has been successfully deleted. We will miss you! 🥲",
            icon: "success",
            confirmButtonColor: "#6C63FF",
            customClass: {
              popup: "rounded-xl shadow-lg",
            },
          });
          refetch(); // Refresh data after deletion
          navigate(`/signin`);
        } catch (error) {
          console.error("Error deleting item:", error);
          Swal.fire({
            title: "Oops! Something went wrong 😟",
            text: "We couldn't delete your account. Please try again later.",
            icon: "error",
            confirmButtonColor: "#FF6B6B",
            customClass: {
              popup: "rounded-xl shadow-lg",
            },
          });
        }
      }
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center px-4">
      <Helmet>
        <title>Profile | Wingsblast</title>
      </Helmet>
      <div className="bg-white shadow-lg rounded-xl w-full lg:w-8/12 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-8 flex flex-col items-center rounded-t-lg">
          {/* Profile Picture Container */}
          <div className="relative w-40 h-40 mb-4">
            <img
              src={user?.profile_pic || Profile}
              alt="Profile"
              className="w-full h-full object-cover rounded-full border-4 border-blue-500 shadow-md"
            />
            <label
              className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white shadow-lg cursor-pointer hover:bg-blue-700 transition duration-200"
              // htmlFor="profileUpload"
            >
              <FaCamera
                onClick={() =>
                  document.getElementById("profile_pic").showModal()
                }
                className="text-lg"
              />
            </label>
          </div>

          {/* User Info */}
          <h1 className="text-2xl font-bold mt-4">{`${
            user?.first_name || "No"
          } ${user?.last_name || "Name"}`}</h1>
          <p className="text-sm text-blue-100">
            {user?.email || ""}
          </p>
        </div>

        {/* Main Details Section */}
        <div className="p-6">
          {/* Section Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-TitleFont text-gray-900 flex items-center gap-2">
              <BiUser className="text-indigo-500" />
              Personal Information
            </h2>
            <button
              onClick={() =>
                document.getElementById("profile_edit").showModal()
              }
              className="btn text-white rounded font-TitleFont font-normal bg-green-600 hover:bg-green-700"
            >
              <BiEdit /> Edit Info
            </button>
          </div>

          {/* User Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                First Name
              </label>
              <div className="bg-orange-100 rounded-md p-2">
                {user?.first_name || "N/A"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Last Name
              </label>
              <div className="bg-orange-100 rounded-md p-2">
                {user?.last_name || "N/A"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <div className="bg-orange-100 rounded-md p-2">
                {user?.email || "N/A"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Phone
              </label>
              <div className="bg-orange-100 rounded-md p-2">
                {user?.phone || "N/A"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Birth Date
              </label>
              <div className="bg-orange-100 rounded-md p-2">
                {formatDate(user.birth_day) || "N/A"}
              </div>
            </div>
          </div>

          {/* Address Details */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">
              Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Street Address */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">
                  Street Address
                </label>
                <div className="bg-orange-100 rounded-md p-3 shadow-md">
                  {user?.street_address || "N/A"}
                </div>
              </div>

              {/* City */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">
                  City
                </label>
                <div className="bg-orange-100 rounded-md p-3 shadow-md">
                  {user?.city || "N/A"}
                </div>
              </div>

              {/* State/Region */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">
                  State
                </label>
                <div className="bg-orange-100 rounded-md p-3 shadow-md">
                  {user?.state_or_region || "N/A"}
                </div>
              </div>

              {/* Country */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">
                  Country
                </label>
                <div className="bg-orange-100 rounded-md p-3 shadow-md">
                  {user?.country || "N/A"}
                </div>
              </div>

              {/* Postal/ZIP Code */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">
                  ZIP Code
                </label>
                <div className="bg-orange-100 rounded-md p-3 shadow-md">
                  {user?.postal_or_zip_code || "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" text-center md:text-end lg:text-end">
          <button
            onClick={() => handleAccountDelete(user.id)}
            className="btn font-normal text-xl bg-ButtonColor hover:bg-ButtonHover rounded font-TitleFont text-white m-3"
          >
            <RiDeleteBinLine /> ACCOUNT DELETE
          </button>
        </div>
      </div>

      {/* Profile Edit Modal */}
      <dialog id="profile_edit" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box p-6 rounded-lg shadow-xl bg-white max-w-3xl">
          {/* Modal Header */}
          <header className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Edit Profile
            </h2>
            <form method="dialog">
              <button className="btn btn-sm bg-gray-100 hover:bg-gray-200 text-gray-800 border-none rounded-full px-4 py-1">
                ✕
              </button>
            </form>
          </header>

          {/* Form Section */}
          <section>
            <form onSubmit={userInfoEdit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Fast Name
                  </label>
                  <input
                    id="username"
                    defaultValue={user.first_name}
                    name="first_name"
                    type="text"
                    placeholder="First Name...."
                    className="mt-2 block w-full px-4 py-2 text-gray-700 bg-gray-100 shadow-lg border border-gray-300 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-50 focus:outline-none"
                  />
                </div>

                {/* Last name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    id="last_name"
                    defaultValue={user.last_name}
                    name="last_name"
                    type="text"
                    placeholder="Last Name...."
                    className="mt-2 block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md shadow-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-50 focus:outline-none"
                  />
                </div>
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    defaultValue={user.phone}
                    id="phone"
                    name="phone"
                    type="phone"
                    placeholder="Enter Your phone...."
                    className="mt-2 block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md shadow-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-50 focus:outline-none"
                  />
                </div>
                {/* Birth Day */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Birth Date
                  </label>
                  <input
                    defaultValue={user.birth_day}
                    id="birth_day"
                    name="birth_day"
                    type="date"
                    placeholder="Birth Date...."
                    className="mt-2 block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md shadow-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-50 focus:outline-none"
                  />
                </div>
                {/* Street Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Street Address
                  </label>
                  <input
                    defaultValue={user.street_address}
                    id="street_address"
                    name="street_address"
                    type="text"
                    placeholder="Street Address...."
                    className="mt-2 block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md shadow-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-50 focus:outline-none"
                  />
                </div>
                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    defaultValue={user.city}
                    id="city"
                    name="city"
                    type="text"
                    placeholder="City...."
                    className="mt-2 block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md shadow-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-50 focus:outline-none"
                  />
                </div>
                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    defaultValue={user.country}
                    id="country"
                    name="country"
                    type="text"
                    placeholder="Country...."
                    className="mt-2 block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md shadow-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-50 focus:outline-none"
                  />
                </div>
                {/* Zip code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Zip code
                  </label>
                  <input
                    defaultValue={user.postal_or_zip_code}
                    id="postal_or_zip_code"
                    name="postal_or_zip_code"
                    type="text"
                    placeholder="zip_Code...."
                    className="mt-2 block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md shadow-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-50 focus:outline-none"
                  />
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex justify-end mt-8">
                <button
                  type="submit"
                  className="px-6 py-2 text-white bg-ButtonColor rounded-lg shadow-md hover:bg-ButtonHover"
                >
                  {editLoading ? (
                    <span className="loading loading-spinner text-accent"></span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      </dialog>
      <dialog id="profile_pic" className="modal">
        <div className="modal-box w-[90%] max-w-sm p-6 rounded-lg shadow-lg bg-white">
          {/* Close Button */}
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-500 hover:text-red-500 transition"
              aria-label="Close"
            >
              ✕
            </button>
          </form>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700">
              Change Profile Photo
            </h2>
            <p className="text-sm text-gray-500">
              Upload a new profile picture to update your profile.
            </p>
          </div>
          {/* Image Preview */}
          <div className="w-32 h-32 relative mx-auto mb-4">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-full border-2 border-blue-300 shadow-sm"
              />
            ) : (
              <img
                src={user.profile_pic}
                alt="Preview"
                className="w-full h-full object-cover rounded-full border-2 border-blue-300 shadow-sm"
              />
            )}
            <label
              title="Choice Photo"
              className="absolute bottom-0 right-0 bg-ButtonColor p-2 rounded-full text-white shadow-lg cursor-pointer hover:bg-ButtonHover transition duration-200"
              htmlFor="profileUpload"
            >
              <FaCamera className="text-lg" />
            </label>
          </div>

          {/* Upload Input */}
          <div className="text-center mb-4">
            <input
              id="profileUpload"
              type="file"
              name="profile_pic"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Save Button */}
          <div className="text-center">
            {uploading ? (
              <button
                className={`btn w-full bg-ButtonColor hover:bg-ButtonHover text-white px-4 py-2 rounded-lg transition duration-200`}
              >
                <span className="loading loading-spinner text-secondary"></span>
                Save Changes
              </button>
            ) : (
              <button
                onClick={handleUpload}
                className="btn w-full bg-ButtonColor hover:bg-ButtonHover text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default UserProfile;
