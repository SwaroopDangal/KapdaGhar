import Cart from "../models/cart.model.js";
import { Product } from "../models/product.models.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity, selectedSize } = req.body;
    const userId = req.id;

    //checking stock
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    const sizeStock = product.sizes.find((s) => s.size === selectedSize);
    if (!sizeStock || sizeStock.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Selected size is out of stock",
      });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
      });
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, selectedSize });
    }

    await cart.save();
    res.status(201).json({
      message: "Added to cart",
      cart,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Adding to cart failed",
    });
  }
};

export const itemCountInCart = async (req, res) => {
  try {
    const userId = req.id;
    let cart = await Cart.findOne({ user: userId });

    let totalQuantity = 0;

    if (!cart) {
      return res.status(200).json({
        success: "true",
        totalQuantity,
      });
    }

    cart.items.find((item) => {
      totalQuantity += item.quantity;
    });

    return res.status(200).json({
      success: "true",
      totalQuantity,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Fetching quantity failed",
    });
  }
};

export const getCartItems = async (req, res) => {
  try {
    const userId = req.id;
    let cart = await Cart.findOne({ user: userId }).populate("items.productId");
    console.log(cart);
    if (!cart) {
      return res.status(200).json({
        success: "true",
        cartItems: [],
      });
    }
    const formattedItems = cart.items.map((item) => {
      const product = item.productId;
      return {
        _id: item._id,
        productId: product._id,
        name: product.name,
        price: product.price,
        description: product.description,
        sizes: product.sizes,
        category: product.category,
        subCategory: product.subCategory,
        unitsSold: product.unitsSold,
        photoUrl: product.photoUrl,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
      };
    });
    return res.status(200).json({
      success: "true",
      cartItems: formattedItems,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Fetching cart Item failed",
    });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { productId, quantity, selectedSize } = req.body;
    const userId = req.id;

    //checking stock
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    const sizeStock = product.sizes.find((s) => s.size === selectedSize);
    if (!sizeStock || sizeStock.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Selected size is out of stock",
      });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: "false",
        message: "Cart not foud",
      });
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      cart.items.push({ productId, quantity, selectedSize });
    }

    await cart.save();
    res.status(201).json({
      message: "Cart updated",
      cart,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Updating cart failed",
    });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const userId = req.id;
    const { productId, selectedSize } = req.body;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Filter out the item with matching productId and selectedSize
    cart.items = cart.items.filter(
      (item) =>
        item.productId.toString() !== productId ||
        item.selectedSize !== selectedSize
    );

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cartItems: cart.items,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to remove item from cart",
    });
  }
};
