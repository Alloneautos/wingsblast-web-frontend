// CardFood.js & cheild component
import { FaMinus, FaPlus } from "react-icons/fa";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { API } from "../../api/api";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
const CardFood = ({
  mycd,
  refetch,
  itemQuantity,
  itemTotalPrice,
  incrementQuantity,
  quantities,
  decrementQuantity,
  onPassFood,
}) => {
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await API.delete(`/card/delete/${id}`);
      setDeleteLoading(false);
      refetch();
    } catch (error) {
      console.error("Error deleting flavor:", error);
      setDeleteLoading(false);
    }
  };

  const showDeleteConfirm = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id);
        refetch();
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
        refetch();
      }
    });
  };
  const pp = itemTotalPrice;
  const foods = {
    name: mycd.food_name,
    id: mycd.id,
    price: mycd.food_price,
    totalPrice: pp,
    quantity: itemQuantity,
    user_id: mycd.user_id,
    flavor: [
      {
        name: mycd.flavor_name,
        image: mycd.flavor_image,
        quantity: mycd.flavor_quantity,
      },
    ],
    dip: [
      {
        name: mycd.dip_name,
        image: mycd.dip_image,
        isPaid: mycd.is_dip_paid,
        price: mycd.dip_price,
      },
    ],
    side: [
      {
        name: mycd.side_name,
        image: mycd.side_image,
        isPaid: mycd.is_side_paid,
        price: mycd.side_price,
      },
    ],
    drink: [
      {
        name: mycd.drink_name,
        image: mycd.drink_image,
        isPaid: mycd.is_drink_paid,
        price: mycd.drink_price,
      },
    ],
  };

  useEffect(() => {
    onPassFood(foods);
  }, [mycd]);

  return (
    <div key={mycd.id}>
      <div className="my-3 mx-4 text-black">
        <div className="divider"></div>
        <div className="flex justify-between text-xl sm:text-2xl">
          <h2>
            {mycd.food_name} X {itemQuantity}
          </h2>
          <div className="join">
            <button className="btn join-item">
              <Link to={`/details/${mycd.id}`}>
                {" "}
                <BiEdit className="text-2xl" />
              </Link>
            </button>
            <button className="btn join-item">
              <RiDeleteBin6Line
                onClick={() => showDeleteConfirm(mycd.id)}
                className="text-2xl text-red-600"
              />
            </button>
          </div>
        </div>

        {mycd.flavors && mycd.flavors.length > 0 ? (
          mycd.flavors.map((flavorItem, index) => (
            <div key={index} className="my-2">
              <p>
                {flavorItem.flavor_name} X {flavorItem.quantity}
              </p>
            </div>
          ))
        ) : (
          <p>No flavor data available</p>
        )}

        {mycd.dip_name && (
          <p className="my-2">
            <span className="font-semibold text-lg mt-6">Dip:</span>{" "}
            {mycd.dip_name}{" "}
            {mycd.is_dip_paid === 0 ? "" : `(${mycd.dip_price})`}
          </p>
        )}
        {mycd.side_name && (
          <p className="my-2">
            <span className="font-semibold text-lg mt-6">Side:</span>{" "}
            {mycd.side_name}{" "}
            {mycd.is_side_paid === 0 ? "" : `(${mycd.side_price})`}
          </p>
        )}
        {mycd.drink_name && (
          <p className="my-2">
            <span className="font-semibold text-lg mt-6">Drink:</span>{" "}
            {mycd.drink_name}{" "}
            {mycd.is_drink_paid === 0 ? "" : `(${mycd.drink_price})`}
          </p>
        )}
        {mycd.bakery_name && (
          <p className="my-2">
            <span className="font-semibold text-lg mt-6">Bakery:</span>{" "}
            {mycd.bakery_name}{" "}
            {mycd.is_bakery_paid === 0 ? "" : `(${mycd.bakery_price})`}
          </p>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <button
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-100"
              onClick={() => decrementQuantity(mycd.id)}
            >
              <FaMinus />
            </button>
            <span className="p-2 border-gray-300 text-xl font-semibold">
              {itemQuantity}
            </span>
            <button
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-100"
              onClick={() => incrementQuantity(mycd.id)}
            >
              <FaPlus />
            </button>
          </div>
          <span className="text-2xl font-semibold">
            ${itemTotalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardFood;
