import { BiSolidError } from "react-icons/bi";
import { Link } from "react-router-dom";

const FoodMenuAbout = () => {
  return (
    <div className="w-full lg:w-10/12 mx-auto my-4">
      <p className="p-4">
        <span className="flex items-center gap-1">2,000 calories <BiSolidError /> a day is used for general nutrition
        advice, but calorie needs vary. Additional nutritional and allergen
        information available upon request or by visiting{" "}</span>
        <Link className="text-green-500" to="/termsofuser">
          {" "}
          wingblast.com/terms&user
        </Link>{" "}
        and wingblast.com/allergens. FOR ALL OFFERS OR PROMOTIONS ON
        WINGBLAST.COM OR THE{" "}
        <a
          className="text-green-400"
          href="https://apps.apple.com/us/app/wingsblast/id6738927180"
          target="_blank"
        >
          WINGBLAST APP
        </a>
        : Available only for a limited time at participating locations in the US
        on orders for carryout or delivery placed via Wingblast.com or the
        Wingblast App. Minimum purchase may be required. Prices may vary by
        location. Does not include applicable service fees, delivery fees,
        surcharges, taxes or gratuities. May not be combined with any other
        offers or promotions. May not be available on third party marketplaces.
        While supplies last. Wingblast Restaurants Inc. reserves the right to
        cancel, suspend and/or modify any offer or promotion if any fraud,
        technical failures, human error, or any other factor impairs the
        integrity or proper performance of the offer, as determined by Wingblast
        Restaurants Inc. in its sole discretion.{" "}
        <Link target="_blank" to="/promotions" className="text-green-500">
          {" "}
          Visit wingblast.com/offers
        </Link>{" "}
        Order
      </p>
    </div>
  );
};

export default FoodMenuAbout;
