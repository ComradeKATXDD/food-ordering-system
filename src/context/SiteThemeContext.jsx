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
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) {
        const updated = await res.json();
        setSettings(updated);
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
        return updated;
      }
    } catch {
      // Fallback
    }

    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
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
              <div className="pointer-events-none fixed inset-0 z-[99] shadow-[inset_0_0_80px_rgba(255,107,53,0.15)] dark:shadow-[inset_0_0_100px_rgba(255,107,53,0.2)]" />
            )}

            {/* Background Image / Pattern Overlay */}
            {settings.bgPattern === "custom" && settings.customBgImageUrl ? (
              <div
                className="pointer-events-none fixed inset-0 z-[-1] opacity-[0.07] dark:opacity-[0.12] bg-cover bg-center bg-fixed transition-opacity duration-700"
                style={{ backgroundImage: `url("${settings.customBgImageUrl}")` }}
              />
            ) : settings.bgPattern === "warm-glow" ? (
              <div className="pointer-events-none fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-orange-600/5 dark:from-amber-500/15 dark:to-orange-950/20" />
            ) : settings.bgPattern === "food-doodles" ? (
              <div
                className="pointer-events-none fixed inset-0 z-[-1] opacity-[0.05] dark:opacity-[0.09] bg-repeat bg-[length:350px_350px]"
                style={{
                  backgroundImage: `url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80")`,
                }}
              />
            ) : settings.bgPattern === "spicy-vignette" ? (
              <div className="pointer-events-none fixed inset-0 z-[-1] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/5 via-orange-500/10 to-amber-600/15" />
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
