import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
} from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

// Admin user management routes
router.get("/users", protect, adminOnly, getAllUsers);
router.patch("/users/:id/toggle-status", protect, adminOnly, toggleUserStatus);
router.delete("/users/:id", protect, adminOnly, deleteUser);

export default router;
