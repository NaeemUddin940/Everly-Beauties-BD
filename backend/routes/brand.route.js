import { Router } from "express";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  updateBrand,
} from "../controllers/brand.controller.js";
import { uploadTo } from "../middlewares/fileUpload.js";
import { multerErrorHandler } from "../middlewares/multerErrorHandler.js";
const brandRoute = Router();

brandRoute.post(
  "/create",
  uploadTo("brandImage").single("image"),
  multerErrorHandler,
  createBrand
);

brandRoute.get("/get", getAllBrands);

brandRoute.delete("/delete/:id", deleteBrand);

brandRoute.put(
  "/update/:id",
  uploadTo("brandImage").single("image"),
  multerErrorHandler,
  updateBrand
);

export default brandRoute;
