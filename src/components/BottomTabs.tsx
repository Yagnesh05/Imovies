import React from 'react';

export type TabKey = 'home' | 'theatres' | 'tickets' | 'downloads' | 'me';

interface BottomTabsProps {
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  ticketCount: number;
}

export const BottomTabs: React.FC<BottomTabsProps> = ({
  currentTab,
  onSelectTab,
  ticketCount
}) => {
  return (
    <nav className="fixed left-0 right-0 bottom-0 z-40 flex justify-around items-end px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] bg-[var(--glass)] backdrop-blur-2xl border-t border-[#23293b]">
      {/* Home */}
      <button
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center gap-1 min-w-[60px] text-xs font-semibold transition-all ${
          currentTab === 'home' ? 'text-[#f5cb6e] -translate-y-0.5' : 'text-[#8b95ad] hover:text-white'
        }`}
      >
        <span className="text-xl">🏠</span>
        <span>Home</span>
      </button>

      {/* Theatres */}
      <button
        onClick={() => onSelectTab('theatres')}
        className={`flex flex-col items-center gap-1 min-w-[60px] text-xs font-semibold transition-all ${
          currentTab === 'theatres' ? 'text-[#f5cb6e] -translate-y-0.5' : 'text-[#8b95ad] hover:text-white'
        }`}
      >
        <span className="text-xl">📍</span>
        <span>Theatres</span>
      </button>

      {/* Center Tickets Button with glowing pulsating ring */}
      <button
        onClick={() => onSelectTab('tickets')}
        className="relative -mt-7 w-16 h-16 rounded-full flex flex-col items-center justify-center bg-gradient-to-br from-[#f5cb6e] via-[#e11d48] to-[#e11d48] text-white shadow-[0_8px_26px_-4px_rgba(225,29,72,0.8)] border-[3px] border-[#0b0d14] animate-pulse-glow transition-transform active:scale-95"
      >
        <span className="text-2xl leading-none">🎟</span>
        <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Tickets</span>
        {ticketCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-white text-[#e11d48] text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow">
            {ticketCount}
          </span>
        )}
      </button>

      {/* Downloads */}
      <button
        onClick={() => onSelectTab('downloads')}
        className={`flex flex-col items-center gap-1 min-w-[60px] text-xs font-semibold transition-all ${
          currentTab === 'downloads' ? 'text-[#f5cb6e] -translate-y-0.5' : 'text-[#8b95ad] hover:text-white'
        }`}
      >
        <span className="text-xl">⬇️</span>
        <span>Downloads</span>
      </button>

      {/* Me */}
      <button
        onClick={() => onSelectTab('me')}
        className={`flex flex-col items-center gap-1 min-w-[60px] text-xs font-semibold transition-all ${
          currentTab === 'me' ? 'text-[#f5cb6e] -translate-y-0.5' : 'text-[#8b95ad] hover:text-white'
        }`}
      >
        <span className="text-xl">👤</span>
        <span>Me</span>
      </button>
    </nav>
  );
};
