import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  // login
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: login, isPending } = useMutation({
    mutationFn: async ({ email, password }) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("jwt", data.token);
        } else {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setTimeout(() => {
        navigate("/");
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [formData, setFormData] = useState({
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
    login({
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
            <h2 className=" text-gray-700 text-lg font-semibold mb-2">Login</h2>

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
              Login
            </button>

            {/*  */}
          </div>
        </form>

        {/* signup */}
        <div className=" flex flex-col items-center gap-2 m-2">
          <p className=" text-gray-500 text-md">Don't have an account?</p>
          <Link to="/signup">
            <button className="btn border-rose-500 text-rose-500 font-light hover:bg-rose-600 w-full hover:text-white hover:font-semibold rounded-md">
              Signup
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
