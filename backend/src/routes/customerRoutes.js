import express from "express";

import {
  createCustomer,
  getCustomers,
  getCustomerById,
  deleteCustomer
} from "../controllers/customerController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { permissionMiddleware } from "../middlewares/permissionMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  permissionMiddleware(["admin", "cashier"]),
  getCustomers
);

router.get(
  "/:id",
  authMiddleware,
  permissionMiddleware(["admin", "cashier"]),
  getCustomerById
);

router.post(
  "/",
  authMiddleware,
  permissionMiddleware(["admin", "cashier"]),
  createCustomer
);

// 🔥 NUEVO: DELETE CUSTOMER
router.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware(["admin"]), // solo admin recomendado
  deleteCustomer
);

export default router;