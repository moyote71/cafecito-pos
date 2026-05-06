const mongoose = require("mongoose");
const connectDB = require("./config");

const Product = require("../models/Product");

const seed = async () => {
  await connectDB();

  await Product.deleteMany();

  await Product.insertMany([
    { name: "Café Americano", price: 25 },
    { name: "Cappuccino", price: 35 },
    { name: "Latte", price: 40 }
  ]);

  console.log("🌱 Seeding completado");

  process.exit();
};

seed();