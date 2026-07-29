import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiFilter, FiSliders, FiRefreshCw } from "react-icons/fi";
import CategoryFilter from "../components/food/CategoryFilter";
import SearchBar from "../components/food/SearchBar";
import FoodCard from "../components/food/FoodCard";
import SkeletonCard from "../components/common/SkeletonCard";
import { foodService } from "../services/foodService";

const MenuPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [maxPrice, setMaxPrice] = useState(25);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("popular");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await foodService.getCategories();
      setCategories(cats);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFilteredFoods = async () => {
      setLoading(true);
      try {
        const result = await foodService.getFoods({
          category: activeCategory,
          search: searchQuery,
          maxPrice: maxPrice,
          minRating: minRating,
          sortBy: sortBy,
        });
        setFoods(result);
      } catch (err) {
        console.error("Error fetching menu foods", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredFoods();
  }, [activeCategory, searchQuery, maxPrice, minRating, sortBy]);

  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    setSearchParams((prev) => {
      if (catId === "all") prev.delete("category");
      else prev.set("category", catId);
      return prev;
    });
  };

  const handleResetFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
    setMaxPrice(25);
    setMinRating(0);
    setSortBy("popular");
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Explore Full Food Menu
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse through our wide selection of fresh & hot gourmet dishes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800"
          >
            <FiFilter /> Filters
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 hidden sm:inline">
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search & Category Pills */}
      <div className="space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={(val) => {
            setSearchQuery(val);
            setSearchParams((prev) => {
              if (!val) prev.delete("search");
              else prev.set("search", val);
              return prev;
            });
          }}
          onClear={() => {
            setSearchQuery("");
            setSearchParams((prev) => {
              prev.delete("search");
              return prev;
            });
          }}
        />

        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={handleCategorySelect}
        />
      </div>

      {/* Main Grid & Filters Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Controls (Desktop & Mobile Drawer) */}
        <aside
          className={`space-y-6 md:block ${
            showMobileFilters ? "block" : "hidden"
          } bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 h-fit sticky top-28`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2 text-base">
              <FiSliders className="text-[#ff6b35]" /> Filter Options
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-slate-400 hover:text-[#ff6b35] flex items-center gap-1 transition"
            >
              <FiRefreshCw size={12} /> Reset
            </button>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">Max Price:</span>
              <span className="text-[#ff6b35] font-extrabold">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              step="1"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#ff6b35] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
              <span>$5</span>
              <span>$25</span>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Minimum Rating:
            </span>
            <div className="space-y-1.5">
              {[0, 4.0, 4.5, 4.8].map((ratingVal) => (
                <label
                  key={ratingVal}
                  className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="minRating"
                    checked={minRating === ratingVal}
                    onChange={() => setMinRating(ratingVal)}
                    className="accent-[#ff6b35]"
                  />
                  <span>
                    {ratingVal === 0 ? "All Ratings" : `★ ${ratingVal.toFixed(1)} & above`}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Food Items Grid */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </div>
          ) : foods.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="text-5xl">🔍</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                No Dishes Match Your Filters
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try resetting your search term or adjusting the price/rating filter parameters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-[#ff6b35] text-white text-xs font-bold rounded-xl shadow"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {foods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
