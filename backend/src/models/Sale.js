import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    saleId: {
      type: String,
      required: true,
      unique: true
    },

    ticketNumber: {
      type: String,
      unique: true
    },

    cashSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CashSession",
      required: true
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "transfer"],
      default: "cash"
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        productNameSnapshot: String,
        unitPriceSnapshot: Number,
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        lineTotal: Number
      }
    ],

    subtotal: {
      type: Number,
      required: true,
      min: 0
    },

    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    discountAmount: {
      type: Number,
      default: 0,
      min: 0
    },

    total: {
      type: Number,
      required: true,
      min: 0
    },
    receivedAmount: {
  type: Number,
  default: 0
},

changeAmount: {
  type: Number,
  default: 0
}
  },
  { timestamps: true }
);

export default mongoose.model("Sale", saleSchema);