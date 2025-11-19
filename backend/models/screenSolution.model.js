import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
      unique: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    type: {
      type: String,
      enum: ["standard", "featured"],
      default: "standard",
    },
  },
  { timestamps: true }
);

const Tag = mongoose.model("Tag", tagSchema);
export default Tag;
