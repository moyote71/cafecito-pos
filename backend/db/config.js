const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/cafecito-pos");

    console.log("🟢 MongoDB conectado");
  } catch (error) {
    console.error("🔴 Error conectando MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;