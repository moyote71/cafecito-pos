import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import productRoutes from "../src/routes/productRoutes.js";
import customerRoutes from "../src/routes/customerRoutes.js";
import saleRoutes from "../src/routes/saleRoutes.js";
import authRoutes from "../src/routes/authRoutes.js";
import cashSessionRoutes from "../src/routes/cashSessionRoutes.js";
import reportRoutes from "../src/routes/reportRoutes.js";
import errorMiddleware from "../src/middlewares/errorMiddleware.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://cafecito-pos-zeta.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.includes("vercel.app")
      ) {
        return callback(null, true);
      }

      console.log("❌ BLOCKED ORIGIN:", origin);
      return callback(null, false);
    },
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/cash-sessions", cashSessionRoutes);
app.use("/api/reports", reportRoutes);

app.use(errorMiddleware);

export default app;