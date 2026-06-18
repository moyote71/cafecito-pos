import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 3001;

const DB_URI = process.env.DB_CONNECTION_STRING;

async function start() {
  try {
    await mongoose.connect(DB_URI);

    console.log("🟢 MongoDB conectado");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("🔴 ERROR INICIAL:", err);
    process.exit(1);
  }
}

start();