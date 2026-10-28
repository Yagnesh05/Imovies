import React from 'react';
import { Booking } from '../types';
import { getMoviePosterSrc } from '../services/storage';
import { Ticket as TicketIcon, Calendar, Clock, MapPin, Eye, Trash2 } from 'lucide-react';

interface TicketsViewProps {
  tickets: Booking[];
  imageMap: Record<string, string>;
  onViewTicket: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
  onExploreCinemas: () => void;
}

export const TicketsView: React.FC<TicketsViewProps> = ({
  tickets,
  imageMap,
  onViewTicket,
  onCancelBooking,
  onExploreCinemas
}) => {
  return (
    <div className="px-4 md:px-8 py-4 animate-up max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-white">
            My Cinema Tickets
          </h2>
          <p className="text-xs text-[#8b95ad] mt-0.5">
            Active reservations and entry passes
          </p>
        </div>
      </div>

      {tickets.length > 0 ? (
        <div className="space-y-3.5">
          {tickets.map((b) => {
            const posterSrc = getMoviePosterSrc(b.m, imageMap);
            return (
              <div
                key={b.id}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-[#131722] border border-[#23293b] hover:border-[#f5cb6e]/40 transition-all shadow-lg"
              >
                <div
                  className="aspect-[2/3] w-24 rounded-xl bg-cover bg-center shrink-0 border border-[#23293b]"
                  style={{ backgroundImage: `url('${posterSrc}')` }}
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-heading font-bold text-lg text-white">
                        {b.m.title}
                      </h3>
                      <span className="font-mono text-xs font-bold text-[#f5cb6e] bg-[#f5cb6e]/10 px-2 py-0.5 rounded border border-[#f5cb6e]/30">
                        {b.id}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8b95ad] mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#f5cb6e]" />
                        <span>{b.day.w}, {b.day.n} Oct</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#f5cb6e]" />
                        <span>{b.slot[0]}</span>
                      </span>
                      <span className="flex items-center gap-1 truncate max-w-[180px]">
                        <MapPin className="w-3.5 h-3.5 text-[#f5cb6e]" />
                        <span>{b.slot[1]}</span>
                      </span>
                    </div>

                    <p className="text-xs text-[#cbd2e3]">
                      Seats: <strong className="text-white font-bold">{b.seats.join(', ')}</strong> · Total: <strong className="text-white font-bold">₹{b.total}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#23293b]">
                    <button
                      onClick={() => onViewTicket(b)}
                      className="btn-gold flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold shadow"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Pass</span>
                    </button>

                    <button
                      onClick={() => onCancelBooking(b.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1a2030] hover:bg-[#e11d48]/15 text-[#8b95ad] hover:text-[#e11d48] border border-[#23293b] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-[#131722] border border-[#23293b] max-w-md mx-auto my-8">
          <TicketIcon className="w-12 h-12 text-[#f5cb6e] mx-auto mb-3 opacity-70" />
          <h3 className="font-heading font-bold text-lg text-white mb-1.5">
            No active reservations
          </h3>
          <p className="text-xs text-[#8b95ad] mb-6 leading-relaxed">
            You don't have any booked cinema tickets. Choose a currently screening movie to pick showtimes and reserve your seats!
          </p>
          <button
            onClick={onExploreCinemas}
            className="btn-gold px-6 py-2.5 rounded-xl text-sm font-bold shadow-md"
          >
            Browse In-Cinema Movies
          </button>
        </div>
      )}
    </div>
  );
};
