// models/Product.js
import mongoose from "mongoose";

// variation schema (optional nested object)
const VariationSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String },
    value: { type: String },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    mainImage: { type: String, required: true },
    productName: { type: String, required: true },
    brands: { type: String }, // একাধিক brand থাকলে Array করতে পারো
    price: { type: Number, required: true },
    regularPrice: { type: Number },
    campaignName: { type: String },
    variations: [VariationSchema],
    rating: { type: Number, min: 0, max: 5, default: 0 },
    hasFreeShipping: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite on dev
const ProductCard = mongoose.model("ProductCard", productSchema);

export default ProductCard;
