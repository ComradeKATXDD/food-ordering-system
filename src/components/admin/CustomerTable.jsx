import React from "react";
import { FiSlash, FiCheckCircle, FiTrash2 } from "react-icons/fi";
import { formatCurrency, getStatusBadgeStyle } from "../../utils/formatters";

const CustomerTable = ({ customers, onToggleBlock, onDelete }) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="bg-slate-100/70 dark:bg-slate-800/70 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="py-4 px-5">Customer</th>
            <th className="py-4 px-5">Contact Email</th>
            <th className="py-4 px-5">Phone Number</th>
            <th className="py-4 px-5">Orders</th>
            <th className="py-4 px-5">Total Spent</th>
            <th className="py-4 px-5">Status</th>
            <th className="py-4 px-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
          {customers.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
            >
              <td className="py-3.5 px-5">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100">
                      {user.name}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1">{user.address}</p>
                  </div>
                </div>
              </td>

              <td className="py-3.5 px-5 font-medium text-slate-700 dark:text-slate-300">
                {user.email}
              </td>

              <td className="py-3.5 px-5 text-slate-500 dark:text-slate-400">
                {user.phone}
              </td>

              <td className="py-3.5 px-5 font-bold text-slate-900 dark:text-slate-100">
                {user.ordersCount || 0}
              </td>

              <td className="py-3.5 px-5 font-extrabold text-slate-900 dark:text-slate-100">
                {formatCurrency(user.totalSpent)}
              </td>

              <td className="py-3.5 px-5">
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusBadgeStyle(
                    user.status
                  )}`}
                >
                  {user.status}
                </span>
              </td>

              <td className="py-3.5 px-5 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onToggleBlock(user.id)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                      user.status === "Active"
                        ? "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                        : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                    }`}
                  >
                    {user.status === "Active" ? (
                      <>
                        <FiSlash size={14} /> Block
                      </>
                    ) : (
                      <>
                        <FiCheckCircle size={14} /> Unblock
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onDelete(user.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                    title="Delete Customer"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
