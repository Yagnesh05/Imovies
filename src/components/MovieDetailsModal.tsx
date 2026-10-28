import React, { useState } from 'react';
import { Movie } from '../types';
import { getMoviePosterSrc } from '../services/storage';
import { generateMoviePosterSvg } from '../data/movies';
import { X, Play, Download, Ticket, Plus, Check, Star, Users } from 'lucide-react';

interface MovieDetailsModalProps {
  movie: Movie;
  imageMap: Record<string, string>;
  isOwned: boolean;
  isInList: boolean;
  onClose: () => void;
  onBookTickets: (movie: Movie) => void;
  onToggleList: (movie: Movie) => void;
  onBuyMovie: (movie: Movie) => void;
  onPlayMovie: (movie: Movie) => void;
}

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  imageMap,
  isOwned,
  isInList,
  onClose,
  onBookTickets,
  onToggleList,
  onBuyMovie,
  onPlayMovie
}) => {
  const [downloadMsg, setDownloadMsg] = useState('');
  const initialPoster = getMoviePosterSrc(movie, imageMap);
  const [posterUrl, setPosterUrl] = useState(initialPoster);
  const [imageError, setImageError] = useState(false);

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

  const isLocked = Boolean(movie.paid && !isOwned);

  const handleDownload = () => {
    if (isLocked) {
      onBuyMovie(movie);
      return;
    }
    if (movie.video) {
      const a = document.createElement('a');
      a.href = movie.video;
      a.download = `${movie.title}.mp4`;
      a.click();
    } else {
      setDownloadMsg(
        'Offline downloads work for video files hosted with direct MP4 links (add one via Add Movie). YouTube videos stream directly.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-up overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#131722] border border-[#23293b] rounded-3xl p-6 md:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#1a2030] text-[#cbd2e3] hover:text-white flex items-center justify-center border border-[#23293b] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-6 items-start">
          <div className="relative aspect-[2/3] w-36 sm:w-full rounded-2xl overflow-hidden bg-[#1a2030] border border-[#23293b] shadow-xl shrink-0">
            <img
              src={posterUrl}
              alt={movie.title}
              onError={handleImageError}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#e5a93c]/20 text-[#f5cb6e] border border-[#e5a93c]/40">
                {movie.genres.join(' · ')}
              </span>
              <span className="text-xs font-semibold text-[#8b95ad]">
                {movie.year ? `${movie.year} · ` : ''}{movie.lang} · {movie.cert}
              </span>
            </div>

            <h1 className="font-heading font-black text-2xl md:text-3xl text-white mb-2">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-[#8b95ad] mb-3">
              {movie.imdbRating ? (
                <span className="flex items-center gap-1 font-bold text-[#f5cb6e] bg-[#f5cb6e]/15 px-2.5 py-0.5 rounded-full border border-[#f5cb6e]/30">
                  <Star className="w-3.5 h-3.5 fill-[#f5cb6e]" />
                  <span>IMDb {movie.imdbRating}</span>
                </span>
              ) : movie.rating ? (
                <span className="flex items-center gap-1 font-bold text-[#f5cb6e]">
                  <Star className="w-3.5 h-3.5 fill-[#f5cb6e]" />
                  <span>★ {movie.rating}</span>
                </span>
              ) : null}

              <span>{Math.floor(movie.dur / 60)}h {movie.dur % 60}m</span>
              {movie.director && <span>· Dir. {movie.director}</span>}
            </div>

            {movie.actors && (
              <p className="text-xs text-[#8b95ad] mb-3 flex items-start gap-1.5">
                <Users className="w-3.5 h-3.5 shrink-0 text-[#f5cb6e] mt-0.5" />
                <span><strong className="text-white">Starring:</strong> {movie.actors}</span>
              </p>
            )}

            <p className="text-sm text-[#cbd2e3] leading-relaxed mb-6">
              {movie.description}
            </p>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => (isLocked ? onBuyMovie(movie) : onPlayMovie(movie))}
                className="btn-gold flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>{isLocked ? `Unlock ₹${movie.price}` : 'Play'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#1a2030] hover:bg-[#23293b] text-white border border-[#23293b] transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>

              {movie.cin && (
                <button
                  onClick={() => onBookTickets(movie)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
                >
                  <Ticket className="w-4 h-4 text-[#f5cb6e]" />
                  <span>Book tickets</span>
                </button>
              )}

              <button
                onClick={() => onToggleList(movie)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                  isInList
                    ? 'border-[#10b981] bg-[#10b981]/20 text-[#10b981]'
                    : 'border-[#23293b] bg-[#1a2030] hover:bg-[#23293b] text-[#cbd2e3]'
                }`}
              >
                {isInList ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>In My List</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>My List</span>
                  </>
                )}
              </button>
            </div>

            {downloadMsg && (
              <p className="text-xs text-[#f5cb6e] bg-[#f5cb6e]/10 p-3 rounded-xl border border-[#f5cb6e]/20 mt-4 leading-normal">
                {downloadMsg}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
