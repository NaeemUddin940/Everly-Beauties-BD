import fs from "fs";
import path from "path";
import {
  ChildCategory,
  MainCategory,
  SubCategory,
} from "../models/category.model.js";

//✅ Step 01 : Main Category Create And Upload Category Image Controller
export const createMainCategory = async (req, res) => {
  try {
    //  Extract data from req.body, req.params, or req.query
    const { title, slug, isActive, showOnNavigation, isFeaturedOnHomePage } =
      req.body;
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
      slug,
      image: `./${image.path}`,
      isActive,
      isFeaturedOnHomePage,
      showOnNavigation,
    });
    console.log(mainCategories);
    // Success Status and Message
    res.status(200).json({
      success: true,
      error: false,
      count: (await MainCategory.find()).length,
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
    const {
      title,
      slug,
      mainCategoryId,
      isActive,
      showOnNavigation,
      isFeaturedOnHomePage,
    } = req.body;

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
      isActive,
      isFeaturedOnHomePage,
      showOnNavigation,
    });

    res.status(201).json({
      success: true,
      error: false,
      count: (await SubCategory.find()).length,
      data: subCategories,
      message: `Successfull to Create ${title} as a Sub Category`,
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
    const {
      title,
      slug,
      subCategoryId,
      isActive,
      isFeaturedOnHomePage,
      showOnNavigation,
    } = req.body;

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
      isActive,
      isFeaturedOnHomePage,
      showOnNavigation,
    });

    // 3. Send success response
    return res.status(201).json({
      success: true,
      error: false,
      count: (await ChildCategory.find()).length,
      childCategory: childCategories,
      message: `Successfull to Create ${title} Child Category`,
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

//✅ Step 05 : Delete Main Category And Upload Category Image Controller
export const deleteMainCategory = async (req, res) => {
  try {
    const allMainCategory = await MainCategory.find();
    const mainCategories = await MainCategory.findById(req.params.id);

    if (!mainCategories) {
      return res.status(404).json({
        message: "Main Category Not Found with this id.",
        error: true,
        success: false,
      });
    }

    const subCategories = await SubCategory.find({
      mainCategoryId: req.params.id,
    });

    for (let i = 0; i < subCategories.length; i++) {
      const childCategories = await ChildCategory.find({
        subCategoryId: subCategories[i]._id,
      });

      for (let j = 0; j < childCategories.length; j++) {
        await ChildCategory.findByIdAndDelete(childCategories[j]._id);
      }

      await SubCategory.findByIdAndDelete(subCategories[i]._id);
    }

    // 2️⃣ Delete image from server
    if (mainCategories.image) {
      // mainCategories.image: "/uploads/mainCategoriesImage/abc123.jpg"
      const filePath = path.join(process.cwd(), mainCategories.image); // full path
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // delete file
      }
    }

    await MainCategory.findByIdAndDelete(req.params.id);

    // Get Image url From user query parameter

    res.status(200).json({
      success: true,
      error: false,
      mainCategoryCount: allMainCategory.length - 1 || 0,
      message: `Successfull to Delete ${mainCategories.title} Category`,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      error: true,
      message:
        error.message || `Internal Server Error to Delete Main Category!`,
    });
  }
};

//✅ Step 06 : Delete Sub Category Controller
export const deleteSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);

    const childCategories = await ChildCategory.find({
      subCategoryId: req.params.id,
    });

    for (let j = 0; j < childCategories.length; j++) {
      await ChildCategory.findByIdAndDelete(childCategories[j]._id);
    }

    await SubCategory.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      error: false,
      message: `Successfull to Delete ${subCategory.title} Category`,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Internal Server Error to Delete Sub Category!",
    });
  }
};

//✅ Step 7 : Delete Child Category Controller
export const deleteChildCategory = async (req, res) => {
  try {
    const childCategory = await ChildCategory.findById(req.params.id);
    await ChildCategory.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      error: false,
      message: `Successfull to Delete ${childCategory.name} Category`,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      error: true,
      message:
        error.message || "Internal Server Error to Delete Child Category!",
    });
  }
};

//✅ Step 8 : Update Main Category Controller
export const updateMainCategory = async (req, res) => {
  try {
    const { title, slug, isActive, showOnNavigation, isFeaturedOnHomePage } =
      req.body;

    // 1️⃣ Find existing category
    const mainCategory = await MainCategory.findById(req.params.id);
    if (!mainCategory) {
      return res.status(403).json({
        success: false,
        message: "Cannot Find Main Category!",
      });
    }

    // 2️⃣ Handle image update
    if (req.file) {
      // multer uploaded file
      // delete old image
      if (mainCategory.image) {
        const oldImagePath = path.join(process.cwd(), mainCategory.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // assign new image path
      mainCategory.image = `/uploads/mainCategoriesImage/${req.file.filename}`;
    }

    // 3️⃣ Update other fields if provided
    if (title) mainCategory.title = title;
    if (slug) mainCategory.slug = slug;
    if (isActive !== undefined) mainCategory.isActive = isActive;
    if (showOnNavigation !== undefined)
      mainCategory.showOnNavigation = showOnNavigation;
    if (isFeaturedOnHomePage !== undefined)
      mainCategory.isFeaturedOnHomePage = isFeaturedOnHomePage;

    // 4️⃣ Save updated category
    await mainCategory.save();

    // 5️⃣ Send response
    res.status(200).json({
      success: true,
      error: false,
      message: `Successfully updated category '${mainCategory.title}'`,
      mainCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: true,
      message:
        error.message || "Internal Server Error to Update Main Category!",
    });
  }
};

//✅ Step 9 : Update Sub Category Controller
export const updateSubCategory = async (req, res) => {
  try {
    const { title, slug, isActive, showOnNavigation, isFeaturedOnHomePage } =
      req.body;
    const oldSubCategory = await SubCategory.findById(req.params.id);
    if (!oldSubCategory) {
      return res.status(403).json({
        success: false,
        message: "Cannot Find Sub Category!",
      });
    }
    const updateSubCategory = await SubCategory.findOneAndUpdate(
      { _id: req.params.id },
      { title, slug, isActive, isFeaturedOnHomePage, showOnNavigation },
      { new: true }
    );

    res.status(200).json({
      success: true,
      error: false,
      updateSubCategory,
      message: `Successfull to Update ${oldSubCategory.title} to ${title} Category`,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Internal Server Error to Update Sub Category!",
    });
  }
};

//✅ Step 10 : Update Child Category Controller
export const updateChildCategory = async (req, res) => {
  try {
    const { title, slug, isActive, showOnNavigation, isFeaturedOnHomePage } =
      req.body;
    const oldChildCategory = await ChildCategory.findById(req.params.id);
    if (!oldChildCategory) {
      return res.status(403).json({
        success: false,
        message: "Cannot Find Child Category!",
      });
    }
    const updateChildCategory = await ChildCategory.findOneAndUpdate(
      { _id: req.params.id },
      { title, slug, isActive, isFeaturedOnHomePage, showOnNavigation },
      { new: true }
    );

    res.status(200).json({
      success: true,
      error: false,
      updateChildCategory,
      message: `Successfull to Update ${oldChildCategory.title} to ${title} Category`,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Internal Server Error to Update Sub Category!",
    });
  }
};
