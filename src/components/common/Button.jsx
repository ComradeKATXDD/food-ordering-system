import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  className = "",
  loading = false,
  disabled = false,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-[#ff6b35] hover:bg-[#e85a24] text-white shadow-lg shadow-orange-500/25 focus:ring-[#ff6b35]",
    secondary:
      "bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-slate-400",
    outline:
      "border-2 border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white focus:ring-[#ff6b35]",
    ghost:
      "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-400",
    danger:
      "bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/25 focus:ring-rose-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-base gap-2.5",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block animate-spin border-2 border-current border-t-transparent rounded-full w-4 h-4" />
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon className="text-base" />}
          <span>{children}</span>
          {Icon && iconPosition === "right" && <Icon className="text-base" />}
        </>
      )}
    </button>
  );
};

export default Button;
