import fs from "fs";
import path from "path";
import SimpleProduct from "../models/simpleProduct.model.js";

export const createSimpleProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      ingredient,
      usageGuide,
      regularPrice,
      salePrice,
      scheduleSale,
      stockQuantity,
      lowStockThreshold,
      sku,
      trackStock,
      allowBackorders,
      seo,
      category,
      brand,
      skinSolution,
      tags,
      visibility,
      isActive,
    } = req.body;

    if (!name || !slug || !description || !regularPrice || !sku) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: name, slug, description, regularPrice, sku.",
      });
    }

    // 🖼️ Multer Files
    const mainImage = req.files["mainImage"]?.[0];
    const galleryImages = req.files["galleryImages"] || [];

    // ❌ Main image required
    if (!mainImage) {
      return res.status(400).json({
        success: false,
        message: "Please upload a Simple Product main image.",
      });
    }

    // 🔍 ONE QUERY duplicate check (name/slug/sku)
    const existing = await SimpleProduct.findOne({
      $or: [{ name: name?.trim() }, { slug }, { sku }],
    });

    if (existing) {
      // ❌ Delete main image
      fs.unlinkSync(
        path.join("uploads/SimpleProductImage/", mainImage.filename)
      );

      // ❌ Delete gallery images
      galleryImages.forEach((img) => {
        fs.unlinkSync(path.join("uploads/SimpleProductImage/", img.filename));
      });

      return res.status(400).json({
        success: false,
        error: true,
        message:
          existing.name === name?.trim()
            ? `Product name "${name}" already exists!`
            : existing.slug === slug
            ? `Slug "${slug}" is already in use!`
            : existing.sku === sku
            ? `SKU "${sku}" already exists!`
            : "Duplicate product information found!",
      });
    }

    const mainImagePath = `/uploads/SimpleProductImage/${mainImage.filename}`;

    // Gallery images path
    const galleryImagesPaths = galleryImages.map(
      (img) => `/uploads/SimpleProductImage/${img.filename}`
    );

    // Main image কে gallery-এর first element হিসেবে add করা
    const finalGalleryImages = [mainImagePath, ...galleryImagesPaths];

    // 🟢 Create product
    const newProduct = await SimpleProduct.create({
      name,
      slug,
      description,
      ingredient,
      usageGuide,
      regularPrice,
      salePrice,
      scheduleSale,
      stockQuantity,
      lowStockThreshold,
      sku,
      trackStock,
      allowBackorders,
      mainImage: mainImagePath, // Main image
      galleryImages: finalGalleryImages, // Main image + gallery
      seo,
      category,
      brand,
      skinSolution,
      tags,
      visibility,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully!",
      product: newProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

export const deleteSimpleProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // 1️⃣ Find the product
    const product = await SimpleProduct.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    // 2️⃣ Delete main image
    if (product.mainImage) {
      const mainImagePath = path.join(
        "uploads/SimpleProductImage",
        path.basename(product.mainImage)
      );
      if (fs.existsSync(mainImagePath)) {
        fs.unlinkSync(mainImagePath);
      }
    }

    // 3️⃣ Delete gallery images
    if (product.galleryImages && product.galleryImages.length > 0) {
      product.galleryImages.forEach((img) => {
        const galleryImagePath = path.join(
          "uploads/SimpleProductImage",
          path.basename(img)
        );
        if (fs.existsSync(galleryImagePath)) {
          fs.unlinkSync(galleryImagePath);
        }
      });
    }

    // 4️⃣ Delete product from DB
    await SimpleProduct.findByIdAndDelete(productId);

    return res.status(200).json({
      success: true,
      message: "Product and associated images deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

export const updateSimpleProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const {
      name,
      slug,
      description,
      ingredient,
      usageGuide,
      regularPrice,
      salePrice,
      scheduleSale,
      stockQuantity,
      lowStockThreshold,
      sku,
      trackStock,
      allowBackorders,
      seo,
      category,
      brand,
      skinSolution,
      tags,
      visibility,
      isActive,
      removeGalleryImages, // Array of URLs to remove explicitly
    } = req.body;

    // 1️⃣ Find existing product
    const product = await SimpleProduct.findById(productId);

    if (!product) {
      // ❌ Delete uploaded files if product not found
      if (req.files) {
        Object.values(req.files)
          .flat()
          .forEach((file) => {
            const filePath = path.join(
              "uploads/SimpleProductImage",
              file.filename
            );
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          });
      }
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    // 2️⃣ Duplicate check
    const duplicate = await SimpleProduct.findOne({
      $or: [{ name: name?.trim() }, { slug }, { sku }],
      _id: { $ne: productId },
    });

    if (duplicate) {
      if (req.files) {
        Object.values(req.files)
          .flat()
          .forEach((file) => {
            const filePath = path.join(
              "uploads/SimpleProductImage",
              file.filename
            );
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          });
      }
      return res.status(400).json({
        success: false,
        message:
          duplicate.name === name?.trim()
            ? `Product name "${name}" already exists!`
            : duplicate.slug === slug
            ? `Slug "${slug}" is already in use!`
            : duplicate.sku === sku
            ? `SKU "${sku}" already exists!`
            : "Duplicate product information found!",
      });
    }

    // 3️⃣ Handle file updates
    const mainImageFile = req.files?.["mainImage"]?.[0];
    const galleryFiles = req.files?.["galleryImages"] || [];

    // 3a. Update main image
    if (mainImageFile) {
      if (product.mainImage) {
        const oldMainPath = path.join(
          "uploads/SimpleProductImage",
          path.basename(product.mainImage)
        );
        if (fs.existsSync(oldMainPath)) fs.unlinkSync(oldMainPath);
      }
      product.mainImage = `/uploads/SimpleProductImage/${mainImageFile.filename}`;
    }

    // 3b. Handle gallery images replacement
    if (galleryFiles.length > 0) {
      // Delete all old gallery images
      if (product.galleryImages && product.galleryImages.length > 0) {
        product.galleryImages.forEach((img) => {
          const oldPath = path.join(
            "uploads/SimpleProductImage",
            path.basename(img)
          );
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        });
      }
      // Save only new images
      product.galleryImages = galleryFiles.map(
        (file) => `/uploads/SimpleProductImage/${file.filename}`
      );
    }

    // 3c. Remove selected gallery images explicitly
    if (removeGalleryImages && Array.isArray(removeGalleryImages)) {
      removeGalleryImages.forEach((imgUrl) => {
        const imgPath = path.join(
          "uploads/SimpleProductImage",
          path.basename(imgUrl)
        );
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

        // Remove from product.galleryImages array
        product.galleryImages = product.galleryImages.filter(
          (img) => img !== imgUrl
        );
      });
    }

    // 4️⃣ Update other fields
    product.name = name ?? product.name;
    product.slug = slug ?? product.slug;
    product.description = description ?? product.description;
    product.ingredient = ingredient ?? product.ingredient;
    product.usageGuide = usageGuide ?? product.usageGuide;
    product.regularPrice = regularPrice ?? product.regularPrice;
    product.salePrice = salePrice ?? product.salePrice;
    product.scheduleSale = scheduleSale ?? product.scheduleSale;
    product.stockQuantity = stockQuantity ?? product.stockQuantity;
    product.lowStockThreshold = lowStockThreshold ?? product.lowStockThreshold;
    product.sku = sku ?? product.sku;
    product.trackStock = trackStock ?? product.trackStock;
    product.allowBackorders = allowBackorders ?? product.allowBackorders;
    product.seo = seo ?? product.seo;
    product.category = category ?? product.category;
    product.brand = brand ?? product.brand;
    product.skinSolution = skinSolution ?? product.skinSolution;
    product.tags = tags ?? product.tags;
    product.visibility = visibility ?? product.visibility;
    product.isActive = isActive ?? product.isActive;

    // 5️⃣ Save product
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      product,
    });
  } catch (error) {
    console.log(error);

    // ❌ Rollback uploaded files if error occurs
    if (req.files) {
      Object.values(req.files)
        .flat()
        .forEach((file) => {
          const filePath = path.join(
            "uploads/SimpleProductImage",
            file.filename
          );
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

export const getSimpleAllProduct = async (req, res) => {
  try {
    // Query Params → page, limit
    let { page = 1, limit = 10 } = req.query;
    page = Number(page);
    limit = Number(limit);

    // 1️⃣ Pagination + Sort
    const paginatedProducts = await SimpleProduct.paginate(
      {},
      {
        page,
        limit,
        sort: { createdAt: -1 },
        lean: true,
      }
    );

    // 2️⃣ Total Count
    const totalProducts = await SimpleProduct.countDocuments();

    // 3️⃣ Active Product Count
    const activeProducts = await SimpleProduct.countDocuments({
      isActive: true,
    });

    return res.status(200).json({
      success: true,
      error: false,

      // Pagination Info
      pagination: {
        totalProducts: paginatedProducts.totalDocs,
        totalPages: paginatedProducts.totalPages,
        currentPage: paginatedProducts.page,
        limit: paginatedProducts.limit,
        hasNextPage: paginatedProducts.hasNextPage,
        hasPrevPage: paginatedProducts.hasPrevPage,
        nextPage: paginatedProducts.nextPage,
        prevPage: paginatedProducts.prevPage,
      },

      // Final Product List
      simpleProducts: paginatedProducts.docs,

      // Extra counts
      totalProducts,
      activeProducts,

      message: "Successfully fetched all simple products.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message:
        error.message || "Internal Server Error to Get All Simple Products.",
    });
  }
};

export const getSingleProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const singleProduct = await SimpleProduct.findById(productId);

    if (!singleProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found!" });
    }

    res.status(201).json({ success: true, singleProduct });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error to do Something!",
    });
  }
};

export const getSingleProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const singleProduct = await SimpleProduct.findOne({ slug });
    if (!singleProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found!" });
    }

    res.status(201).json({ success: true, singleProduct });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error to do Something!",
    });
  }
};
