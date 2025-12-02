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
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number },
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
    discountType: { type: String, enum: ["percentage", "fixed"] },
    startDate: { type: Date },
    permalink: { type: String, required: true, trim: true },
    endDate: { type: Date, required: true },
    thumbnailImage: { type: CampaignThumbnailSchema, required: true },
  },
  { timestamps: true }
);

const Campaign = mongoose.model("Campaign", CampaignSchema);
export default Campaign;
