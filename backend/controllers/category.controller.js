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



// ✅ Step 04 : Finally get all categories
export const getAllCategories = async (req, res) => {
  try {
    // Main and sub and Child Category get from Database
    const mainCategories = await MainCategory.find().lean();
    const subCategories = await SubCategory.find().lean();
    const childCategories = await ChildCategory.find().lean();

    // Make Nested like MainCategory => SubCategory => ChildCategory
    const getAllCategories = mainCategories.map((mainCat) => {
      // Filter Sub Category using mainCategoryId
      const matchedSubCategory = subCategories.filter(
        (subCat) => String(subCat.mainCategoryId) === String(mainCat._id)
      );

      // 🟢 প্রতিটি subCategory এর childCategories filter করা
      const subWithChild = matchedSubCategory.map((subCat) => {
        const matchChildCategory = childCategories.filter(
          (childCat) => String(childCat.subCategoryId) === String(subCat._id)
        );
        return { ...subCat, childCategories: matchChildCategory };
      });

      // 🟢 mainCategory object এর সাথে nested subCategory ও childCategory attach করা
      return { ...mainCat, subCategories: subWithChild };
    });

    if (getAllCategories.length <= 0) {
      return res.status(404).json({
        message: "Not Found any Categories.",
        error: true,
        success: false,
      });
    }

    // ✅ Response পাঠানো
    return res.status(200).json({
      success: true,
      error: false,
      message: "Successfully fetched all categories.",
      mainCategories: getAllCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Internal Server Error to Get All Category.",
    });
  }
};