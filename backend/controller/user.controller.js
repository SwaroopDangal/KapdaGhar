import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
export const handleRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: "false",
        message: "User already exists",
      });
    }
    const hashedPassowrd = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassowrd,
    });
    return res.status(201).json({
      success: true,
      message: `Hello ${name.split(" ")[0]},welcome to Kapda Ghar`,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};
export const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: "false",
        message: "Incorrect email or password",
      });
    }
    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      return res.status(400).json({
        success: "false",
        message: "Incorrect email or password",
      });
    }
    generateToken(
      res,
      user,
      `Hello ${user.name.split(" ")[0]},welcome back to Kapda Ghar`
    );
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

export const handleLogout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

export const loadUser = async (req, res) => {
  try {
    const userId = req.id;
    console.log(userId);
    const user = await User.findById(userId).select("role");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        user: "",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User found",
      userRole: user.role,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "User fetching failed",
    });
  }
};
