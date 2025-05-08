import { useQuery } from "@tanstack/react-query";
import ProductCard from "../../components/ProductCard";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import Spinner from "../../components/Spinner";
// import { PRODUCT_LISTS } from "../../utils/database/dummyDb";
import { FaApple } from "react-icons/fa";
import { BsAndroid2 } from "react-icons/bs";
import { Link } from "react-router-dom";

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

  const showModal = () => {
    document.getElementById("my_modal_2").showModal();
  };
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

      {/* hero */}
      <div className="hero min-h-72 relative bg-[url(/profilepic.png)] visible sm:hidden">
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content absolute bottom-1">
          <div className="">
            <button
              className="btn btn-outline text-white font-light hover:bg-rose-600 w-full hover:text-white hover:border-none hover:shadow-none rounded-md"
              onClick={showModal}
            >
              Download App
            </button>
          </div>
        </div>
      </div>

      {/* modal */}
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box max-w-72 h-36 flex justify-center items-center">
          <div className=" flex flex-row justify-center items-center gap-4 w-full">
            {/* apple */}
            <Link to="/download/iphone" className="w-full">
              <button className="btn bg-gray-700 text-white hover:bg-gray-500 w-full rounded-md">
                <FaApple />
              </button>
            </Link>

            {/* android */}
            <Link to="/download/android" className="w-full">
              <button className="btn bg-gray-700 text-white hover:bg-gray-500 w-full rounded-md">
                <BsAndroid2 />
              </button>
            </Link>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

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
