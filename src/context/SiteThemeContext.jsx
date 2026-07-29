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

  // Apply Custom Background Image directly to Body when active
  useEffect(() => {
    if (settings.enabled && settings.bgPattern === "custom" && settings.customBgImageUrl) {
      document.body.style.backgroundImage = `url("${settings.customBgImageUrl}")`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundAttachment = "fixed";
      document.body.style.backgroundPosition = "center";
    } else {
      document.body.style.backgroundImage = "none";
    }
  }, [settings]);

  const updateSiteSettings = async (newSettings) => {
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
            {/* Soft, Subtle Viewport Edge Glow (No thick border lines) */}
            {settings.edgeEffects && (
              <div className="pointer-events-none fixed inset-0 z-[99] shadow-[inset_0_0_50px_rgba(255,107,53,0.12)] dark:shadow-[inset_0_0_70px_rgba(255,107,53,0.18)] transition-all duration-500" />
            )}

            {/* Background Pattern Presets Floating Overlay */}
            {settings.bgPattern === "warm-glow" ? (
              <div className="pointer-events-none fixed inset-0 z-[1] opacity-60 dark:opacity-40 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/15 via-orange-500/5 to-transparent transition-all duration-500" />
            ) : settings.bgPattern === "food-doodles" ? (
              <div
                className="pointer-events-none fixed inset-0 z-[1] opacity-10 dark:opacity-15 bg-repeat bg-[length:350px_350px] mix-blend-multiply dark:mix-blend-overlay transition-all duration-500"
                style={{
                  backgroundImage: `url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80")`,
                }}
              />
            ) : settings.bgPattern === "spicy-vignette" ? (
              <div className="pointer-events-none fixed inset-0 z-[1] opacity-50 dark:opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/10 via-orange-500/10 to-amber-900/20 transition-all duration-500" />
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
