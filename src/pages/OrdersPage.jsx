import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag, FiClock, FiCheckCircle, FiTruck, FiAlertCircle, FiXCircle } from "react-icons/fi";
import Loader from "../components/common/Loader";
import Modal from "../components/common/Modal";
import { formatCurrency, formatDate, getStatusBadgeStyle } from "../utils/formatters";
import { orderService } from "../services/orderService";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalOrderId, setCancelModalOrderId] = useState(null);

  const { user } = useAuth();
  const { addToast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const result = await orderService.getOrders();
      setOrders(result);
    } catch (err) {
      console.error("Error fetching user orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleConfirmCancel = async () => {
    if (!cancelModalOrderId) return;
    try {
      await orderService.cancelOrder(cancelModalOrderId);
      addToast(`Order ${cancelModalOrderId} has been cancelled`, "info");
      setCancelModalOrderId(null);
      fetchOrders();
    } catch (err) {
      addToast("Failed to cancel order", "error");
    }
  };

  if (loading) return <Loader text="Loading your order history..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          My Order History & Live Tracking
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Track current order delivery status, view past purchases, or manage cancellations
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-20 h-20 bg-orange-100 dark:bg-orange-950/50 text-[#ff6b35] rounded-full flex items-center justify-center text-3xl mx-auto">
            <FiShoppingBag />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            No Orders Placed Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When you order your favorite meals, they will appear here for live tracking.
          </p>
          <Link
            to="/menu"
            className="inline-block px-5 py-2.5 bg-[#ff6b35] text-white font-bold text-xs rounded-xl shadow"
          >
            Order Something Tasty
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const canCancel = order.status === "Preparing" || order.status === "Out for Delivery";

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {/* Order Header */}
                <div className="p-6 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-xs text-slate-400 block font-normal">Order ID</span>
                      <span className="text-base font-extrabold text-[#ff6b35]">{order.id}</span>
                    </div>
                    <div className="hidden sm:block border-l border-slate-200 dark:border-slate-700 h-8" />
                    <div className="hidden sm:block">
                      <span className="text-xs text-slate-400 block font-normal">Date & Time</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {formatDate(order.date)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border ${getStatusBadgeStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-normal">Total Paid</span>
                      <span className="text-lg font-black text-slate-900 dark:text-white">
                        {formatCurrency(order.amount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6 space-y-6">
                  {/* Items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {item.name}
                          </h5>
                          <div className="flex justify-between text-[11px] text-slate-500 font-semibold mt-0.5">
                            <span>Qty: {item.quantity}</span>
                            <span>{formatCurrency(item.price)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Address & Status Tracker */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    <div>
                      <span className="font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                        Delivery Address:
                      </span>
                      <p className="font-semibold text-slate-700 dark:text-slate-300">
                        {order.customerName} ({order.phone})
                      </p>
                      <p className="text-slate-500">{order.address}</p>
                      <p className="text-[#ff6b35] font-semibold mt-1">
                        Payment Method: {order.paymentMethod}
                      </p>
                    </div>

                    {/* Status Timeline or Cancellation Trigger */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-400 uppercase tracking-wider block">
                          Live Delivery Timeline:
                        </span>

                        {canCancel && (
                          <button
                            onClick={() => setCancelModalOrderId(order.id)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 font-bold text-xs rounded-xl transition border border-rose-200 dark:border-rose-800"
                          >
                            <FiXCircle size={14} /> Cancel Order
                          </button>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span
                          className={
                            order.status === "Preparing" ||
                            order.status === "Out for Delivery" ||
                            order.status === "Delivered"
                              ? "text-[#ff6b35]"
                              : "text-slate-400"
                          }
                        >
                          1. Preparing
                        </span>
                        <span
                          className={
                            order.status === "Out for Delivery" || order.status === "Delivered"
                              ? "text-[#ff6b35]"
                              : "text-slate-400"
                          }
                        >
                          2. Out for Delivery
                        </span>
                        <span
                          className={
                            order.status === "Delivered" ? "text-emerald-500" : "text-slate-400"
                          }
                        >
                          3. Delivered
                        </span>
                      </div>

                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            order.status === "Preparing"
                              ? "w-1/3 bg-gradient-to-r from-[#ff6b35] to-amber-500"
                              : order.status === "Out for Delivery"
                              ? "w-2/3 bg-gradient-to-r from-[#ff6b35] to-blue-500"
                              : order.status === "Delivered"
                              ? "w-full bg-emerald-500"
                              : "w-full bg-rose-500 opacity-60"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      <Modal
        isOpen={!!cancelModalOrderId}
        onClose={() => setCancelModalOrderId(null)}
        title="Confirm Order Cancellation"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Are you sure you want to cancel order{" "}
            <span className="font-bold text-[#ff6b35]">{cancelModalOrderId}</span>?
            This will stop kitchen preparation and refund your payment method.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setCancelModalOrderId(null)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl"
            >
              Keep Order
            </button>
            <button
              onClick={handleConfirmCancel}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow"
            >
              Yes, Cancel Order
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrdersPage;
