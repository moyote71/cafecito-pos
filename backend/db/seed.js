import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

import Product from "../src/models/Product.js";
import Customer from "../src/models/Customer.js";
import Sale from "../src/models/Sale.js";
import User from "../src/models/User.js";

const seed = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);

    console.log("🟢 Conectado a MongoDB");

    // LIMPIAR COLECCIONES
    await Product.deleteMany();
    await Customer.deleteMany();
    await Sale.deleteMany();
    await User.deleteMany();

    // PRODUCTOS
    const products = await Product.insertMany([
      {
        name: "Café Americano",
        price: 25,
        stock: 50
      },
      {
        name: "Cappuccino",
        price: 35,
        stock: 40
      },
      {
        name: "Latte",
        price: 40,
        stock: 30
      }
    ]);

    // CLIENTES
    const customers = await Customer.insertMany([
      {
        name: "Juan García",
        phoneOrEmail: "juan@example.com",
        purchasesCount: 5
      },
      {
        name: "María López",
        phoneOrEmail: "maria@example.com",
        purchasesCount: 2
      }
    ]);

    // HASH PASSWORDS
    const adminPassword =
      await bcrypt.hash("123456", 10);

    const cashierPassword =
      await bcrypt.hash("123456", 10);

    // USUARIOS
    const users = await User.insertMany([
      {
        name: "Administrador",
        email: "admin@cafecito.com",
        password: adminPassword,
        role: "admin"
      },
      {
        name: "Vendedor",
        email: "vendedor@cafecito.com",
        password: cashierPassword,
        role: "cashier"
      }
    ]);

    console.log("🌱 Seeding completado");
    console.log(`Productos: ${products.length}`);
    console.log(`Clientes: ${customers.length}`);
    console.log(`Usuarios: ${users.length}`);

    process.exit();

  } catch (error) {

    console.error("❌ Error seed:", error);

    process.exit(1);
  }
};

seed();