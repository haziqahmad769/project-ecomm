import { useSearchParams } from "react-router-dom";
import { ORDER } from "../../utils/database/dummyDb";

const PaymentSucceed = ({ clearCart }) => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  // find order
  const order = orderId == ORDER.OrderId ? ORDER : null;

  // clear cart
  if (order) clearCart();

  if (!order) {
    return <p className="text-center text-red-500">Order not found.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-emerald-400 mb-4">
        Payment Successful!
      </h1>
      <p className="text-gray-600">
        Thank you for your purchase. Below are your order details:
      </p>

      {/* user/ guest details */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-4">
        <h2 className="text-lg font-semibold">Customer Information</h2>
        <p>
          <strong>Name:</strong> {order.name}
        </p>
        <p>
          <strong>Email:</strong> {order.email}
        </p>
        <p>
          <strong>Phone Number:</strong> {order.phoneNumber}
        </p>
        <p>
          <strong>Address:</strong> {order.address}
        </p>
      </div>

      {/* order summary */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-4">
        <h2 className="text-lg font-semibold">Order Summary</h2>
        <p>
          <strong>Order ID:</strong> {order.OrderId}
        </p>
        <p>
          <strong>Total Amount:</strong> RM {order.totalAmount}
        </p>

        {/* ordered products */}
        <div className="mt-4">
          <h3 className="text-md font-semibold">Ordered Products</h3>
          <ul className="space-y-2">
            {order.orderedProducts.map((item) => (
              <li
                key={item._id}
                className="flex items-center justify-between p-2 bg-gray-100 rounded-md"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.productImage}
                    alt={item.name}
                    className="w-12 h-12 rounded-md"
                  />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-600">
                      RM {item.price} x {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-gray-800 font-semibold">
                  RM {item.price * item.quantity}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentSucceed;
