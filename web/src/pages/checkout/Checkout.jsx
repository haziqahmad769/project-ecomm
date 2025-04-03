import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const countryCodes = ["+60", "+65", "+66", "+62"];

const Checkout = ({ cart, user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    countryCode: "+60",
    addressLine1: "",
    addressLine2: "",
    postcode: "",
    city: "",
    state: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        countryCode: user.phone ? user.phone.slice(0, 3) : "+60",
        addressLine1: user.address?.split(", ")[0] || "",
        addressLine2: user.address?.split(", ")[1] || "",
        postcode: user.address?.split(", ")[2] || "",
        city: user.address?.split(", ")[3] || "",
        state: user.address?.split(", ")[4] || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fullAddress = `${formData.addressLine1}, ${formData.addressLine2}, ${formData.postcode}, ${formData.city}, ${formData.state}`;

    const orderDetails = {
      name: formData.name,
      phone: `${formData.countryCode}${formData.phone}`,
      address: fullAddress,
      email: formData.email,
      cart,
    };

    console.log("Order Details:", orderDetails); //check order details

    navigate("/payment");
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {/* checkout form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <div className="flex">
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              className="p-2 border rounded-l-md bg-gray-100"
            >
              {countryCodes.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-r-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* address fields */}
        <div>
          <label className="block text-sm font-medium">Address</label>
          <input
            type="text"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            required
            placeholder="Address Line 1"
            className="w-full p-2 border rounded-md mb-2"
          />
          <input
            type="text"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
            required
            placeholder="Address Line 2"
            className="w-full p-2 border rounded-md mb-2"
          />
          <input
            type="text"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            required
            placeholder="Postcode"
            className="w-full p-2 border rounded-md mb-2"
          />
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            placeholder="City"
            className="w-full p-2 border rounded-md mb-2"
          />
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            placeholder="State"
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* order summary */}
        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          {cart.items.map((item) => (
            <div
              key={item.product._id}
              className="flex justify-between text-sm mb-1"
            >
              <span>
                {item.quantity} X {item.product.name}
              </span>
              <span>RM {item.totalPrice}</span>
            </div>
          ))}
          <hr className="my-2" />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>RM {cart.totalPrice}</span>
          </div>
        </div>

        {/* checkout button */}
        <button
          type="submit"
          className="w-full bg-rose-500 text-white hover:bg-rose-600 transition py-2 rounded-md"
        >
          Place order & Pay
        </button>
      </form>
    </div>
  );
};

export default Checkout;
