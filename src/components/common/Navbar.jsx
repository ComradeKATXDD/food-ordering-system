import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiShoppingBag,
  FiUser,
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiLogOut,
  FiLock,
} from "react-icons/fi";
import { useCart } from "../../hooks/useCart";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    addToast("Logged out successfully", "info");
    setMobileMenuOpen(false);
    navigate("/");
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Menu", path: "/menu" },
    { label: "My Orders", path: "/orders", authRequired: true },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-[#ff6b35] flex items-center justify-center font-black text-2xl text-white shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              FEAST<span className="text-[#ff6b35]">DASH</span>
            </span>
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#ff6b35] block -mt-1">
              Food Delivery
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            if (link.authRequired && !isAuthenticated) return null;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-bold transition-colors ${isActive
                    ? "text-[#ff6b35]"
                    : "text-slate-600 dark:text-slate-300 hover:text-[#ff6b35] dark:hover:text-[#ff6b35]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            );
          })}
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-100 text-[#ff6b35] dark:bg-orange-950/50 dark:text-orange-300 text-xs font-bold border border-orange-300 dark:border-orange-800"
            >
              <FiLock size={12} /> Admin Portal
            </Link>
          )}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-[#ff6b35] dark:hover:text-[#ff6b35] transition"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <FiSun size={19} /> : <FiMoon size={19} />}
          </button>

          {/* Cart Button */}
          <Link
            to="/cart"
            className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-[#ff6b35] dark:hover:text-[#ff6b35] transition"
            aria-label="Cart"
          >
            <FiShoppingBag size={19} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#ff6b35] text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Profile / Auth Buttons */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-[#ff6b35] transition"
              >
                <img
                  src={user.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                  {user.name}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2.5 text-slate-500 hover:text-rose-500 rounded-xl transition"
                title="Logout"
              >
                <FiLogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#ff6b35]"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-xs font-bold bg-[#ff6b35] text-white rounded-xl shadow-md shadow-orange-500/20 hover:bg-[#e85a24] transition"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-6 py-6 space-y-4 animate-fade-in">
          <nav className="flex flex-col space-y-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-bold text-slate-800 dark:text-slate-200 hover:text-[#ff6b35]"
            >
              Home
            </Link>
            <Link
              to="/menu"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-bold text-slate-800 dark:text-slate-200 hover:text-[#ff6b35]"
            >
              Menu
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-bold text-slate-800 dark:text-slate-200 hover:text-[#ff6b35]"
                >
                  My Orders
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-bold text-slate-800 dark:text-slate-200 hover:text-[#ff6b35]"
                >
                  Profile ({user?.name})
                </Link>
              </>
            )}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-bold text-[#ff6b35]"
              >
                Admin Dashboard
              </Link>
            )}
          </nav>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full py-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 font-bold rounded-xl text-sm flex items-center justify-center gap-2"
              >
                <FiLogOut /> Logout
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 text-center border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-sm"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 text-center bg-[#ff6b35] text-white font-bold rounded-xl text-sm shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center text-xs font-semibold text-slate-400 hover:text-[#ff6b35] pt-2"
            >
              Admin Portal Access
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
