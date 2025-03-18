import express from "express";
import "dotenv/config";
import { databaseInit } from "./database/connectPostgres.js";
import authRouter from "./routes/auth.js";
import productRouter from "./routes/product.js";

const app = express();
const PORT = 8585;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.get("/helloworld", (req, res) => {
  res.send("<h1>Hello admin!</h1>");
});

app.get("/helloworld-json", (req, res) => {
  res.json({ message: "Hello admin!" });
});

databaseInit();

app.use("/auth", authRouter);
app.use("/products", productRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
