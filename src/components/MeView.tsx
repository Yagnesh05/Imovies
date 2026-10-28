import React, { useState } from 'react';
import { User, UserData, Movie, OmdbSearchResult } from '../types';
import { THEATRES } from '../data/theatres';
import { GENRE_EMOJIS } from '../data/movies';
import { MovieCard } from './MovieCard';
import { searchOmdb, fetchOmdbById, convertOmdbToMovie } from '../services/omdb';
import { 
  History, 
  Bookmark, 
  Ticket, 
  Download, 
  PlusCircle, 
  Settings, 
  ChevronRight, 
  Crown,
  Search,
  Sparkles,
  DownloadCloud,
  CheckCircle2,
  Film
} from 'lucide-react';

interface MeViewProps {
  currentUser: User | null;
  guestId: string;
  userData: UserData;
  allMovies: Movie[];
  imageMap: Record<string, string>;
  onOpenAuth: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  onClearHistory: () => void;
  onClearList: () => void;
  onUpdateSetting: <K extends keyof UserData['S']>(key: K, value: UserData['S'][K]) => void;
  onSelectMovie: (movie: Movie) => void;
  onAddCustomMovie: (movie: Movie) => void;
  onNavigateTab: (tab: 'tickets' | 'downloads') => void;
}

type SubScreen = 'main' | 'history' | 'list' | 'settings' | 'rewards' | 'studio';

