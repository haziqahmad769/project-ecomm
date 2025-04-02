import { PRODUCT_LISTS } from "../../utils/database/dummyDb";
import ProductCard from "../../components/ProductCard";

const HomePage = ({ addToCart }) => {
  return (
    <div className="flex flex-col items-center">
      {/* shop details */}
      <div className="flex flex-col items-center bg-rose-500 py-6 px-4 shadow-md w-full">
        <figure className="rounded-full overflow-hidden w-24 h-24 border-4 border-white shadow-lg">
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt=""
            className="w-full h-full object-cover"
          />
        </figure>
        <h1 className="text-white text-xl font-semibold mt-3">Shop Name</h1>
        <p className="text-white text-sm">Phone Number</p>
        <p className="text-white text-sm">Location</p>
      </div>

      {/* product catalogue */}
      <div className="w-full max-w-6xl px-4 my-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Our Products
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {PRODUCT_LISTS.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
