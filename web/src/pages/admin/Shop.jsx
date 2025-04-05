import { useState } from "react";

const Shop = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    productImage: null,
    previewImage: null,
  });
  const [products, setProducts] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct((prev) => ({
        ...prev,
        productImage: file,
        previewImage: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, price, productImage, previewImage } = product;
    if (name && price && productImage) {
      setProducts([
        ...products,
        {
          name,
          price,
          productImage: previewImage, // just for preview
        },
      ]);
      setProduct({
        name: "",
        price: "",
        productImage: null,
        previewImage: null,
      });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Shop Management</h2>

      {/* product form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded"
        />
        {product.previewImage && (
          <img
            src={product.previewImage}
            alt="Preview"
            className="w-24 h-24 object-cover rounded"
          />
        )}
        <button
          type="submit"
          className="w-full bg-rose-500 text-white hover:bg-rose-600 transition py-2 rounded-md"
        >
          Add Product
        </button>
      </form>

      {/* product list */}
      <h3 className="text-lg font-semibold mb-3">Created Products</h3>
      <div className="space-y-4">
        {products.map((prod, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow-md">
            <p>
              <strong>Name:</strong> {prod.name}
            </p>
            <p>
              <strong>Price:</strong> RM {prod.price}
            </p>
            <img
              src={prod.productImage}
              alt={prod.name}
              className="w-20 h-20 object-cover mt-2 rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
