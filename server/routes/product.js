import { Router } from "express";
import upload from "../middlewares/upload.js";
import createProduct from "../controllers/product.controller/createProduct.js";
import deleteProduct from "../controllers/product.controller/deleteProduct.js";
import updateProduct from "../controllers/product.controller/updateProduct.js";
import getProduct from "../controllers/product.controller/getProduct.js";
import getAllProducts from "../controllers/product.controller/getAllProducts.js";

const productRouter = Router();

productRouter.post("/", upload.single("productImage"), createProduct);
productRouter.delete("/:_id", deleteProduct);
productRouter.put("/:_id", upload.single("productImage"), updateProduct);
productRouter.get("/:_id", getProduct);
productRouter.get("/", getAllProducts);

export default productRouter;
