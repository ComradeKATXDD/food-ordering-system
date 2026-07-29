import React from "react";
import { Link } from "react-router-dom";
import {
  FiInstagram,
  FiTwitter,
  FiFacebook,
  FiYoutube,
  FiMapPin,
  FiPhone,
  FiMail,
} from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#ff6b35] flex items-center justify-center font-black text-xl text-white shadow-lg">
                ⚡
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                FEAST<span className="text-[#ff6b35]">DASH</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Delivering piping hot, artisanal culinary delights straight from top master kitchens to your doorstep in under 30 minutes.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-[#ff6b35] hover:text-white flex items-center justify-center transition"
                aria-label="Instagram"
              >
                <FiInstagram size={18} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-[#ff6b35] hover:text-white flex items-center justify-center transition"
                aria-label="Twitter"
              >
                <FiTwitter size={18} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-[#ff6b35] hover:text-white flex items-center justify-center transition"
                aria-label="Facebook"
              >
                <FiFacebook size={18} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-[#ff6b35] hover:text-white flex items-center justify-center transition"
                aria-label="YouTube"
              >
                <FiYoutube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-[#ff6b35] transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-[#ff6b35] transition">
                  Full Food Menu
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#ff6b35] transition">
                  My Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-[#ff6b35] transition">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-[#ff6b35] transition">
                  User Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin / Portal */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Management
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/admin/login" className="hover:text-[#ff6b35] transition">
                  Admin Portal Login
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-[#ff6b35] transition">
                  Store Metrics
                </Link>
              </li>
              <li>
                <Link to="/admin/foods" className="hover:text-[#ff6b35] transition">
                  Menu Management
                </Link>
              </li>
              <li>
                <Link to="/admin/orders" className="hover:text-[#ff6b35] transition">
                  Order Dispatching
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <FiMapPin className="text-[#ff6b35] mt-1 shrink-0" />
                <span>100 Gourmet Plaza, Culinary Way, NY 10001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiPhone className="text-[#ff6b35] shrink-0" />
                <span>+1 (800) 555-FEAST</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiMail className="text-[#ff6b35] shrink-0" />
                <span>support@feastdash.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} FEASTDASH Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
