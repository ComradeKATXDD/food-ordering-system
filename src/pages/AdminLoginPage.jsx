import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiShield, FiUser, FiLock, FiArrowRight, FiInfo } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

const AdminLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginAdmin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginAdmin(username, password);
      addToast("Authenticated successfully as Administrator", "success");
      navigate("/admin/dashboard");
    } catch (err) {
      addToast(err.message || "Invalid Admin Credentials", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#ff6b35] text-white flex items-center justify-center text-2xl mx-auto shadow-lg shadow-orange-500/30">
            <FiShield size={28} />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Admin Portal Access</h2>
          <p className="text-xs text-slate-400">
            Secure administrative control center for FeastDash
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Admin Username
            </label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter admin username or email"
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Admin Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#ff6b35] hover:bg-[#e85a24] text-white font-extrabold text-sm rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition"
          >
            {loading ? "Authenticating..." : "Enter Admin Dashboard"} <FiArrowRight />
          </button>
        </form>

        <div className="pt-2 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-xs text-slate-500 hover:text-slate-300 transition"
          >
            ← Return to Public Storefront
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
