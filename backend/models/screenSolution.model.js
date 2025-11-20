import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const screenSolutionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    image: { type: String },
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
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

screenSolutionSchema.plugin(mongoosePaginate);

const ScreenSolution = mongoose.model("ScreenSolutions", screenSolutionSchema);
export default ScreenSolution;
