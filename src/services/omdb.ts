import { Movie, OmdbMovieDetail, OmdbSearchResult } from '../types';
import { safeLocalStorage } from './storage';

/**
 * OMDb API Key constant used across all movie data and poster fetching requests.
 */
export const OMDB_API_KEY = '365d650f';

/**
 * Base HTTPS endpoint for OMDb REST API.
 */
export const OMDB_BASE_URL = 'https://www.omdbapi.com/';

const CACHE_KEY = 'im_omdb_cache';

interface OmdbCacheRecord {
  [titleOrId: string]: OmdbMovieDetail | null;
}

// Get the persistent OMDb cache from localStorage
export const getOmdbCache = (): OmdbCacheRecord => {
  return safeLocalStorage.get<OmdbCacheRecord>(CACHE_KEY, {});
};

// Save a fetched record to persistent cache
export const saveToOmdbCache = (key: string, data: OmdbMovieDetail | null) => {
  const cache = getOmdbCache();
  cache[key.toLowerCase().trim()] = data;
  safeLocalStorage.set(CACHE_KEY, cache);
};

/**
 * Fetch detailed movie information and poster by title using the provided OMDb API key.
 * If title contains a colon or subtitle, attempts a fallback query on the primary title if needed.
 */
export const fetchOmdbByTitle = async (title: string, year?: string): Promise<OmdbMovieDetail | null> => {
  const cleanTitle = title.trim();
  if (!cleanTitle) return null;

  const cacheKey = `${cleanTitle}_${year || ''}`.toLowerCase().trim();
  const cache = getOmdbCache();
  if (cache[cacheKey] !== undefined) {
    return cache[cacheKey];
  }

  try {
    let url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(cleanTitle)}&plot=full`;
    if (year) {
      url += `&y=${encodeURIComponent(year)}`;
    }

    const res = await fetch(url);
    if (!res.ok) return null;
    const data: OmdbMovieDetail = await res.json();

    if (data.Response === 'True') {
      saveToOmdbCache(cacheKey, data);
      return data;
    }

    // Fallback: If title has a colon (e.g., "Baahubali: The Beginning"), try searching the primary title
    if (cleanTitle.includes(':')) {
      const primaryTitle = cleanTitle.split(':')[0].trim();
      const fallbackUrl = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(primaryTitle)}&plot=full`;
      const fallbackRes = await fetch(fallbackUrl);
      if (fallbackRes.ok) {
        const fallbackData: OmdbMovieDetail = await fallbackRes.json();
        if (fallbackData.Response === 'True') {
          saveToOmdbCache(cacheKey, fallbackData);
          return fallbackData;
        }
      }
    }

    // Cache null to prevent repetitive failing queries
    saveToOmdbCache(cacheKey, null);
    return null;
  } catch (err) {
    console.warn(`OMDb fetch error for title "${title}" with key ${OMDB_API_KEY}:`, err);
    return null;
  }
};

/**
 * Fetch detailed movie information and poster by IMDb ID using the OMDb API key.
 */
export const fetchOmdbById = async (imdbId: string): Promise<OmdbMovieDetail | null> => {
  const cleanId = imdbId.trim();
  if (!cleanId) return null;

  const cacheKey = cleanId.toLowerCase();
  const cache = getOmdbCache();
  if (cache[cacheKey] !== undefined) {
    return cache[cacheKey];
  }

  try {
    const url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${encodeURIComponent(cleanId)}&plot=full`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data: OmdbMovieDetail = await res.json();

    if (data.Response === 'True') {
      saveToOmdbCache(cacheKey, data);
      return data;
    } else {
      saveToOmdbCache(cacheKey, null);
      return null;
    }
  } catch (err) {
    console.warn(`OMDb fetch error for ID "${imdbId}" with key ${OMDB_API_KEY}:`, err);
    return null;
  }
};

/**
 * Search OMDb movies by keyword query using the OMDb API key.
 */
export const searchOmdb = async (query: string): Promise<OmdbSearchResult[]> => {
  const cleanQ = query.trim();
  if (!cleanQ || cleanQ.length < 2) return [];

  try {
    const url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(cleanQ)}&type=movie`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();

    if (data.Response === 'True' && Array.isArray(data.Search)) {
      return data.Search.filter((item: OmdbSearchResult) => item.Poster && item.Poster !== 'N/A');
    }
    return [];
  } catch (err) {
    console.warn(`OMDb search error for "${query}" with key ${OMDB_API_KEY}:`, err);
    return [];
  }
};

/**
 * Convert an OMDb movie detail response into the iMovies Movie interface.
 */
