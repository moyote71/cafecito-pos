require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require ("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

console.log("ENV:", process.env.DB_CONNECTION_STRING);

mongoose.connect(process.env.DB_CONNECTION_STRING)
  .then(() => console.log("🟢 MongoDB Atlas conectado"))
  .catch(err => console.error("🔴 Error MongoDB:", err));

const PORT = 3001;

app.get("/api/products", (req, res) => {
  res.json([
    { id: 1, name: "Café Americano", price: 25 },
    { id: 2, name: "Cappuccino", price: 35 },
    { id: 3, name: "Latte", price: 40 }
  ]);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});