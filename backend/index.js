import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 3001;

// 👇 elegir DB según entorno
const DB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.DB_CONNECTION_STRING_TEST
    : process.env.DB_CONNECTION_STRING;

mongoose.connect(DB_URI)
  .then(() => {
    if (process.env.NODE_ENV !== "test") {
      console.log("🟢 MongoDB Atlas conectado");
      app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("🔴 Error MongoDB:", err);
    process.exit(1);
  });

export default app;