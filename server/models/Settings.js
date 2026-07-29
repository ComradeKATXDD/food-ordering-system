import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    enabled: {
      type: Boolean,
      default: true,
    },
    bgPattern: {
      type: String,
      default: "warm-glow", // "none" | "warm-glow" | "food-doodles" | "spicy-vignette" | "custom"
    },
    edgeEffects: {
      type: Boolean,
      default: true,
    },
    customBgImageUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Settings = mongoose.model("Settings", settingsSchema);
