import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  updateUserRole,
  deleteUser,
  getAllUser,
  getCurrentUser,
} from "../controllers/userController.js";
import { isAdmin, isAuthenticatedUser } from "../middleware/auth.js";

const router = express.Router();

router.route("/signup").post(signupUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/getCurrUser").get(isAuthenticatedUser, getCurrentUser);

export default router;
