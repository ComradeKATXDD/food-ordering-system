import React, { createContext, useContext, useEffect, useState } from "react";
import { userService } from "../services/userService";

const AuthContext = createContext();

const AUTH_KEY = "food_ordering_user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(AUTH_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }, [user]);

  const loginCustomer = async (email, password) => {
    const loggedUser = await userService.loginCustomer(email, password);
    setUser(loggedUser);
    return loggedUser;
  };

  const loginAdmin = async (username, password) => {
    const adminUser = await userService.loginAdmin(username, password);
    setUser(adminUser);
    return adminUser;
  };

  const signupCustomer = async (userData) => {
    const newUser = {
      id: `user-${Date.now()}`,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      role: "customer",
      status: "Active",
      ...userData
    };
    await userService.updateProfile(newUser.id, newUser);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    if (!user) return;
    const updated = await userService.updateProfile(user.id, profileData);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        loginCustomer,
        loginAdmin,
        signupCustomer,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
