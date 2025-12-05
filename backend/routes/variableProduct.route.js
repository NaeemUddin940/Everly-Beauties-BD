import { Router } from "express";
import {
  createVariableProduct,
  generateVariations,
  getVariableProduct,
  getVariableProducts,
} from "../controllers/variableProduct.controller.js";
import { uploadVariableProduct } from "../middlewares/fileUpload.js";
import { multerErrorHandler } from "../middlewares/multerErrorHandler.js";

const variableProduct = Router();

// Create variable product with main image
variableProduct.post(
  "/create",
  // use a single multer instance that routes files to folders based on fieldname
  uploadVariableProduct().any(),
  multerErrorHandler,
  createVariableProduct
);

// Generate variations
variableProduct.post("/generate-variations", generateVariations);

// Get all variable products
variableProduct.get("/get", getVariableProducts);

// Get single variable product
variableProduct.get("/:id", getVariableProduct);

export default variableProduct;
