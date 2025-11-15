import { MainCategory } from "../models/category.model.js";

export const mainCreateCategory = async (req, res) => {
  try {
    //  Extract data from req.body, req.params, or req.query
    const { title, slug } = req.body;
    const image = req.file;

    const mainCategories = await MainCategory.find();
    for (let i = 0; i < mainCategories.length; i++) {
      if (mainCategories[i].title === title) {
        return res.status(400).json({
          message: `This ${title} Category Already Exist in Databse.`,
          error: true,
          success: false,
        });
      }
    }

    // Create Main Category and Save it on MongoDb
    const categories = await MainCategory.create({
      title,
      image: `./${image.path}`,
      //   title.toLowerCase().replace(/\s+/g, "-")
      slug,
    });

    // Success Status and Message
    res.status(200).json({
      success: true,
      error: false,
      mainCategory: categories,
      message: `Successfull to Create ${title} Main Category`,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      error: true,
      message:
        error.message || "Internal Server Error to Create Main Category!",
    });
  }
};
