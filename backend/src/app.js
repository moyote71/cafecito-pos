import express from "express";
import cors from "cors";
import productRoutes from "../src/routes/productRoutes.js";
import customerRoutes from "../src/routes/customerRoutes.js";
import saleRoutes from "../src/routes/saleRoutes.js";
import authRoutes from "../src/routes/authRoutes.js";
import cashSessionRoutes from "../src/routes/cashSessionRoutes.js";
import reportRoutes from "../src/routes/reportRoutes.js";
import errorMiddleware from "../src/middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser"


const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://cafecito-pos-zeta.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS not allowed: " + origin));
  },
  credentials: true
}));
  
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