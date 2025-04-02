import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import ProductDetails from "./pages/product/ProductDetails";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
      </Routes>
    </div>
  );
}

export default App;