export const MeView: React.FC<MeViewProps> = ({
  currentUser,
  guestId,
  userData,
  allMovies,
  imageMap,
  onOpenAuth,
  onLogout,
  onDeleteAccount,
  onClearHistory,
  onClearList,
  onUpdateSetting,
  onSelectMovie,
  onAddCustomMovie,
  onNavigateTab
}) => {
  const [subScreen, setSubScreen] = useState<SubScreen>('main');

  // Studio manual form states
  const [movieTitle, setMovieTitle] = useState('');
  const [movieGenre, setMovieGenre] = useState('Action');
  const [movieDesc, setMovieDesc] = useState('');
  const [movieYt, setMovieYt] = useState('');
  const [movieVideo, setMovieVideo] = useState('');
  const [moviePrice, setMoviePrice] = useState(0);
  const [moviePosterUrl, setMoviePosterUrl] = useState('');
  const [studioError, setStudioError] = useState('');
  const [studioSuccess, setStudioSuccess] = useState('');

  // OMDb live search & import states
  const [omdbQuery, setOmdbQuery] = useState('');
  const [omdbSearching, setOmdbSearching] = useState(false);
  const [omdbResults, setOmdbResults] = useState<OmdbSearchResult[]>([]);
  const [importingId, setImportingId] = useState<string | null>(null);

  // Rewards points
  const totalSpent = userData.tickets.reduce((sum, b) => sum + b.total, 0);
  const points = Math.floor(totalSpent / 10);
  const tier = points >= 500 ? 'Platinum' : points >= 200 ? 'Gold' : 'Silver';
  const nextTierPts = points >= 200 ? 500 : 200;
  const tierProgress = Math.min(100, Math.round((points / nextTierPts) * 100));

  // Search OMDb
  const handleOmdbSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!omdbQuery.trim()) return;

    setOmdbSearching(true);
    setStudioError('');
    try {
      const results = await searchOmdb(omdbQuery);
      setOmdbResults(results);
      if (results.length === 0) {
        setStudioError(`No movies found on OMDb for "${omdbQuery}". Try a different title.`);
      }
    } catch {
      setStudioError('Failed to search OMDb. Please check your network connection.');
    } finally {
      setOmdbSearching(false);
    }
  };

  // 1-Click Import from OMDb
  const handleImportOmdbMovie = async (imdbId: string) => {
    setImportingId(imdbId);
    setStudioError('');
    try {
      const detail = await fetchOmdbById(imdbId);
      if (detail && detail.Response === 'True') {
        const newMovie = convertOmdbToMovie(detail, false);
        onAddCustomMovie(newMovie);
        setStudioSuccess(`"${newMovie.title}" imported successfully from OMDb!`);
        // Remove from current search candidates
        setOmdbResults(prev => prev.filter(r => r.imdbID !== imdbId));
      } else {
        setStudioError('Could not fetch movie details from OMDb.');
      }
    } catch {
      setStudioError('Error importing movie.');
    } finally {
      setImportingId(null);
    }
  };

  // Pre-fill manual form from OMDb
  const handlePreFillForm = async (imdbId: string) => {
    setImportingId(imdbId);
    try {
      const detail = await fetchOmdbById(imdbId);
      if (detail && detail.Response === 'True') {
        setMovieTitle(detail.Title);
        setMovieDesc(detail.Plot !== 'N/A' ? detail.Plot : '');
        setMoviePosterUrl(detail.Poster !== 'N/A' ? detail.Poster : '');
        const firstGenre = detail.Genre ? detail.Genre.split(',')[0].trim() : 'Action';
        if (Object.keys(GENRE_EMOJIS).includes(firstGenre)) {
          setMovieGenre(firstGenre);
        }
        setStudioSuccess(`Loaded "${detail.Title}" details into form below. Adjust price or links and click Publish.`);
      }
    } catch {
      // ignore
    } finally {
      setImportingId(null);
    }
  };

  // Publish manual custom movie
  const handlePublishMovie = (e: React.FormEvent) => {
    e.preventDefault();
    setStudioError('');
    setStudioSuccess('');

    const title = movieTitle.trim();
    if (!title) {
      setStudioError('Please enter a movie title');
      return;
    }

    const ytMatch = movieYt.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
    const ytId = ytMatch ? ytMatch[1] : undefined;

    const customMovie: Movie = {
      id: 'c_' + Date.now().toString(36),
      title,
      tagline: `${movieGenre} · Added by ${currentUser?.name || 'You'}`,
      description: movieDesc.trim() || `Added by ${currentUser?.name || 'User'}. Available to watch on iMovies.`,
      genres: [movieGenre],
      dur: 120,
      rating: 9.0,
      cert: 'U/A',
      director: currentUser?.name || 'Independent Creator',
      lang: 'English',
      cat: 'Hollywood',
      cin: false,
      video: movieVideo.trim() || undefined,
      yt: ytId,
      thumb: ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : undefined,
      paid: moviePrice > 0,
      price: moviePrice,
      custom: true,
      poster: moviePosterUrl || undefined
    };

    onAddCustomMovie(customMovie);
    setStudioSuccess(`"${title}" published successfully to your iMovies library!`);
    setMovieTitle('');
    setMovieDesc('');
    setMovieYt('');
    setMovieVideo('');
    setMoviePrice(0);
    setMoviePosterUrl('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setMoviePosterUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const historyMovies = userData.hist
    .map(h => allMovies.find(m => m.id === h.id))
    .filter((m): m is Movie => Boolean(m));

  const listMovies = userData.lst
    .map(id => allMovies.find(m => m.id === id))
    .filter((m): m is Movie => Boolean(m));

  // SUB-SCREEN: WATCH HISTORY
  if (subScreen === 'history') {
    return (
      <div className="px-4 md:px-8 py-4 animate-up max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <button
              onClick={() => setSubScreen('main')}
              className="text-xs font-bold text-[#f5cb6e] hover:underline mb-1"
            >
              ← Back to Profile
            </button>
            <h2 className="font-heading font-extrabold text-2xl text-white">Watch History</h2>
          </div>
          {historyMovies.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs text-[#8b95ad] hover:text-[#e11d48] transition-colors"
            >
              Clear History
            </button>
          )}
        </div>

        {historyMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {historyMovies.map((m, idx) => (
              <MovieCard
                key={m.id}
                movie={m}
                index={idx}
                imageMap={imageMap}
                isOwned={userData.owned.includes(m.id)}
                onSelectMovie={onSelectMovie}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#8b95ad] p-8 text-center bg-[#131722] rounded-2xl border border-[#23293b]">
            No watch history yet. Start watching movies to track your stream activity here.
          </p>
        )}
      </div>
    );
  }

  // SUB-SCREEN: MY LIST
  if (subScreen === 'list') {
    return (
      <div className="px-4 md:px-8 py-4 animate-up max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <button
              onClick={() => setSubScreen('main')}
              className="text-xs font-bold text-[#f5cb6e] hover:underline mb-1"
            >
              ← Back to Profile
            </button>
            <h2 className="font-heading font-extrabold text-2xl text-white">My Watchlist</h2>
          </div>
          {listMovies.length > 0 && (
            <button
              onClick={onClearList}
              className="text-xs text-[#8b95ad] hover:text-[#e11d48] transition-colors"
            >
              Clear Watchlist
            </button>
          )}
        </div>

        {listMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {listMovies.map((m, idx) => (
              <MovieCard
                key={m.id}
                movie={m}
                index={idx}
                imageMap={imageMap}
                isOwned={userData.owned.includes(m.id)}
                onSelectMovie={onSelectMovie}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#8b95ad] p-8 text-center bg-[#131722] rounded-2xl border border-[#23293b]">
            Your watchlist is empty. Click "+ My List" on any movie to save it here for later.
          </p>
        )}
      </div>
    );
  }

  // SUB-SCREEN: REWARDS
  if (subScreen === 'rewards') {
    return (
      <div className="px-4 md:px-8 py-4 animate-up max-w-4xl mx-auto">
        <button
          onClick={() => setSubScreen('main')}
          className="text-xs font-bold text-[#f5cb6e] hover:underline mb-2"
        >
          ← Back to Profile
        </button>
        <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-white mb-6">
          Rewards &amp; Privileges
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-3xl bg-[#131722] border border-[#23293b]">
            <p className="text-xs font-bold uppercase tracking-wider text-[#8b95ad]">Your Reward Points</p>
            <div className="font-heading font-black text-5xl text-[#f5cb6e] my-3">{points}</div>
            <p className="text-xs text-white font-semibold mb-3">
              {tier} Member · Next tier at {nextTierPts} pts
            </p>
            <div className="h-2 rounded-full bg-[#1a2030] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#f5cb6e] to-[#e11d48] transition-all duration-500"
                style={{ width: `${tierProgress}%` }}
              />
            </div>
            <small className="block text-[11px] text-[#8b95ad] mt-3">
              Earn 1 point for every ₹10 spent on cinema tickets and movie purchases.
            </small>
          </div>

          <div className="p-6 rounded-3xl bg-[#131722] border border-[#23293b] flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#10b981] bg-[#10b981]/15 px-2.5 py-0.5 rounded-md">
                Active Promo
              </span>
              <h3 className="font-heading font-bold text-xl text-white mt-2 mb-1">
                FIRSTSHOW
              </h3>
              <p className="text-xs text-[#8b95ad] leading-relaxed">
                Flat ₹100 discount coupon code applied on your first cinema ticket reservation.
              </p>
            </div>
            <div className="mt-4 p-2.5 rounded-xl border border-dashed border-[#f5cb6e] text-center font-mono font-bold text-sm text-[#f5cb6e]">
              CODE: FIRSTSHOW
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SUB-SCREEN: ADD MOVIE STUDIO WITH OMDB SEARCH
  if (subScreen === 'studio') {
    return (
      <div className="px-4 md:px-8 py-4 animate-up max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => setSubScreen('main')}
          className="text-xs font-bold text-[#f5cb6e] hover:underline mb-2"
        >
          ← Back to Profile
        </button>

        <div>
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-white mb-1.5 flex items-center gap-2">
            <span>Movie Studio</span>
            <span className="text-xs font-bold text-[#10b981] bg-[#10b981]/15 px-2.5 py-0.5 rounded-full border border-[#10b981]/30">
              OMDb Connected
            </span>
          </h2>
          <p className="text-xs text-[#8b95ad]">
            Search millions of movies with OMDb or publish your own custom films with posters
          </p>
        </div>

        {/* SECTION 1: OMDb Quick Search & 1-Click Import */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#131722] border border-[#23293b] space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-white font-heading font-bold text-lg">
            <Sparkles className="w-5 h-5 text-[#f5cb6e]" />
            <h3>Search &amp; Import from OMDb</h3>
          </div>
          <p className="text-xs text-[#8b95ad]">
            Type any global movie title (e.g. <em>Inception</em>, <em>Kantara</em>, <em>Oppenheimer</em>) to auto-fetch official posters, IMDb ratings, director, and plot.
          </p>

          <form onSubmit={handleOmdbSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8b95ad] absolute left-3.5 top-3" />
              <input
                type="text"
                value={omdbQuery}
                onChange={(e) => setOmdbQuery(e.target.value)}
                placeholder="Search any movie title on OMDb..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#1a2030] border border-[#23293b] rounded-xl text-sm text-white placeholder-[#8b95ad] focus:outline-none focus:border-[#f5cb6e]"
              />
            </div>
            <button
              type="submit"
              disabled={omdbSearching || !omdbQuery.trim()}
              className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold shrink-0 disabled:opacity-40"
            >
              {omdbSearching ? 'Searching...' : 'Search OMDb'}
            </button>
          </form>

          {/* OMDb Candidates Search Results */}
          {omdbResults.length > 0 && (
            <div className="pt-2 space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {omdbResults.map((item) => (
                <div
                  key={item.imdbID}
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#1a2030] border border-[#23293b] hover:border-[#f5cb6e]/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.Poster}
                      alt={item.Title}
                      className="w-11 h-16 rounded-lg object-cover bg-black shrink-0 border border-white/10"
                    />
                    <div className="min-w-0">
                      <h4 className="font-heading font-bold text-sm text-white truncate">
                        {item.Title}
                      </h4>
                      <p className="text-xs text-[#8b95ad]">
                        {item.Year} · IMDb: {item.imdbID}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handlePreFillForm(item.imdbID)}
                      disabled={importingId === item.imdbID}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#23293b] text-[#cbd2e3] hover:text-white transition-colors"
                    >
                      Edit in Form
                    </button>
                    <button
                      onClick={() => handleImportOmdbMovie(item.imdbID)}
                      disabled={importingId === item.imdbID}
                      className="btn-gold px-3.5 py-1.5 rounded-lg text-xs font-bold shadow"
                    >
                      {importingId === item.imdbID ? 'Importing...' : '＋ Import'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: Custom / Manual Form */}
        <form onSubmit={handlePublishMovie} className="p-6 rounded-3xl bg-[#131722] border border-[#23293b] space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-white font-heading font-bold text-lg mb-1">
            <Film className="w-5 h-5 text-[#f5cb6e]" />
            <h3>Custom Movie Details &amp; Video Links</h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8b95ad] mb-1">Movie Title *</label>
            <input
              type="text"
              required
              value={movieTitle}
              onChange={(e) => setMovieTitle(e.target.value)}
              placeholder="e.g. Neon Runner: Tokyo 2099"
              className="w-full px-4 py-2.5 bg-[#1a2030] border border-[#23293b] rounded-xl text-sm text-white focus:outline-none focus:border-[#f5cb6e]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#8b95ad] mb-1">Genre</label>
              <select
                value={movieGenre}
                onChange={(e) => setMovieGenre(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#1a2030] border border-[#23293b] rounded-xl text-sm text-white focus:outline-none focus:border-[#f5cb6e]"
              >
                {Object.keys(GENRE_EMOJIS).map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8b95ad] mb-1">Price in ₹ (0 = Free)</label>
              <input
                type="number"
                min="0"
                value={moviePrice}
                onChange={(e) => setMoviePrice(+e.target.value || 0)}
                className="w-full px-4 py-2.5 bg-[#1a2030] border border-[#23293b] rounded-xl text-sm text-white focus:outline-none focus:border-[#f5cb6e]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8b95ad] mb-1">Short Description</label>
            <textarea
              rows={2}
              value={movieDesc}
              onChange={(e) => setMovieDesc(e.target.value)}
              placeholder="Synopsis of the movie..."
              className="w-full px-4 py-2 bg-[#1a2030] border border-[#23293b] rounded-xl text-sm text-white focus:outline-none focus:border-[#f5cb6e] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8b95ad] mb-1">YouTube Link (optional)</label>
            <input
              type="text"
              value={movieYt}
              onChange={(e) => setMovieYt(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-2.5 bg-[#1a2030] border border-[#23293b] rounded-xl text-sm text-white focus:outline-none focus:border-[#f5cb6e]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8b95ad] mb-1">Direct Video URL (.mp4)</label>
            <input
              type="text"
              value={movieVideo}
              onChange={(e) => setMovieVideo(e.target.value)}
              placeholder="https://example.com/video.mp4"
              className="w-full px-4 py-2.5 bg-[#1a2030] border border-[#23293b] rounded-xl text-sm text-white focus:outline-none focus:border-[#f5cb6e]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8b95ad] mb-1">Poster Image URL or Upload</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={moviePosterUrl}
                onChange={(e) => setMoviePosterUrl(e.target.value)}
                placeholder="https://... or upload below"
                className="flex-1 px-4 py-2 bg-[#1a2030] border border-[#23293b] rounded-xl text-xs text-white focus:outline-none focus:border-[#f5cb6e]"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="text-xs text-[#8b95ad] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1a2030] file:text-white hover:file:bg-[#23293b]"
            />
          </div>

          {studioError && (
            <p className="text-xs text-[#e11d48] bg-[#e11d48]/10 p-2.5 rounded-lg border border-[#e11d48]/20">{studioError}</p>
          )}

          {studioSuccess && (
            <p className="text-xs text-[#10b981] bg-[#10b981]/10 p-2.5 rounded-lg border border-[#10b981]/20 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{studioSuccess}</span>
            </p>
          )}

          <button
            type="submit"
            className="btn-gold w-full py-3 rounded-xl text-sm font-bold shadow-lg"
          >
            Publish Movie to iMovies
          </button>
        </form>
      </div>
    );
  }

  // SUB-SCREEN: SETTINGS
  if (subScreen === 'settings') {
    return (
      <div className="px-4 md:px-8 py-4 animate-up max-w-2xl mx-auto">
        <button
          onClick={() => setSubScreen('main')}
          className="text-xs font-bold text-[#f5cb6e] hover:underline mb-2"
        >
          ← Back to Profile
        </button>
        <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-white mb-6">
          App Settings
        </h2>

        <div className="space-y-4">
          <div className="rounded-2xl bg-[#131722] border border-[#23293b] overflow-hidden divide-y divide-[#23293b]">
            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-semibold text-white">Default Cinema City</span>
              <select
                value={userData.S.city}
                onChange={(e) => onUpdateSetting('city', e.target.value)}
                className="bg-[#1a2030] text-sm text-white px-3 py-1.5 rounded-xl border border-[#23293b]"
              >
                {Object.keys(THEATRES).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-semibold text-white">Language</span>
              <select
                value={userData.S.lang}
                onChange={(e) => onUpdateSetting('lang', e.target.value)}
                className="bg-[#1a2030] text-sm text-white px-3 py-1.5 rounded-xl border border-[#23293b]"
              >
                {['English', 'Hindi', 'Tamil', 'Telugu'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-semibold text-white">Cursor Glow Effect</span>
              <input
                type="checkbox"
                checked={Boolean(userData.S.glow)}
                onChange={(e) => onUpdateSetting('glow', e.target.checked ? 1 : 0)}
                className="w-5 h-5 accent-[#f5cb6e] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-semibold text-white">Autoplay Video Previews</span>
              <input
                type="checkbox"
                checked={Boolean(userData.S.auto)}
                onChange={(e) => onUpdateSetting('auto', e.target.checked ? 1 : 0)}
                className="w-5 h-5 accent-[#f5cb6e] rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-[#131722] border border-[#23293b] overflow-hidden divide-y divide-[#23293b]">
            <button
              onClick={onClearHistory}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a2030] transition-colors"
            >
              <span className="text-sm font-semibold text-white">Clear Watch History</span>
              <ChevronRight className="w-4 h-4 text-[#8b95ad]" />
            </button>

            <button
              onClick={onClearList}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a2030] transition-colors"
            >
              <span className="text-sm font-semibold text-white">Clear My List</span>
              <ChevronRight className="w-4 h-4 text-[#8b95ad]" />
            </button>

            {currentUser ? (
              <>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a2030] transition-colors"
                >
                  <span className="text-sm font-semibold text-white">Log Out</span>
                  <ChevronRight className="w-4 h-4 text-[#8b95ad]" />
                </button>

                <button
                  onClick={onDeleteAccount}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-[#e11d48]/10 transition-colors"
                >
                  <span className="text-sm font-semibold text-[#e11d48]">Delete Account</span>
                  <ChevronRight className="w-4 h-4 text-[#e11d48]" />
                </button>
              </>
            ) : (
              <button
                onClick={onOpenAuth}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a2030] transition-colors"
              >
                <span className="text-sm font-semibold text-[#f5cb6e]">Log In / Sign Up</span>
                <ChevronRight className="w-4 h-4 text-[#f5cb6e]" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // MAIN SCREEN: PROFILE OVERVIEW
  return (
    <div className="px-4 md:px-8 py-4 animate-up max-w-3xl mx-auto space-y-6">
      {/* User Greeting Header */}
      <div className="flex items-center justify-between gap-4 p-5 rounded-3xl bg-[#131722] border border-[#23293b]">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-white">
            {currentUser ? currentUser.name : 'Welcome, Movie Buff'}
          </h2>
          <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#1a2030] text-[#8b95ad]">
            {currentUser ? currentUser.email : `Guest ID: ${guestId}`}
          </span>
        </div>

        {!currentUser && (
          <button
            onClick={onOpenAuth}
            className="btn-gold px-5 py-2 rounded-xl text-xs font-bold shadow-md"
          >
            Log In
          </button>
        )}
      </div>

      {/* iMovies Premium Banner */}
      <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-r from-[#6b4a14] via-[#c8902c] to-[#7a5518] text-white shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-black/30 flex items-center justify-center shrink-0">
            <Crown className="w-7 h-7 text-[#ffcf5a]" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-xl text-white">iMovies Premium</h3>
            <p className="text-xs text-white/85">
              {userData.owned.length} movies unlocked · {tier} Tier Rewards
            </p>
          </div>
        </div>

        <button
          onClick={() => setSubScreen('rewards')}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-[#1a1200] hover:bg-white/90 shadow-md shrink-0 transition-transform active:scale-95"
        >
          Rewards
        </button>
      </div>

      {/* Navigation Menu Items */}
      <div className="rounded-3xl bg-[#131722] border border-[#23293b] overflow-hidden divide-y divide-[#23293b]">
        <button
          onClick={() => setSubScreen('history')}
          className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-[#1a2030] transition-colors"
        >
          <div className="flex items-center gap-3.5">
            <History className="w-5 h-5 text-[#f5cb6e]" />
            <span className="font-semibold text-sm text-white">Watch History</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8b95ad]">{userData.hist.length}</span>
            <ChevronRight className="w-4 h-4 text-[#8b95ad]" />
          </div>
        </button>

        <button
          onClick={() => setSubScreen('list')}
          className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-[#1a2030] transition-colors"
        >
          <div className="flex items-center gap-3.5">
            <Bookmark className="w-5 h-5 text-[#f5cb6e]" />
            <span className="font-semibold text-sm text-white">My Watchlist</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8b95ad]">{userData.lst.length}</span>
            <ChevronRight className="w-4 h-4 text-[#8b95ad]" />
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('tickets')}
          className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-[#1a2030] transition-colors"
        >
          <div className="flex items-center gap-3.5">
            <Ticket className="w-5 h-5 text-[#f5cb6e]" />
            <span className="font-semibold text-sm text-white">My Cinema Tickets</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8b95ad]">{userData.tickets.length}</span>
            <ChevronRight className="w-4 h-4 text-[#8b95ad]" />
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('downloads')}
          className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-[#1a2030] transition-colors"
        >
          <div className="flex items-center gap-3.5">
            <Download className="w-5 h-5 text-[#f5cb6e]" />
            <span className="font-semibold text-sm text-white">Downloads</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8b95ad]" />
        </button>

        <button
          onClick={() => setSubScreen('studio')}
          className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-[#1a2030] transition-colors"
        >
          <div className="flex items-center gap-3.5">
            <PlusCircle className="w-5 h-5 text-[#f5cb6e]" />
            <span className="font-semibold text-sm text-white">Add Movie (Studio &amp; OMDb)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#10b981] bg-[#10b981]/15 px-2 py-0.5 rounded">OMDb API</span>
            <ChevronRight className="w-4 h-4 text-[#8b95ad]" />
          </div>
        </button>

        <button
          onClick={() => setSubScreen('settings')}
          className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-[#1a2030] transition-colors"
        >
          <div className="flex items-center gap-3.5">
            <Settings className="w-5 h-5 text-[#f5cb6e]" />
            <span className="font-semibold text-sm text-white">Settings</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8b95ad]" />
        </button>
      </div>
    </div>
  );
};
