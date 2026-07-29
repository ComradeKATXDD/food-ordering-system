import React from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

const QuantitySelector = ({ quantity = 1, onIncrease, onDecrease, min = 1, max = 99, size = "md" }) => {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs min-w-[24px]",
    md: "px-3 py-1.5 text-sm min-w-[32px]",
    lg: "px-4 py-2 text-base min-w-[40px]"
  };

  const btnClasses = {
    sm: "p-1 text-xs",
    md: "p-1.5 text-sm",
    lg: "p-2 text-base"
  };

  return (
    <div className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-0.5">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        className={`${btnClasses[size]} rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label="Decrease quantity"
      >
        <FiMinus />
      </button>

      <span className={`${sizeClasses[size]} font-bold text-center text-slate-900 dark:text-slate-100`}>
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        className={`${btnClasses[size]} rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label="Increase quantity"
      >
        <FiPlus />
      </button>
    </div>
  );
};

export default QuantitySelector;
