import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import { databaseInit } from "./database/connectPostgres.js";
import authRouter from "./routes/auth.js";
import productRouter from "./routes/product.js";
import cartRouter from "./routes/cart.js";
import paymentRouter from "./routes/payment.js";
import orderRouter from "./routes/order.js";

const app = express();
const PORT = 8585;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // use cookie-parser before defining routes
app.use("/uploads", express.static("uploads"));
app.use(
  cors({
    origin: process.env.WEB_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

app.get("/helloworld", (req, res) => {
  res.send("<h1>Hello admin!</h1>");
});

app.get("/helloworld-json", (req, res) => {
  res.json({ message: "Hello admin!" });
});

databaseInit();

app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/carts", cartRouter);
app.use("/payments", paymentRouter);
app.use("/orders", orderRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
