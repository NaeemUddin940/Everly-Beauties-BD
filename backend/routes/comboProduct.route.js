import { Router } from "express";
import { createComboProduct } from "../controllers/comboProduct.controller.js";
import { uploadTo } from "../middlewares/fileUpload.js";

const comboProductRoute = Router();

comboProductRoute.post(
  "/create",
  uploadTo("comboProductImage").single("image"),
  createComboProduct
);

export default comboProductRoute;
