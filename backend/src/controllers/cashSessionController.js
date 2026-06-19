import CashSession from "../models/CashSession.js";
import Sale from "../models/Sale.js";
import {
  successResponse,
  createdResponse,
  errorResponse
} from "../utils/apiResponse.js";

/**
 * OPEN CASH SESSION
 */
export const openCashSession = async (req, res) => {
  try {
    const openingAmountNum = Number(req.body.openingAmount);

    if (isNaN(openingAmountNum) || openingAmountNum < 0) {
      return errorResponse(res, 422, "Invalid opening amount");
    }

    await CashSession.updateMany(
      { userId: req.user.id, status: "open" },
      {
        $set: {
          status: "closed",
          closedAt: new Date(),
          closingAmount: 0
        }
      }
    );

    const session = await CashSession.create({
      userId: req.user.id,
      openingAmount: openingAmountNum,
      status: "open"
    });

    return createdResponse(res, session, "Cash session opened successfully");
  } catch (error) {
    console.error("OPEN CASH SESSION ERROR:", error);
    return errorResponse(res, 500, "Error opening cash session");
  }
};

/**
 * GET CURRENT SESSION
 */
export const getCurrentCashSession = async (req, res) => {
  try {
    const session = await CashSession.findOne({
      userId: req.user.id,
      status: "open"
    });

    return successResponse(res, session || null, "Current session");
  } catch (error) {
    console.error("GET SESSION ERROR:", error);
    return errorResponse(res, 500, "Error getting session");
  }
};

/**
 * CLOSE CASH SESSION
 */
export const closeCashSession = async (req, res) => {
  try {
    const closingAmountNum = Number(req.body?.closingAmount);

    if (isNaN(closingAmountNum) || closingAmountNum < 0) {
      return errorResponse(res, 422, "Invalid closing amount");
    }

    const session = await CashSession.findOne({
      userId: req.user.id,
      status: "open"
    });

    if (!session) {
      return errorResponse(res, 404, "No open cash session found");
    }

    const sales = await Sale.find({
      cashSessionId: session._id
    });

    const totalCashSales = sales
      .filter(s => s.paymentMethod === "cash")
      .reduce((acc, s) => acc + s.total, 0);

    const totalCardSales = sales
      .filter(s => s.paymentMethod === "card")
      .reduce((acc, s) => acc + s.total, 0);

    const totalTransferSales = sales
      .filter(s => s.paymentMethod === "transfer")
      .reduce((acc, s) => acc + s.total, 0);

    const totalSales =
      totalCashSales + totalCardSales + totalTransferSales;

    const expectedAmount =
      Number(session.openingAmount) + Number(totalCashSales);

    const difference =
      closingAmountNum - expectedAmount;

    session.closingAmount = closingAmountNum;
    session.closedAt = new Date();
    session.status = "closed";

    await session.save();

    return successResponse(res, {
      sessionId: session._id,
      openingAmount: Number(session.openingAmount.toFixed(2)),
      closingAmount: Number(closingAmountNum.toFixed(2)),
      totalSales: Number(totalSales.toFixed(2)),
      totalCashSales: Number(totalCashSales.toFixed(2)),
      totalCardSales: Number(totalCardSales.toFixed(2)),
      totalTransferSales: Number(totalTransferSales.toFixed(2)),
      expectedAmount: Number(expectedAmount.toFixed(2)),
      difference: Number(difference.toFixed(2)),
      totalTransactions: sales.length
    }, "Cash session closed successfully");

  } catch (error) {
    console.error("CLOSE CASH SESSION ERROR:", error);
    return errorResponse(res, 500, "Error closing cash session");
  }
};

/**
 * CASH SESSION REPORT
 */
export const getCashSessionReport = async (req, res) => {
  try {
    const session = await CashSession.findOne({
      userId: req.user.id,
      status: "open"
    });

    if (!session) {
  return successResponse(res, null, "No open cash session");
}

    const sales = await Sale.find({
      cashSessionId: session._id
    });

    const byPayment = {
      cash: 0,
      card: 0,
      transfer: 0
    };

    const productsMap = {};

    for (const sale of sales) {
      if (byPayment[sale.paymentMethod] !== undefined) {
        byPayment[sale.paymentMethod] += sale.total;
      }

      for (const item of sale.items) {
        const name = item.productNameSnapshot || "Producto";

        if (!productsMap[name]) {
          productsMap[name] = {
            name,
            quantity: 0,
            total: 0
          };
        }

        productsMap[name].quantity += item.quantity;
        productsMap[name].total += item.lineTotal;
      }
    }

    const totalSales =
      byPayment.cash + byPayment.card + byPayment.transfer;

    const expectedCash =
      Number(session.openingAmount) + Number(byPayment.cash);

    const tickets = sales.length;

    return successResponse(res, {
      sessionId: session._id,
      openingAmount: Number(session.openingAmount.toFixed(2)),
      totalSales: Number(totalSales.toFixed(2)),
      expectedCash: Number(expectedCash.toFixed(2)),
      tickets,
      averageTicket: Number(
        tickets ? totalSales / tickets : 0
      ).toFixed(2),
      byPayment: {
        cash: Number(byPayment.cash.toFixed(2)),
        card: Number(byPayment.card.toFixed(2)),
        transfer: Number(byPayment.transfer.toFixed(2))
      },
      topProducts: Object.values(productsMap)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10)
    });

  } catch (error) {
    console.error("REPORT ERROR:", error);
    return errorResponse(res, 500, "Error generating report");
  }
};