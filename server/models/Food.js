import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userAvatar: {
      type: String,
      default: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    text: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Food name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      lowercase: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    initialRating: {
      type: Number,
      default: 4.5,
    },
    reviewsCount: {
      type: Number,
      default: 1,
    },
    initialReviewsCount: {
      type: Number,
      default: 1,
    },
    prepTime: {
      type: String,
      default: "15-20 min",
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    ingredients: [
      {
        type: String,
      },
    ],
    inStock: {
      type: Boolean,
      default: true,
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);

export const Food = mongoose.model("Food", foodSchema);
