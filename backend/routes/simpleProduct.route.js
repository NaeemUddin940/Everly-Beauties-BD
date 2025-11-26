import { Router } from "express";
import {
  createSimpleProduct,
  deleteSimpleProduct,
  getSimpleAllProduct,
  updateSimpleProduct,
} from "../controllers/simpleProduct.controller.js";
import { uploadTo } from "../middlewares/fileUpload.js";
import { validationHandler } from "../middlewares/validationHandler.js";
import { simpleProductValidation } from "../validations/simpleProductValidation.js";

const productRoute = Router();

productRoute.post(
  "/create-product",
  uploadTo("SimpleProductImage").fields([
    { name: "productImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
  ]),
  simpleProductValidation,
  validationHandler,
  createSimpleProduct
);

productRoute.delete("/delete-product/:productId", deleteSimpleProduct);

productRoute.put(
  "/update-product/:productId",
  uploadTo("SimpleProductImage").fields([
    { name: "productImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
  ]),
  simpleProductValidation,
  validationHandler,
  updateSimpleProduct
);

productRoute.get("/get-all-simple-product", getSimpleAllProduct);

export default productRoute;
