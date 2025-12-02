import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const mainCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    seo: {
      seoTitle: { type: String, default: "" },
      seoDescription: { type: String, default: "" },
      bottomContent: { type: String, default: "" },
      schemaMarkup: { type: String, default: "" },
      canonicalUrl: { type: String, default: "" },
      focusKeywords: [{ type: String }],
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
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    seo: {
      seoTitle: { type: String, default: "" },
      seoDescription: { type: String, default: "" },
      bottomContent: { type: String, default: "" },
      schemaMarkup: { type: String, default: "" },
      canonicalUrl: { type: String, default: "" },
      focusKeywords: [{ type: String }],
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

// const childCategorySchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     slug: {
//       type: String,
//       trim: true,
//       unique: true,
//       default: "",
//     },
//     isActive: { type: Boolean, default: true },
//     showOnNavigation: { type: Boolean, default: false },
//     isFeaturedOnHomePage: { type: Boolean, default: false },
//     subCategoryId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "SubCategory",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

mainCategorySchema.plugin(mongoosePaginate);
subCategorySchema.plugin(mongoosePaginate);

export const MainCategory = mongoose.model("MainCategory", mainCategorySchema);
export const SubCategory = mongoose.model("SubCategory", subCategorySchema);
// export const ChildCategory = mongoose.model(
//   "ChildCategory",
//   childCategorySchema
// );
