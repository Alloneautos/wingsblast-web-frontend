import { useState } from "react";
import Swal from "sweetalert2";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "success",
      title: "Send Your Massage",
      showConfirmButton: false,
      timer: 1500,
    });
    // Reset form
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className="bg-gray-100 py-7">
      <div className="container mx-auto px-3 md:px-6 lg:px-20">
        <h1 className="text-3xl lg:text-5xl font-TitleFont text-black text-center mb-4">
          Contact Us
        </h1>
        <p className="text-gray-600 text-center mb-4">
          Have questions? We'd love to hear from you! Fill out the form below,
          and we’ll get back to you soon.
        </p>

        <div className="md:w-8/12 mx-auto">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded shadow-lg">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block text-gray-900 font-TitleFont mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-ButtonColor"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-gray-900 font-TitleFont mb-2"
                >
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-ButtonColor"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-gray-900 font-TitleFont mb-2"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Write your message"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-ButtonColor"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-ButtonColor text-white py-3 px-6 rounded shadow hover:bg-ButtonHover font-TitleFont text-xl transition-all duration-300 w-full"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
