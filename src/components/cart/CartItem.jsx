import React from "react";
import { Link } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import QuantitySelector from "../common/QuantitySelector";
import { formatCurrency } from "../../utils/formatters";
import { useCart } from "../../hooks/useCart";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-bold text-[#ff6b35] uppercase tracking-wider">
            {item.category}
          </span>
          <Link to={`/food/${item.id}`}>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 hover:text-[#ff6b35] transition line-clamp-1">
              {item.name}
            </h4>
          </Link>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 block mt-1">
            {formatCurrency(item.price)} each
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
        <QuantitySelector
          quantity={item.quantity}
          onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
          onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
          size="md"
        />

        <div className="text-right min-w-[90px]">
          <span className="text-xs text-slate-400 block font-normal">Subtotal</span>
          <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            {formatCurrency(item.price * item.quantity)}
          </span>
        </div>

        <button
          onClick={() => removeFromCart(item.id)}
          className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition"
          aria-label="Remove item"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
