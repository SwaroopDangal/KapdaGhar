import { Product } from "../models/product.models.js";
import Cart from "../models/cart.model.js";
import { ProductPurchase } from "../models/purchaseProduct.model.js";

import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export const getEsewaPaymentHash = async ({ amount, transaction_uuid }) => {
  try {
    const data = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE}`;

    const secretKey = process.env.ESEWA_SECRET_KEY;
    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(data)
      .digest("base64");

    return {
      signature: hash,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };
  } catch (error) {
    throw error;
  }
};

export const verifyEsewaTransaction = async (encodedData) => {
  try {
    console.log("Raw encoded data:", encodedData);

    let decodedData = Buffer.from(encodedData, "base64").toString("utf-8");
    console.log("Decoded string:", decodedData);

    decodedData = JSON.parse(decodedData);
    console.log("Parsed data:", decodedData);

    // Build signature string exactly as eSewa expects
    const data = `transaction_code=${decodedData.transaction_code},status=${decodedData.status},total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE},signed_field_names=${decodedData.signed_field_names}`;

    console.log("Data string for signature:", data);

    const secretKey = process.env.ESEWA_SECRET_KEY;
    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(data)
      .digest("base64");

    console.log("Generated Hash:", hash);
    console.log("eSewa Signature:", decodedData.signature);

    if (hash !== decodedData.signature) {
      console.error("❌ Signature mismatch!");
      throw new Error("Signature mismatch");
    }

    console.log("✅ Signature verified, checking with eSewa server...");

    // Verify with eSewa server
    const verificationUrl = `${process.env.ESEWA_GATEWAY_URL}/api/epay/transaction/status/?product_code=${process.env.ESEWA_PRODUCT_CODE}&total_amount=${decodedData.total_amount}&transaction_uuid=${decodedData.transaction_uuid}`;

    console.log("Verification URL:", verificationUrl);

    const response = await axios.get(verificationUrl, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    console.log("eSewa server response:", response.data);

    // Validate response data
    if (response.data.status !== "COMPLETE") {
      console.error("❌ Transaction not complete:", response.data.status);
      throw new Error(
        `Transaction status is ${response.data.status}, not COMPLETE`
      );
    }

    if (response.data.transaction_uuid !== decodedData.transaction_uuid) {
      console.error("❌ Transaction UUID mismatch");
      throw new Error("Transaction UUID mismatch");
    }

    if (
      Number(response.data.total_amount) !== Number(decodedData.total_amount)
    ) {
      console.error("❌ Amount mismatch");
      throw new Error("Transaction amount mismatch");
    }

    console.log("✅ Transaction verified successfully");

    return {
      decoded: decodedData,
      response: response.data,
    };
  } catch (error) {
    console.error("verifyEsewaTransaction error:", error);
    throw error;
  }
};

export const verifyCartPayment = async (encodedData) => {
  try {
    console.log("Cart payment verification - Raw encoded data:", encodedData);

    // Decode base64 encoded data from Esewa
    let decodedData = Buffer.from(encodedData, "base64").toString("utf-8");
    console.log("Decoded string:", decodedData);

    decodedData = JSON.parse(decodedData);
    console.log("Parsed cart data:", decodedData);

    // Build the string to sign exactly as per Esewa cart payment fields
    const data = `transaction_code=${decodedData.transaction_code},status=${decodedData.status},total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE},signed_field_names=${decodedData.signed_field_names}`;

    console.log("Cart signature data string:", data);

    // Create HMAC SHA256 hash with your secret key
    const secretKey = process.env.ESEWA_SECRET_KEY;
    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(data)
      .digest("base64");

    console.log("Generated cart hash:", hash);
    console.log("eSewa cart signature:", decodedData.signature);

    // Check if signature matches
    if (hash !== decodedData.signature) {
      console.error("❌ Cart signature mismatch!");
      throw new Error("Signature mismatch");
    }

    console.log("✅ Cart signature verified");

    // Verify transaction status from Esewa server
    const verificationUrl = `${process.env.ESEWA_GATEWAY_URL}/api/epay/transaction/status/?product_code=${process.env.ESEWA_PRODUCT_CODE}&total_amount=${decodedData.total_amount}&transaction_uuid=${decodedData.transaction_uuid}`;

    console.log("Cart verification URL:", verificationUrl);

    const response = await axios.get(verificationUrl, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    console.log("eSewa cart server response:", response.data);

    if (response.data.status !== "COMPLETE") {
      console.error("❌ Cart transaction not complete:", response.data.status);
      throw new Error(
        `Transaction status is ${response.data.status}, not COMPLETE`
      );
    }

    if (response.data.transaction_uuid !== decodedData.transaction_uuid) {
      console.error("❌ Cart transaction UUID mismatch");
      throw new Error("Transaction UUID mismatch");
    }

    if (
      Number(response.data.total_amount) !== Number(decodedData.total_amount)
    ) {
      console.error("❌ Cart amount mismatch");
      throw new Error("Transaction amount mismatch");
    }

    console.log("✅ Cart transaction verified successfully");

    return {
      decoded: decodedData,
      response: response.data,
    };
  } catch (error) {
    console.error("verifyCartPayment error:", error);
    throw error;
  }
};

export const initializeEsewaForProduct = async (req, res) => {
  try {
    const userId = req.id;
    const { productId, selectedSize, quantity } = req.body;

    console.log("Product payment init:", {
      userId,
      productId,
      selectedSize,
      quantity,
    });

    const product = await Product.findById(productId);
    if (!product) {
      console.error("❌ Product not found:", productId);
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const sizeInfo = product.sizes.find((s) => s.size === selectedSize);
    if (!sizeInfo || sizeInfo.stock < quantity) {
      console.error("❌ Insufficient stock:", {
        sizeInfo,
        requestedQuantity: quantity,
      });
      return res.status(400).json({
        success: false,
        message: "Insufficient stock for selected size",
      });
    }

    const totalAmount = product.price * quantity;
    console.log("Total amount calculated:", totalAmount);

    const purchase = await ProductPurchase.create({
      productId,
      userId,
      selectedSize,
      quantity,
      amount: totalAmount,
      status: "PENDING",
    });

    console.log("Purchase created:", purchase._id);

    const payment = await getEsewaPaymentHash({
      amount: totalAmount,
      transaction_uuid: purchase._id.toString(),
    });

    console.log("Payment hash generated:", payment);

    return res.status(200).json({
      success: true,
      message: "eSewa payment initialized",
      payment,
      purchaseId: purchase._id,
      productName: product.name,
      amount: totalAmount,
    });
  } catch (error) {
    console.error("Esewa Init Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to initialize eSewa payment",
      error: error.message,
    });
  }
};

export const completeProductPayment = async (req, res) => {
  console.log("✅ eSewa hit complete-product-payment route");
  console.log("Request body:", req.body);
  console.log("Request query:", req.query);

  const encodedData = req.body?.encodedData || req.query?.data;
  console.log("Encoded data received:", encodedData);

  if (!encodedData) {
    console.error("❌ Missing encoded data");
    return res.status(400).send("Missing encoded data.");
  }

  try {
    const paymentInfo = await verifyEsewaTransaction(encodedData);
    const { transaction_uuid, transaction_code, total_amount } =
      paymentInfo.response;

    console.log("Product payment - transaction_uuid:", transaction_uuid);
    console.log(
      "Product payment - transaction_uuid type:",
      typeof transaction_uuid
    );

    // Check if this is actually a cart payment (UUID format)
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        transaction_uuid
      );

    if (isUUID) {
      console.log(
        "🔄 Detected cart payment UUID, redirecting to cart payment handler"
      );
      // This is actually a cart payment, handle it as such
      return await completeCartPaymentLogic(req, res, paymentInfo);
    }

    // Fix: Use proper MongoDB query - transaction_uuid should be the purchase._id for single products
    const purchase = await ProductPurchase.findById(transaction_uuid).populate(
      "productId"
    );

    if (!purchase) {
      console.error("❌ Purchase not found for ID:", transaction_uuid);
      return res.status(404).send("Purchase not found");
    }

    console.log("Purchase found:", purchase._id, "Status:", purchase.status);

    if (purchase.status === "COMPLETED") {
      console.log("⚠️ Purchase already completed, redirecting");
      return res.redirect(
        `${process.env.FRONTEND_URL}/product/${purchase.productId._id}`
      );
    }

    // ✅ Update purchase
    purchase.status = "COMPLETED";
    purchase.amount = Number(total_amount);
    purchase.transactionId = transaction_code;
    purchase.dataFromVerificationReq = paymentInfo;
    purchase.apiQueryFromUser = req.query;
    await purchase.save();

    console.log("✅ Purchase updated to COMPLETED");

    // ✅ Update stock
    const product = purchase.productId;
    const sizeIndex = product.sizes.findIndex(
      (s) => s.size === purchase.selectedSize
    );
    if (sizeIndex !== -1) {
      product.sizes[sizeIndex].stock -= purchase.quantity;
      console.log(
        `✅ Stock updated for ${product.name} - ${purchase.selectedSize}`
      );
    }
    product.unitsSold += purchase.quantity;
    await product.save();

    console.log("✅ Product stock and units sold updated");

    return res.redirect(`${process.env.FRONTEND_URL}/product/${product._id}`);
  } catch (error) {
    console.error("❌ Complete Payment Error:", error);
    return res
      .status(500)
      .send(`Esewa payment verification failed: ${error.message}`);
  }
};

// Helper function to handle cart payment logic
const completeCartPaymentLogic = async (req, res, paymentInfo) => {
  try {
    const { transaction_uuid, transaction_code, total_amount } =
      paymentInfo.response;

    console.log("Cart payment logic - transaction_uuid:", transaction_uuid);

    // Fix: Use orderGroupId to find purchases, not _id
    const purchases = await ProductPurchase.find({
      orderGroupId: transaction_uuid,
      status: "PENDING", // Only get pending purchases
    }).populate("productId");

    if (!purchases || purchases.length === 0) {
      console.error(
        "❌ No matching purchases found for orderGroupId:",
        transaction_uuid
      );
      return res.status(404).send("No matching purchases found");
    }

    console.log(`Found ${purchases.length} purchases to complete`);

    for (const purchase of purchases) {
      if (purchase.status === "COMPLETED") {
        console.log(`⚠️ Purchase ${purchase._id} already completed, skipping`);
        continue;
      }

      purchase.status = "COMPLETED";
      purchase.transactionId = transaction_code;
      purchase.dataFromVerificationReq = paymentInfo;
      purchase.apiQueryFromUser = req.query;
      await purchase.save();

      console.log(`✅ Purchase ${purchase._id} marked as COMPLETED`);

      // Update stock
      const product = purchase.productId;
      const sizeIndex = product.sizes.findIndex(
        (s) => s.size === purchase.selectedSize
      );
      if (sizeIndex !== -1) {
        product.sizes[sizeIndex].stock -= purchase.quantity;
        console.log(
          `✅ Stock updated for ${product.name} - ${purchase.selectedSize}`
        );
      }
      product.unitsSold += purchase.quantity;
      await product.save();
    }

    // Clear cart
    const userId = purchases[0].userId;
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      await cart.save();
      console.log("✅ Cart cleared for user:", userId);
    }

    return res.redirect(`${process.env.FRONTEND_URL}/cart`);
  } catch (error) {
    console.error("❌ Complete Cart Payment Logic Error:", error);
    return res
      .status(500)
      .send(`Cart payment completion failed: ${error.message}`);
  }
};

export const initializeEsewaForCart = async (req, res) => {
  try {
    const userId = req.id;
    console.log("Cart payment init for user:", userId);

    const cart = await Cart.findOne({ user: userId }).populate(
      "items.productId"
    );

    if (!cart || cart.items.length === 0) {
      console.error("❌ Cart is empty for user:", userId);
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    let totalAmount = 0;
    const orderGroupId = uuidv4(); // Shared among all items
    const pendingPurchases = [];

    console.log("Processing cart items, orderGroupId:", orderGroupId);

    // Check stock + create PENDING purchases
    for (const item of cart.items) {
      const product = item.productId;
      const sizeStock = product.sizes.find((s) => s.size === item.selectedSize);

      if (!sizeStock || sizeStock.stock < item.quantity) {
        console.error("❌ Insufficient stock:", {
          product: product.name,
          size: item.selectedSize,
          available: sizeStock?.stock,
          requested: item.quantity,
        });
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name} - ${item.selectedSize}`,
        });
      }

      const itemAmount = item.quantity * product.price;
      totalAmount += itemAmount;

      const purchase = await ProductPurchase.create({
        productId: product._id,
        userId,
        selectedSize: item.selectedSize,
        quantity: item.quantity,
        amount: itemAmount,
        status: "PENDING",
        orderGroupId,
      });

      pendingPurchases.push(purchase);
      console.log(`✅ Created pending purchase for ${product.name}`);
    }

    console.log("Total cart amount:", totalAmount);

    const payment = await getEsewaPaymentHash({
      amount: totalAmount,
      transaction_uuid: orderGroupId, // used to identify group
    });

    console.log("Cart payment hash generated:", payment);

    return res.status(200).json({
      success: true,
      message: "eSewa payment initialized",
      payment,
      orderGroupId,
      amount: totalAmount,
    });
  } catch (error) {
    console.error("Cart Payment Init Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to initialize cart payment",
      error: error.message,
    });
  }
};

