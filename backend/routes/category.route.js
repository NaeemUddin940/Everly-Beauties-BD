import { Router } from "express";
import {
  createChildCategory,
  createMainCategory,
  createSubCategory,
  getAllCategories,
} from "../controllers/category.controller.js";
import { uploadTo } from "../middlewares/fileUpload.js";
import { multerErrorHandler } from "../middlewares/multerErrorHandler.js";

const categoryRoute = Router();

categoryRoute.post(
  "/create-main-category",
  uploadTo("categoryImage").single("image"),
  multerErrorHandler,
  createMainCategory
);

categoryRoute.post("/create-sub-category", createSubCategory);

categoryRoute.post("/create-child-category", createChildCategory);

categoryRoute.get("/get-all-category", getAllCategories);
export default categoryRoute;
