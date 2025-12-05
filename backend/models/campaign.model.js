import mongoose from "mongoose";

// Campaign এর জন্য ব্যবহৃত Image Schema
const CampaignThumbnailSchema = new mongoose.Schema(
  {
    large: { type: String, required: true },
    mobile: { type: String, required: true },
    alt: { type: String, required: true },
    link: { type: String },
  },
  { _id: false }
);

// পণ্য অন্তর্ভুক্তির জন্য সাব-স্কিমা (ফিক্সড ডিসকাউন্টের জন্য প্রয়োজনীয়)
// Product ID এবং সেই ক্যাম্পেইনে তার নির্দিষ্ট ডিসকাউন্ট/চূড়ান্ত মূল্য
const CampaignProductDetailsSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    discountValue: { type: Number, default: 0 }, // পণ্যের জন্য নির্দিষ্ট ডিসকাউন্ট (যদি 'fixed' হয়)
    finalPrice: { type: Number, required: true },
  },
  { _id: false }
);

const CampaignSchema = new mongoose.Schema(
  {
    campaignName: { type: String, required: true, trim: true },
    // slug ব্যবহার করা ভালো, এটি permalink-এর জন্য ব্যবহৃত হবে
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },

    // ক্যাম্পেইনের সাধারণ ডিসকাউন্ট পরিমাণ (যেমন 10 বা 500)
    discountAmount: { type: Number, default: 0 },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "finished"],
      default: "inactive",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    // ক্যাম্পেইনের আওতাভুক্ত পণ্যের তালিকা
    products: [CampaignProductDetailsSchema],

    thumbnailImage: { type: CampaignThumbnailSchema, required: true },
  },
  { timestamps: true }
);

const Campaign = mongoose.model("Campaign", CampaignSchema);
export default Campaign;
