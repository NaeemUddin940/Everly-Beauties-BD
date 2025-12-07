import fs from "fs";
import path from "path";
import ComboProduct from "../models/comboProduct.model.js";
import SimpleProduct from "../models/simpleProduct.model.js";
import VariableProduct from "../models/variableProduct.model.js";

// ======== All Products like Simple, Variable and Combo ======== //
export const getAllProducts = async (req, res) => {
  try {
    // ----- Pagination -----
    const pageNum = parseInt(req.query.page) || 1;
    const limitNum = parseInt(req.query.limit) || 5;
    const skip = (pageNum - 1) * limitNum;

    // ----- Extract filters -----
    const {
      category = "All Categories",
      brand = "All Brands",
      type = "All Types",
      isActive = "All Status",
      stock = "All Stock",
      search = "",
    } = req.query;

    // ----- Base Mongo filter -----
    const baseFilter = {};

    if (category !== "All Categories") baseFilter.category = category;
    if (brand !== "All Brands") baseFilter.brand = brand;
    if (isActive !== "All Status") baseFilter.isActive = isActive === "Active";
    if (search) baseFilter.name = { $regex: search, $options: "i" };

    // ----- Product type filter -----
    const typeLower = type.toLowerCase();
    const fetchCombo = type === "All Types" || typeLower === "combo";
    const fetchVariable = type === "All Types" || typeLower === "variable";
    const fetchSimple = type === "All Types" || typeLower === "simple";

    // ----- Fetch products -----
    const [combo, variable, simple] = await Promise.all([
      fetchCombo ? ComboProduct.find(baseFilter) : [],
      fetchVariable ? VariableProduct.find(baseFilter) : [],
      fetchSimple ? SimpleProduct.find(baseFilter) : [],
    ]);

    // ----- Merge products with type info -----
    let allProducts = [
      ...combo.map((p) => ({ ...p.toObject(), type: "combo" })),
      ...variable.map((p) => ({ ...p.toObject(), type: "variable" })),
      ...simple.map((p) => ({ ...p.toObject(), type: "simple" })),
    ];

    // ----- Stock filter -----
    if (stock !== "All Stock") {
      allProducts = allProducts.filter((product) => {
        let stockQty = product.stockQuantity || 0;

        if (product.type === "variable") {
          stockQty =
            product.skus?.reduce(
              (total, sku) => total + sku.stockQuantity,
              0
            ) || 0;
        } else if (product.type === "combo") {
          stockQty = product.components?.length || 0;
        }

        if (stock === "In Stock") return stockQty > 10;
        if (stock === "Low Stock") return stockQty > 0 && stockQty <= 10;
        if (stock === "Out of Stock") return stockQty === 0;
        return true;
      });
    }

    // ----- Sort newest first -----
    allProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // ----- Pagination -----
    const totalDocs = allProducts.length;
    const totalPages = Math.ceil(totalDocs / limitNum);
    const paginated = allProducts.slice(skip, skip + limitNum);

    // ----- Response -----
    res.status(200).json({
      success: true,
      pagination: {
        totalDocs,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      data: paginated,
    });
  } catch (error) {
    console.error("Get All Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

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

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required.",
      });
    }
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
      mainImage: uploadedImagePath ? `/${uploadedImagePath}` : null,
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

export const getAllComboProduct = async (req, res) => {
  try {
    const comboProducts = await ComboProduct.find();

    res.status(201).json({ success: true, comboProducts });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message:
        error.message || "Internal Server Error to do Get Combo Product!",
    });
  }
};

export const editComboProduct = async (req, res) => {
  const productId = req.params.id; // assume route: /combo-products/:id

  // Full image path if uploaded
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
    // ❗ 1. Find existing product
    // --------------------------------------------------------
    const existingProduct = await ComboProduct.findById(productId);
    if (!existingProduct) {
      if (uploadedImagePath && fs.existsSync(uploadedImagePath)) {
        fs.unlinkSync(uploadedImagePath);
      }
      return res.status(404).json({
        success: false,
        message: "Combo product not found!",
      });
    }

    // --------------------------------------------------------
    // ❗ 2. Validate name uniqueness (exclude current product)
    // --------------------------------------------------------
    if (name && name !== existingProduct.name) {
      const nameExists = await ComboProduct.findOne({ name });
      if (nameExists) {
        if (uploadedImagePath && fs.existsSync(uploadedImagePath)) {
          fs.unlinkSync(uploadedImagePath);
        }
        return res.status(400).json({
          success: false,
          message: "Product name already exists!",
        });
      }
    }

    // --------------------------------------------------------
    // ❗ 3. Validate slug uniqueness (exclude current product)
    // --------------------------------------------------------
    if (slug && slug !== existingProduct.slug) {
      const slugExists = await ComboProduct.findOne({ slug });
      if (slugExists) {
        if (uploadedImagePath && fs.existsSync(uploadedImagePath)) {
          fs.unlinkSync(uploadedImagePath);
        }
        return res.status(400).json({
          success: false,
          message: "Slug already exists!",
        });
      }
    }

    // --------------------------------------------------------
    // ⭐ 4. Update product fields
    // --------------------------------------------------------
    Object.assign(existingProduct, {
      name: name || existingProduct.name,
      description: description || existingProduct.description,
      slug: slug || existingProduct.slug,
      components: components || existingProduct.components,
      comboRegularPrice: comboRegularPrice || existingProduct.comboRegularPrice,
      comboSalePrice: comboSalePrice || existingProduct.comboSalePrice,
      discountPercentage:
        discountPercentage || existingProduct.discountPercentage,
      limitedTimeOffer: limitedTimeOffer ?? existingProduct.limitedTimeOffer,
      category: category || existingProduct.category,
      brand: brand || existingProduct.brand,
      tags: tags || existingProduct.tags,
      visibility: visibility ?? existingProduct.visibility,
      isActive: isActive ?? existingProduct.isActive,
      hasFreeShipping: hasFreeShipping ?? existingProduct.hasFreeShipping,
      title: title || existingProduct.title,
      seoDescription: seoDescription || existingProduct.seoDescription,
      bottomContent: bottomContent || existingProduct.bottomContent,
      schemaMarkup: schemaMarkup || existingProduct.schemaMarkup,
      canonicalUrl: canonicalUrl || existingProduct.canonicalUrl,
      focusKeywords: focusKeywords || existingProduct.focusKeywords,
      screenSolution: screenSolution || existingProduct.screenSolution,
    });

    // --------------------------------------------------------
    // ⭐ 5. Handle new image upload
    // --------------------------------------------------------
    if (uploadedImagePath) {
      // Remove old image if exists
      if (
        existingProduct.mainImage &&
        fs.existsSync(existingProduct.mainImage.replace("/", ""))
      ) {
        fs.unlinkSync(existingProduct.mainImage.replace("/", ""));
      }
      existingProduct.mainImage = `/${uploadedImagePath}`;
    }

    await existingProduct.save();

    res.status(200).json({
      success: true,
      message: "Combo product updated successfully",
      updatedCombo: existingProduct,
    });
  } catch (error) {
    console.error("Combo Product Edit Error:", error);

    if (uploadedImagePath && fs.existsSync(uploadedImagePath)) {
      fs.unlinkSync(uploadedImagePath);
    }

    res.status(500).json({
      success: false,
      message: "Failed to update combo product",
      error: error.message,
    });
  }
};
