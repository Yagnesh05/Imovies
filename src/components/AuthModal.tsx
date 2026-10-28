import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon } from 'lucide-react';
import { User } from '../types';
import { sha256, safeLocalStorage } from '../services/storage';

interface AuthModalProps {
  initialMode?: 'login' | 'register';
  subtitle?: string;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode = 'login',
  subtitle,
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const hash = await sha256(password);
    const existingUsers = safeLocalStorage.get<User[]>('im_u', []);

    if (mode === 'register') {
      const cleanName = name.trim();
      if (!cleanName) {
        setError('Please enter your full name');
        setLoading(false);
        return;
      }

      if (existingUsers.some(u => u.email === cleanEmail)) {
        setError('An account with this email already exists. Please log in.');
        setLoading(false);
        return;
      }

      const newUser: User = {
        id: Date.now().toString(36),
        name: cleanName,
        email: cleanEmail,
        hash,
        joined: new Date().toISOString()
      };

      existingUsers.push(newUser);
      safeLocalStorage.set('im_u', existingUsers);
      safeLocalStorage.set('im_s', newUser.id);
      setLoading(false);
      onSuccess(newUser);
    } else {
      const foundUser = existingUsers.find(u => u.email === cleanEmail && u.hash === hash);
      if (!foundUser) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      safeLocalStorage.set('im_s', foundUser.id);
      setLoading(false);
      onSuccess(foundUser);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-up">
      <div className="relative w-full max-w-md bg-[#131722] border border-[#23293b] rounded-3xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#1a2030] text-[#cbd2e3] hover:text-white flex items-center justify-center border border-[#23293b] transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="font-heading font-extrabold text-2xl text-white mb-1.5">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-xs sm:text-sm text-[#8b95ad] mb-6">
          {subtitle || (mode === 'login' ? 'Login to book tickets, stream, and save your watchlist' : 'Sign up to unlock personalized cinema booking and rewards')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8b95ad]" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-3 bg-[#1a2030] border border-[#23293b] rounded-xl text-sm text-white placeholder-[#8b95ad] focus:outline-none focus:border-[#f5cb6e]"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8b95ad]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full pl-10 pr-4 py-3 bg-[#1a2030] border border-[#23293b] rounded-xl text-sm text-white placeholder-[#8b95ad] focus:outline-none focus:border-[#f5cb6e]"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8b95ad]" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (minimum 6 characters)"
              className="w-full pl-10 pr-4 py-3 bg-[#1a2030] border border-[#23293b] rounded-xl text-sm text-white placeholder-[#8b95ad] focus:outline-none focus:border-[#f5cb6e]"
            />
          </div>

          {error && (
            <p className="text-xs text-[#e11d48] bg-[#e11d48]/10 p-2.5 rounded-lg border border-[#e11d48]/20">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full py-3 rounded-xl text-sm font-bold shadow-md mt-2 disabled:opacity-50"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-xs text-[#8b95ad] mt-5">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
            className="text-[#f5cb6e] font-bold hover:underline ml-1"
          >
            {mode === 'login' ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};
