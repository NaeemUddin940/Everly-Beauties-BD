import Product from "../models/product.models.js";
import ProductCard from "../models/productCard.model.js";

export const createProduct = async (req, res) => {
  try {
    // const {
    //   name,
    //   price,
    //   regular_price,
    //   sale_price,
    //   image,
    //   permalink,
    //   rating_count,
    //   average_rating,
    //   attributes,
    // } = req.body;

    const product = await Product.create(req.body);
    res
      .status(201)
      .json({ success: true, product, message: "Successfull to Products" });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error to Products!",
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await ProductCard.find();
    console.log(products);
    res.status(201).json({
      success: true,
      products,
      message: "Successfull to Get Products",
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error to Get Products!",
    });
  }
};

export const productCard = async (req, res) => {
  try {
    const product = await ProductCard.create(req.body);

    res
      .status(201)
      .json({ success: true, product, message: "Successfull to Product" });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error to Product!",
    });
  }
};
