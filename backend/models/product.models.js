import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // Size-wise stock as array of objects
    sizes: [
      {
        size: {
          type: String,
          enum: ["S", "M", "L", "XL", "XXL"],
          required: true,
        },
        stock: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    category: {
      type: String,
      enum: ["men", "women", "kids"],
    },
    subCategory: {
      type: String,
      enum: ["Topwear", "Bottomwear", "Winterwear"],
    },
    unitsSold: {
      type: Number,
      default: 0,
    },
    photoUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", productSchema);
