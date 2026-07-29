import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FiClock, FiPlus, FiArrowLeft, FiCheck, FiThumbsUp, FiThumbsDown, FiMessageSquare, FiStar, FiSend } from "react-icons/fi";
import RatingStars from "../components/common/RatingStars";
import QuantitySelector from "../components/common/QuantitySelector";
import FoodCard from "../components/food/FoodCard";
import Loader from "../components/common/Loader";
import { formatCurrency, formatDate } from "../utils/formatters";
import { foodService } from "../services/foodService";
import { useCart } from "../hooks/useCart";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../hooks/useAuth";

const FoodDetailsPage = () => {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [relatedFoods, setRelatedFoods] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Review & Comment Form State
  const [commentText, setCommentText] = useState("");
  const [selectedRating, setSelectedRating] = useState(5);
  const [submittingComment, setSubmittingComment] = useState(false);

  const { addToCart } = useCart();
  const { addToast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchFoodDetails = async () => {
    try {
      const item = await foodService.getFoodById(id);
      setFood(item);

      const allFoods = await foodService.getFoods({ category: item.category });
      setRelatedFoods(allFoods.filter((f) => f.id !== item.id && f._id !== item._id).slice(0, 3));
    } catch (err) {
      console.error("Error loading food details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchFoodDetails();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const handleAddToCart = () => {
    if (!food) return;
    if (!isAuthenticated) {
      addToast("Please log in to add items to your cart", "warning");
      navigate("/login");
      return;
    }
    addToCart(food, quantity);
    addToast(`Added ${quantity}x ${food.name} to cart!`, "success");
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast("Please log in to post a review or comment", "warning");
      navigate("/login");
      return;
    }

    if (!commentText.trim()) {
      addToast("Please enter your comment or review text", "warning");
      return;
    }

    setSubmittingComment(true);
    try {
      const updatedFood = await foodService.addComment(food.id || food._id, {
        rating: selectedRating,
        text: commentText,
      });
      setFood(updatedFood);
      setCommentText("");
      setSelectedRating(5);
      addToast("Your review and rating have been posted to MongoDB!", "success");
    } catch (err) {
      addToast(err.message || "Failed to post review", "error");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!isAuthenticated) {
      addToast("Please log in to react to comments", "warning");
      navigate("/login");
      return;
    }

    const currentUserId = user?.id || user?._id;
    if (!currentUserId) return;

    // Optimistic UI update
    setFood((prevFood) => {
      if (!prevFood) return prevFood;
      const updatedComments = (prevFood.comments || []).map((c) => {
        const cId = c._id || c.id;
        if (cId === commentId) {
          const likes = [...(c.likes || [])];
          const dislikes = [...(c.dislikes || [])];
          const lIdx = likes.findIndex((id) => (id._id || id) === currentUserId || id === currentUserId);
          const dIdx = dislikes.findIndex((id) => (id._id || id) === currentUserId || id === currentUserId);

          if (dIdx > -1) dislikes.splice(dIdx, 1);
          if (lIdx > -1) likes.splice(lIdx, 1);
          else likes.push(currentUserId);

          return { ...c, likes, dislikes };
        }
        return c;
      });
      return { ...prevFood, comments: updatedComments };
    });

    try {
      const updatedFood = await foodService.likeComment(food.id || food._id, commentId);
      if (updatedFood) setFood(updatedFood);
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const handleDislikeComment = async (commentId) => {
    if (!isAuthenticated) {
      addToast("Please log in to react to comments", "warning");
      navigate("/login");
      return;
    }

    const currentUserId = user?.id || user?._id;
    if (!currentUserId) return;

    // Optimistic UI update
    setFood((prevFood) => {
      if (!prevFood) return prevFood;
      const updatedComments = (prevFood.comments || []).map((c) => {
        const cId = c._id || c.id;
        if (cId === commentId) {
          const likes = [...(c.likes || [])];
          const dislikes = [...(c.dislikes || [])];
          const lIdx = likes.findIndex((id) => (id._id || id) === currentUserId || id === currentUserId);
          const dIdx = dislikes.findIndex((id) => (id._id || id) === currentUserId || id === currentUserId);

          if (lIdx > -1) likes.splice(lIdx, 1);
          if (dIdx > -1) dislikes.splice(dIdx, 1);
          else dislikes.push(currentUserId);

          return { ...c, likes, dislikes };
        }
        return c;
      });
      return { ...prevFood, comments: updatedComments };
    });

    try {
      const updatedFood = await foodService.dislikeComment(food.id || food._id, commentId);
      if (updatedFood) setFood(updatedFood);
    } catch (err) {
      console.error("Dislike failed", err);
    }
  };

  if (loading) return <Loader text="Fetching dish details..." />;

  if (!food) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Dish Not Found</h2>
        <p className="text-xs text-slate-500">The requested food item does not exist or has been removed.</p>
        <Link to="/menu" className="inline-block px-5 py-2.5 bg-[#ff6b35] text-white text-xs font-bold rounded-xl">
          Back to Menu
        </Link>
      </div>
    );
  }

  const comments = food.comments || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back button */}
      <Link
        to="/menu"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#ff6b35] transition"
      >
        <FiArrowLeft /> Back to Menu
      </Link>

      {/* Main Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Image Art */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 aspect-[4/3]">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover"
          />
          {food.isPopular && (
            <span className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white font-black text-xs uppercase tracking-wider rounded-full shadow">
              ★ Bestseller
            </span>
          )}
        </div>

        {/* Right Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-[#ff6b35] uppercase tracking-widest">
              {food.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {food.name}
            </h1>
            <div className="flex items-center gap-4 pt-1">
              <RatingStars rating={food.rating} reviewsCount={food.reviewsCount} size={16} />
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                <FiClock className="text-[#ff6b35]" /> {food.prepTime || "20 min prep"}
              </span>
            </div>
          </div>

          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {formatCurrency(food.price)}
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {food.description}
          </p>

          {/* Ingredients list */}
          {food.ingredients && food.ingredients.length > 0 && (
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Fresh Ingredients & Toppings:
              </h4>
              <div className="flex flex-wrap gap-2">
                {food.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                  >
                    <FiCheck className="text-emerald-500" /> {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Actions */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4">
            <QuantitySelector
              quantity={quantity}
              onIncrease={() => setQuantity(quantity + 1)}
              onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
              size="lg"
            />

            <button
              onClick={handleAddToCart}
              className="flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3.5 bg-[#ff6b35] hover:bg-[#e85a24] text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-orange-500/30 transition active:scale-95"
            >
              <FiPlus size={18} /> Add to Cart — {formatCurrency(food.price * quantity)}
            </button>
          </div>
        </div>
      </div>

      {/* Customer Ratings & Comments Section */}
      <section className="space-y-8 pt-12 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#ff6b35]">
              Customer Reviews
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FiMessageSquare className="text-[#ff6b35]" /> Dish Ratings & Discussion ({comments.length})
            </h2>
          </div>

          <div className="flex items-center gap-3 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 px-4 py-2 rounded-2xl text-xs font-bold text-slate-700 dark:text-orange-200">
            <span>Overall Score:</span>
            <span className="text-base text-[#ff6b35] font-black">★ {food.rating}</span>
            <span className="text-slate-400">({food.reviewsCount} reviews)</span>
          </div>
        </div>

        {/* Comment Form */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Leave a Rating & Comment
          </h3>

          <form onSubmit={handleCommentSubmit} className="space-y-4">
            {/* 0-5 Star Rating Selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Your Rating:</span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRating(star)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <FiStar
                      size={22}
                      className={
                        star <= selectedRating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300 dark:text-slate-700"
                      }
                    />
                  </button>
                ))}
                <span className="text-xs font-black text-[#ff6b35] ml-2">
                  {selectedRating} / 5 Stars
                </span>
              </div>
            </div>

            {/* Comment Area */}
            <div>
              <textarea
                rows="3"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={
                  isAuthenticated
                    ? `Share your thoughts on ${food.name}...`
                    : "Please log in to leave a comment and rating."
                }
                disabled={!isAuthenticated || submittingComment}
                className="w-full p-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] disabled:opacity-60"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!isAuthenticated || submittingComment}
                className="px-6 py-3 bg-[#ff6b35] hover:bg-[#e85a24] text-white font-extrabold text-xs rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2 transition active:scale-95 disabled:opacity-50"
              >
                <FiSend /> {submittingComment ? "Posting..." : "Post Review"}
              </button>
            </div>
          </form>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400">
              No comments yet for this dish. Be the first to share your review!
            </div>
          ) : (
            comments.map((comment) => {
              const commentId = comment._id || comment.id;
              const currentUserId = user?.id || user?._id;
              const hasLiked = comment.likes?.some((uid) => (uid._id || uid) === currentUserId || uid === currentUserId);
              const hasDisliked = comment.dislikes?.some((uid) => (uid._id || uid) === currentUserId || uid === currentUserId);

              return (
                <div
                  key={commentId}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={comment.userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"}
                        alt={comment.userName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                          {comment.userName}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-xl text-amber-500 text-xs font-black">
                      <FiStar className="fill-current" size={13} />
                      <span>{comment.rating} / 5</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium pl-1">
                    {comment.text}
                  </p>

                  {/* Likes / Dislikes Action Buttons */}
                  <div className="flex items-center gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                    <button
                      type="button"
                      onClick={() => handleLikeComment(commentId)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition active:scale-95 ${
                        hasLiked
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-500"
                      }`}
                    >
                      <FiThumbsUp size={14} /> <span>{comment.likes?.length || 0}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDislikeComment(commentId)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition active:scale-95 ${
                        hasDisliked
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-700"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-500"
                      }`}
                    >
                      <FiThumbsDown size={14} /> <span>{comment.dislikes?.length || 0}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Related Foods */}
      {relatedFoods.length > 0 && (
        <section className="space-y-6 pt-12 border-t border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#ff6b35]">
              Similar Flavor Profiles
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              You Might Also Enjoy
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedFoods.map((rel) => (
              <FoodCard key={rel.id} food={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default FoodDetailsPage;
