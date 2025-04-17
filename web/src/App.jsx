import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import ProductDetail from "./pages/product/ProductDetail";
import CartItem from "./pages/cart/CartItem";
import Checkout from "./pages/checkout/Checkout";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import Dashboard from "./pages/admin/Dashboard";
import LoginPage from "./pages/login/LoginPage";
import SignupPage from "./pages/signup/SignupPage";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product-detail/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<CartItem />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
