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
    isActive: { type: Boolean, default: true },
    showOnNavigation: { type: Boolean, default: false },
    isFeaturedOnHomePage: { type: Boolean, default: false },
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
    isActive: { type: Boolean, default: true },
    showOnNavigation: { type: Boolean, default: false },
    isFeaturedOnHomePage: { type: Boolean, default: false },
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
    isActive: { type: Boolean, default: true },
    showOnNavigation: { type: Boolean, default: false },
    isFeaturedOnHomePage: { type: Boolean, default: false },
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
