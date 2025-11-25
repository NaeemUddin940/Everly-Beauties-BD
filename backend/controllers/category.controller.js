import fs from "fs";
import path from "path";
import { MainCategory, SubCategory } from "../models/category.model.js";

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
      message: `Successfully created main category.`,
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
            ? `The Sub Category already exists.`
            : `The slug already exists.`,
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
      message: `Successfully created Sub Category.`,
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
    // Query Params → page, limit
    let { page = 1, limit = 10 } = req.query;
    page = Number(page);
    limit = Number(limit);

    // 1️⃣ Main Category Pagination + Sort
    const mainPaginated = await MainCategory.paginate(
      {},
      {
        page,
        limit,
        sort: { createdAt: -1 },
        lean: true,
      }
    );

    // 2️⃣ Fetch all SubCategories (not paginated)
    const subCategories = await SubCategory.find().lean();

    // 3️⃣ Attach SubCategories + Count
    const allCategories = mainPaginated.docs.map((mainCat) => {
      const matchedSubCategory = subCategories.filter(
        (subCat) => String(subCat.mainCategoryId) === String(mainCat._id)
      );

      return {
        ...mainCat,
        subCategories: matchedSubCategory,
        subCategoryCount: matchedSubCategory.length,
      };
    });

    // 4️⃣ TOTAL COUNTS
    const allMain = await MainCategory.countDocuments();
    const allSub = await SubCategory.countDocuments();

    const activeMainCategoryCount = await MainCategory.countDocuments({
      isActive: true,
    });
    const activeSubCategoryCount = await SubCategory.countDocuments({
      isActive: true,
    });

    return res.status(200).json({
      success: true,
      error: false,

      // Pagination Info
      pagination: {
        totalMainCategories: mainPaginated.totalDocs,
        totalPages: mainPaginated.totalPages,
        currentPage: mainPaginated.page,
        limit: mainPaginated.limit,
        hasNextPage: mainPaginated.hasNextPage,
        hasPrevPage: mainPaginated.hasPrevPage,
        nextPage: mainPaginated.nextPage,
        prevPage: mainPaginated.prevPage,
      },

      // 👉 Final Category List (Correct)
      categories: allCategories,

      // 👉 Correct Counts
      mainCategoriesCount: allMain,
      subCategoriesCount: allSub,
      totalCategories: allMain + allSub,

      activeMainCategoryCount,
      activeSubCategoryCount,
      activeCategoryCount: activeMainCategoryCount + activeSubCategoryCount,

      message: "Successfully fetched all categories.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Internal Server Error to Get All Category.",
    });
  }
};

//✅ Step 04 : Delete Main Category And Upload Category Image Controller
export const deleteMainCategory = async (req, res) => {
  try {
    const mainCategory = await MainCategory.findById(req.params.id);

    if (!mainCategory) {
      return res.status(404).json({
        message: "Main Category Not Found with this id.",
        error: true,
        success: false,
      });
    }

    // 1️⃣ Find all sub categories under this main category
    const subCategories = await SubCategory.find({
      mainCategoryId: req.params.id,
    });

    // 2️⃣ Delete all Sub Category Images + Records
    for (const sub of subCategories) {
      // Delete sub category image if exists
      if (sub.image) {
        const filePath = path.join(process.cwd(), sub.image);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      // Delete sub category record
      await SubCategory.findByIdAndDelete(sub._id);
    }

    // 3️⃣ Delete Main Category Image
    if (mainCategory.image) {
      const filePath = path.join(process.cwd(), mainCategory.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // 4️⃣ Delete Main Category
    await MainCategory.findByIdAndDelete(req.params.id);

    const totalMainCategories = await MainCategory.countDocuments();

    return res.status(200).json({
      success: true,
      error: false,
      mainCategoryCount: totalMainCategories,
      message: `Successfully deleted Main and All Sub category.`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message:
        error.message || "Internal Server Error to Delete Main Category.",
    });
  }
};

//✅ Step 05 : Delete Sub Category Controller
export const deleteSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);

    await SubCategory.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      error: false,
      message: `Successfull to Delete Sub Category`,
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

//✅ Step 06 : Update Main Category Controller
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
      message: `Successfully updated Main Category`,
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

//✅ Step 07 : Update Sub Category Controller

export const updateSubCategory = async (req, res) => {
  try {
    const {
      name,
      slug,
      isActive,
      showOnNavigation,
      isFeaturedOnHomePage,
      mainCategoryId,
    } = req.body;

    // 0️⃣ No field provided
    if (!name && !slug && isActive === undefined && !req.file) {
      return res.status(400).json({
        success: false,
        message: "No update field provided.",
      });
    }

    // 1️⃣ Check Sub Category exists
    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "Sub Category not found!",
      });
    }

    // 2️⃣ Duplicate check (exclude current)
    if (name || slug) {
      const duplicate = await SubCategory.findOne({
        _id: { $ne: req.params.id },
        $or: [{ name }, { slug }],
      });

      if (duplicate) {
        // remove uploaded new image
        if (req.file) {
          fs.unlinkSync(
            path.join("uploads/subCategoryImage/", req.file.filename)
          );
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

    // 3️⃣ Handle Image Upload
    const uploadedFile = req.file ? req.file.filename : null;

    let newImage = subCategory.image;

    if (uploadedFile) {
      // Delete old image if exists
      if (subCategory.image) {
        const oldImgPath = path.join(
          "uploads/subCategoryImage/",
          path.basename(subCategory.image)
        );
        if (fs.existsSync(oldImgPath)) fs.unlinkSync(oldImgPath);
      }

      newImage = `/uploads/subCategoryImage/${uploadedFile}`;
    }

    // 4️⃣ Prepare Update Object
    const updateData = {
      name: name || subCategory.name,
      slug: slug || subCategory.slug,
      isActive: isActive !== undefined ? isActive : subCategory.isActive,
      showOnNavigation:
        showOnNavigation !== undefined
          ? showOnNavigation
          : subCategory.showOnNavigation,
      isFeaturedOnHomePage:
        isFeaturedOnHomePage !== undefined
          ? isFeaturedOnHomePage
          : subCategory.isFeaturedOnHomePage,
      mainCategoryId: mainCategoryId || subCategory.mainCategoryId, // ✔ important
      image: newImage,
    };

    // 5️⃣ Update Sub Category
    const updated = await SubCategory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      error: false,
      data: updated,
      message: `Successfully updated Sub Category`,
    });
  } catch (error) {
    console.error(error);

    // Delete uploaded image if operation fails
    if (req.file) {
      const newFile = path.join("uploads/subCategoryImage/", req.file.filename);
      if (fs.existsSync(newFile)) fs.unlinkSync(newFile);
    }

    return res.status(500).json({
      success: false,
      error: true,
      message:
        error.message || "Internal Server Error while updating Sub Category!",
    });
  }
};

//✅ Step 08 : Get Main Single Category Controller
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

//✅ Step 09 : Get Sub Single Category Controller
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
