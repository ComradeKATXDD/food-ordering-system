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

let cachedCategories = null;

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
      // Offline fallback
    }

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

    const all = getStoredFoods();
    const found = all.find((item) => item.id === id || item._id === id);
    if (!found) throw new Error("Food item not found");
    return found;
  },

  async getCategories() {
    if (cachedCategories) return cachedCategories;
    try {
      const res = await fetch(`${API_URL}/categories`);
      if (res.ok) {
        cachedCategories = await res.json();
        return cachedCategories;
      }
    } catch {
      // Fallback
    }

    cachedCategories = initialCategories;
    return initialCategories;
  },

  async addFood(foodData) {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...foodData,
        price: Number(foodData.price) || 199,
        rating: Number(foodData.rating) || 4.5,
        ingredients: Array.isArray(foodData.ingredients)
          ? foodData.ingredients
          : (foodData.ingredients || "").split(",").map((s) => s.trim()).filter(Boolean),
      };

      const res = await fetch(`${API_URL}/foods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const created = await res.json();
        const current = getStoredFoods();
        saveFoods([created, ...current]);
        return created;
      } else {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 401 || res.status === 403) {
          throw new Error(errData.message || "Admin authorization required to add dishes.");
        }
      }
    } catch (err) {
      if (err.message && !err.message.includes("fetch")) {
        throw err;
      }
    }

    const current = getStoredFoods();
    const newFood = {
      ...foodData,
      id: `food-${Date.now()}`,
      rating: Number(foodData.rating) || 4.5,
      reviewsCount: 1,
      price: Number(foodData.price) || 199,
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
      const payload = {
        ...foodData,
        price: Number(foodData.price),
        ingredients: Array.isArray(foodData.ingredients)
          ? foodData.ingredients
          : (foodData.ingredients || "").split(",").map((s) => s.trim()).filter(Boolean),
      };

      const res = await fetch(`${API_URL}/foods/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updated = await res.json();
        const current = getStoredFoods();
        const idx = current.findIndex((item) => item.id === id || item._id === id);
        if (idx !== -1) {
          current[idx] = { ...current[idx], ...updated };
          saveFoods(current);
        } else {
          saveFoods([updated, ...current]);
        }
        return updated;
      } else {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 401 || res.status === 403) {
          throw new Error(errData.message || "Admin authorization required to update dishes.");
        }
      }
    } catch (err) {
      if (err.message && !err.message.includes("fetch")) {
        throw err;
      }
    }

    const current = getStoredFoods();
    const index = current.findIndex((item) => item.id === id || item._id === id);
    if (index === -1) {
      const newLocal = {
        ...foodData,
        id: id || `food-${Date.now()}`,
        price: Number(foodData.price),
        rating: Number(foodData.rating) || 4.5,
      };
      saveFoods([newLocal, ...current]);
      return newLocal;
    }

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
        const current = getStoredFoods();
        saveFoods(current.filter((item) => item.id !== id && item._id !== id));
        return { success: true, id };
      }
    } catch {
      // Fallback
    }

    const current = getStoredFoods();
    const updated = current.filter((item) => item.id !== id && item._id !== id);
    saveFoods(updated);
    return { success: true, id };
  },

  async addComment(foodId, { rating, text }) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/foods/${foodId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ rating, text }),
      });
      if (res.ok) {
        return await res.json();
      }
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Failed to post review");
    } catch (err) {
      if (err.message && !err.message.includes("fetch")) {
        throw err;
      }
    }

    const current = getStoredFoods();
    const idx = current.findIndex((item) => item.id === foodId || item._id === foodId);
    if (idx !== -1) {
      const currentUser = JSON.parse(localStorage.getItem("food_ordering_user") || "{}");
      const comments = current[idx].comments || [];
      const newC = {
        _id: `comment-${Date.now()}`,
        userName: currentUser.name || "Customer",
        userAvatar: currentUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        rating: Number(rating),
        text,
        likes: [],
        dislikes: [],
        createdAt: new Date().toISOString(),
      };
      current[idx].comments = [newC, ...comments];
      const initR = current[idx].initialRating || current[idx].rating || 4.5;
      const initC = current[idx].initialReviewsCount || 1;
      const cSum = current[idx].comments.reduce((acc, c) => acc + c.rating, 0);
      current[idx].reviewsCount = initC + current[idx].comments.length;
      current[idx].rating = Number(((initR * initC + cSum) / current[idx].reviewsCount).toFixed(1));
      saveFoods(current);
      return current[idx];
    }
    throw new Error("Food item not found");
  },

  async likeComment(foodId, commentId) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/foods/${foodId}/comments/${commentId}/like`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const current = getStoredFoods();
    const idx = current.findIndex((item) => item.id === foodId || item._id === foodId);
    if (idx !== -1) {
      const currentUser = JSON.parse(localStorage.getItem("food_ordering_user") || "{}");
      const userId = currentUser.id || currentUser._id || "local-user";
      const comment = (current[idx].comments || []).find((c) => c._id === commentId || c.id === commentId);
      if (comment) {
        if (!comment.likes) comment.likes = [];
        if (!comment.dislikes) comment.dislikes = [];
        const lIdx = comment.likes.indexOf(userId);
        const dIdx = comment.dislikes.indexOf(userId);
        if (dIdx > -1) comment.dislikes.splice(dIdx, 1);
        if (lIdx > -1) comment.likes.splice(lIdx, 1);
        else comment.likes.push(userId);
        saveFoods(current);
      }
      return current[idx];
    }
    throw new Error("Food item not found");
  },

  async dislikeComment(foodId, commentId) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/foods/${foodId}/comments/${commentId}/dislike`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const current = getStoredFoods();
    const idx = current.findIndex((item) => item.id === foodId || item._id === foodId);
    if (idx !== -1) {
      const currentUser = JSON.parse(localStorage.getItem("food_ordering_user") || "{}");
      const userId = currentUser.id || currentUser._id || "local-user";
      const comment = (current[idx].comments || []).find((c) => c._id === commentId || c.id === commentId);
      if (comment) {
        if (!comment.likes) comment.likes = [];
        if (!comment.dislikes) comment.dislikes = [];
        const lIdx = comment.likes.indexOf(userId);
        const dIdx = comment.dislikes.indexOf(userId);
        if (lIdx > -1) comment.likes.splice(lIdx, 1);
        if (dIdx > -1) comment.dislikes.splice(dIdx, 1);
        else comment.dislikes.push(userId);
        saveFoods(current);
      }
      return current[idx];
    }
    throw new Error("Food item not found");
  },
};
