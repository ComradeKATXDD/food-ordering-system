import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingBag, FiArrowRight, FiTrash2, FiTag } from "react-icons/fi";
import CartItem from "../components/cart/CartItem";
import { formatCurrency } from "../utils/formatters";
import { useCart } from "../hooks/useCart";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../hooks/useAuth";

const CartPage = () => {
  const { cartItems, clearCart, subtotal, deliveryFee, grandTotal, totalItems } = useCart();
  const { addToast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === "FEAST50") {
      const discVal = subtotal * 0.5;
      setDiscount(discVal);
      addToast("FEAST50 coupon applied! 50% discount granted.", "success");
    } else {
      addToast("Invalid coupon code. Try 'FEAST50'", "error");
    }
  };

  const finalTotal = Math.max(0, grandTotal - discount);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <div className="w-24 h-24 bg-orange-100 dark:bg-orange-950/50 text-[#ff6b35] rounded-full flex items-center justify-center text-4xl mx-auto">
          <FiShoppingBag />
        </div>
        <div className="space-y-2 max-w-sm mx-auto">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Your Cart is Currently Empty
          </h2>
          <p className="text-xs text-slate-500">
            Looks like you haven't added any culinary items to your bag yet.
          </p>
        </div>
        <div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#ff6b35] hover:bg-[#e85a24] text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-orange-500/25 transition"
          >
            Explore Food Menu <FiArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Your Shopping Cart ({totalItems} items)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review your order before proceeding to checkout
          </p>
        </div>
        <button
          onClick={() => {
            clearCart();
            addToast("Cart cleared", "info");
          }}
          className="flex items-center gap-1 text-xs font-bold text-rose-500 hover:underline"
        >
          <FiTrash2 /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Order Summary
            </h3>

            {/* Coupon Box */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <FiTag className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Promo code (e.g. FEAST50)"
                  className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-[#ff6b35] transition"
              >
                Apply
              </button>
            </form>

            <div className="space-y-3 text-sm border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Delivery Charge</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-500 font-extrabold uppercase text-xs">FREE</span>
                  ) : (
                    formatCurrency(deliveryFee)
                  )}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Discount (FEAST50)</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-lg font-black text-slate-900 dark:text-white">
              <span>Grand Total</span>
              <span className="text-[#ff6b35] text-2xl">{formatCurrency(finalTotal)}</span>
            </div>

            <button
              onClick={() => {
                if (!isAuthenticated) {
                  addToast("Please log in to proceed to checkout", "warning");
                  navigate("/login");
                } else {
                  navigate("/checkout");
                }
              }}
              className="w-full py-4 bg-[#ff6b35] hover:bg-[#e85a24] text-white font-extrabold text-base rounded-2xl shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 transition active:scale-98"
            >
              Proceed to Checkout <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
