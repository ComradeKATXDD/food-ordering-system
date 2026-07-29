import React, { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import { FiMenu, FiSun, FiMoon, FiShield } from "react-icons/fi";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { user, isAdmin } = useAuth();

  // Protect Admin layout: If not admin, redirect to Admin Login page
  if (!user || user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-[#ff6b35] selection:text-white">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              aria-label="Toggle Sidebar"
            >
              <FiMenu size={22} />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <FiShield className="text-[#ff6b35]" />
              <span className="hidden sm:inline">Admin Workspace</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition"
              aria-label="Toggle Theme"
            >
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-700"
              />
              <div className="hidden sm:block">
                <span className="text-xs font-bold text-white block">
                  {user.name}
                </span>
                <span className="text-[10px] text-[#ff6b35] font-semibold block">
                  Super Admin
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
