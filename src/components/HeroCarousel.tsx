import React, { useState, useEffect } from 'react';
import { Movie } from '../types';
import { getMoviePosterSrc } from '../services/storage';
import { Ticket, Star, Play } from 'lucide-react';

interface HeroCarouselProps {
  featuredMovies: Movie[];
  imageMap: Record<string, string>;
  onBookTickets: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  featuredMovies,
  imageMap,
  onBookTickets,
  onOpenDetails
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  if (!featuredMovies.length) return null;

  const currentMovie = featuredMovies[currentIndex];
  const posterSrc = getMoviePosterSrc(currentMovie, imageMap);

  return (
    <div className="relative mx-4 md:mx-8 mt-3 mb-6 h-[clamp(240px,46vw,380px)] rounded-3xl overflow-hidden border border-[#23293b] isolation-auto group shadow-2xl">
      {/* Background Slides */}
      {featuredMovies.map((movie, idx) => {
        const bg = getMoviePosterSrc(movie, imageMap);
        const isActive = idx === currentIndex;
        return (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Background image with Ken Burns animation */}
            <div
              className={`absolute inset-0 bg-cover bg-center ${isActive ? 'animate-kenburns' : ''}`}
              style={{ backgroundImage: `url('${bg}')` }}
            />
            {/* Dark gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d14] via-[#0b0d14]/75 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0d14] via-[#0b0d14]/80 to-transparent" />

            {/* Content info */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 max-w-2xl z-20">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#e5a93c]/20 text-[#f5cb6e] border border-[#e5a93c]/40 backdrop-blur-md">
                  Now In Cinemas
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-[#f5cb6e] bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-md">
                  <Star className="w-3.5 h-3.5 fill-[#f5cb6e]" />
                  {movie.rating || 9.2}
                </span>
              </div>

              <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-2 drop-shadow-md">
                {movie.title}
              </h1>

              <p className="text-sm md:text-base text-[#cbd2e3] line-clamp-2 mb-5 font-normal drop-shadow">
                {movie.tagline || movie.description}
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onBookTickets(movie)}
                  className="btn-gold flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Book tickets</span>
                </button>

                <button
                  onClick={() => onOpenDetails(movie)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-colors"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Details</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Pagination indicators */}
      <div className="absolute right-5 bottom-5 z-30 flex items-center gap-2">
        {featuredMovies.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentIndex ? 'w-6 bg-[#f5cb6e]' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            title={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
