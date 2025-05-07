import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  // reset password
  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: async ({ newPassword, confirmPassword }) => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ newPassword, confirmPassword }),
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
      toast.success("Password reset sucessfully");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
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
    resetPassword({
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
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
              Update Password
            </h2>

            {/* password */}
            <div className="mb-4">
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            {/* confirm password */}
            <div className="mb-4">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            {/* button */}
            <button className="btn bg-rose-500 text-white hover:bg-rose-600 w-full rounded-md">
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
