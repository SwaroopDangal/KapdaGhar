import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    req.id = user._id; // optional, if you already use this
    req.user = user; // 👈 required for role-based checks
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(500).json({
      message: "Authentication error",
      success: false,
    });
  }
};

export default isAuthenticated;
