import { Product } from "../models/product.models.js";
import fs from "fs/promises";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const addProduct = async (req, res) => {
  try {
    const { name, price, description, sizes, category, subCategory } = req.body;
    const photo = req.file;

    if (!name || !price || !description || !sizes || !photo) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let parsedSizes = [];
    try {
      parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
      if (
        !Array.isArray(parsedSizes) ||
        parsedSizes.some(
          (s) =>
            !["S", "M", "L", "XL", "XXL"].includes(s.size) ||
            typeof s.stock !== "number"
        )
      ) {
        throw new Error();
      }
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid sizes format. Expected array of { size, stock }.",
      });
    }

    let productPic;
    if (photo && photo.path) {
      // ✅ Check if path exists
      productPic = await uploadMedia(photo.path);
      await fs.unlink(photo.path);
    } else if (photo) {
      // ✅ Handle the case where path is undefined (Vercel production)
      console.log("File path is undefined - production environment detected");
      return res.status(400).json({
        success: false,
        message:
          "File upload not supported in current environment. Please use memory storage.",
      });
    }

    const product = await Product.create({
      name,
      price,
      description,
      sizes: parsedSizes,
      category,
      subCategory,
      photoUrl: productPic?.secure_url,
    });

    return res.status(201).json({
      success: true,
      message: "Product Created successfully",
      product,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Product creation failed",
    });
  }
};
export const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    if (!products) {
      return res.status(404).json({
        success: true,
        message: "No product found",
        products: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "Product Fetched successfully",
      products,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Product fetching failed",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Product Fetched successfully",
      product,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Product fetching by Id failed",
    });
  }
};

export const getLatestCollections = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    if (!products) {
      return res.status(404).json({
        success: true,
        message: "No product found",
        products: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "Latest Collections Fetched successfully",
      products: products.filter((_, index) => index < 8),
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Latest collections failed",
    });
  }
};

export const getBestSellers = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ unitsSold: -1 });
    if (!products) {
      return res.status(404).json({
        success: true,
        message: "No product found",
        products: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "Best sellers Fetched successfully",
      products: products.filter((_, index) => index < 8),
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Best sellers failed",
    });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $match: {
          sizes: {
            $elemMatch: { stock: { $gt: 0 } },
          },
        },
      },
      { $sample: { size: 15 } },
    ]);

    return res.status(200).json({
      success: true,
      message: "Featured products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Error fetching featured products:", error.message);
    return res.status(500).json({
      success: false,
      message: "Fetching featured products failed",
    });
  }
};

export const searchAndFilter = async (req, res) => {
  try {
    const {
      query = "", // This is the search string
      categories = "",
      sortByPrice = "",
      types = "",
    } = req.query || {};

    const categoryArray = categories ? categories.split(",") : [];
    const typeArray = types ? types.split(",") : [];

    // Search conditions
    const searchCriteria = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    };

    if (categoryArray.length > 0) {
      searchCriteria.category = { $in: categoryArray };
    }
    if (typeArray.length > 0) {
      searchCriteria.subCategory = { $in: typeArray };
    }

    const sortOptions = {};
    if (sortByPrice === "lowtohigh") sortOptions.price = 1;
    else if (sortByPrice === "hightolow") sortOptions.price = -1;

    // Use different variable name for MongoDB query
    let productQuery = Product.find(searchCriteria);
    if (Object.keys(sortOptions).length > 0) {
      productQuery = productQuery.sort(sortOptions);
    }

    const products = await productQuery;

    return res.status(200).json({
      success: true,
      products: products || [],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to search products",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not found",
      });
    }
    // Delete course thumbnail from Cloudinary if exists
    if (product.photoUrl) {
      const publicId = product.photoUrl.split("/").pop().split(".")[0];
      await deleteMediaFromCloudinary(publicId);
    }

    await Product.findByIdAndDelete(productId);

    return res.status(200).json({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};
