import mongoose from "mongoose";

const mainCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      default: "",
    },
    image: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const subCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      default: "",
    },
    mainCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MainCategory",
      required: true,
    },
  },
  { timestamps: true }
);

const childCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      default: "",
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
  },
  { timestamps: true }
);

export const MainCategory = mongoose.model("MainCategory", mainCategorySchema);
export const SubCategory = mongoose.model("SubCategory", subCategorySchema);
export const ChildCategory = mongoose.model(
  "ChildCategory",
  childCategorySchema
);
