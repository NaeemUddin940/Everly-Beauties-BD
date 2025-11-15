import {
  ChildCategory,
  MainCategory,
  SubCategory,
} from "../models/category.model.js";

//✅ Step 01 : Main Category Create And Upload Category Image Controller
export const createMainCategory = async (req, res) => {
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

//✅ Step 02 : Sub Category Create Controller
export const createSubCategory = async (req, res) => {
  try {
    //  Extract data from req.body, req.params, or req.query
    const { title, slug, mainCategoryId } = req.body;

    // Find Category By ID if not found trow error
    const category = await MainCategory.findById(mainCategoryId);
    if (!category)
      return res.status(404).json({ message: "Main category not found" });

    const isExistSubCategories = await SubCategory.find();
    for (let i = 0; i < isExistSubCategories.length; i++) {
      if (isExistSubCategories[i].title === title) {
        return res.status(400).json({
          message: `This ${title} Category Exist in Databse.`,
          error: true,
          success: false,
        });
      }
    }

    // Create Sub Category
    const subCategories = await SubCategory.create({
      title,
      slug,
      mainCategoryId,
    });

    res.status(201).json({
      success: true,
      error: false,
      message: `Successfull to Create ${title} as a Sub Category`,
      data: subCategories,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Internal Server Error to Create Sub-Category!",
    });
  }
};

//✅ Step 03 : Sub Category Create Controller
export const createChildCategory = async (req, res) => {
  try {
    // 1. Extract data from req.body, req.params, or req.query
    const { title, slug, subCategoryId } = req.body;

    // 2. Perform DB operations or business logic
    const subCategories = await SubCategory.findById(subCategoryId);
    const isChildCategoriesExist = await ChildCategory.find();
    for (let i = 0; i < isChildCategoriesExist.length; i++) {
      if (isChildCategoriesExist[i].title === title) {
        return res.status(400).json({
          message: `This ${title} Category Exist in Databse.`,
          error: true,
          success: false,
        });
      }
    }

    if (!subCategories) {
      return res.status(404).json({
        message: "Sub Category Not Found!",
        error: true,
        success: false,
      });
    }

    const childCategories = await ChildCategory.create({
      title,
      slug,
      subCategoryId,
    });

    // 3. Send success response
    return res.status(201).json({
      success: true,
      error: false,
      message: `Successfull to Create ${title} Child Category`,
      childCategory: childCategories,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      error: true,
      message:
        error.message || "Internal Server Error to Create Child Category!",
    });
  }
};
