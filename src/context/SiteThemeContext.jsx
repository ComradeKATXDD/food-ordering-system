import React, { createContext, useContext, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SETTINGS_KEY = "food_ordering_site_settings";

const defaultSettings = {
  enabled: true,
  edgeEffects: true,
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
        {/* Global Ambient Viewport Edge Glow Effect */}
        {settings.enabled && settings.edgeEffects && (
          <div className="pointer-events-none fixed inset-0 z-[99] shadow-[inset_0_0_80px_rgba(255,107,53,0.22)] dark:shadow-[inset_0_0_100px_rgba(255,107,53,0.28)] transition-all duration-500" />
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
