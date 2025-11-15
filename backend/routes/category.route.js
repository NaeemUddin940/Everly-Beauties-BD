import { Router } from "express";
import { createMainCategory, createSubCategory } from "../controllers/category.controller.js";
import { uploadTo } from "../middlewares/fileUpload.js";
import { multerErrorHandler } from "../middlewares/multerErrorHandler.js";

const categoryRoute = Router();

categoryRoute.post(
  "/create-main-category",
  uploadTo("categoryImage").single("image"),
  multerErrorHandler,
  createMainCategory
);

categoryRoute.post("/create-sub-category", createSubCategory)
export default categoryRoute;
