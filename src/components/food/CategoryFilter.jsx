import React, { useRef, useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const CategoryFilter = ({ categories, activeCategory, onSelectCategory }) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 5);
      // Give a tiny 5px margin of error for fractional pixel scaling
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const handleResize = () => checkScrollPosition();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [categories]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -260 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative flex items-center">
      {/* Scroll Left Button - Only visible when scrolled right */}
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="z-10 absolute -left-3 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-lg text-slate-700 dark:text-slate-200 hover:bg-[#ff6b35] hover:text-white dark:hover:bg-[#ff6b35] transition duration-200"
          aria-label="Scroll Left"
        >
          <FiChevronLeft size={18} />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        onScroll={checkScrollPosition}
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

      {/* Scroll Right Button - Only visible when more items exist to the right */}
      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="z-10 absolute -right-3 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-lg text-slate-700 dark:text-slate-200 hover:bg-[#ff6b35] hover:text-white dark:hover:bg-[#ff6b35] transition duration-200"
          aria-label="Scroll Right"
        >
          <FiChevronRight size={18} />
        </button>
      )}
    </div>
  );
};

export default CategoryFilter;