export const convertOmdbToMovie = (omdb: OmdbMovieDetail, isCinema = false): Movie => {
  // Parse runtime (e.g. "148 min" -> 148)
  const runtimeMatches = omdb.Runtime ? omdb.Runtime.match(/(\d+)/) : null;
  const dur = runtimeMatches ? parseInt(runtimeMatches[1], 10) : 120;

  // Parse genres
  const genres = omdb.Genre && omdb.Genre !== 'N/A'
    ? omdb.Genre.split(',').map(g => g.trim())
    : ['Drama'];

  // Parse rating (e.g. "8.8" -> 8.8)
  const rating = omdb.imdbRating && omdb.imdbRating !== 'N/A' ? parseFloat(omdb.imdbRating) : 8.5;

  const validPoster = omdb.Poster && omdb.Poster !== 'N/A' ? omdb.Poster : undefined;

  return {
    id: `omdb_${omdb.imdbID}`,
    title: omdb.Title,
    tagline: `${omdb.Year} · ${genres[0]} · IMDb ★ ${omdb.imdbRating || 'N/A'}`,
    description: omdb.Plot && omdb.Plot !== 'N/A' ? omdb.Plot : `${omdb.Title} (${omdb.Year}) directed by ${omdb.Director}.`,
    genres,
    dur,
    rating,
    cert: omdb.Rated && omdb.Rated !== 'N/A' ? omdb.Rated : 'U/A',
    director: omdb.Director && omdb.Director !== 'N/A' ? omdb.Director : 'Acclaimed Director',
    lang: omdb.Language ? omdb.Language.split(',')[0].trim() : 'English',
    cat: genres.includes('Anime') ? 'Anime' : 'Hollywood',
    cin: isCinema,
    paid: false,
    price: 0,
    poster: validPoster,
    imdbId: omdb.imdbID,
    year: omdb.Year,
    actors: omdb.Actors && omdb.Actors !== 'N/A' ? omdb.Actors : undefined,
    rated: omdb.Rated && omdb.Rated !== 'N/A' ? omdb.Rated : undefined,
    imdbRating: omdb.imdbRating && omdb.imdbRating !== 'N/A' ? omdb.imdbRating : undefined,
    source: 'omdb'
  };
};

/**
 * Merge an existing catalog movie with enriched OMDb details (real poster, rating, actors, plot).
 */
export const enrichMovieWithOmdb = (movie: Movie, omdb: OmdbMovieDetail): Movie => {
  const hasValidPoster = omdb.Poster && omdb.Poster !== 'N/A';
  return {
    ...movie,
    poster: hasValidPoster ? omdb.Poster : movie.poster,
    imdbId: omdb.imdbID,
    year: omdb.Year || movie.year,
    actors: omdb.Actors && omdb.Actors !== 'N/A' ? omdb.Actors : movie.actors,
    director: omdb.Director && omdb.Director !== 'N/A' ? omdb.Director : movie.director,
    description: (movie.description && movie.description.length > 50) ? movie.description : (omdb.Plot && omdb.Plot !== 'N/A' ? omdb.Plot : movie.description),
    rating: (omdb.imdbRating && omdb.imdbRating !== 'N/A') ? parseFloat(omdb.imdbRating) : movie.rating,
    imdbRating: omdb.imdbRating && omdb.imdbRating !== 'N/A' ? omdb.imdbRating : undefined,
    cert: (omdb.Rated && omdb.Rated !== 'N/A') ? omdb.Rated : movie.cert
  };
};

/**
 * Batch-enrich catalog movies with OMDb data using the key.
 * First applies any locally cached data instantly, then queries OMDb for uncached movies.
 */
export const batchEnrichMovies = async (
  movies: Movie[],
  onUpdate?: (updatedMovies: Movie[]) => void
): Promise<Movie[]> => {
  const updated = [...movies];
  const uncachedList: { index: number; title: string }[] = [];
  const cache = getOmdbCache();

  // First pass: apply any cached values immediately
  movies.forEach((m, idx) => {
    const key = m.title.toLowerCase().trim();
    if (cache[key]) {
      updated[idx] = enrichMovieWithOmdb(m, cache[key]!);
    } else {
      uncachedList.push({ index: idx, title: m.title });
    }
  });

  if (onUpdate) {
    onUpdate([...updated]);
  }

  // Second pass: query OMDb for uncached movies with slight staggering
  const priorityUncached = uncachedList.slice(0, 30);
  for (const item of priorityUncached) {
    try {
      const omdbData = await fetchOmdbByTitle(item.title);
      if (omdbData) {
        updated[item.index] = enrichMovieWithOmdb(updated[item.index], omdbData);
        if (onUpdate) {
          onUpdate([...updated]);
        }
      }
    } catch {
      // ignore individual failures
    }
  }

  return updated;
};
