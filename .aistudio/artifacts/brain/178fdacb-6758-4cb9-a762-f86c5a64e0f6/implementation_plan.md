# OMDb API Integration & Real Movie Posters Engine

Auto-enrich the iMovies cinema platform with real high-definition posters, ratings, and synopses using the OMDb API (`365d650f`), featuring live search and 1-click movie import in both the header and Studio with persistent client-side caching.

***

## User Review & Critical Decisions

> [!IMPORTANT]
> The following integration decisions were confirmed during the interactive interview:
> - **Catalog Enrichment**: Auto-fetch authentic OMDb movie posters and metadata for all Hollywood, Bollywood, South Indian, Anime, and Cinema titles.
> - **Search & Import Access**: Enable live OMDb query lookup and 1-click movie import both in the **global top search bar** and inside the **Add Movie (Studio)** view.
> - **Poster Caching & Fallback**: Cache fetched poster URLs and movie details in `localStorage` under `im_omdb_cache` to minimize network calls and rate limits, with immediate fallback to dynamic SVG poster art whenever offline or if OMDb returns `N/A`.

- **API Rate Limiting & Debouncing**: Live search input is debounced by 350ms to ensure fast, responsive queries without throttling the OMDb free key.
- **Poster Fallback Resilience**: Any poster that fails to load (e.g. 404 or image block) gracefully falls back to the dynamic SVG vector art generator without breaking card layouts.

***

## 1. Overview & Core Concept

- **What It Does**: Connects iMovies to the Open Movie Database (OMDb) using the provided API key (`365d650f`). It replaces generic or placeholder posters across the catalog with authentic studio artwork, enhances movie synopses with IMDb ratings, actors, and director information, and enables users to discover and import any movie in the world with a single click.
- **Target Audience / Persona**: Movie lovers and cinema-goers seeking authentic movie artwork, accurate IMDb ratings, and personalized ticket booking or streaming.
- **Key Value**: Transforms the catalog into an authentic, visually striking cinema directory with real posters and instant search-and-add capabilities.

***

## 2. User Experience & Visual Design

### Key User Flows

1. **Browsing the Catalog**:
   - As users browse categories (Trending, Bollywood, South, Hollywood, Anime, Sports), the app checks the persistent cache or requests OMDb for authentic poster URLs and IMDb ratings.
   - Posters display crisp official artwork with subtle hover elevation and ambient glow.
2. **Live Global Search**:
   - Typing in the top search bar filters local titles instantly while concurrently querying OMDb.
   - An OMDb Results section appears under local matches with high-res thumbnails, year, and a `"＋ Import to iMovies"` button.
3. **Studio Quick-Import**:
   - In the "Add Movie (Studio)" tab, an "OMDb Quick Search" input allows typing any movie title (e.g., *The Godfather*, *Oppenheimer*, *Kantara*).
   - Clicking an OMDb result auto-populates the Title, Genre, Director, Year, Description, IMDb Rating, and Poster URL with one click.
4. **Movie Details & Player**:
   - Movie detail modals now present the real poster, IMDb star rating, full cast, release year, and duration alongside ticket booking and streaming options.

### Visual Identity & Theme

- **Palette**: Dark cinema aesthetics (`#0b0d14` background, `#131722` surface cards, `#1a2030` elevated elements, `#f5cb6e` gold accent, `#e11d48` crimson tag, `#10b981` emerald for owned/active).
- **Typography**: Display headings in **Outfit** (Bold 700 / Black 900) and body prose in **Plus Jakarta Sans** with tabular numbers (`tabular-nums`) for prices, ratings, and showtimes.
- **Zero-Pill Metadata**: Tags, runtime, and certs displayed as clean unboxed text separated by typographic middots (`·`).
- **Resilient Poster Frames**: Fixed 2:3 aspect ratio containers with smooth gradient skeleton loading and SVG vector fallbacks to prevent layout shift.

***

## 3. Key Product Decisions & Trade-Offs

