import { initialUsers } from "../data/users";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const USERS_KEY = "food_ordering_users";

const getStoredUsers = () => {
  const stored = localStorage.getItem(USERS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialUsers;
    }
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
  return initialUsers;
};

const saveUsers = (usersList) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(usersList));
};

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const userService = {
  async getUsers() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/auth/users`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    await delay(300);
    return getStoredUsers();
  },

  async getUserById(id) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    await delay(200);
    const users = getStoredUsers();
    return users.find((u) => u.id === id) || null;
  },

  async updateProfile(id, updateData) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(updateData),
      });
      if (res.ok) {
        const updated = await res.json();
        if (updated.token) localStorage.setItem("token", updated.token);
        return updated;
      }
    } catch {
      // Fallback
    }

    await delay(300);
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
      const newUser = { id, ...updateData };
      users.push(newUser);
      saveUsers(users);
      return newUser;
    }
    users[index] = { ...users[index], ...updateData };
    saveUsers(users);
    return users[index];
  },

  async toggleUserBlock(id) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/auth/users/${id}/toggle-status`, {
        method: "PATCH",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (res.ok) {
        const data = await res.json();
        return data.user || data;
      }
    } catch {
      // Fallback
    }

    const users = getStoredUsers();
    const index = users.findIndex((u) => u.id === id || u._id === id);
    if (index === -1) throw new Error("User not found");

    const currentStatus = users[index].status;
    users[index].status = currentStatus === "Active" ? "Blocked" : "Active";
    saveUsers(users);
    return users[index];
  },

  async deleteUser(id) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/auth/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (res.ok) {
        const data = await res.json();
        const users = getStoredUsers();
        saveUsers(users.filter((u) => u.id !== id && u._id !== id));
        return data;
      }
      const errData = await res.json().catch(() => ({}));
      if (res.status === 401 || res.status === 403) {
        throw new Error(errData.message || "Admin authorization required to delete customers.");
      }
    } catch (err) {
      if (err.message && !err.message.includes("fetch")) {
        throw err;
      }
    }

    const users = getStoredUsers();
    const updated = users.filter((u) => u.id !== id && u._id !== id);
    saveUsers(updated);
    return { success: true, id };
  },

  async loginCustomer(email, password) {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      return data;
    } catch (err) {
      if (err.message && !err.message.includes("fetch")) {
        throw err;
      }
    }

    await delay(300);
    const users = getStoredUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!found) {
      throw new Error("No account found with this email address. Please sign up first.");
    }

    if (found.status === "Blocked") {
      throw new Error("Your account has been suspended by administration.");
    }

    return found;
  },

  async registerCustomer(userData) {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      return data;
    } catch (err) {
      if (err.message && !err.message.includes("fetch")) {
        throw err;
      }
    }

    await delay(300);
    const users = getStoredUsers();
    const newUser = {
      id: `user-${Date.now()}`,
      role: "customer",
      status: "Active",
      ordersCount: 0,
      totalSpent: 0,
      ...userData,
    };
    users.push(newUser);
    saveUsers(users);
    return newUser;
  },

  async loginAdmin(username, password) {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.role === "admin") {
          if (data.token) localStorage.setItem("token", data.token);
          return data;
        }
      }
    } catch {
      // Fallback
    }

    await delay(300);
    if (username === "admin" && password === "admin123") {
      return {
        id: "admin-1",
        name: "System Administrator",
        email: "admin@example.com",
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      };
    }
    throw new Error("Invalid admin credentials.");
  },
};
