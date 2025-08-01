import express from "express";
import {
  handleLogin,
  handleLogout,
  handleRegister,
  loadUser,
} from "../controller/user.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(handleRegister);
router.route("/login").post(handleLogin);
router.route("/logout").post(handleLogout);
router.route("/").get(isAuthenticated, loadUser);

export default router;
