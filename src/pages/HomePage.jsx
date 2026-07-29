import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiZap,
  FiAward,
  FiMapPin,
  FiArrowRight,
  FiClock,
  FiShield,
  FiHeart,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import CategoryFilter from "../components/food/CategoryFilter";
import FoodCard from "../components/food/FoodCard";
import SkeletonCard from "../components/common/SkeletonCard";
import { foodService } from "../services/foodService";
import { formatCurrency } from "../utils/formatters";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const [popularFoods, setPopularFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);
  const navigate = useNavigate();

  const heroSlides = featuredFoods.length > 0 ? featuredFoods : [
    {
      _id: "f1",
      id: "f1",
      name: "Truffle Mushroom Pizza",
      price: 399,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80",
    },
    {
      _id: "f2",
      id: "f2",
      name: "Royal Paneer Tikka Masala",
      price: 329,
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1000&q=80",
    },
    {
      _id: "f3",
      id: "f3",
      name: "Smokey BBQ Gourmet Burger",
      price: 249,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cats, foods] = await Promise.all([
          foodService.getCategories(),
          foodService.getFoods(),
        ]);
        setCategories(cats);
        setFeaturedFoods(foods.filter((f) => f.isFeatured).slice(0, 4));
        setPopularFoods(foods.filter((f) => f.isPopular).slice(0, 8));
      } catch (err) {
        console.error("Error loading home page data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/80 via-white to-transparent dark:from-slate-900/90 dark:via-slate-950 dark:to-transparent py-16 sm:py-24 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-[#ff6b35] dark:text-orange-300 font-extrabold text-xs uppercase tracking-wider shadow-sm">
                <FiZap className="animate-bounce" /> Fast Delivery Within 30 Minutes
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                Craving Delicious Food? <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b35] to-amber-500">
                  Delivered Piping Hot!
                </span>
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover artisanal pizzas, juicy gourmet burgers, aromatic biryanis, and decadent desserts from top local master chefs.
              </p>

              {/* Hero Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="relative max-w-xl mx-auto lg:mx-0 bg-white dark:bg-slate-900 rounded-3xl p-2 shadow-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-2"
              >
                <div className="pl-4 text-slate-400">
                  <FiSearch size={22} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pizzas, burgers, biryani, ramen..."
                  className="w-full bg-transparent py-3 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-[#ff6b35] hover:bg-[#e85a24] text-white font-bold text-sm rounded-2xl shadow-lg shadow-orange-500/30 transition-all shrink-0"
                >
                  Search
                </button>
              </form>

              {/* Trust Metrics */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-slate-600 dark:text-slate-400 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <FiClock className="text-[#ff6b35] text-base" /> 24/7 Fast Delivery
                </div>
                <div className="flex items-center gap-2">
                  <FiAward className="text-[#ff6b35] text-base" /> 4.9 Star Rating
                </div>
                <div className="flex items-center gap-2">
                  <FiShield className="text-[#ff6b35] text-base" /> 100% Hygenic
                </div>
              </div>
            </div>

            {/* Right Image Art - Dynamic Featured Dish Slideshow Carousel */}
            <div className="relative flex justify-center">
              <div className="relative w-full max-w-lg aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/20 border-4 border-white dark:border-slate-800 group">
                {heroSlides.map((slide, idx) => (
                  <div
                    key={slide._id || slide.id || idx}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      idx === slideIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={slide.name}
                      className="w-full h-full object-cover scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-[#ff6b35] uppercase tracking-wider block">
                          Special Treat 🔥
                        </span>
                        <Link
                          to={`/food/${slide.id || slide._id}`}
                          className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white hover:text-[#ff6b35] transition line-clamp-1"
                        >
                          {slide.name}
                        </Link>
                      </div>
                      <span className="px-3.5 py-2 bg-[#ff6b35] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shrink-0">
                        {formatCurrency(slide.price)}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Left / Right Carousel Controls */}
                <button
                  onClick={() => setSlideIndex((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
                  className="z-20 absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/40 hover:bg-[#ff6b35] text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition duration-300"
                  aria-label="Previous Slide"
                >
                  <FiChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setSlideIndex((prev) => (prev + 1) % heroSlides.length)}
                  className="z-20 absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/40 hover:bg-[#ff6b35] text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition duration-300"
                  aria-label="Next Slide"
                >
                  <FiChevronRight size={20} />
                </button>

                {/* Indicator Dots */}
                <div className="z-20 absolute top-4 right-4 flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  {heroSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSlideIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === slideIndex ? "w-5 bg-[#ff6b35]" : "w-2 bg-white/60 hover:bg-white"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Explore Menu Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select a category to quickly filter your craving
            </p>
          </div>
          <Link
            to="/menu"
            className="flex items-center gap-1 text-xs font-extrabold text-[#ff6b35] hover:underline"
          >
            View All <FiArrowRight />
          </Link>
        </div>

        <CategoryFilter
          categories={categories}
          activeCategory="all"
          onSelectCategory={(id) => navigate(`/menu?category=${id}`)}
        />
      </section>

      {/* Featured Items Carousel/Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#ff6b35]">
              Chef's Specials
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Featured Food Items
            </h2>
          </div>
          <Link
            to="/menu"
            className="flex items-center gap-1 text-xs font-extrabold text-[#ff6b35] hover:underline"
          >
            Explore Menu <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredFoods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}
      </section>

      {/* Special Offer Banners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Banner 1 */}
          <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between min-h-[220px]">
            <div className="space-y-2 z-10 max-w-xs">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
                Limited Offer
              </span>
              <h3 className="text-2xl font-black">50% OFF Your First Order!</h3>
              <p className="text-xs opacity-90">Use code: FEAST50 at checkout</p>
            </div>
            <div className="pt-4 z-10">
              <Link
                to="/menu"
                className="inline-block px-5 py-2.5 bg-white text-orange-600 font-extrabold text-xs rounded-xl shadow-lg hover:bg-slate-100 transition"
              >
                Claim Offer Now
              </Link>
            </div>
          </div>

          {/* Banner 2 */}
          <div className="relative overflow-hidden bg-slate-900 text-white rounded-3xl p-8 shadow-xl border border-slate-800 flex flex-col justify-between min-h-[220px]">
            <div className="space-y-2 z-10 max-w-xs">
              <span className="px-3 py-1 bg-[#ff6b35] rounded-full text-xs font-bold uppercase tracking-wider">
                Free Shipping
              </span>
              <h3 className="text-2xl font-black">Free Delivery On Orders Over $40</h3>
              <p className="text-xs text-slate-400">Order from top rated restaurants</p>
            </div>
            <div className="pt-4 z-10">
              <Link
                to="/menu"
                className="inline-block px-5 py-2.5 bg-[#ff6b35] hover:bg-[#e85a24] text-white font-extrabold text-xs rounded-xl shadow-lg transition"
              >
                Order Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Foods */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#ff6b35]">
            Customer Favorites
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Most Popular Dishes
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularFoods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="bg-slate-100 dark:bg-slate-900 py-16 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#ff6b35]">
              Our Promise
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Why Millions Choose FeastDash
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              We redefine food delivery with ultra-fast fulfillment and uncompromised food quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 text-center card-hover">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-950/60 text-[#ff6b35] rounded-2xl flex items-center justify-center text-2xl mx-auto">
                🚀
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                30-Min Fast Delivery
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Piping hot delivery guarantee backed by smart routing algorithms and thermal insulated bags.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 text-center card-hover">
              <div className="w-14 h-14 bg-amber-100 dark:bg-amber-950/60 text-amber-500 rounded-2xl flex items-center justify-center text-2xl mx-auto">
                👨‍🍳
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Master Chef Quality
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Every dish is prepared using farm-fresh ingredients by verified award-winning culinary experts.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 text-center card-hover">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 rounded-2xl flex items-center justify-center text-2xl mx-auto">
                📍
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Live GPS Order Tracking
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Track your order status step-by-step from kitchen prep to your doorstep in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#ff6b35]">
            Customer Reviews
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            What Food Lovers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Sarah Jenkins",
              role: "Food Blogger",
              review: "The Truffle Mushroom Pizza arrived piping hot and tasted like it came straight out of a wood-fired oven in Naples! 10/10 service.",
              avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
            },
            {
              name: "Alex Rivera",
              role: "Software Engineer",
              review: "Ordering lunch for our tech team has never been easier. The Double Smash Avocado Burger is unmatched in town!",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
            },
            {
              name: "Jessica Alba",
              role: "Fitness Instructor",
              review: "Love the healthy protein bowl options! Super fresh ingredients, clean packaging, and extremely fast delivery times.",
              avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
            },
          ].map((t, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</h4>
                  <span className="text-xs text-slate-400">{t.role}</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                "{t.review}"
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
