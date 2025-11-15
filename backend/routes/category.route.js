import { Router } from "express";
import {
  createChildCategory,
  createMainCategory,
  createSubCategory,
  deleteChildCategory,
  deleteMainCategory,
  deleteSubCategory,
  getAllCategories,
  updateChildCategory,
  updateMainCategory,
  updateSubCategory,
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

categoryRoute.delete("/delete-main-category/:id", deleteMainCategory);

categoryRoute.delete("/delete-sub-category/:id", deleteSubCategory);

categoryRoute.delete("/delete-child-category/:id", deleteChildCategory);

categoryRoute.put(
  "/update-main-category/:id",
  uploadTo("categoryImage").single("image"),
  updateMainCategory
);

categoryRoute.put("/update-sub-category/:id", updateSubCategory);

categoryRoute.put("/update-child-category/:id", updateChildCategory);
export default categoryRoute;
