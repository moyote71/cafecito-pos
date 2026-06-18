import express from "express";
import { getDashboard } from "../controllers/reportController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/**
 * SOLO ADMIN (dashboard negocio)
 */
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware(["admin"]),
  getDashboard
);

export default router;