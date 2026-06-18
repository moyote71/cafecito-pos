import mongoose from "mongoose";

const cashSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    openingAmount: {
      type: Number,
      required: true,
      min: 0
    },

    closingAmount: {
      type: Number,
      default: null
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open"
    },

    openedAt: {
      type: Date,
      default: Date.now
    },

    closedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "CashSession",
  cashSessionSchema
);