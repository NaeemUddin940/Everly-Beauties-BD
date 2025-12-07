import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const simpleProductSchema = new mongoose.Schema(
  {
    // 🟢 Basic Information
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String, default: "" },
    ingredient: { type: String, default: "" },
    usageGuide: { type: String, default: "" },

    // 🟢 Pricing
    regularPrice: { type: Number, required: true },
    salePrice: { type: Number, default: 0 },
    scheduleSale: { type: Boolean, default: false },

    // 🟢 Inventory
    stockQuantity: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    sku: { type: String, unique: true, sparse: true },
    trackStock: { type: Boolean, default: true },
    allowBackorders: { type: Boolean, default: false },

    // 🟢 Product Images
    mainImage: { type: String, default: "" },
    galleryImages: [{ type: String }],

    // 🟢 SEO Content For Category Page
    seo: {
      seoTitle: { type: String, default: "" },
      seoDescription: { type: String, default: "" },
      bottomContent: { type: String, default: "" },
      schemaMarkup: { type: String, default: "" },
      canonicalUrl: { type: String, default: "" },
      focusKeywords: [{ type: String }],
    },

    // 🟢 Organization
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
    },
    skinSolution: {
      type: String,
    },
    tags: [{ type: String }],

    // 🟢 Status
    visibility: {
      type: String,
      enum: ["Published", "Draft"],
      default: "Published",
    },
    type: {
      type: String,
      default: "simple",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

simpleProductSchema.plugin(mongoosePaginate);

const SimpleProduct = mongoose.model("SimpleProduct", simpleProductSchema);
export default SimpleProduct;
