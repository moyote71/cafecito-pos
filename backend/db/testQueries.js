import mongoose from "mongoose";
import dotenv from "dotenv";

import Product from "../src/models/Product.js";
import Customer from "../src/models/Customer.js";
import Sale from "../src/models/Sale.js";

dotenv.config();

await mongoose.connect(process.env.DB_CONNECTION_STRING);

console.log("🧪 TEST QUERIES INICIANDO...\n");

// ===================== PRODUCTS =====================
console.log("📦 PRODUCTS - find()");
console.log(await Product.find());

console.log("\n📦 PRODUCTS - findOne()");
console.log(await Product.findOne({ name: "Café Americano" }));

console.log("\n📦 PRODUCTS - filter price > 30");
console.log(await Product.find({ price: { $gt: 30 } }));

// ===================== CUSTOMERS =====================
console.log("\n👤 CUSTOMERS - find()");
console.log(await Customer.find());

console.log("\n👤 CUSTOMERS - findOne()");
console.log(await Customer.findOne({ phoneOrEmail: "juan@example.com" }));

// ===================== SALES (RELATIONS) =====================
console.log("\n🧾 SALES - populate test");
console.log(
  await Sale.find()
    .populate("customerId")
    .populate("items.productId")
);

console.log("\n✅ TESTS TERMINADOS");

process.exit();