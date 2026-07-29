import express from "express";
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, protectOptional, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protectOptional, createOrder);
router.get("/my-orders", protect, getUserOrders);
router.get("/admin/all", protect, adminOnly, getAllOrders);
router.patch("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
