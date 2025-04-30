import { useState } from "react";
import Shop from "./Shop";
import Orders from "./Orders";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("shop");
  return (
    <div className=" flex flex-col items-center p-4">
      <div className=" flex flex-col items-center my-4">
        <h2 className=" text-rose-500 text-lg font-semibold">
          Admin Dashboard
        </h2>
        {/* tab navigation */}
        <div className=" flex flex-row">
          <button
            className={`text-gray-700 text-md  px-4 py-2 ${
              activeTab === "shop"
                ? "border-b-2 border-rose-500 text-rose-500"
                : ""
            }`}
            onClick={() => setActiveTab("shop")}
          >
            Shop
          </button>
          <button
            className={`text-gray-700 text-md px-4 py-2 ${
              activeTab === "orders"
                ? "border-b-2 border-rose-500 text-rose-500"
                : ""
            }`}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
        </div>

        {/* tab content */}
        <div className="">
          {activeTab === "shop" && <Shop />}
          {activeTab === "orders" && <Orders />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
