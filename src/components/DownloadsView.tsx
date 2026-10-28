import React from 'react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';
import { Download, Film } from 'lucide-react';

interface DownloadsViewProps {
  movies: Movie[];
  imageMap: Record<string, string>;
  ownedIds: string[];
  onSelectMovie: (movie: Movie) => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
}

export const DownloadsView: React.FC<DownloadsViewProps> = ({
  movies,
  imageMap,
  ownedIds,
  onSelectMovie,
  onOpenAuth,
  isLoggedIn
}) => {
  return (
    <div className="px-4 md:px-8 py-4 animate-up max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-white">
            Downloads &amp; Library
          </h2>
          <p className="text-xs text-[#8b95ad] mt-0.5">
            Offline media files and purchased movies
          </p>
        </div>
      </div>

      {!isLoggedIn ? (
        <div className="p-10 text-center rounded-3xl bg-[#131722] border border-[#23293b] max-w-md mx-auto my-8">
          <Download className="w-12 h-12 text-[#f5cb6e] mx-auto mb-3 opacity-80" />
          <h3 className="font-heading font-bold text-lg text-white mb-2">
            Log in to access Downloads
          </h3>
          <p className="text-xs text-[#8b95ad] mb-6 leading-relaxed">
            Sign in to access your purchased movies, custom uploaded videos, and offline downloads library across devices.
          </p>
          <button
            onClick={onOpenAuth}
            className="btn-gold px-6 py-2.5 rounded-xl text-sm font-bold shadow-md"
          >
            Login / Register
          </button>
        </div>
      ) : movies.length > 0 ? (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((m, idx) => (
              <MovieCard
                key={m.id}
                movie={m}
                index={idx}
                imageMap={imageMap}
                isOwned={ownedIds.includes(m.id)}
                onSelectMovie={onSelectMovie}
              />
            ))}
          </div>

          <p className="text-xs text-[#8b95ad] mt-6 p-4 rounded-xl bg-[#131722] border border-[#23293b]">
            💡 <strong>Offline access tip:</strong> Purchased titles and videos hosted via direct MP4 URLs can be downloaded directly to your device storage. YouTube titles stream directly.
          </p>
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-[#131722] border border-[#23293b] max-w-md mx-auto my-8">
          <Film className="w-12 h-12 text-[#8b95ad] mx-auto mb-3 opacity-60" />
          <h3 className="font-heading font-bold text-lg text-white mb-1.5">
            No downloads yet
          </h3>
          <p className="text-xs text-[#8b95ad] leading-relaxed">
            Purchase premium titles or add your own MP4 videos in the Add Movie studio to download them here for offline watching.
          </p>
        </div>
      )}
    </div>
  );
};
