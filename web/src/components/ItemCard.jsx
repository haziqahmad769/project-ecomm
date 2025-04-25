import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const ItemCard = ({ item, updateQuantity }) => {
  // update quantity in cart
  const {
    mutate: updateItemQuantity,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ id, quantity }) => {
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

        const res = await fetch(`${import.meta.env.VITE_API_URL}/carts/${id}`, {
          method: "PUT",
          credentials: "include",
          headers,
          body: JSON.stringify({ quantity }),
        });

        const data = await res.json();
        // console.log( "product id:", product_id, "quantity:", quantity);

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Update quantity");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  //delete item
  const queryClient = useQueryClient();
  const { mutate: deleteItem } = useMutation({
    mutationFn: async ({ id }) => {
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

        const res = await fetch(`${import.meta.env.VITE_API_URL}/carts/${id}`, {
          method: "DELETE",
          credentials: "include",
          headers,
        });

        const data = await res.json();
        // console.log( "product id:", product_id, "quantity:", quantity);

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });

  const reduceQuantity = (e) => {
    e.preventDefault();
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
    updateItemQuantity({ id: item.id, quantity: item.quantity - 1 });
  };

  const addQuantity = (e) => {
    e.preventDefault();
    updateQuantity(item.id, item.quantity + 1);
    updateItemQuantity({ id: item.id, quantity: item.quantity + 1 });
  };

  if (isPending) {
    return <div>Add to cart...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    deleteItem({ id: item.id });
  };

  return (
    <div className="">
      {/* card */}
      <div className="flex flex-row card justify-between items-center rounded-md bg-white shadow-lg p-2 my-4 gap-4">
        <div className="flex flex-row">
          {/* image */}
          <figure className=" rounded-lg w-12 h-12 ">
            <img
              src={item.product.productImage}
              alt=""
              className="object-cover w-full h-full"
            />
          </figure>

          {/* name & price */}
          <div className="ml-2">
            <h3 className="text-gray-700 font-semibold text-sm">
              {item.product.name}
            </h3>
            <p className="text-gray-600 text-sm">RM{item.totalPrice}</p>
          </div>
        </div>

        {/* quantity selector */}
        <div className=" border rounded-lg">
          <div className="flex justify-center items-center">
            <button
              className=" hover:bg-gray-200 w-8 h-8 rounded-lg text-gray-500"
              onClick={reduceQuantity}
            >
              -
            </button>
            <p className="text-gray-700 text-md mx-4">{item.quantity}</p>
            <button
              className=" hover:bg-gray-200 w-8 h-8 rounded-lg text-gray-500"
              onClick={addQuantity}
            >
              +
            </button>
          </div>
        </div>

        {/* delete button */}
        <button
          className="btn bg-rose-500 text-white hover:bg-rose-600 rounded-md"
          onClick={handleSubmit}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
