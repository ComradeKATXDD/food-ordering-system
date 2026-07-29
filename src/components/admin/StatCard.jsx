import React from "react";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const StatCard = ({ title, value, change, isIncrease = true, icon: Icon, color = "orange" }) => {
  const colorMap = {
    orange: "bg-orange-50 dark:bg-orange-950/40 text-[#ff6b35] border-orange-200 dark:border-orange-900/40",
    blue: "bg-blue-50 dark:bg-blue-950/40 text-blue-500 border-blue-200 dark:border-blue-900/40",
    emerald: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 border-emerald-200 dark:border-emerald-900/40",
    purple: "bg-purple-50 dark:bg-purple-950/40 text-purple-500 border-purple-200 dark:border-purple-900/40",
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          {value}
        </h3>
        {change && (
          <div className="flex items-center gap-1 text-xs font-semibold pt-1">
            {isIncrease ? (
              <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                <FiTrendingUp /> {change}
              </span>
            ) : (
              <span className="flex items-center gap-0.5 text-rose-600 dark:text-rose-400">
                <FiTrendingDown /> {change}
              </span>
            )}
            <span className="text-slate-400 font-normal">vs last month</span>
          </div>
        )}
      </div>

      <div className={`p-4 rounded-2xl border ${colorMap[color]} shrink-0`}>
        <Icon className="text-2xl" />
      </div>
    </div>
  );
};

export default StatCard;
