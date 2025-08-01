import express from "express";

import isAuthenticated from "../middleware/isAuthenticated.js";
import {
  addToCart,
  deleteCartItem,
  getCartItems,
  itemCountInCart,
  updateCart,
} from "../controller/cart.controller.js";
const router = express.Router();

// Routes
router.post("/add", isAuthenticated, addToCart);
router.put("/update", isAuthenticated, updateCart);
router.delete("/delete", isAuthenticated, deleteCartItem);
router.get("/getCount", isAuthenticated, itemCountInCart);
router.get("/getItem", isAuthenticated, getCartItems);
export default router;
