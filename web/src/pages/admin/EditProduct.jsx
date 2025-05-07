import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const EditProduct = ({ product }) => {
  const queryClient = useQueryClient();

  // update product
  const {
    mutate: updateProduct,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({
      _id,
      productImage,
      name,
      price,
      quantity,
      category,
      description,
    }) => {
      try {
        const token = localStorage.getItem("jwt");
        const guestId = localStorage.getItem("guest_id");

        const headers = {
          "x-guest-id": guestId || "",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const formData = new FormData();

        formData.append("name", name);
        formData.append("quantity", quantity);
        formData.append("price", price);
        formData.append("productImage", productImage);
        formData.append("category", category);
        formData.append("description", description);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/products/${_id}`,
          {
            method: "PUT",
            credentials: "include",
            headers,
            body: formData,
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
      toast.success("Update product");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [formData, setFormData] = useState({
    productImage: null,
    previewImage: null,
    name: "",
    price: "",
    category: "",
    quantity: "",
    description: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        category: product.category || "",
        quantity: product.quantity || "",
        description: product.description || "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        productImage: file,
        previewImage: URL.createObjectURL(file),
      }));
    }
  };

  if (isPending) {
    return <div>Add to cart...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProduct({
      _id: product._id,
      name: formData.name,
      quantity: formData.quantity,
      price: formData.price,
      productImage: formData.productImage,
      category: formData.category,
      description: formData.description,
    });
  };

  return (
    <div className="">
      {/* card */}
      <div className="card rounded-md bg-white shadow-lg my-4 collapse collapse-arrow">
        <input type="checkbox" />

        <div className=" flex flex-row justify-between items-center collapse-title">
          <div className=" flex flex-row justify-center items-center">
            {/* image */}
            <figure className=" rounded-lg w-12 h-12 ">
              <img
                src={product.productImage}
                alt=""
                className="object-cover w-full h-full"
              />
            </figure>

            {/* name */}
            <div className="ml-4">
              <h3 className="text-gray-700 font-semibold text-sm">
                {product.name}
              </h3>
            </div>
          </div>
        </div>

        {/* product editor */}
        <div className=" collapse-content flex flex-col items-center">
          <div className="border-t p-2">
            <form action="" onSubmit={handleSubmit}>
              {/* product image */}
              <div className="mb-4">
                <label className="text-gray-500 text-sm">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-1 border rounded-md"
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
                <label className="text-gray-500 text-sm">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* product price & quantity */}
              <div className="mb-4 flex flex-row justify-between gap-2">
                {/* price */}
                <div className="flex flex-col">
                  <label className="text-gray-500 text-sm">Product Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="RM"
                    className="w-full p-2 border rounded"
                  />
                </div>
                {/* quantity */}
                <div className="flex flex-col">
                  <label className="text-gray-500 text-sm">In Stock</label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>

              {/* product category */}
              <div className="mb-4">
                <label className="text-gray-500 text-sm">
                  Product Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* product description */}
              <div className="mb-4">
                <label className="text-gray-500 text-sm">
                  Product Desription
                </label>
                <textarea
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="textarea w-full p-2 border rounded-md"
                />
              </div>

              {/* button */}
              <button className="btn bg-rose-500 text-white hover:bg-rose-600 w-full rounded-md">
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
