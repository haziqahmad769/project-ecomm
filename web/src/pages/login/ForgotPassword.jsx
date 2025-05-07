import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  // forgot password
  const { mutate: forgotPassword, isPending } = useMutation({
    mutationFn: async ({ email }) => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Check your email");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    forgotPassword({
      email: email,
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
              Reset Password
            </h2>

            {/* email */}
            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            {/* button */}
            <button className="btn bg-rose-500 text-white hover:bg-rose-600 w-full rounded-md">
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
