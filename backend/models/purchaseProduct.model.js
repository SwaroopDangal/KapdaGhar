import mongoose from "mongoose";

const productPurchaseSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    selectedSize: {
      type: String,
      enum: ["S", "M", "L", "XL", "XXL"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
    deliveryStatus: {
      type: String,
      enum: ["PLACED", "ON_THE_WAY", "DELIVERED"],
      default: "PLACED",
    },
    transactionId: {
      type: String,
    },
    orderGroupId: {
      type: String,
      default: null,
    },

    dataFromVerificationReq: { type: Object },
    apiQueryFromUser: { type: Object },
    paymentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ProductPurchase = mongoose.model(
  "ProductPurchase",
  productPurchaseSchema
);
