import { body } from "express-validator";

export const simpleProductValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 3 })
    .withMessage("Product name must be at least 3 characters"),

  body("regularPrice")
    .notEmpty()
    .withMessage("Regular price is required")
    .isNumeric()
    .withMessage("Regular price must be a number"),

  body("salePrice")
    .optional()
    .isNumeric()
    .withMessage("Sale price must be a number"),

  body("stockQuantity")
    .notEmpty()
    .withMessage("Stock quantity is required")
    .isNumeric()
    .withMessage("Stock quantity must be a number"),

  body("lowStockThreshold")
    .optional()
    .isNumeric()
    .withMessage("Low stock threshold must be a number"),

  body("category").notEmpty().withMessage("Category is required"),

  body("brand").optional(),

  body("slug").optional(),

  body("sku").optional(),
];
