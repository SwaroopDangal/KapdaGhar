import express from "express";
import upload from "../utils/multer.js";
import {
  addProduct,
  getAllProduct,
  getProductById,
  getLatestCollections,
  getBestSellers,
  getFeaturedProducts,
  searchAndFilter,
  deleteProduct,
} from "../controller/product.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isAdmin from "../middleware/isAdmin.js";
const router = express.Router();

// Routes
router.post(
  "/add",
  isAuthenticated,
  isAdmin,
  upload.single("photo"),
  addProduct
);
router.get("/all", getAllProduct);
router.get("/latest", getLatestCollections);
router.get("/bestsellers", getBestSellers);
router.get("/featuredProducts", getFeaturedProducts);
router.get("/product/:productId", getProductById);
router.get("/collection", searchAndFilter);
router.delete("/:productId", isAuthenticated, isAdmin, deleteProduct);

export default router;