### Decision 1: OMDb Integration Strategy (Service Layer vs. Ad-hoc Calls)
- *Chosen Approach*: Centralized `OmdbService` (`src/services/omdb.ts`) with typed methods (`searchMovies`, `getMovieByTitle`, `getMovieById`, `batchEnrichMovies`) and persistent `localStorage` caching.
- *Why*: Prevents duplicate API requests, keeps API key configuration modular, and ensures fast instant re-renders from local cache.
- *Alternatives Considered*: Direct fetch inside individual components was rejected to avoid code duplication and API rate exhaustion.

### Decision 2: Search Experience Architecture
- *Chosen Approach*: Hybrid search rendering: local catalog matches displayed immediately, while an asynchronous OMDb search section displays external discoveries with preview cards and 1-click import.
- *Why*: Delivers zero-latency local results while unlocking millions of global movies without blocking the UI.
- *Alternatives Considered*: Replacing the local catalog entirely was rejected because local cinema showtimes, ticket booking engines, and customized prices rely on the existing schema.

### Decision 3: Image Error Handling
- *Chosen Approach*: `onError` handler on all poster elements that automatically switches to `generateMoviePosterSvg(movie)` if an external OMDb image link is blocked, expired, or returns 404.
- *Why*: Eliminates broken image icons and maintains visual polish.

***

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                       iMovies SPA                           │
└─────────────────────────────────────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
    ┌─────────────────────┐         ┌─────────────────────┐
    │     UI Layer        │         │   Services Layer    │
    │  (React 19 + Vite)  │         │                     │
    ├─────────────────────┤         ├─────────────────────┤
    │ • Header / Search   │◄───────►│ • OmdbService       │
    │ • MovieCard / Rows  │         │   - apiKey:365d650f │
    │ • MovieDetailsModal │         │   - cache layer     │
    │ • Studio / MeView   │         │ • storageService    │
    │ • BookingModal      │         │   - localStorage    │
    └─────────────────────┘         └─────────────────────┘
               │                               │
               │                               ▼
               │                    ┌─────────────────────┐
               │                    │     OMDb REST API   │
               │                    │   omdbapi.com       │
               ▼                    └─────────────────────┘
    ┌─────────────────────┐
    │  Poster Fallback    │
    │  (Dynamic SVG Art)  │
    └─────────────────────┘
```

### Data Model Additions

```typescript
// Extended Movie interface with OMDb metadata
export interface Movie {
  // Existing fields
  id: string;
  title: string;
  genres: string[];
  dur: number;
  rating: number;
  cert: string;
  director: string;
  lang: string;
  poster?: string;
  // OMDb enhanced fields
  imdbId?: string;
  year?: string;
  actors?: string;
  rated?: string;
  imdbRating?: string;
  source?: 'catalog' | 'omdb' | 'custom';
}

// OMDb API response interfaces
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
  Actors: string;
  Plot: string;
  Language: string;
  Poster: string;
  imdbRating: string;
  imdbID: string;
  Response: string;
}
```

### Component & State Mapping

1. **`src/services/omdb.ts`**:
   - `OMDB_API_KEY = '365d650f'`
   - `fetchOmdbMovie(title: string)`: Queries OMDb by title and caches response in `im_omdb_cache`.
   - `searchOmdbMovies(query: string)`: Returns array of search candidates.
   - `enrichMoviesWithOmdb(movies: Movie[])`: Batches and fills real posters for catalog titles.
2. **`src/components/Header.tsx`**:
   - Adds an active search status indicator when querying OMDb.
3. **`src/App.tsx`**:
   - Runs `enrichMoviesWithOmdb` on initial mount to populate real posters.
   - Displays both local search results and OMDb live search results when user searches.
   - Handles 1-click import from OMDb search results into the local library.
4. **`src/components/MeView.tsx` (Studio)**:
   - Adds a "Search & Import from OMDb" section with live search and auto-fill for new movies.
5. **`src/components/MovieDetailsModal.tsx`**:
   - Displays IMDb rating badge, cast list, and release year from OMDb.
