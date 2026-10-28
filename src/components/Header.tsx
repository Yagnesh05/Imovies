import React from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  selectedCity: string;
  onNavigateTheatres: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  selectedCity,
  onNavigateTheatres
}) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-3 px-4 md:px-8 py-3 bg-[var(--glass)] backdrop-blur-xl border-b border-[#23293b]">
      {/* Brand Logo */}
      <div 
        onClick={() => {
          onSearchChange('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="flex items-center gap-2 cursor-pointer select-none group"
      >
        <svg className="w-9 h-9 animate-float drop-shadow-[0_4px_10px_rgba(229,169,60,0.4)]" viewBox="0 0 40 40">
          <defs>
            <linearGradient id="lgg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffcf5a" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
          </defs>
          <g className="animate-spin-slow" style={{ transformOrigin: '20px 20px' }}>
            <circle cx="20" cy="20" r="18" fill="url(#lgg)" />
            <g fill="#0b0d14">
              <circle cx="20" cy="8" r="3.2" />
              <circle cx="31.4" cy="16.3" r="3.2" />
              <circle cx="27" cy="29.7" r="3.2" />
              <circle cx="13" cy="29.7" r="3.2" />
              <circle cx="8.6" cy="16.3" r="3.2" />
            </g>
          </g>
          <path d="M17 14l10 6-10 6z" fill="#ffffff" />
        </svg>
        <span className="font-heading font-extrabold text-2xl tracking-tight text-white flex items-center">
          i<b className="text-[#f5cb6e] font-extrabold ml-0.5">Movies</b>
        </span>
      </div>

      {/* Search Input */}
      <div className="flex-1 max-w-[560px] mx-2">
        <div className="flex items-center gap-2.5 bg-[#1a2030] border border-[#23293b] rounded-2xl px-4 py-2 transition-all focus-within:border-[#f5cb6e] focus-within:shadow-[0_0_0_3px_rgba(245,203,110,0.18)]">
          <Search className="w-4 h-4 text-[#8b95ad] shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search movies, anime, sports, theatres..."
            className="w-full bg-transparent text-sm text-[#f1f5f9] placeholder-[#8b95ad] focus:outline-none"
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              className="text-[#8b95ad] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Right Actions: City + Account */}
      <div className="flex items-center gap-2">
        <button
          onClick={onNavigateTheatres}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#131722] border border-[#23293b] text-xs font-semibold text-[#8b95ad] hover:text-[#f1f5f9] hover:border-[#f5cb6e] transition-all"
          title="Select Cinema City"
        >
          <MapPin className="w-3.5 h-3.5 text-[#f5cb6e]" />
          <span>{selectedCity}</span>
        </button>

        <button
          onClick={currentUser ? onOpenProfile : onOpenAuth}
          className="px-4 py-1.5 rounded-full bg-[#1a2030] border border-[#23293b] text-xs md:text-sm font-semibold text-[#f1f5f9] hover:bg-[#f5cb6e] hover:text-[#1a1200] hover:border-[#f5cb6e] transition-all shrink-0 shadow-sm"
        >
          {currentUser ? `👤 ${currentUser.name.split(' ')[0]}` : 'Login'}
        </button>
      </div>
    </header>
  );
};
