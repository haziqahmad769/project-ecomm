import { Router } from "express";
import isAuth from "../middlewares/isAuth.js";
import initiatePayment from "../controllers/payment.controller/initiatePayment.js";
import paymentWebhook from "../controllers/payment.controller/paymentWebhook.js";
import paymentStatus from "../controllers/payment.controller/paymentStatus.js";

const paymentRouter = Router();

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return isAuth(req, res, next);
  }
  next();
};

paymentRouter.post("/checkout", optionalAuth, initiatePayment);
paymentRouter.post("/webhook", paymentWebhook);
paymentRouter.get("/status/:order_id", paymentStatus);

export default paymentRouter;
