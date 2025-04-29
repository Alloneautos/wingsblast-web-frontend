import { useAllPromotions } from "../../api/api";
import Gift from "../../assets/images/gift.png";

const MakeOffer = ({ handleDiscount }) => {
  const { allPromotion } = useAllPromotions();

  return (
    <div>
      <button onClick={() => document.getElementById("make_offer").showModal()}>
        <div className="w-full flex items-center justify-between gap-2">
          <img src={Gift} alt="Gift Icon" className="w-16 h-16" />
          <span className="text-red-600 font-semibold text-lg text-start">
            Exclusive Limited-Time <br /> Offer !
          </span>
          <span className="text-red-600 text-xl font-bold cursor-pointer">
            →
          </span>
        </div>
      </button>
      <dialog id="make_offer" className="modal">
        <div className="modal-box p-7 rounded-lg">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-xl text-black">
            Exclusive Limited-Time Offer !
          </h3>
          <div className=" space-y-3">
            {allPromotion.map((promotion) => (
              <div
                key={promotion.id}
                className="flex items-center border border-red-700 bg-white rounded-l-md overflow-hidden"
              >
                <div className="bg-white text-black flex items-center justify-center px-4 py-6">
                  <h2 className="font-bold text-lg transform -rotate-90 tracking-wider">
                    VOUCHER
                  </h2>
                </div>

                <div className="w-1 bg-gray-300 relative">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 space-y-2 py-2">
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                  </div>
                </div>

                <div className="bg-red-500 text-white flex flex-col items-center justify-center px-8 py-6 relative">
                  <div className="border-2 border-white rounded-lg p-12 w-64 h-20 flex items-center justify-center">
                    <span className="text-5xl font-TitleFont">20%</span>{" "} OF
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default MakeOffer;
