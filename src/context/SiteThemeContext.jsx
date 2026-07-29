import React, { createContext, useContext, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SETTINGS_KEY = "food_ordering_site_settings";

const defaultSettings = {
  enabled: true,
  bgPattern: "warm-glow",
  edgeEffects: true,
  customBgImageUrl: "",
};

const SiteThemeContext = createContext(null);

export const SiteThemeProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const local = localStorage.getItem(SETTINGS_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/settings`);
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
      }
    } catch {
      // Offline fallback
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSiteSettings = async (newSettings) => {
    // Instant local UI state update
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(merged),
      });

      if (res.ok) {
        const updated = await res.json();
        setSettings(updated);
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
        return updated;
      } else {
        const errData = await res.json().catch(() => ({}));
        console.warn("Server settings update notice:", errData.message);
      }
    } catch (err) {
      console.warn("Backend offline, updated site theme locally:", err);
    }

    return merged;
  };

  return (
    <SiteThemeContext.Provider value={{ settings, updateSiteSettings, fetchSettings }}>
      <div className="relative min-h-screen">
        {/* Global Ambient Background Effects Overlay */}
        {settings.enabled && (
          <>
            {/* Edge Glow Vignette Effect */}
            {settings.edgeEffects && (
              <div className="pointer-events-none fixed inset-0 z-[99] border-[6px] border-[#ff6b35]/30 shadow-[inset_0_0_120px_rgba(255,107,53,0.3)] dark:shadow-[inset_0_0_150px_rgba(255,107,53,0.4)] transition-all duration-500" />
            )}

            {/* Background Image / Pattern Overlay */}
            {settings.bgPattern === "custom" && settings.customBgImageUrl ? (
              <div
                className="pointer-events-none fixed inset-0 z-[-1] opacity-20 dark:opacity-30 bg-cover bg-center bg-fixed transition-all duration-500"
                style={{ backgroundImage: `url("${settings.customBgImageUrl}")` }}
              />
            ) : settings.bgPattern === "warm-glow" ? (
              <div className="pointer-events-none fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-orange-500/10 to-orange-950/20 transition-all duration-500" />
            ) : settings.bgPattern === "food-doodles" ? (
              <div
                className="pointer-events-none fixed inset-0 z-[-1] opacity-15 dark:opacity-25 bg-repeat bg-[length:350px_350px] transition-all duration-500"
                style={{
                  backgroundImage: `url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80")`,
                }}
              />
            ) : settings.bgPattern === "spicy-vignette" ? (
              <div className="pointer-events-none fixed inset-0 z-[-1] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-600/15 via-orange-500/20 to-amber-900/30 transition-all duration-500" />
            ) : null}
          </>
        )}

        {children}
      </div>
    </SiteThemeContext.Provider>
  );
};

export const useSiteTheme = () => {
  const context = useContext(SiteThemeContext);
  if (!context) {
    throw new Error("useSiteTheme must be used within a SiteThemeProvider");
  }
  return context;
};
