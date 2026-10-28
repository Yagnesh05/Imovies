import React, { useState } from 'react';
import { Movie } from '../types';
import { X, ShieldCheck, CheckCircle } from 'lucide-react';

interface CheckoutModalProps {
  movie: Movie;
  onClose: () => void;
  onSuccess: (movie: Movie) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  movie,
  onClose,
  onSuccess
}) => {
  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onSuccess(movie);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-up">
      <div className="relative w-full max-w-sm bg-[#131722] border border-[#23293b] rounded-3xl p-6 sm:p-7 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#1a2030] text-[#cbd2e3] hover:text-white flex items-center justify-center border border-[#23293b]"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="font-heading font-extrabold text-xl text-white mb-1">
          {movie.title}
        </h2>
        <p className="text-xs text-[#8b95ad] mb-4">
          Unlock lifetime streaming &amp; offline download
        </p>

        <div className="font-heading font-black text-4xl text-[#f5cb6e] mb-5">
          ₹{movie.price || 99}
        </div>

        {/* Payment Methods */}
        <div className="space-y-2 mb-4">
          {[
            { id: 'upi', name: 'Instant UPI (GPay, PhonePe, Paytm)' },
            { id: 'card', name: 'Credit / Debit Card' },
            { id: 'netbanking', name: 'Net Banking' }
          ].map((item) => (
            <label
              key={item.id}
              onClick={() => setMethod(item.id as typeof method)}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-xs font-semibold transition-all ${
                method === item.id
                  ? 'border-[#f5cb6e] bg-[#f5cb6e]/15 text-white'
                  : 'border-[#23293b] bg-[#1a2030] text-[#cbd2e3] hover:border-white/30'
              }`}
            >
              <input
                type="radio"
                name="payment_method"
                checked={method === item.id}
                onChange={() => setMethod(item.id as typeof method)}
                className="accent-[#f5cb6e]"
              />
              <span>{item.name}</span>
            </label>
          ))}
        </div>

        <p className="text-[11px] text-[#8b95ad] leading-normal mb-5 flex items-start gap-1.5 bg-[#1a2030] p-2.5 rounded-lg border border-[#23293b]">
          <ShieldCheck className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
          <span>Demo checkout simulator. Clicking Pay will instantly credit and unlock this movie to your library.</span>
        </p>

        <button
          onClick={handlePay}
          disabled={processing}
          className="btn-gold w-full py-3 rounded-xl text-sm font-bold shadow-lg disabled:opacity-50"
        >
          {processing ? 'Processing Payment...' : `Pay ₹${movie.price || 99}`}
        </button>
      </div>
    </div>
  );
};
