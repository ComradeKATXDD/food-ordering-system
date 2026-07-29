import React, { useEffect, useState } from "react";
import OrderTable from "../components/admin/OrderTable";
import Loader from "../components/common/Loader";
import { orderService } from "../services/orderService";
import { useToast } from "../hooks/useToast";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const { addToast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err) {
      console.error("Error loading orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
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
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "Cancelled" } : o))
      );
      addToast(`Order ${orderId} cancelled`, "info");
    } catch (err) {
      addToast("Failed to cancel order", "error");
    }
  };

  const filteredOrders = orders.filter((o) =>
    statusFilter === "all" ? true : o.status === statusFilter
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Customer Orders Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Monitor incoming orders, update delivery progress, or handle cancellations
          </p>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {["all", "Preparing", "Out for Delivery", "Delivered", "Cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                statusFilter === st
                  ? "bg-[#ff6b35] text-white shadow-md"
                  : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
              }`}
            >
              {st === "all" ? "All Orders" : st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loader text="Fetching live order feeds..." />
      ) : (
        <OrderTable
          orders={filteredOrders}
          onStatusChange={handleStatusChange}
          onCancelOrder={handleCancelOrder}
        />
      )}
    </div>
  );
};

export default AdminOrdersPage;
