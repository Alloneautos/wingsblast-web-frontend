import Slice from "../../assets/images/Slice.jpg";
import Grubhub from "../../assets/images/Grubhub.png";
import DoorDash from "../../assets/images/Doordesh.png";
import Uber from "../../assets/images/uber_eats.jpg";

const OtherCompany = () => {
  return (
    <section className="bg-gray-800 py-16">
      <div className="container w-full lg:w-10/12 mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold italic text-white mb-4">
            OUR DELIVERY PARTNERS
          </h1>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:flex lg:flex gap-6 mx-auto justify-center">
          <a
            href="https://slicelife.com/restaurants/ny/brooklyn/11213/wings-blast-and-pizza/menu?utm_campaign=order_now_button&utm_medium=referral&utm_source=wingsblast.com&utm_content=custom_link"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white w-[130px] lg:w-[150px] h-[130px] lg:h-[150px] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <img
              src={Slice}
              alt="Slice Logo"
              className="rounded-xl w-full object-cover"
            />
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white w-[130px] lg:w-[150px] h-[130px] lg:h-[150px] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <img
              src={Grubhub}
              alt="Slice Logo"
              className="rounded-xl w-full object-cover"
            />
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white w-[130px] lg:w-[150px] h-[130px] lg:h-[150px] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <img
              src={Uber}
              alt="Slice Logo"
              className="rounded-xl w-full object-cover"
            />
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white w-[130px] lg:w-[150px] h-[130px] lg:h-[150px] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <img
              src={DoorDash}
              alt="Slice Logo"
              className="rounded-xl w-full object-cover"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default OtherCompany;
