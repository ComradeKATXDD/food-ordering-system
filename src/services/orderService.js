import { initialOrders } from "../data/orders";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const ORDERS_KEY = "food_ordering_orders";

const getStoredOrders = () => {
  const stored = localStorage.getItem(ORDERS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialOrders;
    }
  }
  localStorage.setItem(ORDERS_KEY, JSON.stringify(initialOrders));
  return initialOrders;
};

const saveOrders = (ordersList) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(ordersList));
};

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const orderService = {
  async getOrders() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/orders/admin/all`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    await delay(300);
    return getStoredOrders();
  },

  async getOrdersByUserId(userId) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/orders/my-orders`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    await delay(300);
    const all = getStoredOrders();
    const currentUser = JSON.parse(localStorage.getItem("food_ordering_user") || "{}");
    return all.filter(
      (order) =>
        order.customerId === userId ||
        order.user === userId ||
        (currentUser.email && order.customerEmail?.toLowerCase() === currentUser.email?.toLowerCase())
    );
  },

  async getOrderById(id) {
    await delay(200);
    const all = getStoredOrders();
    const order = all.find((o) => o.id === id);
    if (!order) throw new Error("Order not found");
    return order;
  },

  async createOrder(orderPayload) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(orderPayload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    await delay(300);
    const orders = getStoredOrders();
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 16).replace("T", " ");

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: formattedDate,
      status: "Preparing",
      ...orderPayload,
    };

    const updated = [newOrder, ...orders];
    saveOrders(updated);
    return newOrder;
  },

  async updateOrderStatus(id, newStatus) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    await delay(300);
    const orders = getStoredOrders();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error("Order not found");

    orders[index].status = newStatus;
    saveOrders(orders);
    return orders[index];
  },

  async cancelOrder(id) {
    return this.updateOrderStatus(id, "Cancelled");
  },
};
