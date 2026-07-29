import { Settings } from "../models/Settings.js";

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        enabled: true,
        bgPattern: "warm-glow",
        edgeEffects: true,
        customBgImageUrl: "",
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { enabled, bgPattern, edgeEffects, customBgImageUrl } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }

    if (enabled !== undefined) settings.enabled = !!enabled;
    if (bgPattern !== undefined) settings.bgPattern = bgPattern;
    if (edgeEffects !== undefined) settings.edgeEffects = !!edgeEffects;
    if (customBgImageUrl !== undefined) settings.customBgImageUrl = customBgImageUrl;

    const updated = await settings.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
