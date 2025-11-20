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
    const { name, slug, isActive, showOnNavigation, isFeaturedOnHomePage } =
      req.body;

    const uploadedFile = req.file ? req.file.filename : null;

    // ❌ Required fields
    if (!name || !slug) {
      if (uploadedFile) {
        fs.unlinkSync(path.join("uploads/categoryImage/", uploadedFile));
      }
      return res.status(400).json({
        success: false,
        message: "Main Category name and slug are required.",
      });
    }

    // ❌ Image required
    if (!uploadedFile) {
      return res.status(400).json({
        success: false,
        message: "Please upload a Category image.",
      });
    }

    // ❌ Duplicate Check (optimized query)
    const existing = await MainCategory.findOne({
      $or: [{ name }, { slug }],
    });

    if (existing) {
      // Delete uploaded image if exists
      fs.unlinkSync(path.join("uploads/categoryImage/", uploadedFile));

      return res.status(400).json({
        success: false,
        error: true,
        message:
          existing.name === name
            ? `The category name "${name}" already exists.`
            : `The slug "${slug}" is already in use.`,
      });
    }

    // Create Main Category
    const newCategory = await MainCategory.create({
      name,
      slug,
      image: `/uploads/categoryImage/${uploadedFile}`,
      isActive,
      isFeaturedOnHomePage,
      showOnNavigation,
    });

    return res.status(200).json({
      success: true,
      error: false,
      mainCategory: newCategory,
      message: `Successfully created "${name}" main category.`,
    });
  } catch (error) {
    // server crash prevent
    console.error(error);

    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Internal Server Error!",
    });
  }
};

//✅ Step 02 : Sub Category Create Controller
export const createSubCategory = async (req, res) => {
  try {
    const {
      name,
      slug,
      mainCategoryId,
      isActive,
      showOnNavigation,
      isFeaturedOnHomePage,
    } = req.body;

    const uploadedFile = req.file ? req.file.filename : null;

    // ❌ Required validation
    if (!name || !slug || !mainCategoryId) {
      if (uploadedFile) {
        fs.unlinkSync(path.join("uploads/subCategoryImage/", uploadedFile));
      }

      return res.status(400).json({
        success: false,
        message: "name, slug & mainCategoryId are required.",
      });
    }

    // ❌ Image required
    if (!uploadedFile) {
      return res.status(400).json({
        success: false,
        message: "Please upload a Sub Category image.",
      });
    }

    // ❌ Check if main category exists
    const category = await MainCategory.findById(mainCategoryId);
    if (!category) {
      fs.unlinkSync(path.join("uploads/subCategoryImage/", uploadedFile));

      return res.status(404).json({
        success: false,
        message: "Main category not found.",
      });
    }

    // ❌ Duplicate Check (optimized)
    const existing = await SubCategory.findOne({
      $or: [{ name }, { slug }],
    });

    if (existing) {
      fs.unlinkSync(path.join("uploads/subCategoryImage/", uploadedFile));

      return res.status(400).json({
        success: false,
        message:
          existing.name === name
            ? `The Sub Category "${name}" already exists.`
            : `The slug "${slug}" already exists.`,
      });
    }

    // Create Sub Category
    const subCategories = await SubCategory.create({
      name,
      slug,
      image: `/uploads/subCategoryImage/${uploadedFile}`,
      mainCategoryId,
      isActive,
      isFeaturedOnHomePage,
      showOnNavigation,
    });

    res.status(201).json({
      success: true,
      error: false,
      data: subCategories,
      message: `Successfully created "${name}" as a Sub Category.`,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Internal Server Error to Create Sub Category!",
    });
  }
};

//✅ Step 03 : Sub Category Create Controller
// export const createChildCategory = async (req, res) => {
//   try {
//     // 1. Extract data from req.body, req.params, or req.query
//     const {
//       name,
//       slug,
//       subCategoryId,
//       isActive,
//       isFeaturedOnHomePage,
//       showOnNavigation,
//     } = req.body;

