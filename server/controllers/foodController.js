import mongoose from "mongoose";
import { Food } from "../models/Food.js";

export const getFoods = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, minRating, sortBy } = req.query;

    let query = {};

    if (category && category !== "all") {
      query.category = category.toLowerCase();
    }

    if (search && search.trim() !== "") {
      const q = search.trim();
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { ingredients: { $regex: q, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    let sortOptions = {};
    if (sortBy === "price-asc") {
      sortOptions.price = 1;
    } else if (sortBy === "price-desc") {
      sortOptions.price = -1;
    } else if (sortBy === "rating") {
      sortOptions.rating = -1;
    } else if (sortBy === "popular") {
      sortOptions.reviewsCount = -1;
    } else {
      sortOptions.createdAt = -1;
    }

    const foods = await Food.find(query).sort(sortOptions);

    const mappedFoods = foods.map((f) => ({
      ...f.toObject(),
      id: f._id.toString(),
    }));

    res.json(mappedFoods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFoodById = async (req, res) => {
  try {
    let food = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      food = await Food.findById(req.params.id);
    }
    if (!food) {
      food = await Food.findOne({ name: { $regex: req.params.id, $options: "i" } });
    }

    if (food) {
      res.json({
        ...food.toObject(),
        id: food._id.toString(),
      });
    } else {
      res.status(404).json({ message: "Food item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createFood = async (req, res) => {
  try {
    const { name, category, price, description, image, ingredients, prepTime, isPopular, isFeatured } = req.body;

    const food = new Food({
      name,
      category: category ? category.toLowerCase() : "pizza",
      price: Number(price) || 0,
      description,
      image,
      ingredients: Array.isArray(ingredients)
        ? ingredients
        : (ingredients || "").split(",").map((s) => s.trim()).filter(Boolean),
      prepTime: prepTime || "15-20 min",
      isPopular: !!isPopular,
      isFeatured: !!isFeatured,
    });

    const createdFood = await food.save();
    res.status(201).json({
      ...createdFood.toObject(),
      id: createdFood._id.toString(),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateFood = async (req, res) => {
  try {
    let food = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      food = await Food.findById(req.params.id);
    }

    if (!food && req.body.name) {
      food = await Food.findOne({ name: { $regex: req.body.name, $options: "i" } });
    }

    // If still not found, create new food document
    if (!food) {
      food = new Food({
        name: req.body.name || "New Item",
        category: (req.body.category || "pizza").toLowerCase(),
        price: Number(req.body.price) || 199,
        description: req.body.description || "Freshly prepared dish.",
        image: req.body.image || "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
        ingredients: Array.isArray(req.body.ingredients)
          ? req.body.ingredients
          : (req.body.ingredients || "").split(",").map((s) => s.trim()).filter(Boolean),
        isPopular: !!req.body.isPopular,
        isFeatured: !!req.body.isFeatured,
      });
    } else {
      food.name = req.body.name || food.name;
      food.category = req.body.category ? req.body.category.toLowerCase() : food.category;
      food.price = req.body.price !== undefined ? Number(req.body.price) : food.price;
      food.description = req.body.description || food.description;
      food.image = req.body.image || food.image;
      food.prepTime = req.body.prepTime || food.prepTime;
      if (req.body.ingredients !== undefined) {
        food.ingredients = Array.isArray(req.body.ingredients)
          ? req.body.ingredients
          : (req.body.ingredients || "").split(",").map((s) => s.trim()).filter(Boolean);
      }
      if (req.body.isPopular !== undefined) food.isPopular = req.body.isPopular;
      if (req.body.isFeatured !== undefined) food.isFeatured = req.body.isFeatured;
      if (req.body.inStock !== undefined) food.inStock = req.body.inStock;
    }

    const updatedFood = await food.save();
    res.json({
      ...updatedFood.toObject(),
      id: updatedFood._id.toString(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFood = async (req, res) => {
  try {
    let food = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      food = await Food.findById(req.params.id);
    }

    if (food) {
      await food.deleteOne();
      res.json({ message: "Food item removed successfully" });
    } else {
      await Food.deleteOne({ _id: req.params.id });
      res.json({ message: "Food item removed successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
