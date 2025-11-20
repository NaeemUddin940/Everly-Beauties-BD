import { Router } from "express";
import {
  createScreenSolution,
  deleteScreenSolution,
  getAllScreenSolutions,
  getSingleScreenSolution,
  updateScreenSolution,
} from "../controllers/screenSolution.controller.js";
import { uploadTo } from "../middlewares/fileUpload.js";
import { multerErrorHandler } from "../middlewares/multerErrorHandler.js";

const screenSolutionRoute = Router();

screenSolutionRoute.post(
  "/create",
  uploadTo("screenSolutionImage").single("image"),
  multerErrorHandler,

  createScreenSolution
);

screenSolutionRoute.get("/get", getAllScreenSolutions);

screenSolutionRoute.delete("/delete/:id", deleteScreenSolution);

screenSolutionRoute.get("/get-single-solution/:id", getSingleScreenSolution);

screenSolutionRoute.put(
  "/update/:id",
  uploadTo("screenSolutionImage").single("image"),
  multerErrorHandler,
  updateScreenSolution
);
export default screenSolutionRoute;
