import React from 'react';
import { Movie } from '../types';
import { X, Play, ExternalLink } from 'lucide-react';
import { GENRE_EMOJIS } from '../data/movies';

interface PlayerModalProps {
  movie: Movie;
  autoPlay: boolean;
  onClose: () => void;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({
  movie,
  autoPlay,
  onClose
}) => {
  const genreEmoji = movie.genres.find(g => GENRE_EMOJIS[g]) ? GENRE_EMOJIS[movie.genres.find(g => GENRE_EMOJIS[g])!] : '🎬';
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    movie.title + ' full movie official'
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-up overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#131722] border border-[#23293b] rounded-3xl overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center border border-white/20 hover:scale-105 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {movie.yt ? (
          <div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${movie.yt}?autoplay=1&rel=0`}
                title={movie.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
            <div className="p-4 flex items-center justify-between text-xs text-[#8b95ad] border-t border-[#23293b]">
              <span>Streaming YouTube official upload</span>
              <a
                href={`https://www.youtube.com/watch?v=${movie.yt}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[#f5cb6e] hover:underline"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : movie.video ? (
          <div className="bg-black">
            <video
              controls
              autoPlay={autoPlay}
              playsInline
              src={movie.video}
              className="w-full max-h-[75vh] object-contain mx-auto"
            />
          </div>
        ) : (
          <div className="p-8 sm:p-12 text-center flex flex-col items-center max-w-lg mx-auto">
            <div className="text-6xl mb-3">{genreEmoji}</div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-white mb-2">
              {movie.title}
            </h2>
            <p className="text-sm text-[#8b95ad] mb-6 leading-relaxed">
              No direct video file is attached to this demo title yet. You can stream the official full movie or trailer directly on YouTube.
            </p>

            <a
              href={youtubeSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-gold flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold shadow-lg"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Watch on YouTube</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
