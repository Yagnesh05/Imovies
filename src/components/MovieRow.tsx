import React from 'react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  imageMap: Record<string, string>;
  ownedIds: string[];
  onSelectMovie: (movie: Movie) => void;
  showRank?: boolean;
}

export const MovieRow: React.FC<MovieRowProps> = ({
  title,
  movies,
  imageMap,
  ownedIds,
  onSelectMovie,
  showRank = false
}) => {
  if (!movies.length) return null;

  return (
    <div className="mb-7">
      <h2 className="font-heading font-extrabold text-xl md:text-2xl text-white px-4 md:px-8 mb-3.5 flex items-center gap-2">
        <span>{title}</span>
      </h2>

      {/* Horizontal Scroll Track */}
      <div className="flex gap-4 overflow-x-auto px-4 md:px-8 pb-3 pt-1 scrollbar-none no-scrollbar">
        {movies.map((movie, idx) => (
          <div key={movie.id} className="w-[140px] md:w-[165px] shrink-0">
            <MovieCard
              movie={movie}
              index={idx}
              imageMap={imageMap}
              isOwned={ownedIds.includes(movie.id)}
              onSelectMovie={onSelectMovie}
              rank={showRank ? idx + 1 : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
