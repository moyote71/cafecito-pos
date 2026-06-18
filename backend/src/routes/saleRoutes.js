import express from "express";

import {
  createSale,
  getSales,
  getSaleById
} from "../controllers/saleController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { permissionMiddleware } from "../middlewares/permissionMiddleware.js";

const router = express.Router();

/**
 * CREATE SALE (requiere login + rol)
 */
router.post(
  "/",
  authMiddleware,
  permissionMiddleware(["admin", "cashier"]),
  createSale
);

/**
 * GET ALL SALES (requiere login + rol)
 */
router.get(
  "/",
  authMiddleware,
  permissionMiddleware(["admin", "cashier"]),
  getSales
);

/**
 * GET SALE BY ID (requiere login + rol)
 */
router.get(
  "/:id",
  authMiddleware,
  permissionMiddleware(["admin", "cashier"]),
  getSaleById
);

export default router;