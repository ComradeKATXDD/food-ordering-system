import React from "react";
import { formatCurrency, formatDate, getStatusBadgeStyle } from "../../utils/formatters";
import { FiXCircle } from "react-icons/fi";

const OrderTable = ({ orders, onStatusChange, onCancelOrder }) => {
  const statusOptions = ["Preparing", "Out for Delivery", "Delivered", "Cancelled"];

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="bg-slate-100/70 dark:bg-slate-800/70 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="py-4 px-5">Order ID</th>
            <th className="py-4 px-5">Customer</th>
            <th className="py-4 px-5">Items</th>
            <th className="py-4 px-5">Amount</th>
            <th className="py-4 px-5">Date</th>
            <th className="py-4 px-5">Status</th>
            <th className="py-4 px-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
          {orders.map((order) => (
            <tr
              key={order.id}
              className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
            >
              <td className="py-3.5 px-5 font-extrabold text-[#ff6b35]">
                {order.id}
              </td>

              <td className="py-3.5 px-5">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">
                    {order.customerName}
                  </h4>
                  <p className="text-xs text-slate-400">{order.phone}</p>
                </div>
              </td>

              <td className="py-3.5 px-5">
                <div className="text-xs font-medium space-y-0.5">
                  {order.items?.map((it, idx) => (
                    <div key={idx} className="text-slate-700 dark:text-slate-300">
                      {it.quantity}x {it.name}
                    </div>
                  ))}
                </div>
              </td>

              <td className="py-3.5 px-5 font-extrabold text-slate-900 dark:text-slate-100">
                {formatCurrency(order.amount)}
              </td>

              <td className="py-3.5 px-5 text-xs text-slate-500 dark:text-slate-400">
                {formatDate(order.date)}
              </td>

              <td className="py-3.5 px-5">
                <select
                  value={order.status}
                  onChange={(e) => onStatusChange(order.id, e.target.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none transition cursor-pointer ${getStatusBadgeStyle(
                    order.status
                  )}`}
                >
                  {statusOptions.map((st) => (
                    <option key={st} value={st} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                      {st}
                    </option>
                  ))}
                </select>
              </td>

              <td className="py-3.5 px-5 text-right">
                {order.status !== "Cancelled" && order.status !== "Delivered" && (
                  <button
                    onClick={() => onCancelOrder(order.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                  >
                    <FiXCircle size={14} /> Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
