import express from "express";

import {
    loginUser,
    registerUser,
    refreshToken,
    logoutUser
} from "../controllers/authController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);

router.post("/refresh", refreshToken);

router.post("/logout", logoutUser);

router.post("/register", authMiddleware, roleMiddleware(["admin"]), registerUser);

export default router;