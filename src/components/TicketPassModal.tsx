import React from 'react';
import { Booking } from '../types';
import { getMoviePosterSrc, generateQrMatrix } from '../services/storage';
import { X, CheckCircle2, Trash2 } from 'lucide-react';

interface TicketPassModalProps {
  booking: Booking;
  imageMap: Record<string, string>;
  onClose: () => void;
  onCancelBooking?: (bookingId: string) => void;
}

export const TicketPassModal: React.FC<TicketPassModalProps> = ({
  booking,
  imageMap,
  onClose,
  onCancelBooking
}) => {
  const posterSrc = getMoviePosterSrc(booking.m, imageMap);
  const qrMatrix = generateQrMatrix(booking.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-up overflow-y-auto">
      <div className="relative w-full max-w-sm rounded-3xl overflow-hidden bg-[#131722] border border-[#23293b] shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center border border-white/20 hover:scale-105 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Poster Banner */}
        <div
          className="h-40 bg-cover bg-center relative"
          style={{ backgroundImage: `url('${posterSrc}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#131722] via-[#131722]/50 to-transparent" />
        </div>

        {/* Ticket Content */}
        <div className="p-6 pt-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 w-fit mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Booking Confirmed</span>
          </div>

          <h2 className="font-heading font-black text-2xl text-white mb-4">
            {booking.m.title}
          </h2>

          <div className="grid grid-cols-2 gap-3.5 pb-4 mb-5 border-b-2 border-dashed border-[#23293b] text-sm">
            <div>
              <small className="block text-[11px] font-bold text-[#8b95ad] uppercase tracking-wider mb-0.5">Date</small>
              <span className="font-semibold text-white">{booking.day.w}, {booking.day.n} Oct</span>
            </div>
            <div>
              <small className="block text-[11px] font-bold text-[#8b95ad] uppercase tracking-wider mb-0.5">Time</small>
              <span className="font-semibold text-white">{booking.slot[0]}</span>
            </div>
            <div>
              <small className="block text-[11px] font-bold text-[#8b95ad] uppercase tracking-wider mb-0.5">Theatre</small>
              <span className="font-semibold text-white truncate block max-w-[130px]">{booking.slot[1]}</span>
            </div>
            <div>
              <small className="block text-[11px] font-bold text-[#8b95ad] uppercase tracking-wider mb-0.5">Seats</small>
              <span className="font-bold text-[#f5cb6e]">{booking.seats.join(', ')}</span>
            </div>
            <div>
              <small className="block text-[11px] font-bold text-[#8b95ad] uppercase tracking-wider mb-0.5">Paid Amount</small>
              <span className="font-bold text-white">₹{booking.total}</span>
            </div>
            <div>
              <small className="block text-[11px] font-bold text-[#8b95ad] uppercase tracking-wider mb-0.5">Booking ID</small>
              <span className="font-mono font-bold text-[#f5cb6e]">{booking.id}</span>
            </div>
          </div>

          {/* QR Code Matrix */}
          <div className="flex flex-col items-center">
            <div className="w-[154px] p-2 bg-white rounded-xl shadow-inner grid grid-cols-[repeat(21,1fr)] gap-[1px]">
              {qrMatrix.map((filled, idx) => (
                <div
                  key={idx}
                  className={`aspect-square ${filled ? 'bg-black' : 'bg-white'}`}
                />
              ))}
            </div>
            <small className="text-[11px] text-[#8b95ad] mt-2 tracking-widest font-mono uppercase">
              Scan at cinema turnstile
            </small>
          </div>

          {/* Actions */}
          {onCancelBooking && (
            <button
              onClick={() => onCancelBooking(booking.id)}
              className="w-full mt-5 py-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#8b95ad] hover:text-[#e11d48] transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Cancel reservation</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
