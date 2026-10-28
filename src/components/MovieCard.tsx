import React, { useState } from 'react';
import { Movie } from '../types';
import { getMoviePosterSrc } from '../services/storage';
import { generateMoviePosterSvg } from '../data/movies';

interface MovieCardProps {
  movie: Movie;
  index: number;
  imageMap: Record<string, string>;
  isOwned: boolean;
  onSelectMovie: (movie: Movie) => void;
  rank?: number;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  index,
  imageMap,
  isOwned,
  onSelectMovie,
  rank
}) => {
  const initialPoster = getMoviePosterSrc(movie, imageMap);
  const [posterUrl, setPosterUrl] = useState(initialPoster);
  const [imageError, setImageError] = useState(false);

  // If poster URL changes from prop
  React.useEffect(() => {
    setPosterUrl(getMoviePosterSrc(movie, imageMap));
    setImageError(false);
  }, [movie.poster, movie.img, imageMap]);

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setPosterUrl(generateMoviePosterSvg(movie));
    }
  };

  const priceTag = isOwned
    ? 'OWNED'
    : movie.paid
    ? `₹${movie.price || 99}`
    : 'FREE';

  const ratingLabel = movie.imdbRating
    ? `IMDb ${movie.imdbRating}`
    : movie.rating
    ? `★ ${movie.rating}`
    : movie.lang;

  return (
    <div
      onClick={() => onSelectMovie(movie)}
      className="group relative cursor-pointer flex flex-col select-none transition-transform duration-300 hover:-translate-y-1.5"
    >
      {/* Rank number if in top 10 */}
      {rank !== undefined && (
        <span
          className="absolute -left-2 bottom-12 z-20 font-heading font-black text-6xl md:text-7xl leading-none select-none pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
          style={{
            color: 'transparent',
            WebkitTextStroke: '2px #f5cb6e'
          }}
        >
          {rank}
        </span>
      )}

      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-[#1a2030] border border-[#23293b] shadow-lg group-hover:shadow-[0_20px_35px_-10px_rgba(0,0,0,0.8),0_0_0_1px_#f5cb6e] transition-all duration-300">
        <img
          src={posterUrl}
          alt={movie.title}
          onError={handleImageError}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Ambient bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20 pointer-events-none" />

        {/* Rating/IMDb badge on top right */}
        <div className="absolute top-2.5 right-2.5 z-10 px-2.5 py-0.5 rounded-full text-xs font-bold bg-black/65 text-[#f5cb6e] backdrop-blur-md border border-white/10 shadow">
          {ratingLabel}
        </div>

        {/* Price or status badge on bottom right */}
        <div
          className={`absolute bottom-2.5 right-2.5 z-10 px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wide uppercase shadow ${
            isOwned
              ? 'bg-[#10b981] text-black font-extrabold'
              : movie.paid
              ? 'bg-[#f5cb6e] text-[#1a1200] font-black'
              : 'bg-[#1fbf75] text-[#04170d]'
          }`}
        >
          {priceTag}
        </div>
      </div>

      {/* Title & Metadata */}
      <h3 className="font-heading font-bold text-sm md:text-base text-white mt-2.5 mb-0.5 truncate group-hover:text-[#f5cb6e] transition-colors">
        {movie.title}
      </h3>
      <p className="text-xs text-[#8b95ad] truncate">
        {movie.year ? `${movie.year} · ` : ''}{movie.genres[0]} · {movie.lang}
      </p>
    </div>
  );
};
