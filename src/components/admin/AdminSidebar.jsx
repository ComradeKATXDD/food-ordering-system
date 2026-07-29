import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiPieChart,
  FiShoppingBag,
  FiUsers,
  FiLogOut,
  FiArrowLeft,
} from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const navItems = [
    { label: "Dashboard", icon: FiPieChart, path: "/admin/dashboard" },
    { label: "Food Menu", icon: FiGrid, path: "/admin/foods" },
    { label: "Orders Management", icon: FiShoppingBag, path: "/admin/orders" },
    { label: "Customers", icon: FiUsers, path: "/admin/customers" },
  ];

  const handleLogout = () => {
    logout();
    addToast("Logged out from Admin portal", "info");
    navigate("/");
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-30 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-slate-900 text-white flex flex-col justify-between transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 border-r border-slate-800`}
      >
        <div>
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ff6b35] flex items-center justify-center font-extrabold text-xl text-white shadow-lg shadow-orange-500/30">
                A
              </div>
              <div>
                <h2 className="font-extrabold text-base tracking-wide text-white">
                  Admin Hub
                </h2>
                <span className="text-[11px] text-slate-400 font-medium block">
                  Food Order Portal
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${isActive
                    ? "bg-[#ff6b35] text-white shadow-lg shadow-orange-500/25"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`
                }
              >
                <item.icon className="text-lg" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <FiArrowLeft className="text-base" />
            <span>Back to Storefront</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition"
          >
            <FiLogOut className="text-base" />
            <span>Admin Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
