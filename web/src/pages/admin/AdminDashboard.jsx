import { useState } from "react";
import Order from "./Order";
import Shop from "./Shop";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* tabs navigation */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 ${
            activeTab === "orders" ? "border-b-2 border-black font-bold" : ""
          }`}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "shop" ? "border-b-2 border-black font-bold" : ""
          }`}
          onClick={() => setActiveTab("shop")}
        >
          Shop
        </button>
      </div>

      {/* tab content */}
      <div className="mt-4">
        {activeTab === "orders" && <Order />}
        {activeTab === "shop" && <Shop />}
      </div>
    </div>
  );
};

export default AdminDashboard;
