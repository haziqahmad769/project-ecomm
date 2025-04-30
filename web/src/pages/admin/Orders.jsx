import React from "react";
import { ORDER_LISTS } from "../../utils/database/dummyDb";

const Orders = () => {
  return (
    <div className=" flex flex-col items-center p-4">
      <div className="flex flex-col rounded-md card bg-white shadow-lg p-4">
        <h2 className="text-gray-700 text-lg font-semibold my-2">Orders</h2>

        {/* order card */}
        <div className=" grid grid-cols-1 gap-4">
          {ORDER_LISTS.map((order) => (
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
                    {/* <div className="flex flex-col">
                      <p className="text-gray-500 text-sm">Status</p>
                      <p className="text-gray-700 text-md">Preparing</p>
                    </div> */}
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
                      <div className="flex flex-col mt-2">
                        <p className="text-gray-500 text-sm font-semibold">
                          Ordered Products
                        </p>
                        {order.orderedProducts.map((orderedProduct) => (
                          <div className="flex flex-row gap-4">
                            <p className=" text-gray-700 text-md">
                              {orderedProduct.name}
                            </p>

                            <p className=" text-gray-700 text-md">
                              ({orderedProduct.quantity})
                            </p>
                          </div>
                        ))}
                      </div>
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
