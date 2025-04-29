import { useQuery } from "@tanstack/react-query";
import ProductCard from "../../components/ProductCard";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import Spinner from "../../components/Spinner";
// import { PRODUCT_LISTS } from "../../utils/database/dummyDb";

const HomePage = () => {
  // get all product
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
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

        const res = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
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

  if (isLoading) {
    // return <div>Loading products...</div>;
    return <Spinner />;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="flex flex-col items-center">
      {/* shop details */}
      <div className="flex flex-col items-center bg-rose-500 w-full p-4">
        <figure className="rounded-full w-24 h-24 border-4 border-white overflow-auto">
          <img
            src="/profilepic.png"
            alt=""
            className="object-cover w-full h-full"
          />
        </figure>
        <h1 className="text-white text-xl font-bold my-2">
          MAJEED'S CORPORATED
        </h1>
        <div className="flex flex-row justify-center items-center">
          <MdOutlinePhoneAndroid className="w-4 h-4 text-white" />
          <p className="text-white ml-1">+60123456789</p>
        </div>

        <div className="flex flex-row justify-center items-center">
          <FaLocationDot className="w-4 h-4 text-white" />
          <p className="text-white ml-1">Kuala Lumpur, MY</p>
        </div>
      </div>
      {/* products catalogue */}
      <div className="p-4">
        <h2 className="text-rose-500 text-lg font-semibold my-4">
          Our Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* product card */}
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
