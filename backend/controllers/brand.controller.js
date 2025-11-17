import fs from "fs";
import path from "path";
import Brand from "../models/brand.model.js";

export const createBrand = async (req, res) => {
  try {
    const { name, slug, description, isActive, isPremium, isFeatured } =
      req.body;
    const image = req.file;

    // ❌ Required fields
    if (!name || !slug || !description) {
      if (image) {
        fs.unlinkSync(path.join("uploads/brandImage/", image.filename));
      }
      return res.status(400).json({
        success: false,
        message: "Brand name, slug and description are required.",
      });
    }

    // ❌ Duplicate check
    const existingBrand = await Brand.findOne({ $or: [{ name }, { slug }] });
    if (existingBrand) {
      if (image) {
        fs.unlinkSync(path.join("uploads/brandImage/", image.filename));
      }

      return res.status(400).json({
        success: false,
        message:
          existingBrand.name === name
            ? `The brand name "${name}" already exists.`
            : `The slug "${slug}" already exists.`,
      });
    }

    // ❌ File check
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Please select a brand image.",
      });
    }

    // ✅ Create brand
    const newBrand = await Brand.create({
      name,
      slug,
      description,
      image: `/uploads/brandImage/${image.filename}`,
      isActive,
      isPremium,
      isFeatured,
    });

    res.status(201).json({
      success: true,
      message: "Brand created successfully",
      newBrand,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getAllBrands = async (req, res) => {
  try {
    const allBrands = await Brand.find().sort({ createdAt: -1 });
    const activeBrands = allBrands.filter((brand) => brand.isActive).length;
    const premiumBrands = allBrands.filter((brand) => brand.isPremium).length;
    const featuredBrands = allBrands.filter((brand) => brand.isFeatured).length;

    res.status(200).json({
      success: true,
      totalBrands: allBrands.length,
      activeBrands,
      premiumBrands,
      featuredBrands,
      allBrands,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const { name, slug, description, isActive, isPremium, isFeatured } =
      req.body;

    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found.",
      });
    }

    // Check duplicate name or slug excluding current brand
    const duplicateBrand = await Brand.findOne({
      $or: [{ name }, { slug }],
      _id: { $ne: brand._id },
    });

    if (duplicateBrand) {
      return res.status(400).json({
        success: false,
        message:
          duplicateBrand.name === name
            ? `Brand name "${name}" already exists.`
            : `Slug "${slug}" already exists.`,
      });
    }

    // Handle new image upload
    if (req.file) {
      // delete old image
      if (brand.image) {
        const oldImagePath = path.join(process.cwd(), brand.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      // assign new image
      brand.image = `/uploads/brandImage/${req.file.filename}`;
    }

    // Update other fields if provided
    if (name) brand.name = name;
    if (slug) brand.slug = slug;
    if (description) brand.description = description;
    if (isActive !== undefined) brand.isActive = isActive;
    if (isPremium !== undefined) brand.isPremium = isPremium;
    if (isFeatured !== undefined) brand.isFeatured = isFeatured;

    // Save updated brand
    await brand.save();

    res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      brand,
    });
  } catch (error) {
    // Delete uploaded image if error occurs
    if (req.file) {
      const uploadedPath = path.join(
        process.cwd(),
        `/uploads/brandImage/${req.file.filename}`
      );
      if (fs.existsSync(uploadedPath)) fs.unlinkSync(uploadedPath);
    }

    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById({ _id: req.params.id });
    if (!brand) {
      return res.status(403).json({
        success: false,
        message: "Brand Not Found.",
      });
    }
    if (brand.image) {
      // mainCategories.image: "/uploads/mainCategoriesImage/abc123.jpg"
      const filePath = path.join(process.cwd(), brand.image); // full path
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // delete file
      }
    }

    await Brand.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error to Delete Brand!",
    });
  }
};

// export const getBrandBySlug = async (req, res) => {
//   try {
//     const brand = await Brand.findOne({ slug: req.params.slug });

//     if (!brand)
//       return res
//         .status(404)
//         .json({ success: false, message: "Brand not found" });

//     res.status(200).json({ success: true, brand });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };
