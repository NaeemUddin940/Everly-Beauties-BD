import fs from "fs";
import path from "path";
import ComboProduct from "../models/comboProduct.model.js";

export const createComboProduct = async (req, res) => {
  // full image path if uploaded
  const uploadedImagePath = req.file
    ? path.join("uploads/comboProductImage", req.file.filename)
    : null;

  try {
    const {
      name,
      description,
      slug,
      components,
      comboRegularPrice,
      comboSalePrice,
      discountPercentage,
      limitedTimeOffer,
      category,
      brand,
      tags,
      visibility,
      isActive,
      hasFreeShipping,
      title,
      seoDescription,
      bottomContent,
      schemaMarkup,
      canonicalUrl,
      focusKeywords,
      screenSolution,
    } = req.body;

    // --------------------------------------------------------
    // ❗ 1. Validate name exists
    // --------------------------------------------------------
    const nameExists = await ComboProduct.findOne({ name });
    if (nameExists) {
      if (uploadedImagePath && fs.existsSync(uploadedImagePath)) {
        fs.unlinkSync(uploadedImagePath); // remove uploaded image
      }
      return res.status(400).json({
        success: false,
        message: "Product name already exists!",
      });
    }

    // --------------------------------------------------------
    // ❗ 2. Validate slug exists
    // --------------------------------------------------------
    const slugExists = await ComboProduct.findOne({ slug });
    if (slugExists) {
      if (uploadedImagePath && fs.existsSync(uploadedImagePath)) {
        fs.unlinkSync(uploadedImagePath); // remove uploaded image
      }
      return res.status(400).json({
        success: false,
        message: "Slug already exists!",
      });
    }

    // --------------------------------------------------------
    // ⭐ Create combo product
    // --------------------------------------------------------

    const newCombo = await ComboProduct.create({
      name,
      description,
      slug,
      components,
      comboRegularPrice,
      comboSalePrice,
      discountPercentage,
      limitedTimeOffer,
      category,
      brand,
      tags,
      visibility,
      isActive,
      hasFreeShipping,
      image: uploadedImagePath ? `/${uploadedImagePath}` : null,
      title,
      seoDescription,
      bottomContent,
      schemaMarkup,
      canonicalUrl,
      focusKeywords,
      screenSolution,
    });

    res.status(201).json({
      success: true,
      message: "Combo product created successfully",
      newCombo,
    });
  } catch (error) {
    console.error("Combo Product Create Error:", error);

    // --------------------------------------------------------
    // ❗ 3. Delete image if error occurred
    // --------------------------------------------------------
    if (uploadedImagePath && fs.existsSync(uploadedImagePath)) {
      fs.unlinkSync(uploadedImagePath);
    }

    res.status(500).json({
      success: false,
      message: "Failed to create combo product",
      error: error.message,
    });
  }
};
