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
import ForgotPassword from "./pages/login/ForgotPassword";
import ResetPassword from "./pages/login/ResetPassword";
import Apple from "./pages/download/Apple";
import Android from "./pages/download/Android";
import PaymentResult from "./pages/payment/PaymentResult";
import PaymentFailed from "./pages/payment/PaymentFailed";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product-detail/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<CartItem />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-result" element={<PaymentResult />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/download/iphone" element={<Apple />} />
        <Route path="/download/android" element={<Android />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
