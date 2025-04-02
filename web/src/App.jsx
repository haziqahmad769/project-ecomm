import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import HomePage from "./pages/home/HomePage";
import ProductDetails from "./pages/product/ProductDetails";
import CartItems from "./pages/cart/CartItems";

function App() {
  const [cart, setCart] = useState(() => {
    // load cart from localStorage on first render
    const savedCart = localStorage.getItem("cart");
    return savedCart
      ? JSON.parse(savedCart)
      : { items: [], totalQuantity: 0, totalPrice: 0 };
  });

  // save cart to localStorage when updates
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.items.find(
        (item) => item.product._id === product._id
      );

      const updatedCart = existingItem
        ? {
            ...prevCart,
            items: prevCart.items.map((item) =>
              item.product._id === product._id
                ? {
                    ...item,
                    quantity: item.quantity + quantity,
                    totalPrice: (item.quantity + quantity) * item.product.price,
                  }
                : item
            ),
            totalQuantity: prevCart.totalQuantity + quantity,
            totalPrice: prevCart.totalPrice + product.price * quantity,
          }
        : {
            ...prevCart,
            items: [
              ...prevCart.items,
              { product, quantity, totalPrice: product.price * quantity },
            ],
            totalQuantity: prevCart.totalQuantity + quantity,
            totalPrice: prevCart.totalPrice + product.price * quantity,
          };

      return updatedCart;
    });
  };

  const updateCartQuantity = (productId, newQuantity) => {
    setCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.map((item) =>
        item.product._id === productId
          ? {
              ...item,
              quantity: newQuantity,
              totalPrice: newQuantity * item.product.price,
            }
          : item
      ),
      totalQuantity: prevCart.items.reduce(
        (sum, item) =>
          item.product._id === productId
            ? sum + newQuantity
            : sum + item.quantity,
        0
      ),
      totalPrice: prevCart.items.reduce(
        (sum, item) =>
          item.product._id === productId
            ? sum + newQuantity * item.product.price
            : sum + item.totalPrice,
        0
      ),
    }));
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.items.filter(
        (item) => item.product._id !== productId
      );
      return {
        items: updatedItems,
        totalQuantity: updatedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        ),
        totalPrice: updatedItems.reduce(
          (sum, item) => sum + item.totalPrice,
          0
        ),
      };
    });
  };

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage addToCart={addToCart} />} />
        <Route
          path="/product/:productId"
          element={<ProductDetails addToCart={addToCart} />}
        />
        <Route
          path="/cart"
          element={
            <CartItems
              cart={cart}
              updateCartQuantity={updateCartQuantity}
              removeFromCart={removeFromCart}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
