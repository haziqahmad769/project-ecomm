import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const SignupPage = () => {
  // signup
  const { mutate: signup, isPending } = useMutation({
    mutationFn: async ({ name, email, password }) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
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
      toast.success("Account created successfully");
    },
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
  };
  return (
    <div className=" flex flex-col items-center p-4">
      <div className=" flex flex-col my-4">
        <form
          action=""
          className=" flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <div className=" flex flex-col rounded-md card bg-white shadow-lg p-4">
            <h2 className=" text-gray-700 text-lg font-semibold mb-2">
              Signup
            </h2>

            {/* name */}
            <div className="mb-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* email */}
            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* password */}
            <div className="mb-4">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* button */}
            <button className="btn bg-rose-500 text-white hover:bg-rose-600 w-full rounded-md">
              Signup
            </button>
          </div>
        </form>

        {/* signup */}
        <div className=" flex flex-col items-center gap-2 m-2">
          <p className=" text-gray-500 text-md">Already have an account?</p>
          <Link to="/login">
            <button className="btn border-rose-500 text-rose-500 font-light hover:bg-rose-600 w-full hover:text-white hover:font-semibold rounded-md">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
