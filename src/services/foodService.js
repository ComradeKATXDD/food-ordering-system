import { foods as initialFoods } from "../data/foods";
import { categories } from "../data/categories";

const FOODS_KEY = "food_ordering_foods";

// Initialize localStorage with initial foods if empty
const getStoredFoods = () => {
  const stored = localStorage.getItem(FOODS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialFoods;
    }
  }
  localStorage.setItem(FOODS_KEY, JSON.stringify(initialFoods));
  return initialFoods;
};

const saveFoods = (foodsList) => {
  localStorage.setItem(FOODS_KEY, JSON.stringify(foodsList));
};

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const foodService = {
  async getFoods({ category, search, minPrice, maxPrice, minRating, sortBy } = {}) {
    await delay(300);
    let result = [...getStoredFoods()];

    if (category && category !== "all") {
      result = result.filter((item) => item.category.toLowerCase() === category.toLowerCase());
    }

    if (search && search.trim() !== "") {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.ingredients.some((ing) => ing.toLowerCase().includes(q))
      );
    }

    if (minPrice !== undefined && minPrice !== null) {
      result = result.filter((item) => item.price >= Number(minPrice));
    }

    if (maxPrice !== undefined && maxPrice !== null && maxPrice > 0) {
      result = result.filter((item) => item.price <= Number(maxPrice));
    }

    if (minRating) {
      result = result.filter((item) => item.rating >= Number(minRating));
    }

    if (sortBy) {
      if (sortBy === "price-asc") {
        result.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price-desc") {
        result.sort((a, b) => b.price - a.price);
      } else if (sortBy === "rating") {
        result.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === "popular") {
        result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
      }
    }

    return result;
  },

  async getFoodById(id) {
    await delay(250);
    const all = getStoredFoods();
    const found = all.find((item) => item.id === id);
    if (!found) {
      throw new Error("Food item not found");
    }
    return found;
  },

  async getCategories() {
    await delay(150);
    return categories;
  },

  async addFood(foodData) {
    await delay(400);
    const current = getStoredFoods();
    const newFood = {
      ...foodData,
      id: `food-${Date.now()}`,
      rating: Number(foodData.rating) || 4.5,
      reviewsCount: 1,
      price: Number(foodData.price) || 9.99,
      ingredients: Array.isArray(foodData.ingredients)
        ? foodData.ingredients
        : (foodData.ingredients || "").split(",").map((s) => s.trim()).filter(Boolean)
    };
    const updated = [newFood, ...current];
    saveFoods(updated);
    return newFood;
  },

  async updateFood(id, foodData) {
    await delay(400);
    const current = getStoredFoods();
    const index = current.findIndex((item) => item.id === id);
    if (index === -1) throw new Error("Food item not found");

    const updatedFood = {
      ...current[index],
      ...foodData,
      price: Number(foodData.price),
      ingredients: Array.isArray(foodData.ingredients)
        ? foodData.ingredients
        : (foodData.ingredients || "").split(",").map((s) => s.trim()).filter(Boolean)
    };

    current[index] = updatedFood;
    saveFoods(current);
    return updatedFood;
  },

  async deleteFood(id) {
    await delay(350);
    const current = getStoredFoods();
    const updated = current.filter((item) => item.id !== id);
    saveFoods(updated);
    return { success: true, id };
  }
};
