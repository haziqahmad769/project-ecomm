import ItemCard from "../../components/ItemCard";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CartItem = () => {
  const navigate = useNavigate();

  // get cart
  const {
    data: cart,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      try {
        const token = localStorage.getItem("jwt");
        const guestId = localStorage.getItem("guest_id");

        const headers = {
          "Content-Type": "application/json",
          "x-guest-id": guestId || "",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/carts`, {
          method: "GET",
          credentials: "include",
          headers,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  // const [items, setItems] = useState(cart.items);

  // const updateQuantity = (id, newQuantity) => {
  //   setItems((prevItems) =>
  //     prevItems.map((item) =>
  //       item.id === id
  //         ? {
  //             ...item,
  //             quantity: newQuantity,
  //             totalPrice: (newQuantity * item.product.price).toFixed(2),
  //           }
  //         : item
  //     )
  //   );
  // };

  // 🧠 Local state for quantity updates
  const [items, setItems] = useState([]);

  // ⏬ Update state after cart is fetched
  useEffect(() => {
    if (cart?.items) {
      setItems(cart.items);
    }
  }, [cart]);

  // 🔁 Handle quantity update
  const updateQuantity = (id, newQuantity) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: newQuantity,
              totalPrice: (newQuantity * item.product.price).toFixed(2),
            }
          : item
      )
    );
  };

  //   calculate new total quantity & price
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items
    .reduce((sum, item) => sum + item.quantity * item.product.price, 0)
    .toFixed(2);

  if (isLoading) {
    return <div>Loading cart...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const handleSubmit = () => {
    navigate("/checkout");
  };

  return (
    <div className=" flex flex-col items-center p-4">
      <div className=" my-4">
        <h2 className="text-rose-500 text-lg font-semibold my-4">Your Cart</h2>

        {/* items */}
        <div className="gap-4">
          {/* item card */}
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              updateQuantity={updateQuantity}
            />
          ))}
        </div>
      </div>

      {/* checkout button */}
      <button
        className="flex flex-row justify-between items-center bg-rose-500 hover:bg-rose-600 w-full rounded-md p-2"
        onClick={handleSubmit}
      >
        {/* total items */}
        <div className="flex items-center justify-center bg-white rounded-full w-5 h-5 text-rose-500 text-sm">
          {totalQuantity}
        </div>
        {/* checkout */}
        <div className="text-white font-semibold">Checkout</div>
        {/* total price */}
        <div className="text-white text-sm">RM{totalPrice}</div>
      </button>
    </div>
  );
};

export default CartItem;
