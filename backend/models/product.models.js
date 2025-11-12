import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    regular_price: {
      type: String,
      required: true,
    },
    sale_price: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    permalink: {
      type: String,
      required: true,
    },
    rating_count: {
      type: Number,
      default: 0,
    },
    average_rating: {
      type: Number,
      default: 0,
    },
    categories: {
      type: [String],
      default: [],
    },
    attributes: {
      type: mongoose.Schema.Types.Mixed, // কোনো ধরনের object রাখতে পারবে
      default: {},
    },
  },
  { timestamps: true }
);

// যদি আগেই model তৈরি করা থাকে, তাহলে নতুন করে না বানিয়ে আগেরটাই ব্যবহার করব
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
