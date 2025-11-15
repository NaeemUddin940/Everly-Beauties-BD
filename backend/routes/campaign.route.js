import { Router } from "express";
import {
  createCampaign,
  editCampaign,
  GetAllCampaign,
} from "../controllers/campaign.controller.js";

const campaignRoute = Router();

campaignRoute.post("/create", createCampaign);
campaignRoute.get("/get", GetAllCampaign);
campaignRoute.put("/edit/:id", editCampaign);

export default campaignRoute;
