import { useState, useEffect } from "react";
import { ORDER_LISTS } from "../../utils/database/dummyDb";

const Order = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders(ORDER_LISTS || []);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders available.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="p-4 bg-white rounded-lg shadow-md"
            >
              <p>
                <strong>Order ID:</strong> {order.orderId}
              </p>
              <p>
                <strong>User Name:</strong> {order.name}
              </p>
              <p>
                <strong>Total Amount:</strong> RM {order.totalAmount}
              </p>
              <p>
                <strong>Status:</strong> {order.paid ? "Paid" : "Unpaid"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;
