import { Router } from "express";
import {
  createProduct,
  getProducts,
  productCard,
} from "../controllers/products.controller.js";

const productRoute = Router();

productRoute.post("/create-product", createProduct);
productRoute.get("/get-products", getProducts);
productRoute.post("/add-products", productCard);

export default productRoute;
