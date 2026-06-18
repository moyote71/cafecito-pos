import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.DB_CONNECTION_STRING)
  .then(() => {
    console.log("🟢 MongoDB Atlas conectado");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });

  })
  .catch((err) => {
    console.error("🔴 Error MongoDB:", err);
    process.exit(1);
  });

