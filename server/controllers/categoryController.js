import { Category } from "../models/Category.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: 1 });
    const mappedCategories = categories.map((cat) => ({
      id: cat.slug || cat._id.toString(),
      name: cat.name,
      icon: cat.icon,
      description: cat.description,
    }));
    res.json(mappedCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
