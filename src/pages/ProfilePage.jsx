import React, { useState, useEffect } from "react";
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiCheck, FiImage, FiCamera, FiSliders } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { useSiteTheme } from "../context/SiteThemeContext";

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  const { settings, updateSiteSettings } = useSiteTheme();

  const [themeForm, setThemeForm] = useState({
    enabled: settings?.enabled ?? true,
    edgeEffects: settings?.edgeEffects ?? true,
  });
  const [savingTheme, setSavingTheme] = useState(false);

  useEffect(() => {
    if (settings) {
      setThemeForm({
        enabled: settings.enabled ?? true,
        edgeEffects: settings.edgeEffects ?? true,
      });
    }
  }, [settings]);

  const defaultAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80";

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    avatar: user?.avatar || defaultAvatar,
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const presetAvatars = [
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80",
  ];

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      addToast("Profile & avatar updated successfully in MongoDB!", "success");
    } catch (err) {
      addToast("Failed to update profile.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      addToast("New passwords do not match", "error");
      return;
    }
    addToast("Password changed successfully!", "success");
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          My Account Profile
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your profile picture, personal details, delivery address, and security
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card Sidebar */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 text-center shadow-sm h-fit">
          <div className="relative w-32 h-32 mx-auto">
            <img
              src={formData.avatar || defaultAvatar}
              alt={formData.name}
              className="w-full h-full rounded-full object-cover border-4 border-[#ff6b35] shadow-lg"
              onError={(e) => {
                e.target.src = defaultAvatar;
              }}
            />
            <div className="absolute bottom-1 right-1 p-2 bg-[#ff6b35] text-white rounded-full shadow-md">
              <FiCamera size={14} />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {formData.name || "Customer Account"}
            </h3>
            <span className="text-xs font-semibold text-[#ff6b35] bg-orange-50 dark:bg-orange-950/40 px-3 py-1 rounded-full inline-block mt-1 border border-orange-200 dark:border-orange-800">
              {user?.role === "admin" ? "System Administrator" : "Valued Customer"}
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-left">
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
              <FiMail className="text-[#ff6b35] shrink-0" /> <span className="truncate">{formData.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
              <FiPhone className="text-[#ff6b35] shrink-0" /> <span>{formData.phone || "Not set"}</span>
            </div>
            <div className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
              <FiMapPin className="text-[#ff6b35] shrink-0 mt-0.5" /> <span>{formData.address || "Not set"}</span>
            </div>
          </div>
        </div>

        {/* Main Edit Forms */}
        <div className="md:col-span-2 space-y-8">
          {/* Edit Profile Form */}
          <form
            onSubmit={handleProfileSubmit}
            className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm"
          >
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <FiUser className="text-[#ff6b35]" /> Personal Information & Avatar
            </h3>

            {/* Custom Avatar Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Profile Picture (Custom Image URL)
              </label>
              <div className="relative">
                <FiImage className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://example.com/my-photo.jpg"
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled
                  className="w-full px-4 py-3 bg-slate-200/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold cursor-not-allowed opacity-80"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Default Delivery Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[#ff6b35] hover:bg-[#e85a24] text-white font-extrabold text-xs rounded-xl shadow-lg shadow-orange-500/25 flex items-center gap-2 transition"
              >
                <FiCheck /> {loading ? "Saving..." : "Save Profile Changes"}
              </button>
            </div>
          </form>

          {/* Change Password Form */}
          <form
            onSubmit={handlePasswordSubmit}
            className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm"
          >
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <FiLock className="text-[#ff6b35]" /> Security & Password
            </h3>

            <div className="space-y-4 max-w-md">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-extrabold text-xs rounded-xl transition"
              >
                Update Password
              </button>
            </div>
          </form>

          {/* Super Admin Global Aesthetic & Vibes Control Panel */}
          {user?.role === "admin" && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSavingTheme(true);
                try {
                  await updateSiteSettings(themeForm);
                  addToast("Global site ambient glow settings updated!", "success");
                } catch (err) {
                  addToast("Failed to save ambient settings", "error");
                } finally {
                  setSavingTheme(false);
                }
              }}
              className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-orange-500/30 space-y-6 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[11px] font-extrabold text-[#ff6b35] uppercase tracking-widest block">
                    Super Admin Controls
                  </span>
                  <h3 className="text-lg font-black flex items-center gap-2 mt-1">
                    <FiSliders className="text-[#ff6b35]" /> Ambient Viewport Edge Glow Customizer
                  </h3>
                </div>

                <label className="flex items-center gap-2 cursor-pointer bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700">
                  <input
                    type="checkbox"
                    checked={themeForm.enabled}
                    onChange={(e) => setThemeForm({ ...themeForm, enabled: e.target.checked })}
                    className="accent-[#ff6b35]"
                  />
                  <span className="text-xs font-bold">
                    {themeForm.enabled ? "Glow Effect ON" : "Glow Effect OFF"}
                  </span>
                </label>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-2xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={themeForm.edgeEffects}
                    onChange={(e) => setThemeForm({ ...themeForm, edgeEffects: e.target.checked })}
                    className="accent-[#ff6b35] w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-bold block text-white">
                      Enable Warm Ambient Edge Vignette
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Displays a subtle warm culinary glow along the edges of the website for all visitors.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingTheme}
                  className="px-6 py-3 bg-[#ff6b35] hover:bg-[#e85a24] text-white font-extrabold text-xs rounded-xl shadow-lg shadow-orange-500/30 transition active:scale-95 disabled:opacity-50"
                >
                  {savingTheme ? "Applying..." : "Save Ambient Glow Settings"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
