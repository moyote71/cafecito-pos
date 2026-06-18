import express from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Cualquier usuario autenticado
router.get("/", authMiddleware, getProducts);
router.get("/:id", authMiddleware, getProductById);

// Solo admin
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  createProduct
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  deleteProduct
);

export default router;