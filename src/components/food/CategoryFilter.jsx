import React, { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const CategoryFilter = ({ categories, activeCategory, onSelectCategory }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -260 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group/scroll flex items-center">
      {/* Scroll Left Button */}
      <button
        onClick={() => scroll("left")}
        className="hidden sm:flex z-10 absolute -left-3 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-lg text-slate-700 dark:text-slate-200 hover:bg-[#ff6b35] hover:text-white dark:hover:bg-[#ff6b35] transition"
        aria-label="Scroll Left"
      >
        <FiChevronLeft size={18} />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none scroll-smooth w-full px-1"
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 shadow-sm shrink-0 ${
                isActive
                  ? "bg-[#ff6b35] text-white shadow-lg shadow-orange-500/25 scale-105"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-[#ff6b35] dark:hover:border-[#ff6b35]"
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Scroll Right Button */}
      <button
        onClick={() => scroll("right")}
        className="hidden sm:flex z-10 absolute -right-3 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-lg text-slate-700 dark:text-slate-200 hover:bg-[#ff6b35] hover:text-white dark:hover:bg-[#ff6b35] transition"
        aria-label="Scroll Right"
      >
        <FiChevronRight size={18} />
      </button>
    </div>
  );
};

export default CategoryFilter;
