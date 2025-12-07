import { Router } from "express";
import {
  createSimpleProduct,
  deleteSimpleProduct,
  getSimpleAllProduct,
  getSingleProductById,
  getSingleProductBySlug,
  updateSimpleProduct,
} from "../controllers/simpleProduct.controller.js";
import { uploadTo } from "../middlewares/fileUpload.js";
import { multerErrorHandler } from "../middlewares/multerErrorHandler.js";
import { validationHandler } from "../middlewares/validationHandler.js";
import { simpleProductValidation } from "../validations/simpleProductValidation.js";

const productRoute = Router();

productRoute.post(
  "/create-product",
  uploadTo("SimpleProductImage").fields([
    { name: "mainImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
  ]),
  multerErrorHandler,
  simpleProductValidation,
  validationHandler,
  createSimpleProduct
);

productRoute.delete("/delete-product/:productId", deleteSimpleProduct);

productRoute.put(
  "/update-product/:productId",
  uploadTo("SimpleProductImage").fields([
    { name: "mainImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
  ]),
  multerErrorHandler,
  simpleProductValidation,
  validationHandler,
  updateSimpleProduct
);

productRoute.get("/get-all-simple-product", getSimpleAllProduct);
productRoute.get("/get-single-simple-product/:productId", getSingleProductById);
productRoute.get(
  "/get-single-simple-product-by-slug/:slug",
  getSingleProductBySlug
);

export default productRoute;
