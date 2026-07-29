import { foods as initialFoods } from "../data/foods";
import { categories as initialCategories } from "../data/categories";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const FOODS_KEY = "food_ordering_foods";

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
    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (search) params.append("search", search);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (minRating) params.append("minRating", minRating);
      if (sortBy) params.append("sortBy", sortBy);

      const res = await fetch(`${API_URL}/foods?${params.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Backend offline fallback to local data
    }

    await delay(200);
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
          (item.ingredients && item.ingredients.some((ing) => ing.toLowerCase().includes(q)))
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
    try {
      const res = await fetch(`${API_URL}/foods/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    await delay(200);
    const all = getStoredFoods();
    const found = all.find((item) => item.id === id);
    if (!found) throw new Error("Food item not found");
    return found;
  },

  async getCategories() {
    try {
      const res = await fetch(`${API_URL}/categories`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    await delay(150);
    return initialCategories;
  },

  async addFood(foodData) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/foods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(foodData),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    await delay(300);
    const current = getStoredFoods();
    const newFood = {
      ...foodData,
      id: `food-${Date.now()}`,
      rating: Number(foodData.rating) || 4.5,
      reviewsCount: 1,
      price: Number(foodData.price) || 9.99,
      ingredients: Array.isArray(foodData.ingredients)
        ? foodData.ingredients
        : (foodData.ingredients || "").split(",").map((s) => s.trim()).filter(Boolean),
    };
    const updated = [newFood, ...current];
    saveFoods(updated);
    return newFood;
  },

  async updateFood(id, foodData) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/foods/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(foodData),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    await delay(300);
    const current = getStoredFoods();
    const index = current.findIndex((item) => item.id === id);
    if (index === -1) throw new Error("Food item not found");

    const updatedFood = {
      ...current[index],
      ...foodData,
      price: Number(foodData.price),
      ingredients: Array.isArray(foodData.ingredients)
        ? foodData.ingredients
        : (foodData.ingredients || "").split(",").map((s) => s.trim()).filter(Boolean),
    };

    current[index] = updatedFood;
    saveFoods(current);
    return updatedFood;
  },

  async deleteFood(id) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/foods/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (res.ok) {
        return { success: true, id };
      }
    } catch {
      // Fallback
    }

    await delay(300);
    const current = getStoredFoods();
    const updated = current.filter((item) => item.id !== id);
    saveFoods(updated);
    return { success: true, id };
  },
};
