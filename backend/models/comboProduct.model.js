import mongoose, { Schema } from "mongoose";

const ComboComponentSchema = new Schema(
  {
    productId: { type: String },
    name: { type: String, required: true },
    sku: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    customPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    thumbnail: { type: String },
  },
  { timestamps: true }
);

const ComboSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    slug: { type: String, required: true, unique: true },

    components: { type: [ComboComponentSchema], required: true },

    comboRegularPrice: { type: Number, required: true },
    comboSalePrice: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 },

    limitedTimeOffer: { type: Boolean, default: false },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    tags: { type: [String] },

    visibility: {
      type: String,
      enum: ["Published", "Draft"],
      default: "Published",
    },

    isActive: { type: Boolean, default: true },
    hasFreeShipping: { type: Boolean, default: false },
    type: {
      type: String,
      default: "combo",
    },

    // Image from multer/file upload
    mainImage: { type: String },

    // SEO Fields
    title: String,
    seoDescription: String,
    bottomContent: String,
    schemaMarkup: String,
    canonicalUrl: String,
    focusKeywords: String,
    screenSolution: String,
  },
  { timestamps: true }
);

const ComboProduct = mongoose.model("ComboProduct", ComboSchema);
export default ComboProduct;
