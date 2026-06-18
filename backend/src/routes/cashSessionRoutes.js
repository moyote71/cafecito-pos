import express from "express";
import {
  openCashSession,
  getCurrentCashSession,
  closeCashSession,
  getCashSessionReport
} from "../controllers/cashSessionController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/open", authMiddleware, openCashSession);

router.get("/me", authMiddleware, getCurrentCashSession);

// report
router.get("/report", authMiddleware, getCashSessionReport);

// close cash session
router.post("/close", authMiddleware, closeCashSession);

export default router;  