import { Router } from "express";
import {
  createComboProduct,
  editComboProduct,
  getAllComboProduct,
  getComboProductById,
} from "../controllers/comboProduct.controller.js";
import { uploadTo } from "../middlewares/fileUpload.js";
import { multerErrorHandler } from "../middlewares/multerErrorHandler.js";

const comboProductRoute = Router();

comboProductRoute.post(
  "/create",
  uploadTo("comboProductImage").single("mainImage"),
  createComboProduct
);

comboProductRoute.get("/get", getAllComboProduct);

comboProductRoute.put(
  "/update/:id",
  uploadTo("comboProductImage").single("mainImage"),
  multerErrorHandler,
  editComboProduct
);

comboProductRoute.get("/getById/:id", getComboProductById);
export default comboProductRoute;
