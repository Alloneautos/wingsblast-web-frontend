import { FiChevronRight } from "react-icons/fi";
import Combo from "../../assets/images/combopack-r.png";
import { Link } from "react-router-dom";

const ExtraCombo = ({ extraPackege }) => {
  return (
    <div className="w-full lg:w-10/12 mx-auto">
      <div className="px-3 py-1">
        <h2 className="text-3xl font-TitleFont tracking-tight mb-4">
          HUNGRY? UPGRADE TO ADD MORE WINGS!
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {extraPackege.map((packege) => (
            <Link to={`/food-details/${packege.upgrade_food_details_id}`} key={packege.id}>
              <div className="flex items-center bg-[#ebebe3] rounded-lg overflow-hidden cursor-pointer hover duration-200">
                <div className="pl-4 pr-2 py-2 rounded-l-xl flex items-center justify-center">
                  <img
                    src={packege.image || Combo}
                    alt={packege.food_details_name}
                    className="w-[80px] h-[45px] object-contain"
                  />
                </div>
                <div className="flex flex-col justify-center  px-4 py-2 flex-grow">
                  <p className="text-base font-bold">
                    {packege.food_details_name}
                  </p>
                  <div className="flex items-baseline space-x-1 text-sm">
                    <span className="font-semibold">
                      +$ {packege.extra_price}
                    </span>
                    <span className="text-gray-700">{packege.cal}</span>
                  </div>
                </div>
                <div className="pr-4">
                  <FiChevronRight className="text-black text-xl" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExtraCombo;
