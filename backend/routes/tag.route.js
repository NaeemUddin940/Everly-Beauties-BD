import { Router } from "express";
import {
  createTag,
  deleteTag,
  getAllTags,
  getSingleTag,
  searchTag,
  updateTag,
} from "../controllers/tag.controller.js";
const tagRoute = Router();

tagRoute.post("/create", createTag);
tagRoute.put("/update/:id", updateTag);
tagRoute.delete("/delete/:id", deleteTag);
tagRoute.get("/get", getAllTags);
tagRoute.get("/search", searchTag);
tagRoute.get("/get-single-tag/:id", getSingleTag);

export default tagRoute;
