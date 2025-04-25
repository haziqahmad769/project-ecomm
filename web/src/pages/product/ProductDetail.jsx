import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
// import { PRODUCT } from "../../utils/database/dummyDb";

const ProductDetail = () => {
  // get product
  const { productId } = useParams();
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
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

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/products/${productId}`,
          {
            method: "GET",
            credentials: "include",
            headers,
          }
        );

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

  // add to cart
  const queryClient = useQueryClient();

  const {
    mutate: addToCart,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ product_id, quantity }) => {
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
          method: "POST",
          credentials: "include",
          headers,
          body: JSON.stringify({ product_id, quantity }),
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
      toast.success("Add to cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [quantity, setQuantity] = useState(1);

  const reduceQuantity = () =>
    setQuantity((prevQuantity) =>
      prevQuantity > 1 ? prevQuantity - 1 : prevQuantity
    );

  const addQuantity = () =>
    setQuantity((prevQuantity) =>
      prevQuantity < product.quantity ? prevQuantity + 1 : prevQuantity
    );

  if (isLoading) {
    return <div>Loading product...</div>;
  }

  if (isPending) {
    return <div>Add to cart...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    addToCart({ product_id: product.id, quantity });
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="my-4">
        <h2 className="text-rose-500 text-lg font-semibold my-4">
          Product Details
        </h2>
        {/* image */}
        <figure className="rounded-lg w-56 h-56 overflow-hidden shadow-lg">
          <img
            src={product.productImage}
            alt=""
            className="object-cover w-full h-full"
          />
        </figure>
        {/* details */}
        <div className="my-4">
          <h3 className="text-gray-700 font-bold text-xl">{product.name}</h3>
          <p className="text-gray-600 font-semibold text-lg">
            RM{product.price}
          </p>

          <div className="mt-2">
            <p className="text-gray-600 text-md">Description:</p>
            <p className="text-gray-400 text-md">{product.description}</p>
          </div>

          <div className="mt-2">
            <p className="text-gray-600 text-md">In Stock:</p>
            <p className="text-gray-400 text-md">{product.quantity}</p>
          </div>
        </div>

        {/* quantity selector */}
        <div className=" border-t-2 border-b-2">
          <div className="flex justify-center items-center my-4">
            <button
              className=" hover:bg-gray-200 w-10 h-10 rounded-lg text-gray-500"
              onClick={reduceQuantity}
            >
              -
            </button>
            <p className="text-gray-700 text-md mx-4">{quantity}</p>
            <button
              className=" hover:bg-gray-200 w-10 h-10 rounded-lg text-gray-500"
              onClick={addQuantity}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* button */}
      <button
        className="btn bg-rose-500 text-white hover:bg-rose-600 w-full rounded-md"
        onClick={handleSubmit}
      >
        Add
      </button>
    </div>
  );
};

export default ProductDetail;