export const completeCartPayment = async (req, res) => {
  console.log("✅ eSewa hit complete-cart-payment route");
  console.log("Request body:", req.body);
  console.log("Request query:", req.query);

  const encodedData = req.body?.encodedData || req.query?.data;
  if (!encodedData) {
    console.error("❌ Missing encoded data for cart payment");
    return res.status(400).send("Missing encoded data");
  }

  try {
    const paymentInfo = await verifyCartPayment(encodedData);
    const { transaction_uuid, transaction_code, total_amount } =
      paymentInfo.response;

    console.log("Cart payment - transaction_uuid:", transaction_uuid);
    console.log(
      "Cart payment - transaction_uuid type:",
      typeof transaction_uuid
    );

    // Fix: Use orderGroupId to find purchases, not _id
    const purchases = await ProductPurchase.find({
      orderGroupId: transaction_uuid,
      status: "PENDING", // Only get pending purchases
    }).populate("productId");

    if (!purchases || purchases.length === 0) {
      console.error(
        "❌ No matching purchases found for orderGroupId:",
        transaction_uuid
      );
      return res.status(404).send("No matching purchases found");
    }

    console.log(`Found ${purchases.length} purchases to complete`);

    for (const purchase of purchases) {
      if (purchase.status === "COMPLETED") {
        console.log(`⚠️ Purchase ${purchase._id} already completed, skipping`);
        continue;
      }

      purchase.status = "COMPLETED";
      purchase.transactionId = transaction_code;
      purchase.dataFromVerificationReq = paymentInfo;
      purchase.apiQueryFromUser = req.query;
      await purchase.save();

      console.log(`✅ Purchase ${purchase._id} marked as COMPLETED`);

      // Update stock
      const product = purchase.productId;
      const sizeIndex = product.sizes.findIndex(
        (s) => s.size === purchase.selectedSize
      );
      if (sizeIndex !== -1) {
        product.sizes[sizeIndex].stock -= purchase.quantity;
        console.log(
          `✅ Stock updated for ${product.name} - ${purchase.selectedSize}`
        );
      }
      product.unitsSold += purchase.quantity;
      await product.save();
    }

    // Clear cart
    const userId = purchases[0].userId;
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      await cart.save();
      console.log("✅ Cart cleared for user:", userId);
    }

    return res.redirect(`${process.env.FRONTEND_URL}/cart`);
  } catch (error) {
    console.error("❌ Complete Cart Payment Error:", error);
    return res
      .status(500)
      .send(`Esewa cart payment verification failed: ${error.message}`);
  }
};

