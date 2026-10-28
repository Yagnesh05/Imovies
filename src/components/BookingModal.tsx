import React, { useState } from 'react';
import { Movie, DayOption, Booking } from '../types';
import { getMoviePosterSrc, getBookedSeatsSet } from '../services/storage';
import { X, Calendar, Clock, MapPin } from 'lucide-react';
import { BASE_SLOTS, THEATRES } from '../data/theatres';

interface BookingModalProps {
  movie: Movie;
  city: string;
  imageMap: Record<string, string>;
  onClose: () => void;
  onConfirmBooking: (booking: Booking) => void;
}

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const COLS = 12;

export const BookingModal: React.FC<BookingModalProps> = ({
  movie,
  city,
  imageMap,
  onClose,
  onConfirmBooking
}) => {
  // Generate 5 days starting from today (Oct 28, 2026 as per time context)
  const days: DayOption[] = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(2026, 9, 28 + i);
    return {
      k: i,
      w: d.toLocaleDateString('en-US', { weekday: 'short' }),
      n: d.getDate()
    };
  });

  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedSlotIdx, setSelectedSlotIdx] = useState<number | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());

  const posterSrc = getMoviePosterSrc(movie, imageMap);

  // Slots with current city theatre names
  const cityTheatres = THEATRES[city] || THEATRES.Indore;
  const currentSlots = BASE_SLOTS.map((s, i) => {
    const theatreName = cityTheatres[i % cityTheatres.length][0];
    return [s[0], theatreName, s[2]] as [string, string, number];
  });

  // Calculate tier
  const getRowTier = (rowIdx: number): 'standard' | 'premium' | 'vip' => {
    if (rowIdx < 2) return 'standard';
    if (rowIdx < 6) return 'premium';
    return 'vip';
  };

  const getSeatPrice = (rowIdx: number, basePrice: number): number => {
    const tier = getRowTier(rowIdx);
    if (tier === 'standard') return Math.max(120, basePrice - 60);
    if (tier === 'premium') return basePrice;
    return basePrice + 120;
  };

  const activeBasePrice = selectedSlotIdx !== null ? currentSlots[selectedSlotIdx][2] : 240;

  // Booked seats for current movie + day + slot
  const bookedSet = selectedSlotIdx !== null
    ? getBookedSeatsSet(movie.id, selectedDayIdx, selectedSlotIdx, ROWS.length * COLS)
    : new Set<number>();

  const toggleSeat = (seatId: string) => {
    setSelectedSeats(prev => {
      const next = new Set(prev);
      if (next.has(seatId)) {
        next.delete(seatId);
      } else {
        if (next.size < 8) {
          next.add(seatId);
        }
      }
      return next;
    });
  };

  // Calculate total price
  let totalPrice = 0;
  selectedSeats.forEach(seatLabel => {
    const rChar = seatLabel[0];
    const rIdx = ROWS.indexOf(rChar);
    totalPrice += getSeatPrice(rIdx >= 0 ? rIdx : 2, activeBasePrice);
  });

  const handleBooking = () => {
    if (selectedSlotIdx === null || selectedSeats.size === 0) return;
    const bookingId = 'IM' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const newBooking: Booking = {
      id: bookingId,
      m: movie,
      day: days[selectedDayIdx],
      slot: currentSlots[selectedSlotIdx],
      seats: Array.from(selectedSeats).sort(),
      total: totalPrice,
      createdAt: new Date().toISOString()
    };
    onConfirmBooking(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-up overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#131722] border border-[#23293b] rounded-3xl shadow-2xl flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#1a2030] text-[#cbd2e3] hover:text-white flex items-center justify-center border border-[#23293b] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Movie Info Header */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-6 md:p-8 border-b border-[#23293b]">
          <div
            className="aspect-[2/3] w-36 md:w-full rounded-2xl bg-cover bg-center border border-[#23293b] shadow-lg shrink-0"
            style={{ backgroundImage: `url('${posterSrc}')` }}
          />

          <div className="flex flex-col justify-center">
            <span className="self-start inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#e5a93c]/20 text-[#f5cb6e] border border-[#e5a93c]/40 mb-2">
              {movie.genres.join(' · ')}
            </span>
            <h1 className="font-heading font-black text-2xl md:text-3xl text-white mb-2">
              {movie.title}
            </h1>
            <p className="text-sm text-[#8b95ad] mb-3">
              ★ {movie.rating || 9.0} · {Math.floor(movie.dur / 60)}h {movie.dur % 60}m · {movie.cert} · Dir. {movie.director}
            </p>
            <p className="text-sm text-[#cbd2e3] line-clamp-3">
              {movie.description}
            </p>
          </div>
        </div>

        {/* Step 1: Date selection */}
        <div className="p-6 md:p-8 space-y-6">
          <div>
            <h4 className="flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-widest text-[#8b95ad] mb-3">
              <Calendar className="w-4 h-4 text-[#f5cb6e]" />
              <span>Select Date</span>
            </h4>
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {days.map((d) => (
                <button
                  key={d.k}
                  onClick={() => {
                    setSelectedDayIdx(d.k);
                    setSelectedSeats(new Set());
                  }}
                  className={`px-4 py-2.5 rounded-xl border text-center min-w-[70px] transition-all ${
                    selectedDayIdx === d.k
                      ? 'border-[#f5cb6e] bg-[#f5cb6e]/15 text-[#f5cb6e] font-bold shadow-md'
                      : 'border-[#23293b] bg-[#1a2030] text-[#cbd2e3] hover:border-white/30'
                  }`}
                >
                  <small className="block text-xs uppercase font-medium">{d.w}</small>
                  <span className="font-heading font-extrabold text-xl">{d.n}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Showtime selection */}
          <div>
            <h4 className="flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-widest text-[#8b95ad] mb-3">
              <Clock className="w-4 h-4 text-[#f5cb6e]" />
              <span>Showtimes in {city}</span>
            </h4>
            <div className="flex gap-2.5 flex-wrap">
              {currentSlots.map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedSlotIdx(idx);
                    setSelectedSeats(new Set());
                  }}
                  className={`px-4 py-2.5 rounded-xl border text-left transition-all ${
                    selectedSlotIdx === idx
                      ? 'border-[#f5cb6e] text-[#f5cb6e] bg-[#f5cb6e]/15 shadow-md'
                      : 'border-[#23293b] bg-[#1a2030] text-white hover:border-white/30'
                  }`}
                >
                  <span className="font-heading font-bold text-base block">{slot[0]}</span>
                  <small className="text-xs text-[#8b95ad] block truncate max-w-[150px]">{slot[1]}</small>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Interactive Seat Matrix */}
          {selectedSlotIdx !== null ? (
            <div className="pt-4 border-t border-[#23293b]">
              <div className="text-center mb-6">
                {/* Cinema Screen Curve */}
                <div className="mx-auto w-3/4 max-w-md h-9 rounded-t-[100%] bg-gradient-to-b from-[#f5cb6e]/40 to-transparent border-t-4 border-[#f5cb6e] flex items-center justify-center">
                  <span className="text-[11px] font-black uppercase tracking-[0.35em] text-[#cbd2e3] pt-1">
                    Cinema Screen
                  </span>
                </div>
              </div>

              {/* Grid of Seats */}
              <div className="overflow-x-auto py-2">
                <div className="min-w-[460px] flex flex-col items-center gap-2">
                  {ROWS.map((r, ri) => (
                    <div key={r} className="flex items-center gap-2">
                      <span className="w-4 text-xs font-bold text-[#8b95ad] text-right">{r}</span>
                      <div className="flex gap-1.5 items-center">
                        {Array.from({ length: COLS }, (_, ci) => {
                          const seatIndex = ri * COLS + ci;
                          const seatLabel = `${r}${ci + 1}`;
                          const isBooked = bookedSet.has(seatIndex);
                          const isSelected = selectedSeats.has(seatLabel);
                          const tier = getRowTier(ri);
                          const seatPrice = getSeatPrice(ri, activeBasePrice);

                          return (
                            <React.Fragment key={ci}>
                              {ci === 6 && <div className="w-4" />}
                              <button
                                disabled={isBooked}
                                onClick={() => toggleSeat(seatLabel)}
                                title={`${seatLabel} (${tier.toUpperCase()}) · ₹${seatPrice}`}
                                className={`w-6 h-6 rounded-t-md rounded-b-sm border transition-all ${
                                  isBooked
                                    ? 'bg-[#2a2f40] border-transparent opacity-40 cursor-not-allowed'
                                    : isSelected
                                    ? 'bg-[#f5cb6e] border-[#f5cb6e] text-black font-extrabold scale-110 shadow-[0_0_12px_rgba(245,203,110,0.8)]'
                                    : tier === 'vip'
                                    ? 'bg-[#1a2030] border-[#f5cb6e] hover:scale-110 hover:border-white'
                                    : tier === 'premium'
                                    ? 'bg-[#1a2030] border-[#6d7cff] hover:scale-110 hover:border-white'
                                    : 'bg-[#1a2030] border-[#23293b] hover:scale-110 hover:border-[#f5cb6e]'
                                }`}
                              />
                            </React.Fragment>
                          );
                        })}
                      </div>
                      <span className="w-4 text-xs font-bold text-[#8b95ad] text-left">{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tiers & Status Legend */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#8b95ad] mt-6 pt-4 border-t border-[#23293b]/60">
                <span className="flex items-center gap-1.5">
                  <i className="w-3 h-3 rounded-sm border border-[#23293b] bg-[#1a2030] inline-block" />
                  <span>Standard (₹{getSeatPrice(0, activeBasePrice)})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="w-3 h-3 rounded-sm border border-[#6d7cff] bg-[#1a2030] inline-block" />
                  <span>Premium (₹{getSeatPrice(3, activeBasePrice)})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="w-3 h-3 rounded-sm border border-[#f5cb6e] bg-[#1a2030] inline-block" />
                  <span>VIP (₹{getSeatPrice(7, activeBasePrice)})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="w-3 h-3 rounded-sm bg-[#f5cb6e] border border-[#f5cb6e] inline-block" />
                  <span className="text-[#f5cb6e] font-semibold">Selected</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="w-3 h-3 rounded-sm bg-[#2a2f40] opacity-50 inline-block" />
                  <span>Sold</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-[#8b95ad] border border-dashed border-[#23293b] rounded-2xl">
              Please choose a showtime above to view seat availability and layout.
            </div>
          )}
        </div>

        {/* Footer Checkout Summary */}
        <div className="sticky bottom-0 z-20 flex items-center justify-between gap-4 px-6 md:px-8 py-4 bg-[var(--glass)] backdrop-blur-xl border-t border-[#23293b]">
          <div>
            <small className="text-xs text-[#8b95ad] block font-medium">
              {selectedSeats.size} seat{selectedSeats.size === 1 ? '' : 's'} selected
            </small>
            <div className="font-heading font-extrabold text-2xl text-white">
              ₹{totalPrice}
            </div>
          </div>

          <button
            disabled={selectedSeats.size === 0 || selectedSlotIdx === null}
            onClick={handleBooking}
            className="btn-gold px-8 py-3 rounded-xl text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
          >
            Confirm &amp; Book
          </button>
        </div>
      </div>
    </div>
  );
};
