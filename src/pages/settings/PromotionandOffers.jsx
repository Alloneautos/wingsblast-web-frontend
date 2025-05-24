const PromotionandOffers = () => {
  const promotions = [
    {
      title: "FOR ALL OFFERS OR PROMOTIONS",
      description:
        "Available only for a limited time at participating locations in the US on orders for carryout or delivery placed via Wingsblast.com or the Wingsblast App. Minimum purchase may be required. Prices may vary by location. Prices may be higher in Alaska, California, and Hawaii. Does not include applicable service fees, delivery fees, surcharges, taxes or gratuities. May not be combined with any other offers or promotions. May not be available on third party marketplaces. While supplies last. Wings Blast Food Mart Inc . reserves the right to cancel, suspend and/or modify any offer or promotion if any fraud, technical failures, human error, or any other factor impairs the integrity or proper performance of the offer, as determined by Wingsblast Restaurants Inc. in its sole discretion.",
    },
    {
      title: "FOR SAVINGS ON COMBOS, PACKS, BUNDLES, AND MEAL DEALS",
      description:
        "Savings is based upon the value difference in the price of the Combo, Pack, Bundle, or Meal Deal (or any other advertised combination of menu items) versus the aggregate value of the la carte pricing of the individual items included in the Combo, Pack, Bundle, or Meal Deal (or any other advertised combination of menu items).",
    },
    {
      title: "FOR BONELESS WINGS MONDAYS & TUESDAYS",
      description:
        "Prices may vary by location. Prices may be higher in Alaska, California, and Hawaii. Only available at participating locations in the US on Mondays and Tuesdays on orders placed via Wingsblast.com or the Wingsblast App. Applies only to boneless wings by the piece; does not include combo meals, group or family packs, or bundle meals. May not be used towards combo meals, group or family packs, or bundle meals. Minimum purchase required for delivery. Does not include applicable Delivery Fee, Service Fee, Government-imposed Fees, Taxes, or Gratuities. Not available on third party marketplaces.",
    },
    // ... Add other promotions here in the same format
  ];

  return (
    <div className="bg-gray-100 w-full lg:w-10/12 mx-auto p-6">
      <h1 className="text-4xl font-TitleFont text-center text-black mb-6">
        Promotions & Offers
      </h1>
      {promotions.map((promo, index) => (
        <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4">
          <h2 className="text-2xl font-TitleFont text-black mb-2">
            {promo.title}
          </h2>
          <p className="text-gray-900 font-paragraphFont">{promo.description}</p>
        </div>
      ))}
    </div>
  );
};

export default PromotionandOffers;
