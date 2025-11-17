import Brand from "../models/brand.model.js";

export const validateBrandData = async (req, res, next) => {
  const { name, slug, description } = req.body;

  // Required fields check
  if (!name || !slug || !description) {
    return res.status(400).json({
      success: false,
      message: "Name, slug & description are required.",
    });
  }

  // Duplicate check
  const existingBrand = await Brand.findOne({
    $or: [{ name }, { slug }],
  });

  if (existingBrand) {
    return res.status(400).json({
      success: false,
      message: "Brand name or slug already exists.",
    });
  }

  next(); // 👍 সব ঠিক থাকলে multer চালান
};
