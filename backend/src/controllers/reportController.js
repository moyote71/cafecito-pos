import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";

import {
  successResponse,
  errorResponse
} from "../utils/apiResponse.js";

/**
 * DASHBOARD GENERAL (POS)
 */
export const getDashboard = async (req, res) => {
  try {
    // =========================
    // FECHA HOY (inicio del día)
    // =========================
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // =========================
    // VENTAS DE HOY
    // =========================
    const salesToday = await Sale.find({
      createdAt: { $gte: startOfDay }
    });

    const totalSalesCount = salesToday.length;

    const totalRevenue = salesToday.reduce(
      (acc, sale) => acc + sale.total,
      0
    );

    const averageTicket =
      totalSalesCount > 0
        ? totalRevenue / totalSalesCount
        : 0;

    // =========================
    // TOP PRODUCTOS
    // =========================
    const topProducts = await Sale.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.productNameSnapshot" },
          quantitySold: { $sum: "$items.quantity" },
          revenue: { $sum: "$items.lineTotal" }
        }
      },
      { $sort: { quantitySold: -1 } },
      { $limit: 5 }
    ]);

    // =========================
    // TOP CLIENTES
    // =========================
    const topCustomers = await Customer.find()
      .sort({ purchasesCount: -1 })
      .limit(5)
      .select("name phoneOrEmail purchasesCount");

    // =========================
    // PRODUCTOS BAJO STOCK
    // =========================
    const lowStockProducts = await Product.find({
      stock: { $lte: 5 }
    })
      .limit(5)
      .select("name stock");

    // =========================
    // RESPONSE
    // =========================
    return successResponse(res, {
      summary: {
        totalRevenue,
        totalSalesCount,
        averageTicket
      },
      topProducts,
      topCustomers,
      lowStockProducts
    }, "Dashboard loaded");

  } catch (error) {
    console.log("🔥 DASHBOARD ERROR:", error);
    return errorResponse(res, 500, "Error loading dashboard");
  }
};