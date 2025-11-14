import mongoose from "mongoose";

const CampaignThumbnailSchema = new mongoose.Schema(
  {
    large: { type: String, required: true },
    mobile: { type: String, required: true },
    alt: { type: String, required: true },
    link: { type: String }, // optional
  },
  { _id: false }
);

const CampaignSchema = new mongoose.Schema(
  {
    campaignName: { type: String, required: true, trim: true },
    permalink: { type: String, required: true, trim: true },
    endDate: { type: Date, required: true },
    thumbnailImage: { type: CampaignThumbnailSchema, required: true },
  },
  { timestamps: true }
);

const Campaign = mongoose.model("Campaign", CampaignSchema);
export default Campaign;
