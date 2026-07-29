import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const RatingStars = ({ rating = 0, reviewsCount, showText = true, size = 14 }) => {
  const numRating = Number(rating) || 0;
  const stars = [];
  const fullStars = Math.floor(numRating);
  const hasHalfStar = numRating % 1 >= 0.4 && numRating % 1 <= 0.8;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<FaStar key={i} className="text-amber-400" size={size} />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} className="text-amber-400" size={size} />);
    } else {
      stars.push(<FaRegStar key={i} className="text-amber-400" size={size} />);
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">{stars}</div>
      {showText && (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {numRating.toFixed(1)} {reviewsCount ? <span className="text-slate-400 font-normal">({reviewsCount})</span> : null}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
