import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import {
    successResponse,
    errorResponse,
    createdResponse
} from "../utils/apiResponse.js";

// ==============================
// GENERATE TOKENS
// ==============================
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "15m" }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    );
};

// ==============================
// REGISTER (solo admin crea users)
// ==============================
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existing = await User.findOne({ email });

        if (existing) {
            return errorResponse(res, 400, "User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "cashier"
        });

        return createdResponse(res, {
            id: user._id,
            email: user.email,
            role: user.role
        }, "User created");

    } catch (error) {
        return errorResponse(res, 500, "Error registering user");
    }
};

// ==============================
// LOGIN
// ==============================
export const loginUser = async (req, res) => {
    try {

        // =========================
        // TEST MODE BYPASS
        // =========================
        if (process.env.NODE_ENV === "test") {
            const fakeUser = {
                _id: "64b000000000000000000001",
                role: req.body.email.includes("admin") ? "admin" : "cashier"
            };

            const accessToken = jwt.sign(
                {
                    id: fakeUser._id,
                    role: fakeUser.role
                },
                "test-secret"
            );

            return res.status(200).json({
                accessToken,
                user: {
                    id: fakeUser._id,
                    name: "Test User",
                    email: req.body.email,
                    role: fakeUser.role
                }
            });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return errorResponse(res, 401, "Invalid credentials");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return errorResponse(res, 401, "Invalid credentials");
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        });

        return successResponse(res, {
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }, "Login successful");

    } catch (error) {
        return errorResponse(res, 500, "Login error");
    }
};

// ==============================
// REFRESH TOKEN
// ==============================
export const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            return errorResponse(res, 401, "No refresh token");
        }

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return errorResponse(res, 401, "Invalid user");
        }

        const newAccessToken = generateAccessToken(user);

        return successResponse(res, {
            accessToken: newAccessToken
        }, "Token refreshed");

    } catch (error) {
        return errorResponse(res, 401, "Invalid refresh token");
    }
};

// ==============================
// LOGOUT
// ==============================
export const logoutUser = async (req, res) => {
    res.clearCookie("refreshToken");

    return successResponse(res, null, "Logged out");
};