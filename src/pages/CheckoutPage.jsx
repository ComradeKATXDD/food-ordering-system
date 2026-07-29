import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { FiCreditCard, FiSmartphone, FiDollarSign, FiCheckCircle } from "react-icons/fi";
import { formatCurrency } from "../utils/formatters";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { orderService } from "../services/orderService";

const CheckoutPage = () => {
  const { cartItems, subtotal, deliveryFee, grandTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      addToast("Please fill in all delivery details", "warning");
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        customerId: user?.id || user?._id || `user-${Date.now()}`,
        customerName: formData.name,
        customerEmail: formData.email || user?.email,
        customerPhone: formData.phone,
        deliveryAddress: formData.address,
        address: formData.address,
        items: cartItems.map((item) => ({
          food: item.id || item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        totalAmount: grandTotal,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        paymentMethod: paymentMethod,
      };

      const created = await orderService.createOrder(orderPayload);
      clearCart();
      addToast(`Order ${created.id} placed successfully!`, "success");
      navigate("/orders");
    } catch (err) {
      console.error("Order creation failed", err);
      addToast("Failed to place order. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Order Checkout
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Complete your delivery details and choose a preferred payment method
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Details Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              1. Delivery Address Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Street address, Apartment / Suite"
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
            </div>
          </div>

          {/* Payment Methods Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              2. Choose Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: "UPI", label: "UPI Payment", icon: FiSmartphone, desc: "Google Pay, PhonePe, Paytm" },
                { id: "Credit/Debit Card", label: "Credit / Debit Card", icon: FiCreditCard, desc: "Visa, Mastercard, Amex" },
                { id: "Cash on Delivery", label: "Cash on Delivery", icon: FiDollarSign, desc: "Pay cash at door" },
              ].map((pm) => {
                const isSelected = paymentMethod === pm.id;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition ${
                      isSelected
                        ? "border-[#ff6b35] bg-orange-50/50 dark:bg-orange-950/30 text-slate-900 dark:text-white shadow-md"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <pm.icon size={22} className={isSelected ? "text-[#ff6b35]" : "text-slate-400"} />
                      {isSelected && <FiCheckCircle className="text-[#ff6b35]" />}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm">{pm.label}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{pm.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Summary Right Column */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm sticky top-28">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Order Items ({cartItems.length})
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img src={item.image} alt={item.name} className="w-9 h-9 rounded-lg object-cover" />
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</h5>
                      <span className="text-slate-400">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Items Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Delivery Charge</span>
                <span>{deliveryFee === 0 ? "FREE" : formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-black text-slate-900 dark:text-white pt-2">
                <span>Total Payment</span>
                <span className="text-[#ff6b35] text-2xl">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#ff6b35] hover:bg-[#e85a24] text-white font-extrabold text-base rounded-2xl shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 transition active:scale-98 disabled:opacity-50"
            >
              {loading ? "Confirming Order..." : `Confirm Order — ${formatCurrency(grandTotal)}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
