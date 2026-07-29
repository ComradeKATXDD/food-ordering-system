import React from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

const Toast = ({ message, type = "success", onClose }) => {
  const icons = {
    success: <FiCheckCircle className="text-emerald-500 text-xl shrink-0" />,
    error: <FiAlertCircle className="text-rose-500 text-xl shrink-0" />,
    warning: <FiAlertCircle className="text-amber-500 text-xl shrink-0" />,
    info: <FiInfo className="text-blue-500 text-xl shrink-0" />,
  };

  const borders = {
    success: "border-emerald-500/30 bg-emerald-50/95 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-100",
    error: "border-rose-500/30 bg-rose-50/95 dark:bg-rose-950/90 text-rose-900 dark:text-rose-100",
    warning: "border-amber-500/30 bg-amber-50/95 dark:bg-amber-950/90 text-amber-900 dark:text-amber-100",
    info: "border-blue-500/30 bg-blue-50/95 dark:bg-blue-950/90 text-blue-900 dark:text-blue-100",
  };

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-slide-in ${borders[type]}`}
    >
      <div className="flex items-center gap-3 pr-2">
        {icons[type]}
        <p className="text-sm font-medium leading-snug">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition text-slate-500 hover:text-slate-900 dark:hover:text-white"
        aria-label="Close toast"
      >
        <FiX size={16} />
      </button>
    </div>
  );
};

export default Toast;
