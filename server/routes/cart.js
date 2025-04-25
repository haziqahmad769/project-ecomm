import { Router } from "express";
import isAuth from "../middlewares/isAuth.js";
import addToCart from "../controllers/cart.controller/addToCart.js";
import updateItemQuantity from "../controllers/cart.controller/updateItemQuantity.js";
import deleteItem from "../controllers/cart.controller/deleteItem.js";
import deleteAllItems from "../controllers/cart.controller/deleteAllItems.js";
import getCartItems from "../controllers/cart.controller/getCartItems.js";

const cartRouter = Router();

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return isAuth(req, res, next);
  }

  // Hybrid fallback: check for x-guest-id in headers
  if (!req.cookies.guest_id && req.headers["x-guest-id"]) {
    req.cookies.guest_id = req.headers["x-guest-id"];
  }
  
  next();
};

cartRouter.post("/", optionalAuth, addToCart);
cartRouter.put("/:id", optionalAuth, updateItemQuantity);
cartRouter.delete("/:id", optionalAuth, deleteItem);
cartRouter.delete("/", optionalAuth, deleteAllItems);
cartRouter.get("/", optionalAuth, getCartItems);

export default cartRouter;
