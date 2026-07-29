import { initialUsers } from "../data/users";

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
    await delay(300);
    return getStoredUsers();
  },

  async getUserById(id) {
    await delay(200);
    const users = getStoredUsers();
    return users.find((u) => u.id === id) || null;
  },

  async updateProfile(id, updateData) {
    await delay(400);
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
      // Create user if new
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
    await delay(350);
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("User not found");

    const currentStatus = users[index].status;
    users[index].status = currentStatus === "Active" ? "Blocked" : "Active";
    saveUsers(users);
    return users[index];
  },

  async deleteUser(id) {
    await delay(350);
    const users = getStoredUsers();
    const updated = users.filter((u) => u.id !== id);
    saveUsers(updated);
    return { success: true, id };
  },

  async loginCustomer(email, password) {
    await delay(400);
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

  async loginAdmin(username, password) {
    await delay(400);
    if (username === "admin" && password === "admin123") {
      return {
        id: "admin-1",
        name: "System Administrator",
        email: "admin@feastdash.com",
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
      };
    }
    throw new Error("Invalid admin username or password. (Use admin / admin123)");
  }
};
