import { Movie, Booking, User, UserData } from '../types';
import { generateMoviePosterSvg } from '../data/movies';

export const safeLocalStorage = {
  get: <T>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  set: (key: string, value: unknown): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }
};

export const sha256 = async (str: string): Promise<string> => {
  try {
    const buffer = new TextEncoder().encode(str);
    const digest = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(digest))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  } catch {
    // Simple fallback
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16);
  }
};

export const DEFAULT_USER_DATA: UserData = {
  hist: [],
  lst: [],
  owned: [],
  tickets: [],
  S: {
    city: 'Indore',
    glow: 1,
    auto: 1,
    notif: 1,
    lang: 'English'
  }
};

export const getGuestId = (): string => {
  let gid = safeLocalStorage.get<string | null>('im_g', null);
  if (!gid) {
    gid = String(Math.floor(10000000 + Math.random() * 90000000));
    safeLocalStorage.set('im_g', gid);
  }
  return gid;
};

export const getBookedSeatsSet = (movieId: string, dayIndex: number, slotIndex: number, totalSeats: number = 96): Set<number> => {
  let h = 0;
  const str = `${movieId}_d${dayIndex}_s${slotIndex}`;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  const bookedSet = new Set<number>();
  for (let i = 0; i < 24; i++) {
    h = (h * 1664525 + 1013904223) >>> 0;
    bookedSet.add(h % totalSeats);
  }
  return bookedSet;
};

// Generate QR matrix representation for tickets
export const generateQrMatrix = (bookingId: string): boolean[] => {
  let h = 0;
  for (let i = 0; i < bookingId.length; i++) {
    h = (h * 31 + bookingId.charCodeAt(i)) >>> 0;
  }
  return Array.from({ length: 441 }, (_, i) => {
    h = (h * 1664525 + 1013904223) >>> 0;
    const x = i % 21;
    const y = Math.floor(i / 21);
    const isCornerFinder =
      (x < 7 && y < 7) ||
      (x > 13 && y < 7) ||
      (x < 7 && y > 13);

    if (isCornerFinder) {
      return (
        x % 6 === 0 ||
        y % 6 === 0 ||
        (x > 1 && x < 5 && y > 1 && y < 5) ||
        (x > 14 && x < 18 && y > 1 && y < 5) ||
        (x > 1 && x < 5 && y > 14 && y < 18)
      );
    }
    return Boolean((h >>> 28) & 1);
  });
};

export const getMoviePosterSrc = (m: Movie, imageMap?: Record<string, string>): string => {
  if (m.poster) return m.poster;
  if (m.img && imageMap && imageMap[m.img]) return imageMap[m.img];
  return generateMoviePosterSvg(m);
};
