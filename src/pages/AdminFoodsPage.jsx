import React, { useEffect, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import FoodTable from "../components/admin/FoodTable";
import Modal from "../components/common/Modal";
import Loader from "../components/common/Loader";
import { foodService } from "../services/foodService";
import { useToast } from "../hooks/useToast";

const AdminFoodsPage = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "pizza",
    price: "",
    rating: "4.5",
    description: "",
    ingredients: "",
    image: "",
    isPopular: false,
    isFeatured: false,
  });

  const { addToast } = useToast();

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const [foodList, catList] = await Promise.all([
        foodService.getFoods({ category: activeCategory, search: searchQuery }),
        foodService.getCategories(),
      ]);
      setFoods(foodList);
      setCategories(catList);
    } catch (err) {
      console.error("Error loading foods list", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [activeCategory, searchQuery]);

  const handleOpenAddModal = () => {
    setEditingFood(null);
    setFormData({
      name: "",
      category: "pizza",
      price: "",
      rating: "4.5",
      description: "",
      ingredients: "",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
      isPopular: false,
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      category: food.category,
      price: food.price,
      rating: food.rating,
      description: food.description,
      ingredients: Array.isArray(food.ingredients) ? food.ingredients.join(", ") : food.ingredients,
      image: food.image,
      isPopular: food.isPopular || false,
      isFeatured: food.isFeatured || false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFood) {
        await foodService.updateFood(editingFood.id, formData);
        addToast("Food item updated successfully", "success");
      } else {
        await foodService.addFood(formData);
        addToast("New food item added to menu", "success");
      }
      setIsModalOpen(false);
      fetchFoods();
    } catch (err) {
      addToast("Error saving food item", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await foodService.deleteFood(deleteId);
      addToast("Food item deleted from menu", "info");
      setDeleteId(null);
      fetchFoods();
    } catch (err) {
      addToast("Error deleting item", "error");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Food Menu Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create, update, or remove dishes from the digital storefront
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-3 bg-[#ff6b35] hover:bg-[#e85a24] text-white font-extrabold text-xs rounded-xl shadow-lg transition"
        >
          <FiPlus size={16} /> Add New Dish
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <FiSearch className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu items by name or ingredient..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
          />
        </div>

        <select
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Food Table */}
      {loading ? (
        <Loader text="Updating menu list..." />
      ) : (
        <FoodTable
          foods={foods}
          onEdit={handleOpenEditModal}
          onDelete={(id) => setDeleteId(id)}
        />
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFood ? "Edit Food Item" : "Add New Food Item"}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Food Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g. Truffle Mushroom Pizza"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
              >
                <option value="pizza">Pizza</option>
                <option value="burgers">Burgers</option>
                <option value="indian">Indian</option>
                <option value="asian">Asian & Chinese</option>
                <option value="desserts">Desserts & Drinks</option>
                <option value="healthy">Healthy Bowls</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                placeholder="14.99"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Rating
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Image URL *
            </label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Description *
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="Brief description of flavors and preparations..."
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Ingredients (comma-separated)
            </label>
            <input
              type="text"
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              placeholder="Truffle Oil, Mozzarella, Mushrooms"
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPopular}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                className="accent-[#ff6b35]"
              />
              <span>Mark as Bestseller</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="accent-[#ff6b35]"
              />
              <span>Feature on Home Page</span>
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#ff6b35] hover:bg-[#e85a24] text-white text-xs font-bold rounded-xl shadow"
            >
              {editingFood ? "Save Changes" : "Add Food Item"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to permanently delete this food item from the menu? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteId(null)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow"
            >
              Delete Dish
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminFoodsPage;
