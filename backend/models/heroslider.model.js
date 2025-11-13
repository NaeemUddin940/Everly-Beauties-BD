// models/Slide.js
import mongoose from "mongoose";

const SlideSchema = new mongoose.Schema(
  {
    sliderImage: { type: String, required: true },
    sliderTitle: { type: String, required: true },
    sliderLink: { type: String, required: true },
    order: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

const HeroSlider = mongoose.model("HeroSlider", SlideSchema);

export default HeroSlider;
