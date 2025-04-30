import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

const Shop = () => {
  //create product
  const queryClient = useQueryClient();

  const { mutate: createProduct, isPending } = useMutation({
    mutationFn: async ({ name, quantity, price, productImage, category }) => {
      try {
        const token = localStorage.getItem("jwt");
        const formData = new FormData();

        formData.append("name", name);
        formData.append("quantity", quantity);
        formData.append("price", price);
        formData.append("productImage", productImage);
        formData.append("category", category);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
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
    onSuccess: () => {
      toast.success("Product created");
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      setFormData({
        image: null,
        previewImage: null,
        name: "",
        price: "",
        category: "",
        quantity: "",
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [formData, setFormData] = useState({
    image: null,
    previewImage: null,
    name: "",
    price: "",
    category: "",
    quantity: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        previewImage: URL.createObjectURL(file),
      }));
    }
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    createProduct({
      name: formData.name,
      quantity: formData.quantity,
      price: formData.price,
      productImage: formData.image,
      category: formData.category,
    });
  };
  return (
    <div className=" flex flex-col items-center p-4">
      <div className="flex flex-col rounded-md card bg-white shadow-lg p-4">
        <h2 className="text-gray-700 text-lg font-semibold my-2">Shop</h2>

        {/* product form */}
        <form action="" onSubmit={handleSubmit}>
          {/* product image */}
          <div className="mb-4">
            <label className="text-gray-700 text-md">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded-md"
            />
            {formData.previewImage && (
              <figure className="rounded-lg w-56 h-56 overflow-hidden shadow-lg mt-2">
                <img
                  src={formData.previewImage}
                  alt=""
                  className="object-cover w-full h-full"
                />
              </figure>
            )}
          </div>
          {/* product name */}
          <div className="mb-4">
            <label className="text-gray-700 text-md">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          {/* product price */}
          <div className="mb-4">
            <label className="text-gray-700 text-md">Product Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="RM"
              className="w-full p-2 border rounded"
            />
          </div>
          {/* product category */}
          <div className="mb-4">
            <label className="text-gray-700 text-md">Product Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* product quantity */}
          <div className="mb-4">
            <label className="text-gray-700 text-md">In Stock</label>
            <input
              type="text"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          {/* button */}
          <button className="btn bg-rose-500 text-white hover:bg-rose-600 w-full rounded-md">
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shop;
