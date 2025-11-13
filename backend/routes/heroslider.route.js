import { Router } from "express";
import {
  addHeroSlider,
  deleteHeroSlider,
  editHeroSlider,
  getAllHeroSliders,
} from "../controllers/heroslider.controller.js";

const heroSliderRoute = Router();

heroSliderRoute.post("/add", addHeroSlider);
heroSliderRoute.delete("/delete/:id", deleteHeroSlider);
heroSliderRoute.put("/edit/:id", editHeroSlider);
heroSliderRoute.get("/get", getAllHeroSliders);

export default heroSliderRoute;
