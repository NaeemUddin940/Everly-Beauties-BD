import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import VariableProduct from "../models/variableProduct.model.js";

const generateSKU = (productName, attributes) => {
  const prefix = productName?.substring(0, 3).toUpperCase() || "PRD";
  const attributeCodes = Object.values(attributes || {})
    .map((value) => value.substring(0, 2).toUpperCase())
    .join("");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix}-${attributeCodes}-${random}`;
};

// Helper functions
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// CREATE Variable Product
// Controller function
export const createVariableProduct = async (req, res) => {
  try {
    // Normalize multer `req.files` when using `upload.any()` (array)
    if (Array.isArray(req.files)) {
      const filesObj = {};
      req.files.forEach((file) => {
        if (!filesObj[file.fieldname]) filesObj[file.fieldname] = [];
        filesObj[file.fieldname].push(file);
      });
      req.files = filesObj;
    }

    // If single-file middleware was used and `req.file` exists, ensure it's available on req.files
    if (req.file && !req.files) {
      req.files = { [req.file.fieldname]: [req.file] };
    }

    // Parse JSON data from form-data fields
    const {
      name,
      description,
      ingredients,
      usageGuide,
      categories,
      brand,
      tags,
      screenSolution,
      attributes,
      variations,
      status = "draft",
      isActive = true,
      visibility = "published",
      seo,
      bottomContent,
    } = req.body;

    // Parse JSON strings
    const parsedCategories = categories ? JSON.parse(categories) : [];
    const parsedTags = tags ? JSON.parse(tags) : [];
    const parsedAttributes = attributes ? JSON.parse(attributes) : [];
    const parsedVariations = variations ? JSON.parse(variations) : [];
    const parsedSeo = seo ? JSON.parse(seo) : {};

    // Basic validation
    if (!name) {
      // Delete uploaded files if validation fails
      if (req.files) {
        Object.values(req.files).forEach((files) => {
          if (Array.isArray(files)) {
            files.forEach((file) => {
              if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
              }
            });
          } else if (files && files.path) {
            if (fs.existsSync(files.path)) {
              fs.unlinkSync(files.path);
            }
          }
        });
      }

      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    // Generate slug
    const generateSlug = (text) => {
      return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    };

    const slug = generateSlug(name);

    // Check if slug already exists
    const existingProduct = await VariableProduct.findOne({ slug });
    if (existingProduct) {
      // Delete uploaded files
      if (req.files) {
        Object.values(req.files).forEach((files) => {
          if (Array.isArray(files)) {
            files.forEach((file) => {
              if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
              }
            });
          } else if (files && files.path) {
            if (fs.existsSync(files.path)) {
              fs.unlinkSync(files.path);
            }
          }
        });
      }

      return res.status(400).json({
        success: false,
        message: "Product with this name already exists",
      });
    }

    // Handle uploaded images
    let mainImage = "";
    let galleryImages = [];
    const variationImages = {};

    // Main image
    if (req.files && req.files.mainImage) {
      // req.files.mainImage may be an array of file objects
      const f = Array.isArray(req.files.mainImage)
        ? req.files.mainImage[0]
        : req.files.mainImage;
      mainImage = f && f.filename ? f.filename : "";
    }

    // Gallery images
    if (req.files && req.files.galleryImages) {
      galleryImages = Array.isArray(req.files.galleryImages)
        ? req.files.galleryImages.map((file) => file.filename)
        : [req.files.galleryImages.filename];
    }

    // Variation images — accept fieldnames like `variationImage[1]` or `variationImages[1]`
    if (req.files) {
      Object.keys(req.files).forEach((key) => {
        if (
          key.startsWith("variationImage") ||
          key.startsWith("variationImages")
        ) {
          const match = key.match(/variationImages?\[(\d+)\]/);
          if (match && match[1]) {
            const variationId = match[1];
            // req.files[key] is an array of uploaded file objects
            const fileArr = req.files[key];
            if (Array.isArray(fileArr) && fileArr[0] && fileArr[0].filename) {
              variationImages[variationId] = fileArr[0].filename;
            }
          }
        }
      });
    }

    // Process attributes
    let processedAttributes = [];
    if (parsedAttributes && Array.isArray(parsedAttributes)) {
      processedAttributes = parsedAttributes.map((attr) => ({
        name: attr.name,
        values: attr.values || [],
        usedForVariations: attr.usedForVariations !== false,
      }));
    }

    // Generate SKU helper function
    const generateSKU = (productName, attributes) => {
      const namePrefix = productName.substring(0, 3).toUpperCase();
      const attrCodes = Object.values(attributes)
        .map((val) => val.substring(0, 2).toUpperCase())
        .join("");
      const randomNum = Math.floor(Math.random() * 1000);
      return `${namePrefix}-${attrCodes}-${randomNum}`;
    };

    // Process variations
    let processedVariations = [];
    if (parsedVariations && Array.isArray(parsedVariations)) {
      processedVariations = parsedVariations.map((variation, index) => {
        const variationId = variation.id || index + 1;
        return {
          attributes: variation.attributes || {},
          sku: variation.sku || generateSKU(name, variation.attributes || {}),
          price: parseFloat(variation.price) || 0,
          stock: parseInt(variation.stock) || 0,
          image: variationImages[variationId]
            ? `/uploads/variableProductVariation/${variationImages[variationId]}`
            : "",
          isActive: variation.isActive !== false,
        };
      });
    }

    // Create product object
    const newProduct = new VariableProduct({
      name,
      slug,
      description,
      ingredients,
      usageGuide,
      productType: "variable",
      attributes: processedAttributes,
      variations: processedVariations,
      mainImage: mainImage ? `/uploads/variableProductImage/${mainImage}` : "",
      galleryImages: galleryImages.map(
        (img) => `/uploads/variableProductImages/${img}`
      ),
      categories: parsedCategories,
      brand: brand || null,
      tags: parsedTags.map((tag) => tag.toLowerCase().trim()),
      screenSolution,
      seo: parsedSeo
        ? {
            title: parsedSeo.title,
            description: parsedSeo.description,
            keywords: parsedSeo.keywords || [],
            canonicalUrl: parsedSeo.canonicalUrl,
            schemaMarkup: parsedSeo.schemaMarkup,
            focusKeywords: parsedSeo.focusKeywords || [],
          }
        : undefined,
      bottomContent,
      status,
      isActive: isActive === "true" || isActive === true,
      visibility,
    });

    // Save to database
    await newProduct.save();

    // Populate references
    const populatedProduct = await VariableProduct.findById(newProduct._id)
      .populate("categories", "name slug")
      .populate("brand", "name logo");

    res.status(201).json({
      success: true,
      message: "Variable product created successfully",
      variableProduct: populatedProduct,
    });
  } catch (error) {
    console.error("Error creating variable product:", error);

    // Delete uploaded files on error
    if (req.files) {
      Object.values(req.files).forEach((files) => {
        if (Array.isArray(files)) {
          files.forEach((file) => {
            if (fs.existsSync(file.path)) {
              try {
                fs.unlinkSync(file.path);
              } catch (unlinkError) {
                console.error("Error deleting file:", unlinkError);
              }
            }
          });
        } else if (files && files.path) {
          if (fs.existsSync(files.path)) {
            try {
              fs.unlinkSync(files.path);
            } catch (unlinkError) {
              console.error("Error deleting file:", unlinkError);
            }
          }
        }
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Product with this slug already exists",
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }

    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON data in form fields",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// Generate variations from attributes
export const generateVariations = async (req, res) => {
  try {
    const { attributes, productName } = req.body;

    if (!attributes || !Array.isArray(attributes)) {
      return res.status(400).json({
        success: false,
        message: "Attributes array is required",
      });
    }

    // Get attributes for variations
    const variationAttributes = attributes.filter(
      (attr) => attr.usedForVariations && attr.values && attr.values.length > 0
    );

    if (variationAttributes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No attributes with values marked for variations",
      });
    }

    // Generate all combinations
    const generateCombinations = (
      attrs,
      index = 0,
      current = {},
      results = []
    ) => {
      if (index === attrs.length) {
        results.push({ ...current });
        return;
      }

      const attr = attrs[index];
      for (const value of attr.values) {
        current[attr.name] = value;
        generateCombinations(attrs, index + 1, current, results);
      }
    };

    const allCombinations = [];
    generateCombinations(variationAttributes, 0, {}, allCombinations);

    // Create variations
    const variations = allCombinations.map((attributesObj, index) => ({
      attributes: attributesObj,
      displayAttributes: Object.entries(attributesObj).map(([key, value]) => ({
        attributeName: key,
        value: value,
      })),
      sku: generateSKU(productName, attributesObj),
      price: 0,
      stock: 0,
      image: "",
      isActive: true,
      isDefault: index === 0,
    }));

    res.status(200).json({
      success: true,
      data: {
        variations,
        totalVariations: variations.length,
        attributeSummary: variationAttributes.map((attr) => ({
          name: attr.name,
          valueCount: attr.values.length,
        })),
      },
    });
  } catch (error) {
    console.error("Error generating variations:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all variable products
export const getVariableProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, category, brand } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    let query = { productType: "variable" };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "variations.sku": { $regex: search, $options: "i" } },
      ];
    }
    if (status) query.status = status;
    if (category) query.categories = category;
    if (brand) query.brand = brand;

    // Execute query
    const [products, totalDocs] = await Promise.all([
      VariableProduct.find(query)
        .populate("categories", "name")
        .populate("brand", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      VariableProduct.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalDocs / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;
    const nextPage = hasNextPage ? pageNum + 1 : null;
    const prevPage = hasPrevPage ? pageNum - 1 : null;

    // Format response with stats
    const productsWithStats = products.map((product) => ({
      ...product.toObject(),
      variationCount: product.variations ? product.variations.length : 0,
      totalStock: product.variations
        ? product.variations.reduce((sum, v) => sum + (v.stock || 0), 0)
        : 0,
      priceRange:
        product.variations && product.variations.length > 0
          ? {
              min: Math.min(...product.variations.map((v) => v.price || 0)),
              max: Math.max(...product.variations.map((v) => v.price || 0)),
            }
          : { min: 0, max: 0 },
    }));

    // Send response
    res.status(200).json({
      success: true,
      data: {
        products: productsWithStats,
        pagination: {
          totalDocs,
          totalPages,
          currentPage: pageNum,
          limit: limitNum,
          hasNextPage,
          hasPrevPage,
          nextPage,
          prevPage,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching variable products:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get single variable product
export const getVariableProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await VariableProduct.findById(id)
      .populate("categories", "name slug")
      .populate("brand", "name logo website");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Convert Map attributes to object
    const productObj = product.toObject();
    productObj.variations = productObj.variations.map((variation) => ({
      ...variation,
      attributes: Object.fromEntries(variation.attributes || new Map()),
    }));

    res.status(200).json({
      success: true,
      data: productObj,
    });
  } catch (error) {
    console.error("Error fetching variable product:", error);

    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateVariableProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Normalize multer `req.files` when using `upload.any()` (array)
    if (Array.isArray(req.files)) {
      const filesObj = {};
      req.files.forEach((file) => {
        if (!filesObj[file.fieldname]) filesObj[file.fieldname] = [];
        filesObj[file.fieldname].push(file);
      });
      req.files = filesObj;
    }

    // If single-file middleware was used and `req.file` exists, ensure it's available on req.files
    if (req.file && !req.files) {
      req.files = { [req.file.fieldname]: [req.file] };
    }

    // Parse JSON data from form-data fields
    const {
      name,
      description,
      ingredients,
      usageGuide,
      categories,
      brand,
      tags,
      screenSolution,
      attributes,
      variations,
      status,
      isActive,
      visibility,
      seo,
      bottomContent,
    } = req.body;

    // Find existing product
    const existingProduct = await VariableProduct.findById(id);
    if (!existingProduct) {
      // Delete uploaded files if product not found
      if (req.files) {
        Object.values(req.files).forEach((files) => {
          if (Array.isArray(files)) {
            files.forEach((file) => {
              if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
              }
            });
          } else if (files && files.path) {
            if (fs.existsSync(files.path)) {
              fs.unlinkSync(files.path);
            }
          }
        });
      }

      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Parse JSON strings (only if they exist in request)
    const parsedCategories = categories
      ? JSON.parse(categories)
      : existingProduct.categories;
    const parsedTags = tags ? JSON.parse(tags) : existingProduct.tags;
    const parsedAttributes = attributes
      ? JSON.parse(attributes)
      : existingProduct.attributes;
    const parsedVariations = variations
      ? JSON.parse(variations)
      : existingProduct.variations;
    const parsedSeo = seo ? JSON.parse(seo) : existingProduct.seo;

    // Handle uploaded images
    let mainImage = existingProduct.mainImage;
    let galleryImages = existingProduct.galleryImages;
    const variationImages = {};

    // Extract variation IDs from existing variations for image mapping
    existingProduct.variations.forEach((variation, index) => {
      const variationId = variation.id || index + 1;
      if (variation.image) {
        variationImages[variationId] = variation.image.replace(
          "/uploads/variableProductVariation/",
          ""
        );
      }
    });

    // Main image update
    if (req.files || req.files.mainImage) {
      // Delete old main image if exists
      if (existingProduct.mainImage) {
        const fileName = existingProduct.mainImage.replace(
          "/uploads/variableProductImage/",
          ""
        );

        const oldImagePath = path.join(
          process.cwd(),
          "uploads/variableProductImage",
          fileName
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Save new main image
      const f = Array.isArray(req.files.mainImage)
        ? req.files.mainImage[0]
        : req.files.mainImage;

      mainImage =
        f && f.filename
          ? `/uploads/variableProductImage/${f.filename}`
          : existingProduct.mainImage;
    }

    // Gallery images update
    if (req.files && req.files.galleryImages) {
      // Delete old gallery images if exists
      existingProduct.galleryImages.forEach((image) => {
        const oldImagePath = path.join(process.cwd(), "public", image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      });

      // Save new gallery images
      galleryImages = Array.isArray(req.files.galleryImages)
        ? req.files.galleryImages.map(
            (file) => `/uploads/variableProductImages/${file.filename}`
          )
        : [
            `/uploads/variableProductImages/${req.files.galleryImages.filename}`,
          ];
    }

    // Variation images update
    if (req.files) {
      Object.keys(req.files).forEach((key) => {
        if (
          key.startsWith("variationImage") ||
          key.startsWith("variationImages")
        ) {
          const match = key.match(/variationImages?\[(\d+)\]/);
          if (match && match[1]) {
            const variationId = match[1];
            // Delete old variation image if exists
            if (variationImages[variationId]) {
              const oldImagePath = path.join(
                process.cwd(),
                "public",
                "/uploads/variableProductVariation/",
                variationImages[variationId]
              );
              if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
              }
            }

            // Save new variation image
            const fileArr = req.files[key];
            if (Array.isArray(fileArr) && fileArr[0] && fileArr[0].filename) {
              variationImages[variationId] = fileArr[0].filename;
            }
          }
        }
      });
    }

    // Process attributes
    let processedAttributes = [];
    if (parsedAttributes && Array.isArray(parsedAttributes)) {
      processedAttributes = parsedAttributes.map((attr) => ({
        name: attr.name,
        values: attr.values || [],
        usedForVariations: attr.usedForVariations !== false,
      }));
    }

    // Process variations
    let processedVariations = [];
    if (parsedVariations && Array.isArray(parsedVariations)) {
      processedVariations = parsedVariations.map((variation, index) => {
        const variationId = variation.id || index + 1;
        const variationImage = variationImages[variationId]
          ? `/uploads/variableProductVariation/${variationImages[variationId]}`
          : existingProduct.variations[index]?.image || "";

        // Keep existing SKU or generate new one if not provided
        const existingVariation = existingProduct.variations[index];
        const sku =
          variation.sku ||
          existingVariation?.sku ||
          generateSKU(name || existingProduct.name, variation.attributes || {});

        return {
          attributes: variation.attributes || {},
          sku,
          price: parseFloat(variation.price) || 0,
          stock: parseInt(variation.stock) || 0,
          image: variationImage,
          isActive: variation.isActive !== false,
        };
      });
    }

    // Update product object
    const updateData = {
      ...(name && { name }),
      ...(name && { slug: generateSlug(name) }),
      ...(description !== undefined && { description }),
      ...(ingredients !== undefined && { ingredients }),
      ...(usageGuide !== undefined && { usageGuide }),
      ...(categories !== undefined && { categories: parsedCategories }),
      ...(brand !== undefined && { brand }),
      ...(tags !== undefined && {
        tags: parsedTags.map((tag) => tag.toLowerCase().trim()),
      }),
      ...(screenSolution !== undefined && { screenSolution }),
      ...(attributes !== undefined && { attributes: processedAttributes }),
      ...(variations !== undefined && { variations: processedVariations }),
      ...(mainImage !== undefined && { mainImage }),
      ...(galleryImages !== undefined && { galleryImages }),
      ...(seo !== undefined && {
        seo: parsedSeo
          ? {
              title: parsedSeo.title,
              description: parsedSeo.description,
              keywords: parsedSeo.keywords || [],
              canonicalUrl: parsedSeo.canonicalUrl,
              schemaMarkup: parsedSeo.schemaMarkup,
              focusKeywords: parsedSeo.focusKeywords || [],
            }
          : undefined,
      }),
      ...(bottomContent !== undefined && { bottomContent }),
      ...(status !== undefined && { status }),
      ...(isActive !== undefined && {
        isActive: isActive === "true" || isActive === true,
      }),
      ...(visibility !== undefined && { visibility }),
      updatedAt: Date.now(),
    };

    // Update product in database
    const updatedProduct = await VariableProduct.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Variable product updated successfully",
      variableProduct: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating variable product:", error);

    // Delete uploaded files on error
    if (req.files) {
      Object.values(req.files).forEach((files) => {
        if (Array.isArray(files)) {
          files.forEach((file) => {
            if (fs.existsSync(file.path)) {
              try {
                fs.unlinkSync(file.path);
              } catch (unlinkError) {
                console.error("Error deleting file:", unlinkError);
              }
            }
          });
        } else if (files && files.path) {
          if (fs.existsSync(files.path)) {
            try {
              fs.unlinkSync(files.path);
            } catch (unlinkError) {
              console.error("Error deleting file:", unlinkError);
            }
          }
        }
      });
    }

    // Handle duplicate key errors (slug)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Product with this slug already exists",
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }

    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON data in form fields",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
