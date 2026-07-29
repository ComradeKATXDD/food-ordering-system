import express from "express";
import {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  addComment,
  toggleLikeComment,
  toggleDislikeComment,
} from "../controllers/foodController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getFoods);
router.get("/:id", getFoodById);
router.post("/", protect, adminOnly, createFood);
router.put("/:id", protect, adminOnly, updateFood);
router.delete("/:id", protect, adminOnly, deleteFood);

// Comments & Likes Routes
router.post("/:id/comments", protect, addComment);
router.post("/:id/comments/:commentId/like", protect, toggleLikeComment);
router.post("/:id/comments/:commentId/dislike", protect, toggleDislikeComment);

export default router;
