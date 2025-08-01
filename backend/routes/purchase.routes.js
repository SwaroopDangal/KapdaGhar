import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isAdmin from "../middleware/isAdmin.js";
import {
  GetAllOrders,
  completeCartPayment,
  completeProductPayment,
  getUserOrder,
  initializeEsewaForCart,
  initializeEsewaForProduct,
  updateDeliveryStatus,
} from "../controller/purchaseProduct.controller.js";

const router = express.Router();

router
  .route("/esewa/initialize")
  .post(isAuthenticated, initializeEsewaForProduct);

router.route("/esewa/complete-payment").get(completeProductPayment);

router
  .route("/esewa/cart/initialize")
  .post(isAuthenticated, initializeEsewaForCart);
router.route("/esewa/cart/complete-payment").get(completeCartPayment);
router.get("/orders", isAuthenticated, isAdmin, GetAllOrders);
router.get("/my-orders", isAuthenticated, getUserOrder);
router.put(
  "/change-delivery-status",
  isAuthenticated,
  isAdmin,
  updateDeliveryStatus
);

export default router;
