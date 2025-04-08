import Gift from "../../assets/images/gift.png";

const MakeOffer = () => {
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
          <div>
            <button className="w-full h-[80px] bg-red-100 rounded-lg shadow-md flex items-center justify-between gap-2 p-4 mt-4">
              <div className="flex items-center gap-2">
                <img src={Gift} alt="Gift Icon" className="w-16 h-16" />
                <span className="text-red-600 font-semibold text-lg text-start">
                  Get 20% off on your first order !
                </span>
              </div>
            </button>
            <button className="w-full h-[80px] bg-red-100 rounded-lg shadow-md flex items-center justify-between gap-2 p-4 mt-4">
              <div className="flex items-center gap-2">
                <img src={Gift} alt="Gift Icon" className="w-16 h-16" />
                <span className="text-red-600 font-semibold text-lg text-start">
                  Get 15% off on your Birthday !
                </span>
              </div>
            </button>
            <button className="w-full h-[80px] bg-red-100 rounded-lg shadow-md flex items-center justify-between gap-2 p-4 mt-4">
              <div className="flex items-center gap-2">
                <img src={Gift} alt="Gift Icon" className="w-16 h-16" />
                <span className="text-red-600 font-semibold text-lg text-start">
                  Get 20% off on your Promotion !
                </span>
              </div>
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default MakeOffer;
