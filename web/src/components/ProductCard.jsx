const ProductCard = ({ product }) => {
  return (
    <div className="card bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl">
      <figure className="flex justify-center items-center h-48 bg-gray-100 ">
        <img
          src={product.productImage}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </figure>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
        <p className="text-sm text-gray-700  mt-1">RM {product.price}</p>
      </div>
      <div className="p-4 flex justify-end">
        <button className="btn bg-rose-500 text-white hover:bg-rose-600 transition px-4 py-2 rounded-md">
          Add
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
