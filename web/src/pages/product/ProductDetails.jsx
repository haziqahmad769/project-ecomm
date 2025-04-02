import { useParams } from "react-router-dom";
import { PRODUCT_LISTS } from "../../utils/database/dummyDb";
import { useState } from "react";

const ProductDetails = ({ addToCart }) => {
  const { productId } = useParams();
  const product = PRODUCT_LISTS.find((item) => item._id === productId);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl text-gray-700">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* product image */}
        <div className="flex justify-center">
          <img
            src={product.productImage}
            alt={product.name}
            className="w-full max-w-md rounded-lg shadow-lg"
          />
        </div>

        {/* product details */}
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <p className="text-xl font-bold">RM {product.price}</p>
          <p className="text-gray-600">
            {product.description || "No description available"}
          </p>
          <p className="text-gray-500">
            <strong>Category:</strong> {product.category || "Uncategorized"}
          </p>
          <p className="text-gray-700">
            <strong>Stock:</strong>{" "}
            {product.quantity > 0 ? (
              <span className="text-emerald-400">
                In Stock ({product.quantity})
              </span>
            ) : (
              <span className="text-rose-400">Out of Stock</span>
            )}
          </p>

          {/* quantity selector & add button */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded-lg">
              <button
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="px-4">{quantity}</span>
              <button
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                onClick={() =>
                  setQuantity(Math.min(product.quantity, quantity + 1))
                }
                disabled={quantity >= product.quantity}
              >
                +
              </button>
            </div>
            <button
              className="btn bg-rose-500 text-white hover:bg-rose-600 transition px-4 py-2 rounded-md"
              onClick={() => addToCart(product, quantity)}
              disabled={product.quantity <= 0}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
