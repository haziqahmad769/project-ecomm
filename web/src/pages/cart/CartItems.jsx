import { FaRegTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CartItems = ({ cart, updateCartQuantity, removeFromCart }) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {cart.items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.product._id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
            >
              {/* product info */}
              <div className="flex items-center space-x-4">
                <img
                  src={item.product.productImage}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-md"
                />
                <div>
                  <h2 className="text-lg font-semibold">{item.product.name}</h2>
                  <p className="text-gray-500">RM {item.product.price}</p>
                </div>
              </div>

              {/* quantity controls */}
              <div className="flex items-center space-x-4">
                <button
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md"
                  onClick={() =>
                    updateCartQuantity(
                      item.product._id,
                      Math.max(1, item.quantity - 1)
                    )
                  }
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md"
                  onClick={() =>
                    updateCartQuantity(
                      item.product._id,
                      Math.min(item.product.quantity, item.quantity + 1)
                    )
                  }
                  disabled={item.quantity >= item.product.quantity}
                >
                  +
                </button>
              </div>

              {/* total price & remove button */}
              <div className="flex items-center space-x-4">
                <p className="text-gray-800 font-semibold">
                  RM {item.totalPrice}
                </p>
                <button
                  className="text-rose-500 hover:text-rose-600"
                  onClick={() => removeFromCart(item.product._id)}
                >
                  <FaRegTrashAlt />
                </button>
              </div>
            </div>
          ))}

          {/* checkout button, total price & quantity */}
          <button
            className="w-full flex justify-between items-center bg-rose-500 text-white py-2 px-4 rounded-md hover:bg-rose-600 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={() => navigate("/checkout")}
            disabled={cart.items.length === 0}
          >
            <span className="text-md">{cart.totalQuantity} items</span>
            <span className="text-lg">Checkout</span>
            <span className="text-md">RM {cart.totalPrice}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CartItems;