export const purchaseWholeCart = async (req, res) => {
  try {
    const userId = req.id;
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.productId"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const orderGroupId = uuidv4();
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = item.productId;
      const sizeStock = product.sizes.find((s) => s.size === item.selectedSize);

      if (!sizeStock || sizeStock.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name} - ${item.selectedSize}`,
        });
      }

      const itemAmount = item.quantity * product.price;
      totalAmount += itemAmount;

      await ProductPurchase.create({
        productId: product._id,
        userId,
        selectedSize: item.selectedSize,
        quantity: item.quantity,
        amount: itemAmount,
        status: "PENDING",
        deliveryStatus: "PLACED",
        orderGroupId,
      });
    }

    // Generate eSewa payment hash
    const payment = await getEsewaPaymentHash({
      amount: totalAmount,
      transaction_uuid: orderGroupId,
    });

    return res.status(200).json({
      success: true,
      message: "Cart payment initialized",
      payment,
      orderGroupId,
      amount: totalAmount,
    });
  } catch (error) {
    console.error("Cart Payment Init Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to initialize cart payment",
    });
  }
};

export const updateDeliveryStatus = async (req, res) => {
  try {
    const { status, purchaseId } = req.body;
    console.log(purchaseId);

    if (!["PLACED", "ON_THE_WAY", "DELIVERED"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    const purchase = await ProductPurchase.findById(purchaseId);
    if (!purchase)
      return res
        .status(404)
        .json({ success: false, message: "Purchase not found" });

    purchase.deliveryStatus = status;
    await purchase.save();

    return res.status(200).json({
      success: true,
      message: "Delivery status updated successfully",
      updatedStatus: status,
    });
  } catch (err) {
    console.error("Error updating delivery status:");
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const GetAllOrders = async (req, res) => {
  try {
    const orders = await ProductPurchase.find({ status: "COMPLETED" })
      .populate("userId", "name")
      .populate("productId", "name price photoUrl _id");

    if (!orders) {
      return res.status(404).json({
        success: false,
        orders: [],
        totalOrders: 0,
        deliveredOrders: 0,
        onTheWayOrders: 0,
        totalRevenue: 0,
        message: "No orders found",
      });
    }
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter(
      (item) => item.deliveryStatus == "DELIVERED"
    ).length;
    const onTheWayOrders = orders.filter(
      (item) => item.deliveryStatus == "ON_THE_WAY"
    ).length;
    let totalRevenue = 0;
    orders.map((item) => {
      totalRevenue += item.quantity * item.amount;
    });
    const formattedOrders = orders.map((order) => ({
      orderId: order._id,
      productId: order.productId._id,
      productName: order.productId.name,
      productPrice: order.productId.price,
      productPhotoUrl: order.productId.photoUrl,
      userName: order.userId.name,
      quantity: order.quantity,
      amount: order.amount,
      deliveryStatus: order.deliveryStatus,
    }));

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      orders: formattedOrders,
      totalOrders,
      deliveredOrders,
      onTheWayOrders,
      totalRevenue,
    });
  } catch (error) {
    console.error("Error fetching orders:");
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getUserOrder = async (req, res) => {
  try {
    const userId = req.id;
    console.log(userId);

    const orders = await ProductPurchase.find({
      userId: userId,
      status: "COMPLETED",
    })
      .populate("productId", "name price photoUrl _id")
      .sort({ createdAt: -1 });

    if (!orders) {
      return res.status(404).json({
        success: false,
        orders: [],
        message: "No orders found",
      });
    }
    const formattedOrders = orders.map((order) => ({
      orderId: order._id,
      productId: order.productId._id,
      productName: order.productId.name,
      productPhotoUrl: order.productId.photoUrl,
      quantity: order.quantity,
      size: order.selectedSize,
      amount: order.amount,
      deliveryStatus: order.deliveryStatus,
    }));
    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      orders: formattedOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:");
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
