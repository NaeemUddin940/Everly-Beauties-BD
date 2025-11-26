import mongoose from "mongoose";

const simpleProductSchema = new mongoose.Schema(
  {
    // 🟢 Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    ingredient: {
      type: String,
      default: "",
    },
    usageGuide: {
      type: String,
      default: "",
    },

    // 🟢 Pricing
    regularPrice: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
      default: 0,
    },
    scheduleSale: {
      type: Boolean,
      default: false,
    },

    // 🟢 Inventory
    stockQuantity: {
      type: Number,
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    trackStock: {
      type: Boolean,
      default: true,
    },
    allowBackorders: {
      type: Boolean,
      default: false,
    },

    // 🟢 Product Images
    productImage: {
      type: String, // URL
      default: "",
    },
    galleryImages: [
      {
        type: String, // URL list
      },
    ],

    // 🟢 SEO Content For Category Page
    seo: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      bottomContent: { type: String, default: "" },
      schemaMarkup: { type: String, default: "" },
      canonicalUrl: { type: String, default: "" },
      focusKeywords: [{ type: String }],
    },

    // 🟢 Organization
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    skinSolution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SkinSolution",
    },
    tags: [{ type: String }],

    // 🟢 Status
    visibility: {
      type: String,
      enum: ["Published", "Draft"],
      default: "Published",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const SimpleProduct = mongoose.model("SimpleProduct", simpleProductSchema);
export default SimpleProduct;
