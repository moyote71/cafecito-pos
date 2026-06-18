import Product from "../models/Product.js";
import {
  successResponse,
  createdResponse,
  errorResponse
} from "../utils/apiResponse.js";

/**
 * GET ALL PRODUCTS
 */
export const getProducts = async (req, res) => {
  try {
    let { page = 1, limit = 20, q = "" } = req.query;

    page = Number(page);
    limit = Number(limit);

    if (page < 1 || limit < 1 || limit > 100) {
      return errorResponse(res, 400, "Invalid pagination values");
    }

    const skip = (page - 1) * limit;

    const filter = q
      ? {
        name: { $regex: q, $options: "i" }
      }
      : {};

    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    return successResponse(
      res,
      { products, total, page, limit },
      "Products fetched successfully"
    );

  } catch (error) {
    return errorResponse(res, 500, "Error getting products");
  }
};

/**
 * GET BY ID
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return errorResponse(res, 404, "Product not found");
    }

    return successResponse(
      res,
      product,
      "Product fetched successfully"
    );

  } catch (error) {
    return errorResponse(res, 500, "Error getting product");
  }
};

/**
 * CREATE PRODUCT
 */
export const createProduct = async (req, res) => {
  try {
    const { name, price, stock, image } = req.body;

    const errors = [];

    if (!name || name.trim() === "") {
      errors.push({ field: "name", message: "name is required" });
    }

    if (price === undefined || price < 0.01) {
      errors.push({ field: "price", message: "price must be >= 0.01" });
    }

    if (stock === undefined || stock < 0) {
      errors.push({ field: "stock", message: "stock must be >= 0" });
    }

    if (errors.length > 0) {
      return errorResponse(res, 422, "Validation failed", errors);
    }

    const product = await Product.create({
      name,
      price,
      stock,
      image
    });

    return createdResponse(
      res,
      product,
      "Product created successfully"
    );

  } catch (error) {
    return errorResponse(res, 500, "Error creating product");
  }
};

/**
 * UPDATE PRODUCT
 */
export const updateProduct = async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    const errors = [];

    if (name !== undefined && name.trim() === "") {
      errors.push({ field: "name", message: "name cannot be empty" });
    }

    if (price !== undefined && (typeof price !== "number" || price <= 0)) {
      errors.push({ field: "price", message: "price must be > 0" });
    }

    if (stock !== undefined && (typeof stock !== "number" || stock < 0)) {
      errors.push({ field: "stock", message: "stock must be >= 0" });
    }

    if (errors.length > 0) {
      return errorResponse(res, 422, "Validation failed", errors);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return errorResponse(res, 404, "Product not found");
    }

    return successResponse(
      res,
      updatedProduct,
      "Product updated successfully"
    );

  } catch (error) {
    return errorResponse(res, 500, "Error updating product");
  }
};

/**
 * DELETE PRODUCT
 */
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return errorResponse(res, 404, "Product not found");
    }

    return successResponse(
      res,
      { id: deletedProduct._id },
      "Product deleted successfully"
    );

  } catch (error) {
    return errorResponse(res, 500, "Error deleting product");
  }
};