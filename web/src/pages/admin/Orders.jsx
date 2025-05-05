import { useState } from "react";
import { ORDER_LISTS } from "../../utils/database/dummyDb";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Spinner from "../../components/Spinner";
import toast from "react-hot-toast";

const Orders = () => {
  // get all orders
  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["orders"],
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

        const res = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
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

  const [orderStatus, setOrderStatus] = useState({});

  const handleChange = (orderId, value) => {
    setOrderStatus((prev) => ({ ...prev, [orderId]: value }));
  };

  // update status
  const queryClient = useQueryClient();
  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: async ({ orderId, status }) => {
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
          `${import.meta.env.VITE_API_URL}/orders/${orderId}/status`,
          {
            method: "PATCH",
            credentials: "include",
            headers,
            body: JSON.stringify({ status }),
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
    onSuccess: () => {
      toast.success("Update status");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) {
    // return <div>Loading...</div>;
    return <Spinner />;
  }

  if (isPending) {
    return <div>Updating status...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const handleSubmit = (e, orderId) => {
    e.preventDefault();
    updateStatus({
      orderId: orderId,
      status: orderStatus[orderId],
    });
  };

  return (
    <div className=" flex flex-col items-center p-4">
      <div className="flex flex-col rounded-md card bg-white shadow-lg p-4">
        <h2 className="text-gray-700 text-lg font-semibold my-2">Orders</h2>

        {/* order card */}
        <div className=" grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <div className=" flex flex-col items-center">
              <div className=" flex justify-center items-center card rounded-md w-full bg-white shadow-lg p-4">
               
                {/* order title */}
                <div className=" collapse collapse-arrow text-rose-500">
                  <input type="radio" name="my-accordion-2" defaultChecked />
                  <div className="collapse-title flex flex-row flex-wrap justify-between items-start gap-4">
                   
                    {/*  id */}
                    <div className="flex flex-col">
                      <p className="text-gray-500 text-sm">Order ID</p>
                      <p className="text-gray-700 text-md">{order.orderId}</p>
                    </div>

                    {/* paid */}
                    <div className="flex flex-col">
                      <p className="text-gray-500 text-sm">Paid</p>

                      {order.paid === true && (
                        <p className="text-gray-700 text-md">Yes</p>
                      )}
                      {order.paid === false && (
                        <p className="text-gray-700 text-md">No</p>
                      )}
                    </div>

                    {/* status */}
                    <div className="flex flex-col">
                      <p className="text-gray-500 text-sm">Status</p>
                      {/* <p className="text-gray-700 text-md">{order.status}</p> */}

                      {order.status === "Preparing" && (
                        <div className="flex justify-center items-center bg-amber-400 rounded-full">
                          <p className="text-white text-sm font-light px-2">
                            Preparing
                          </p>
                        </div>
                      )}

                      {order.status === "Delivered" && (
                        <div className="flex justify-center items-center bg-emerald-400 rounded-full">
                          <p className="text-white text-sm font-light px-2">
                            Delivered
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* order content */}
                  <div className="collapse-content">
                    <div className="flex flex-col border rounded-md p-2 gap-2">
                      {/* name */}
                      <div className="flex flex-col">
                        <p className="text-gray-500 text-sm font-semibold">
                          Name
                        </p>
                        <p className="text-gray-700 text-md">{order.name}</p>
                      </div>

                      {/* phone number */}
                      <div className="flex flex-col">
                        <p className="text-gray-500 text-sm font-semibold">
                          Phone Number
                        </p>
                        <p className="text-gray-700 text-md">
                          {order.phoneNumber}
                        </p>
                      </div>

                      {/* address */}
                      <div className="flex flex-col">
                        <p className="text-gray-500 text-sm font-semibold">
                          Address
                        </p>
                        <p className=" text-gray-700 text-md">
                          {order.address}
                        </p>
                      </div>

                      {/* ordered products */}
                      {order.paid === true && (
                        <div className="flex flex-col mt-2">
                          <p className="text-gray-500 text-sm font-semibold">
                            Ordered Products
                          </p>
                          {order.orderedProducts.map((orderedProduct) => (
                            <div className="flex flex-row gap-4">
                              <p className=" text-rose-500 text-md">
                                {orderedProduct.name}
                              </p>

                              <p className=" text-rose-500 text-md">
                                ({orderedProduct.quantity})
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* update status */}
                      {order.paid === true && (
                        <form
                          action=""
                          onSubmit={(e) => handleSubmit(e, order.orderId)}
                        >
                          {/* status */}
                          <div className="flex flex-col mb-2">
                            <label className="text-gray-500 text-sm font-semibold">
                              Status
                            </label>
                            <select
                              className="select select-bordered w-full"
                              value={orderStatus[order.orderId] || order.status}
                              onChange={(e) => {
                                handleChange(order.orderId, e.target.value);
                              }}
                            >
                              <option disabled selected>
                                Paid
                              </option>
                              <option value="Preparing">Preparing</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </div>

                          {/* button */}
                          <button className="btn bg-rose-500 text-white hover:bg-rose-600 w-full rounded-md">
                            Save
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
