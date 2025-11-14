// import cloudinary from "../lib/cloudinary.js";
import HeroSlider from "../models/heroslider.model.js";

export const addHeroSlider = async (req, res) => {
  try {
    const { sliderImage, sliderTitle, sliderLink } = req.body;

    // ✅ Validate input
    if (!sliderImage || !sliderTitle || !sliderLink) {
      return res.status(400).json({
        success: false,
        message: "Please add Slide sliderImage, sliderTitle & sliderLink",
      });
    }

    // let imageUrl = "";

    // if (sliderImage) {
    //   const imageResponse = await cloudinary.uploader.upload(sliderImage);
    //   imageUrl = imageResponse.secure_url;
    // }

    // ✅ Find the last slide based on order
    const lastSlide = await HeroSlider.findOne().sort({ order: -1 });

    // ✅ If no slide exists, order = 1; otherwise, increment
    const nextOrder = lastSlide ? lastSlide.order + 1 : 1;

    // ✅ Create new slide
    const slides = await HeroSlider.create({
      sliderImage,
      sliderTitle,
      sliderLink,
      order: nextOrder,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      slides,
      message: "Successfully added Hero Slider",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "Internal Server Error while adding Hero Slider!",
    });
  }
};

export const deleteHeroSlider = async (req, res) => {
  try {
    const { id } = req.params;

    // const findeSlide = await HeroSlider.findById(id);

    // if (findeSlide.sliderImage) {
    //   const imageUrl = findeSlide.sliderImage;
    //   const urlArr = imageUrl.split("/");
    //   const image = urlArr[urlArr.length - 1];
    //   const imageName = image.split(".")[0];
    //   await cloudinary.uploader.destroy(imageName);
    // }

    // ✅ Delete the target slide
    const deletedSlide = await HeroSlider.findByIdAndDelete(id);

    if (!deletedSlide) {
      return res.status(404).json({
        success: false,
        message: "Slide not found",
      });
    }

    // ✅ Reorder remaining slides
    const slides = await HeroSlider.find().sort({ order: 1 });

    for (let i = 0; i < slides.length; i++) {
      slides[i].order = i + 1; // sequential numbering
      await slides[i].save();
    }

    return res.status(200).json({
      success: true,
      message: "Slide deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error while deleting Hero Slider",
    });
  }
};

// Edit HeroSlider
export const editHeroSlider = async (req, res) => {
  try {
    const { id } = req.params; // Slide ID from URL
    const { sliderImage, sliderTitle, sliderLink, isActive } = req.body;

    // ✅ Find the slide
    const slide = await HeroSlider.findById(id);
    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Slide not found",
      });
    }

    // ✅ Update fields if provided
    if (sliderImage) slide.sliderImage = sliderImage;
    if (sliderTitle) slide.sliderTitle = sliderTitle;
    if (sliderLink) slide.sliderLink = sliderLink;
    if (typeof isActive === "boolean") slide.isActive = isActive;

    // ✅ Save updated slide
    await slide.save();

    return res.status(200).json({
      success: true,
      message: "Slide updated successfully",
      slide,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error while updating Hero Slider",
    });
  }
};

// Get all Hero Sliders
export const getAllHeroSliders = async (req, res) => {
  try {
    // ✅ Fetch all slides, sorted by order ascending
    const slides = await HeroSlider.find().sort({ order: 1 });

    return res.status(200).json({
      success: true,
      count: slides.length,
      slides,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error while fetching Hero Sliders",
    });
  }
};
