import React from "react";
import { FiEdit2, FiTrash2, FiStar } from "react-icons/fi";
import { formatCurrency } from "../../utils/formatters";

const FoodTable = ({ foods, onEdit, onDelete }) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="bg-slate-100/70 dark:bg-slate-800/70 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="py-4 px-5">Food Item</th>
            <th className="py-4 px-5">Category</th>
            <th className="py-4 px-5">Price</th>
            <th className="py-4 px-5">Rating</th>
            <th className="py-4 px-5">Status</th>
            <th className="py-4 px-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
          {foods.map((food) => (
            <tr
              key={food.id}
              className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
            >
              <td className="py-3.5 px-5">
                <div className="flex items-center gap-3.5">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                      {food.name}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {food.ingredients?.slice(0, 3).join(", ")}
                    </p>
                  </div>
                </div>
              </td>

              <td className="py-3.5 px-5 font-semibold text-slate-700 dark:text-slate-300 capitalize">
                {food.category}
              </td>

              <td className="py-3.5 px-5 font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(food.price)}
              </td>

              <td className="py-3.5 px-5 font-semibold">
                <div className="flex items-center gap-1 text-amber-500">
                  <FiStar className="fill-current" />
                  <span>{food.rating}</span>
                </div>
              </td>

              <td className="py-3.5 px-5">
                {food.isPopular ? (
                  <span className="px-2.5 py-1 text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 rounded-full border border-amber-300 dark:border-amber-700">
                    Bestseller
                  </span>
                ) : (
                  <span className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded-full">
                    Regular
                  </span>
                )}
              </td>

              <td className="py-3.5 px-5 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(food)}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition"
                    title="Edit Food"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(food.id)}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                    title="Delete Food"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FoodTable;
