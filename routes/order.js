import { Router } from "express";
import isAuth from "../middlewares/isAuth.js";
import getOrder from "../controllers/order.controller/getOrder.js";
import getAllOrders from "../controllers/order.controller/getAllOrders.js";

const orderRouter = Router();

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return isAuth(req, res, next);
  }
  next();
};

orderRouter.get("/:order_id", optionalAuth, getOrder);
orderRouter.get("/", isAuth, getAllOrders);

export default orderRouter;
