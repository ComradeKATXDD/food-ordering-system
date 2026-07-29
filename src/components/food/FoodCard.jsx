import React from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiClock, FiHeart } from "react-icons/fi";
import RatingStars from "../common/RatingStars";
import { formatCurrency } from "../../utils/formatters";
import { useCart } from "../../hooks/useCart";
import { useToast } from "../../hooks/useToast";

const FoodCard = ({ food }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(food, 1);
    addToast(`Added ${food.name} to your cart!`, "success");
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col justify-between">
      {/* Image & Badges */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {food.isPopular && (
            <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider bg-amber-500 text-white rounded-full shadow-md">
              ★ Bestseller
            </span>
          )}
          {food.isFeatured && (
            <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider bg-[#ff6b35] text-white rounded-full shadow-md">
              Featured
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 z-10">
          <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-black/60 backdrop-blur-md text-white rounded-full">
            <FiClock size={12} /> {food.prepTime || "20 min"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex justify-between items-start gap-2 mb-1.5">
            <span className="text-xs font-semibold text-[#ff6b35] uppercase tracking-wider">
              {food.category}
            </span>
            <RatingStars rating={food.rating} reviewsCount={food.reviewsCount} />
          </div>

          <Link to={`/food/${food.id}`} className="block">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#ff6b35] transition-colors line-clamp-1">
              {food.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
            {food.description}
          </p>
        </div>

        {/* Action Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-400 block font-normal">Price</span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              {formatCurrency(food.price)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/food/${food.id}`}
              className="px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#ff6b35] dark:hover:text-[#ff6b35] transition"
            >
              Details
            </Link>
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#ff6b35] hover:bg-[#e85a24] text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 active:scale-95 transition-all"
              aria-label="Add to Cart"
            >
              <FiPlus size={16} /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
