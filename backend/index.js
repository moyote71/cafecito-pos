import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 3001;

const DB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.DB_CONNECTION_STRING_TEST
    : process.env.DB_CONNECTION_STRING;

// ✅ validación fuerte
if (!DB_URI) {
  console.error("❌ DB_URI no definida");
  process.exit(1);
}

mongoose.connect(DB_URI)
  .then(() => {
    console.log("🟢 MongoDB conectado");

    if (process.env.NODE_ENV !== "test") {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("🔴 MongoDB error:", err);
    process.exit(1);
  });

export default app;