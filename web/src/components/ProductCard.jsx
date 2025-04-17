import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
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
        const headers = {
          "Content-Type": "application/json",
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

  if (isPending) {
    return <div>Add to cart...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    addToCart({ product_id: product.id, quantity: 1 });
  };
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center card w-72 md:w-48 rounded-md bg-white shadow-lg p-4">
        <Link to={`/product-detail/${product._id}`}>
          <div>
            {/* image */}
            <figure className="rounded-lg w-36 h-36 ">
              <img
                src={product.productImage}
                alt=""
                className="object-cover w-full h-full"
              />
            </figure>
            {/* details */}
            <div className="my-4">
              <h3 className="text-gray-700 font-semibold text-md">
                {product.name}
              </h3>
              <p className="text-gray-600">RM{product.price}</p>
            </div>
          </div>
        </Link>

        {/* button */}
        <button
          className="btn bg-rose-500 text-white hover:bg-rose-600 w-full rounded-md"
          onClick={handleSubmit}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
