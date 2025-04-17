import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const Navbar = () => {
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
        const headers = {
          "Content-Type": "application/json",
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

  //get profile
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const token = localStorage.getItem("jwt");
        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/profile`,
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

  if (isLoading) {
    return <div>Loading cart...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex items-center bg-rose-500 p-4">
      <div className="w-full flex flex-row justify-between items-center bg-base-100 rounded-md shadow-lg px-4 py-1">
        {/* logo */}
        <Link to="/">
          <button className="btn btn-ghost text-2xl text-rose-500 font-extrabold">
            M
          </button>
        </Link>

        {/* cart & dropdown */}
        <div className="flex flex-row justify-center items-center">
          {/* cart */}
          <Link to="/cart">
            <button className="btn btn-ghost btn-circle indicator text-gray-700">
              CART
              {cart.totalQuantity > 0 && (
                <span className="badge bg-rose-600 text-white font-light rounded-full badge-sm indicator-item">
                  {cart.totalQuantity}
                </span>
              )}
            </button>
          </Link>

          {/* dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost text-gray-700 ml-4"
            >
              ...
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg mt-2"
            >
              <li>
                <Link to="/login">
                  <span>Login</span>
                </Link>
              </li>

              {authUser?.isAdmin === true && (
                <li>
                  <Link to="/dashboard">
                    <span>Admin Dashsboard</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
