import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiDollarSign,
  FiShoppingBag,
  FiGrid,
  FiUsers,
  FiPlus,
  FiArrowRight,
} from "react-icons/fi";
import StatCard from "../components/admin/StatCard";
import OrderTable from "../components/admin/OrderTable";
import Loader from "../components/common/Loader";
import { formatCurrency } from "../utils/formatters";
import { foodService } from "../services/foodService";
import { orderService } from "../services/orderService";
import { userService } from "../services/userService";
import { useToast } from "../hooks/useToast";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    totalFoods: 0,
    totalRevenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [foods, orders, customers] = await Promise.all([
          foodService.getFoods(),
          orderService.getOrders(),
          userService.getUsers(),
        ]);

        const revenue = orders.reduce(
          (acc, o) => (o.status !== "Cancelled" ? acc + (o.amount || 0) : acc),
          0
        );

        setStats({
          totalCustomers: customers.length,
          totalOrders: orders.length,
          totalFoods: foods.length,
          totalRevenue: revenue,
        });

        setRecentOrders(orders.slice(0, 5));
        setRecentCustomers(customers.slice(0, 5));
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setRecentOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      addToast(`Order ${orderId} updated to ${newStatus}`, "success");
    } catch (err) {
      addToast("Failed to update order status", "error");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await orderService.cancelOrder(orderId);
      setRecentOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "Cancelled" } : o))
      );
      addToast(`Order ${orderId} cancelled`, "info");
    } catch (err) {
      addToast("Failed to cancel order", "error");
    }
  };

  if (loading) return <Loader text="Loading administrative insights..." />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Executive Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time analytics and store performance statistics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/foods"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#ff6b35] hover:bg-[#e85a24] text-white font-extrabold text-xs rounded-xl shadow-lg transition"
          >
            <FiPlus /> Add New Dish
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          change="+18.4%"
          isIncrease={true}
          icon={FiDollarSign}
          color="emerald"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          change="+12.5%"
          isIncrease={true}
          icon={FiShoppingBag}
          color="orange"
        />
        <StatCard
          title="Menu Dishes"
          value={stats.totalFoods}
          change="+4 items"
          isIncrease={true}
          icon={FiGrid}
          color="blue"
        />
        <StatCard
          title="Active Customers"
          value={stats.totalCustomers}
          change="+8.2%"
          isIncrease={true}
          icon={FiUsers}
          color="purple"
        />
      </div>

      {/* Recent Orders Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-white">Recent Orders</h3>
          <Link
            to="/admin/orders"
            className="flex items-center gap-1 text-xs font-extrabold text-[#ff6b35] hover:underline"
          >
            Manage All Orders <FiArrowRight />
          </Link>
        </div>

        <OrderTable
          orders={recentOrders}
          onStatusChange={handleStatusChange}
          onCancelOrder={handleCancelOrder}
        />
      </div>

      {/* Quick Customer List Preview */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-extrabold text-white">Recent Registered Customers</h3>
          <Link
            to="/admin/customers"
            className="text-xs font-extrabold text-[#ff6b35] hover:underline"
          >
            View All Users
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {recentCustomers.map((cust) => (
            <div
              key={cust.id}
              className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60 flex items-center gap-3"
            >
              <img
                src={cust.avatar}
                alt={cust.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-700"
              />
              <div className="min-w-0">
                <h5 className="font-bold text-xs text-white truncate">{cust.name}</h5>
                <span className="text-[10px] text-slate-400 block truncate">{cust.email}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
