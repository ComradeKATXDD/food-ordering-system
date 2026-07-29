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
    
    // Map _id to id for frontend compatibility
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
    const food = await Food.findById(req.params.id);
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
      category,
      price,
      description,
      image,
      ingredients: Array.isArray(ingredients) ? ingredients : (ingredients || "").split(",").map((s) => s.trim()),
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
    const food = await Food.findById(req.params.id);
    if (food) {
      food.name = req.body.name || food.name;
      food.category = req.body.category || food.category;
      food.price = req.body.price !== undefined ? req.body.price : food.price;
      food.description = req.body.description || food.description;
      food.image = req.body.image || food.image;
      food.prepTime = req.body.prepTime || food.prepTime;
      if (req.body.ingredients) {
        food.ingredients = Array.isArray(req.body.ingredients)
          ? req.body.ingredients
          : req.body.ingredients.split(",").map((s) => s.trim());
      }
      if (req.body.isPopular !== undefined) food.isPopular = req.body.isPopular;
      if (req.body.isFeatured !== undefined) food.isFeatured = req.body.isFeatured;
      if (req.body.inStock !== undefined) food.inStock = req.body.inStock;

      const updatedFood = await food.save();
      res.json({
        ...updatedFood.toObject(),
        id: updatedFood._id.toString(),
      });
    } else {
      res.status(404).json({ message: "Food item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (food) {
      await food.deleteOne();
      res.json({ message: "Food item removed successfully" });
    } else {
      res.status(404).json({ message: "Food item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
