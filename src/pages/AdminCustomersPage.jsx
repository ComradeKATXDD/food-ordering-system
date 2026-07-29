import React, { useEffect, useState } from "react";
import CustomerTable from "../components/admin/CustomerTable";
import Modal from "../components/common/Modal";
import Loader from "../components/common/Loader";
import { userService } from "../services/userService";
import { useToast } from "../hooks/useToast";

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const { addToast } = useToast();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers();
      setCustomers(data);
    } catch (err) {
      console.error("Error fetching customers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleBlock = async (userId) => {
    try {
      const updated = await userService.toggleUserBlock(userId);
      setCustomers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: updated.status } : u))
      );
      addToast(
        `Customer account status changed to ${updated.status}`,
        updated.status === "Active" ? "success" : "warning"
      );
    } catch (err) {
      addToast("Failed to change account status", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await userService.deleteUser(deleteId);
      addToast("Customer record deleted", "info");
      setDeleteId(null);
      fetchCustomers();
    } catch (err) {
      addToast("Error deleting customer", "error");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Registered Customer Accounts
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          View customer history, manage account permissions, or block suspicious users
        </p>
      </div>

      {loading ? (
        <Loader text="Loading customer records..." />
      ) : (
        <CustomerTable
          customers={customers}
          onToggleBlock={handleToggleBlock}
          onDelete={(id) => setDeleteId(id)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Customer Account"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to permanently remove this customer profile? This will purge all associated user metadata.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteId(null)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow"
            >
              Delete Customer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminCustomersPage;