//     // 2. Perform DB operations or business logic
//     const subCategories = await SubCategory.findById(subCategoryId);
//     const isChildCategoriesExist = await ChildCategory.find();
//     for (let i = 0; i < isChildCategoriesExist.length; i++) {
//       if (isChildCategoriesExist[i].title === title) {
//         return res.status(400).json({
//           message: `This ${title} Category Exist in Databse.`,
//           error: true,
//           success: false,
//         });
//       }
//     }

//     if (!subCategories) {
//       return res.status(404).json({
//         message: "Sub Category Not Found!",
//         error: true,
//         success: false,
//       });
//     }

//     const childCategories = await ChildCategory.create({
//       title,
//       slug,
//       subCategoryId,
//       isActive,
//       isFeaturedOnHomePage,
//       showOnNavigation,
//     });

//     // 3. Send success response
//     return res.status(201).json({
//       success: true,
//       error: false,
//       count: (await ChildCategory.find()).length,
//       childCategory: childCategories,
//       message: `Successfull to Create ${title} Child Category`,
//     });
//   } catch (error) {
//     // Handle errors
//     res.status(500).json({
//       success: false,
//       error: true,
//       message:
//         error.message || "Internal Server Error to Create Child Category!",
//     });
//   }
// };

// ✅ Step 04 : Finally get all categories
export const getAllCategories = async (req, res) => {
  try {
    // Fetch Main and Sub Categories
    const mainCategories = await MainCategory.find().lean();
    const subCategories = await SubCategory.find().lean();

    // Create nested structure (Main → Sub)
    const allCategories = mainCategories.map((mainCat) => {
      const matchedSubCategory = subCategories.filter(
        (subCat) => String(subCat.mainCategoryId) === String(mainCat._id)
      );

      return {
        ...mainCat,
        subCategories: matchedSubCategory,
      };
    });

    if (allCategories.length === 0) {
      return res.status(404).json({
        message: "Not Found any Categories.",
        error: true,
        success: false,
      });
    }

    let activeMainCategoryCount = 0;
    let activeSubCategoryCount = 0;

    if (Array.isArray(mainCategories)) {
      activeMainCategoryCount = mainCategories.filter(
        (main) => main.isActive === true || main.isActive === "true"
      ).length;
      activeSubCategoryCount = subCategories.filter(
        (sub) => sub.isActive === true || sub.isActive === "true"
      ).length;
    }

    const mainCategoriesCount = mainCategories.length;
    const subCategoriesCount = subCategories.length;

    return res.status(200).json({
      success: true,
      error: false,
      mainCategoriesCount,
      subCategoriesCount,
      activeMainCategoryCount,
      activeSubCategoryCount,
      activeCategoryCount: activeMainCategoryCount + activeSubCategoryCount,
      totalCategories: mainCategoriesCount + subCategoriesCount,
      message: "Successfully fetched all categories.",
      allCategories,
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
      // mainCategories.image: "/uploads/categoryImage/abc123.jpg"
      const filePath = path.join(process.cwd(), mainCategories.image); // full path
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // delete file
      }
    }

    if (subCategories.image) {
      // mainCategories.image: "/uploads/categoryImage/abc123.jpg"
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
// export const deleteChildCategory = async (req, res) => {
//   try {
//     const childCategory = await ChildCategory.findById(req.params.id);
//     await ChildCategory.findByIdAndDelete(req.params.id);

//     res.status(200).json({
//       success: true,
//       error: false,
//       message: `Successfull to Delete ${childCategory.name} Category`,
//     });
//   } catch (error) {
//     // Handle errors
//     res.status(500).json({
//       success: false,
//       error: true,
//       message:
//         error.message || "Internal Server Error to Delete Child Category!",
//     });
//   }
// };

//✅ Step 8 : Update Main Category Controller

export const updateMainCategory = async (req, res) => {
  try {
    const { name, slug, isActive, showOnNavigation, isFeaturedOnHomePage } =
      req.body;

    if (!name && !slug && isActive === undefined && !req.file) {
      return res.status(400).json({
        success: false,
        message: "No update field provided.",
      });
    }

    // 1️⃣ Check if category exists
    const mainCategory = await MainCategory.findById(req.params.id);
    if (!mainCategory) {
      return res.status(404).json({
        success: false,
        message: "Main Category not found!",
      });
    }

    const uploadedFile = req.file ? req.file.filename : null;

    // ❌ Duplicate check (excluding current ID)
    if (name || slug) {
      const duplicate = await MainCategory.findOne({
        _id: { $ne: req.params.id },
        $or: [{ name }, { slug }],
      });

      if (duplicate) {
        // Delete uploaded new image (if any)
        if (uploadedFile) {
          fs.unlinkSync(path.join("uploads/categoryImage/", uploadedFile));
        }

        return res.status(400).json({
          success: false,
          message:
            duplicate.name === name
              ? `The name "${name}" already exists.`
              : `The slug "${slug}" already exists.`,
        });
      }
    }

    let newImage = mainCategory.image;

    if (uploadedFile) {
      // Delete old image if exists
      if (mainCategory.image) {
        const oldPath = path.join(
          "uploads/categoryImage/",
          path.basename(mainCategory.image)
        );
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      newImage = `/uploads/categoryImage/${uploadedFile}`;
    }
    // 3️⃣ Prepare dynamic update object
    const updateData = {
      name: name || mainCategory.name,
      slug: slug || mainCategory.slug,
      isActive: isActive !== undefined ? isActive : mainCategory.isActive,
      showOnNavigation:
        showOnNavigation !== undefined
          ? showOnNavigation
          : mainCategory.showOnNavigation,
      isFeaturedOnHomePage:
        isFeaturedOnHomePage !== undefined
          ? isFeaturedOnHomePage
          : mainCategory.isFeaturedOnHomePage,
      image: newImage,
    };

    // 4️⃣ Handle image update

    // 5️⃣ Update category
    const updated = await MainCategory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    // 6️⃣ Response
    res.status(200).json({
      success: true,
      error: false,
      message: `Successfully updated Main Category '${updated.name}'`,
      data: updated,
    });
  } catch (error) {
    console.error(error);

    // Delete uploaded file on error
    if (req.file) {
      const newFile = path.join("uploads/categoryImage/", req.file.filename);
      if (fs.existsSync(newFile)) fs.unlinkSync(newFile);
    }

    res.status(500).json({
      success: false,
      error: true,
      message:
        error.message || "Internal Server Error while updating Main Category!",
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
// export const updateChildCategory = async (req, res) => {
//   try {
//     const { title, slug, isActive, showOnNavigation, isFeaturedOnHomePage } =
//       req.body;
//     const oldChildCategory = await ChildCategory.findById(req.params.id);
//     if (!oldChildCategory) {
//       return res.status(403).json({
//         success: false,
//         message: "Cannot Find Child Category!",
//       });
//     }
//     const updateChildCategory = await ChildCategory.findOneAndUpdate(
//       { _id: req.params.id },
//       { title, slug, isActive, isFeaturedOnHomePage, showOnNavigation },
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       error: false,
//       updateChildCategory,
//       message: `Successfull to Update ${oldChildCategory.title} to ${title} Category`,
//     });
//   } catch (error) {
//     // Handle errors
//     res.status(500).json({
//       success: false,
//       error: true,
//       message: error.message || "Internal Server Error to Update Sub Category!",
//     });
//   }
// };

export const getMainSingleCategory = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(403).json({
        success: false,
        message: "Something Went Wrong!",
      });
    }

    const mainSingleCategory = await MainCategory.findById(req.params.id);
    res.status(201).json({
      success: true,
      mainSingleCategory,
      message: "Successfull to Get Single Solution",
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error to Get Single Solution!",
    });
  }
};

export const getSubSingleCategory = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(403).json({
        success: false,
        message: "Something Went Wrong!",
      });
    }

    const subSingleCategory = await SubCategory.findById(req.params.id);
    res.status(201).json({
      success: true,
      subSingleCategory,
      message: "Successfull to Get Single Solution",
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error to Get Single Solution!",
    });
  }
};
