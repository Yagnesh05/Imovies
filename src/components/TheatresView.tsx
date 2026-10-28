import React from 'react';
import { THEATRES, CITY_COORDINATES } from '../data/theatres';
import { MapPin, Navigation, Compass } from 'lucide-react';

interface TheatresViewProps {
  currentCity: string;
  onSelectCity: (city: string) => void;
  onUseLocation: () => void;
  statusMessage?: string;
}

export const TheatresView: React.FC<TheatresViewProps> = ({
  currentCity,
  onSelectCity,
  onUseLocation,
  statusMessage
}) => {
  const cities = Object.keys(THEATRES);
  const theatresList = THEATRES[currentCity] || THEATRES.Indore;

  return (
    <div className="px-4 md:px-8 py-4 animate-up max-w-6xl mx-auto">
      {/* Top Bar with City select & location */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
        <div>
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-white">
            Cinemas in {currentCity}
          </h2>
          <p className="text-xs text-[#8b95ad] mt-0.5">
            Real-time screen scheduling and ticket booking
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={currentCity}
            onChange={(e) => onSelectCity(e.target.value)}
            className="bg-[#1a2030] text-sm text-[#f1f5f9] border border-[#23293b] rounded-xl px-3 py-2 focus:outline-none focus:border-[#f5cb6e]"
          >
            {cities.map((c) => (
              <option key={c} value={c} className="bg-[#131722]">
                {c}
              </option>
            ))}
          </select>

          <button
            onClick={onUseLocation}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1a2030] border border-[#23293b] text-[#cbd2e3] hover:text-white hover:border-[#f5cb6e] transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-[#f5cb6e]" />
            <span>Use My Location</span>
          </button>

          <a
            href={`https://www.google.com/maps/search/cinema+near+${encodeURIComponent(currentCity)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-[#f5cb6e]" />
            <span>Cinemas on Maps</span>
          </a>
        </div>
      </div>

      {statusMessage && (
        <p className="text-xs text-[#f5cb6e] bg-[#f5cb6e]/10 border border-[#f5cb6e]/20 p-2.5 rounded-xl mb-4">
          {statusMessage}
        </p>
      )}

      {/* Grid of Theatres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        {theatresList.map((theatre, idx) => {
          const [theatreName, address] = theatre;
          const mapQuery = encodeURIComponent(`${theatreName} ${address} ${currentCity}`);

          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#131722] border border-[#23293b] hover:border-[#f5cb6e]/50 transition-all duration-300 flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <MapPin className="w-4 h-4 text-[#f5cb6e] shrink-0" />
                  <h3 className="font-heading font-bold text-base text-white group-hover:text-[#f5cb6e] transition-colors">
                    {theatreName}
                  </h3>
                </div>
                <p className="text-xs text-[#8b95ad] pl-6 mb-4">
                  {address}, {currentCity}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#23293b]/70">
                <span className="text-[11px] font-bold text-[#10b981] bg-[#10b981]/15 px-2 py-0.5 rounded-md">
                  Dolby Atmos / 4K
                </span>

                <a
                  href={`https://www.google.com/maps/search/${mapQuery}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#f5cb6e] hover:underline"
                >
                  <span>Directions</span>
                  <Navigation className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
