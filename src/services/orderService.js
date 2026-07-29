import { initialOrders } from "../data/orders";

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
    await delay(300);
    return getStoredOrders();
  },

  async getOrdersByUserId(userId) {
    await delay(300);
    const all = getStoredOrders();
    return all.filter((order) => order.customerId === userId || order.customerEmail);
  },

  async getOrderById(id) {
    await delay(200);
    const all = getStoredOrders();
    const order = all.find((o) => o.id === id);
    if (!order) throw new Error("Order not found");
    return order;
  },

  async createOrder(orderPayload) {
    await delay(400);
    const orders = getStoredOrders();
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 16).replace("T", " ");

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: formattedDate,
      status: "Preparing",
      ...orderPayload
    };

    const updated = [newOrder, ...orders];
    saveOrders(updated);
    return newOrder;
  },

  async updateOrderStatus(id, newStatus) {
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
  }
};
