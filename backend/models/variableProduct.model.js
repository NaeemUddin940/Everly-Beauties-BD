import mongoose from "mongoose";
const Schema = mongoose.Schema;
import mongoosePaginate from "mongoose-paginate-v2"

// Main Product Schema
const variableProductSchema = new Schema(
  {
    // Basic Info (from your form)
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
    description: String,
    ingredients: String,
    usageGuide: String,

    // Product Type
    type: {
      type: String,
      default: "variable",
    },

    // Attributes (from Attributes Management section)
    attributes: [
      {
        name: String,
        values: [String],
        usedForVariations: {
          type: Boolean,
          default: true,
        },
      },
    ],

    // Variations (from Variations section)
    variations: [
      {
        attributes: {
          type: Map,
          of: String,
        },
        sku: String,
        price: {
          type: Number,
          default: 0,
        },
        stock: {
          type: Number,
          default: 0,
        },
        image: String, // Base64 or URL
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],

    // Images (from Product Image & Gallery sections)
    mainImage: String, // URL from upload
    galleryImages: [String], // Array of URLs

    // Organization (from Organization section)
    categories: [String], // যেমন: ["Makeup shop", "Hair Care Shop"]
    brand: String, // যেমন: "Luxe Beauty"
    tags: [String], // যেমন: ["cosmetics", "makeup", "beauty"]
    screenSolution: String, // যেমন: "Oily Skin"

    // SEO (from SEO Settings section)
    seo: {
      title: String,
      description: String,
      keywords: [String],
      canonicalUrl: String,
      schemaMarkup: String,
      focusKeywords: [String],
    },
    bottomContent: String,

    // Status (from Status section)
    status: {
      type: String,
      enum: ["draft", "published", "hidden"],
      default: "draft",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    visibility: {
      type: String,
      enum: ["published", "draft", "hidden"],
      default: "published",
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for better search performance
variableProductSchema.index({ name: "text", description: "text" });
variableProductSchema.index({ slug: 1 });
variableProductSchema.index({ categories: 1 });
variableProductSchema.index({ brand: 1 });

// Pre-save middleware to auto-generate slug
variableProductSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Auto-set product type based on variations
  if (this.variations && this.variations.length > 0) {
    this.productType = "variable";
  }

  this.updatedAt = Date.now();
  next();
});

variableProductSchema.plugin(mongoosePaginate);

// Create and export model
const VariableProduct = mongoose.model(
  "VariableProduct",
  variableProductSchema
);

export default VariableProduct;
