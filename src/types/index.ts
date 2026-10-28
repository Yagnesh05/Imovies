export type Category = 'Trending' | 'Bollywood' | 'South' | 'Hollywood' | 'Anime' | 'Sports';

export interface Movie {
  i?: number;
  id: string;
  title: string;
  tagline?: string;
  description: string;
  genres: string[];
  dur: number;
  rating: number;
  cert: string;
  director: string;
  featured?: boolean;
  img?: string;
  poster?: string;
  thumb?: string;
  cin?: number | boolean;
  lang: string;
  cat?: string;
  real?: boolean;
  paid?: boolean;
  price?: number;
  video?: string;
  yt?: string;
  custom?: number | boolean;
  // OMDb extended metadata
  imdbId?: string;
  year?: string;
  actors?: string;
  rated?: string;
  imdbRating?: string;
  source?: 'catalog' | 'omdb' | 'custom';
}

export interface DayOption {
  k: number;
  w: string;
  n: number;
}

export interface Booking {
  id: string;
  m: Movie;
  day: DayOption;
  slot: [string, string, number]; // [time, theatre, basePrice]
  seats: string[];
  total: number;
  createdAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  hash: string;
  joined: string;
}

export interface UserData {
  hist: Array<{ id: string; ts: number }>;
  lst: string[];
  owned: string[];
  tickets: Booking[];
  S: {
    city: string;
    glow: number;
    auto: number;
    notif: number;
    lang: string;
  };
}

// OMDb API Interfaces
export interface OmdbSearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface OmdbMovieDetail {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings?: Array<{ Source: string; Value: string }>;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  Response: string;
  Error?: string;
}
