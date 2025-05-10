import React from "react";
import { Link } from "react-router-dom";

const PaymentFailed = () => {
  return (
    <div className=" flex flex-col items-center p-4">
      {/* card */}
      <div className=" flex flex-col rounded-md card bg-white shadow-lg p-6">
        <h2 className=" flex flex-col items-center text-rose-600 text-lg font-semibold">
          Payment Failed
        </h2>
        <p className=" flex flex-col items-center text-gray-700 text-sm mb-4">
          Please checkout again
        </p>

        {/* button */}
        <Link to="/checkout">
          <button className="btn bg-rose-500 text-white hover:bg-rose-600 w-full rounded-md">
            Checkout
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailed;
