import { Movie } from '../types';

export const GENRE_EMOJIS: Record<string, string> = {
  'Sci-Fi': '🚀',
  'Action': '💥',
  'Romance': '💖',
  'Horror': '👻',
  'Sports': '🏆',
  'Animation': '🧸',
  'Anime': '🌸',
  'Documentary': '🏔️',
  'Family': '🎈',
  'Western': '🌵',
  'Drama': '🎭',
  'Comedy': '😂',
  'Musical': '🎵',
  'Mystery': '🕵️',
  'Thriller': '🔍',
  'Fantasy': '🐉',
  'Adventure': '🧭',
  'Cyberpunk': '🤖',
  'Crime': '🕵️',
  'Music': '🎵',
  'Nature': '🦁',
  'Supernatural': '👻',
  'Superhero': '⚡',
  'War': '🎖️',
  'History': '📜'
};

export const getGenreHue = (str: string): number => {
  let h = 7;
  for (let i = 0; i < str.length; i++) {
    h = (h * 33 + str.charCodeAt(i)) % 360;
  }
  return h;
};

export const generateMoviePosterSvg = (m: Movie): string => {
  const g = m.genres.find(x => GENRE_EMOJIS[x]) || 'Drama';
  const emoji = GENRE_EMOJIS[g] || '🎬';
  const h = getGenreHue(m.title);

  let dots = '';
  for (let i = 0; i < 16; i++) {
    const k = getGenreHue(m.title + i);
    dots += `<circle cx="${(k * 7) % 300}" cy="${(k * 13) % 300}" r="${2 + (k % 5)}" fill="#fff" opacity=".${2 + (k % 4)}"/>`;
  }

  const lines: string[] = [];
  let curr = '';
  for (const word of m.title.split(' ')) {
    if ((curr + ' ' + word).length > 13 && curr) {
      lines.push(curr);
      curr = word;
    } else {
      curr = curr ? curr + ' ' + word : word;
    }
  }
  lines.push(curr);

  const tx = lines.slice(0, 3).map((t, idx) => {
    const yPos = 372 + idx * 28 - (Math.min(lines.length, 3) - 1) * 12;
    return `<text x="150" y="${yPos}" text-anchor="middle" fill="#fff" font-size="24" font-weight="800" font-family="Outfit, sans-serif">${t.replace(/&/g, '&amp;')}</text>`;
  }).join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450"><defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h},75%,40%)"/><stop offset="1" stop-color="hsl(${(h + 70) % 360},80%,9%)"/></linearGradient><radialGradient id="b"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="300" height="450" fill="url(#a)"/>${dots}<circle cx="150" cy="185" r="125" fill="url(#b)"/><text x="150" y="230" text-anchor="middle" font-size="125">${emoji}</text><rect y="305" width="300" height="145" fill="#000" opacity=".55"/>${tx}</svg>`;

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg).replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29');
};

export const INITIAL_CINEMA_MOVIES: Movie[] = [
  {
    i: 0,
    id: "mov_odyssey_stars",
    title: "Odyssey of Stars",
    tagline: "Where journey ends, the universe begins.",
    description: "When an interstellar anomaly triggers gravitational disruptions across the Solar perimeter, Commander Alexander Reed and astrophysicist Eliza Vostok lead humanity’s deepest deep-space expedition through the unknown ringed world of Kepler-186.",
    genres: ["Sci-Fi", "Adventure", "Mystery"],
    dur: 164,
    rating: 9.3,
    cert: "PG-13",
    director: "Elias Thornton",
    featured: true,
    cin: 1,
    lang: "English",
    cat: "Hollywood",
    paid: false,
    price: 49,
    img: "poster_sci_fi_1793119908580.jpg"
  },
  {
    i: 1,
    id: "mov_chrono_protocol",
    title: "Chrono Protocol",
    tagline: "Time is the ultimate weapon.",
    description: "An elite counter-temporal operative investigates a series of paradoxical memory assassinations in high-altitude Neo-Geneva, uncovering a conspiracy that spans three separate timelines.",
    genres: ["Action", "Thriller", "Sci-Fi"],
    dur: 138,
    rating: 8.8,
    cert: "R",
    director: "Sofia Chen-Duval",
    featured: true,
    cin: 1,
    lang: "English",
    cat: "Hollywood",
    paid: false,
    price: 79,
    img: ""
  },
  {
    i: 2,
    id: "mov_the_virtuoso",
    title: "The Virtuoso Maestro",
    tagline: "Every note holds a reckoning.",
    description: "A prodigy concert conductor battles progressive hearing loss while preparing the premier performance of a forbidden symphony that unearths her family’s war-time secrets.",
    genres: ["Drama", "Music"],
    dur: 142,
    rating: 9.0,
    cert: "PG-13",
    director: "Julian Moreau",
    featured: false,
    cin: 1,
    lang: "English",
    cat: "Hollywood",
    paid: true,
    price: 99,
    img: ""
  },
  {
    i: 3,
    id: "mov_phantom_crest",
    title: "Phantom Crest",
    tagline: "In the shadows of the storm.",
    description: "During a relentless Arctic whiteout, a deep-sea salvage crew discovers a submarine that disappeared in 1968, only to find something dormant waiting inside the hull.",
    genres: ["Horror", "Mystery", "Thriller"],
    dur: 119,
    rating: 8.4,
    cert: "R",
    director: "Lars Lindqvist",
    featured: false,
    cin: 1,
    lang: "English",
    cat: "Hollywood",
    paid: false,
    price: 149,
    img: ""
  },
  {
    i: 4,
    id: "mov_solaris_blade",
    title: "Solaris Blade: Neon Horizon",
    tagline: "Rebellion rises from the neon depths.",
    description: "An underground courier navigating the flooded canal levels of Sector 9 discovers a cryogenic capsule containing the prototype consciousness of humanity’s first artificial guardian.",
    genres: ["Cyberpunk", "Action", "Anime"],
    dur: 126,
    rating: 9.1,
    cert: "PG-13",
    director: "Kenichi Takahashi",
    featured: false,
    cin: 1,
    lang: "Japanese",
    cat: "Anime",
    paid: false,
    price: 49,
    img: ""
  },
  {
    i: 5,
    id: "mov_wild_savannah",
    title: "Wild Savannah: Giants of Mara",
    tagline: "The untamed pulse of the earth.",
    description: "Narrated by world-renowned naturalists, this visual spectacle captured over 4 years in 8K IMAX reveals the secret migrations, predator hierarchies, and survival dynamics of the Great Rift Valley.",
    genres: ["Documentary", "Nature"],
    dur: 98,
    rating: 9.4,
    cert: "U",
    director: "Amina Kiprop",
    featured: false,
    cin: 1,
    lang: "English",
    cat: "Hollywood",
    paid: true,
    price: 79,
    img: ""
  },
  {
    i: 6,
    id: "mov_cyber_eclipse",
    title: "Cyber Eclipse",
    tagline: "When the city goes dark, truth lights the fire.",
    description: "In a neon-drenched metropolis under total corporate surveillance, an underground operative uncovers a planetary blackout conspiracy programmed to wipe the identities of millions.",
    genres: ["Action", "Cyberpunk", "Thriller"],
    dur: 146,
    rating: 9.2,
    cert: "R",
    director: "Sofia Chen-Duval",
    featured: true,
    cin: 1,
    lang: "English",
    cat: "Hollywood",
    paid: false,
    price: 99,
    img: "poster_cyber_thriller_1793169929489.jpg"
  },
  {
    i: 7,
    id: "mov_kingdom_ash",
    title: "Kingdom of Ash",
    tagline: "An ancient throne forged in fire and ice.",
    description: "As eternal winter encroaches on the high citadels of Valerius, four banished guardians embark on a perilous ascent up the Dragon Crest to rekindle the slumbering primordial flame.",
    genres: ["Adventure", "Fantasy", "Action"],
    dur: 168,
    rating: 9.4,
    cert: "PG-13",
    director: "Eliza Sharp",
    featured: false,
    cin: 1,
    lang: "English",
    cat: "Hollywood",
    paid: false,
    price: 149,
    img: "poster_epic_fantasy_1793169929860.jpg"
  },
  {
    i: 8,
    id: "mov_starlight_voyage",
    title: "Starlight Voyage",
    tagline: "A galactic adventure for the whole family!",
    description: "When an adventurous robotic cartographer crash-lands on a celestial floating archipelago, he befriends a bioluminescent cosmic creature and embarks on a whimsical quest across stellar rivers.",
    genres: ["Animation", "Adventure", "Family"],
    dur: 104,
    rating: 8.9,
    cert: "U",
    director: "Pete Hansson",
    featured: false,
    cin: 1,
    lang: "English",
    cat: "Hollywood",
    paid: true,
    price: 49,
    img: "poster_animated_adventure_1793169929607.jpg"
  },
  {
    i: 9,
    id: "mov_silent_witness",
    title: "The Silent Witness",
    tagline: "Truth lies in the shadows.",
    description: "In 1954 New York, a rain-soaked detective with a troubled past is hired to investigate a mysterious disappearance in an abandoned jazz district, unraveling a web of political corruption and high-stakes espionage.",
    genres: ["Mystery", "Crime", "Drama"],
    dur: 131,
    rating: 8.7,
    cert: "R",
    director: "Elias Vance",
    featured: false,
    cin: 1,
    lang: "English",
    cat: "Hollywood",
    paid: false,
    price: 79,
    img: "poster_noir_detective_1793169951028.jpg"
  },
  {
    i: 10,
    id: "mov_letters_autumn",
    title: "Letters to Autumn",
    tagline: "An unexpected love, every single leaf.",
    description: "When an American landscape architect arrives in Paris for a restorative autumn sabbatical, a misdelivered vintage love letter leads him into the whimsical world of a charismatic local bookbinder.",
    genres: ["Romance", "Comedy", "Drama"],
    dur: 118,
    rating: 9.1,
    cert: "PG",
    director: "Liam Harper",
    featured: false,
    cin: 1,
    lang: "English",
    cat: "Hollywood",
    paid: false,
    price: 99,
    img: "poster_romance_verona_1793170285497.jpg"
  },
  {
    i: 11,
    id: "mov_vanguard_apex",
    title: "Vanguard: Apex Dawn",
    tagline: "The rise of the ultimate defender.",
    description: "As a rogue syndicate deploys orbital gravitational disruptors above New Metropolis, cybernetically augmented pilot Julian Apex awakens the prototype Vanguard exosuit to mount Earth’s ultimate aerial defense.",
    genres: ["Action", "Sci-Fi", "Superhero"],
    dur: 152,
    rating: 9.5,
    cert: "PG-13",
    director: "Marcus Sterling",
    featured: true,
    cin: 1,
    lang: "English",
    cat: "Hollywood",
    paid: false,
    price: 149,
    img: "poster_superhero_vanguard_1793170285127.jpg"
  },
  {
    i: 12,
    id: "mov_blackwood_haunting",
    title: "The Blackwood Haunting",
    tagline: "Some secrets don’t stay buried.",
    description: "A team of paranormal acoustics researchers spend three nights inside the cursed Blackwood Manor, cataloging frequency anomalies until the house begins rearranging its geometry around them.",
    genres: ["Horror", "Supernatural", "Mystery"],
    dur: 112,
    rating: 8.8,
    cert: "R",
    director: "Arthur Finch",
    featured: false,
    cin: 1,
    lang: "English",
    cat: "Hollywood",
    paid: true,
    price: 49,
    img: "poster_horror_blackwood_1793170286180.jpg"
  },
  {
    i: 13,
    id: "mov_dust_glory",
    title: "Dust & Glory",
    tagline: "Some seek riches. Others seek redemption. He seeks judgment.",
    description: "In 1881 New Mexico territory, an aging lawman is forced out of retirement to track a ruthless outlaw gang across scorching salt flats before they reach the border river.",
    genres: ["Western", "Action", "Adventure"],
    dur: 139,
    rating: 9.0,
    cert: "R",
    director: "Gregory Adams",
    featured: false,
    cin: 1,
    lang: "English",
    cat: "Hollywood",
    paid: false,
    price: 79,
    img: "poster_western_frontier_1793170285618.jpg"
  },
  {
    i: 14,
    id: "mov_final_round",
    title: "The Final Round: Iron Heart",
    tagline: "Champions are made in the rounds they refuse to yield.",
    description: "An undrafted welterweight boxer from South Philadelphia overcomes career-ending ligament injuries and personal tragedy to earn a shot at the undisputed world heavyweight title.",
    genres: ["Sports", "Drama", "Action"],
    dur: 134,
    rating: 8.9,
    cert: "PG-13",
    director: "Denzel Wright",
    featured: false,
    cin: 1,
    lang: "English",
    cat: "Hollywood",
    paid: false,
    price: 99,
    img: ""
  },
  {
    i: 15,
    id: "mov_rhythm_broadway",
    title: "Rhythm of Broadway",
    tagline: "Every street is a stage. Every heartbeat is music.",
    description: "A fiery ensemble of tap dancers, classical violinists, and street jazz vocalists battle gentrification and rival producers to stage the biggest independent musical in Times Square history.",
    genres: ["Musical", "Comedy", "Drama"],
    dur: 125,
    rating: 9.2,
    cert: "PG",
    director: "Lin-Manuel Miranda",
    featured: false,
    cin: 1,
    lang: "English",
    cat: "Hollywood",
    paid: true,
    price: 149,
    img: ""
  },
  {
    i: 16,
    id: "mov_iron_horizon",
    title: "Iron Horizon: Siege of 1944",
    tagline: "In the darkest hour of humanity, courage forged victory.",
    description: "Trapped behind enemy lines in the freezing Ardennes Forest, a lone radio operator and five allied tank crewmen must hold a critical bridge against an advancing armored battalion.",
    genres: ["War", "History", "Action"],
    dur: 158,
    rating: 9.3,
    cert: "R",
    director: "Christopher Nolan",
    featured: false,
    cin: 1,
    lang: "English",
    cat: "Hollywood",
    paid: false,
    price: 49,
    img: ""
  },
  {
    i: 17,
    id: "mov_barnaby_escape",
    title: "Barnaby’s Big City Escape",
    tagline: "One small paw. One giant metropolitan caper!",
    description: "When an adventurous golden retriever accidentally boards a cross-country bullet train to Manhattan, he unites an eccentric alley-cat syndicate to foil an unscrupulous pet store tycoon.",
    genres: ["Family", "Comedy", "Adventure"],
    dur: 96,
    rating: 8.8,
    cert: "U",
    director: "Brad Bird",
    featured: false,
    cin: 1,
    lang: "English",
    cat: "Hollywood",
    paid: false,
    price: 79,
    img: ""
  },
  {
    i: 18,
    id: "mov_singularity_2099",
    title: "Singularity 2099",
    tagline: "Beyond the event horizon lies human rebirth.",
    description: "Deep-space mining vessel Prometheus discovers a hyper-dense artificial neutron construct drifting in interstellar space that emits coherent mathematical signals from the future.",
    genres: ["Sci-Fi", "Thriller", "Mystery"],
    dur: 148,
    rating: 9.2,
    cert: "PG-13",
    director: "Denis Villeneuve",
    featured: false,
    cin: 1,
    lang: "English",
    cat: "Hollywood",
    paid: true,
    price: 99,
    img: ""
  },
  {
    i: 19,
    id: "mov_grand_illusionist",
    title: "The Grand Illusionist",
    tagline: "Look closer. What you see is only what they want you to believe.",
    description: "An elusive master mentalist orchestrates a series of impossible bank disappearances during live televised stage performances in London, challenging Scotland Yard to solve the riddle.",
    genres: ["Mystery", "Crime", "Thriller"],
    dur: 130,
    rating: 9.0,
    cert: "PG-13",
    director: "Christopher Priest",
    featured: false,
    cin: 1,
    lang: "English",
    cat: "Hollywood",
    paid: false,
    price: 149,
    img: ""
  }
];

export const RAW_CATALOG_DATA = [
  // Bollywood
  'Sholay/Action/Hindi', 'Dilwale Dulhania Le Jayenge/Romance/Hindi', '3 Idiots/Comedy/Hindi',
  'Lagaan/Sports/Hindi', 'Dangal/Sports/Hindi', 'Chak De! India/Sports/Hindi',
  'Bhaag Milkha Bhaag/Sports/Hindi', 'Zindagi Na Milegi Dobara/Drama/Hindi', 'Queen/Comedy/Hindi',
  'Andhadhun/Thriller/Hindi', 'Drishyam/Thriller/Hindi', 'Kahaani/Mystery/Hindi',
  'Gully Boy/Musical/Hindi', 'Barfi!/Romance/Hindi', 'Swades/Drama/Hindi',
  'Rang De Basanti/Drama/Hindi', 'PK/Comedy/Hindi', 'Munna Bhai M.B.B.S./Comedy/Hindi',
  'Hera Pheri/Comedy/Hindi', 'Don/Action/Hindi', 'Dhoom 2/Action/Hindi',
  'Bajrangi Bhaijaan/Drama/Hindi', 'Kabir Singh/Romance/Hindi', 'Anand/Drama/Hindi',
  'Gol Maal/Comedy/Hindi', 'Amar Akbar Anthony/Action/Hindi', 'Deewaar/Action/Hindi',
  'Krrish 3/Sci-Fi/Hindi', 'Housefull 2/Comedy/Hindi', 'Dhamaal/Comedy/Hindi',
  'Bhagam Bhaag/Comedy/Hindi', 'Sooryavansham/Drama/Hindi', 'Ghatak/Action/Hindi',
  'Josh/Action/Hindi', '83/Sports/Hindi', 'MS Dhoni: The Untold Story/Sports/Hindi',
  'Mary Kom/Sports/Hindi', 'Sultan/Sports/Hindi',

  // South Indian
  'Baahubali: The Beginning/Action/Telugu', 'RRR/Action/Telugu', 'Pushpa: The Rise/Action/Telugu',
  'KGF: Chapter 1/Action/Kannada', 'Vikram/Action/Tamil', 'Kantara/Thriller/Kannada',
  'Jai Bhim/Drama/Tamil', 'Master/Action/Tamil', 'Sarkaru Vaari Paata/Action/Telugu',
  'Premam/Romance/Malayalam', 'Ponniyin Selvan: I/Drama/Tamil', 'Eega/Fantasy/Telugu',

  // Hollywood
  'Inception/Sci-Fi/English', 'Interstellar/Sci-Fi/English', 'The Dark Knight/Action/English',
  'Avatar/Sci-Fi/English', 'Titanic/Romance/English', 'Jurassic Park/Adventure/English',
  'The Matrix/Sci-Fi/English', 'Gladiator/Action/English', 'The Lion King/Animation/English',
  'Toy Story/Animation/English', 'Frozen/Animation/English', 'Coco/Animation/English',
  'Mad Max: Fury Road/Action/English', 'Jaws/Thriller/English', 'The Conjuring/Horror/English',
  'Rocky/Sports/English', 'Forrest Gump/Drama/English', 'The Shawshank Redemption/Drama/English',
  'Spider-Man: Into the Spider-Verse/Animation/English', 'Top Gun: Maverick/Action/English',

  // Anime
  'Spirited Away/Fantasy/Japanese', 'Your Name/Romance/Japanese', 'Princess Mononoke/Fantasy/Japanese',
  'Akira/Sci-Fi/Japanese', 'Demon Slayer: Mugen Train/Action/Japanese', 'Weathering with You/Romance/Japanese',
  'Grave of the Fireflies/Drama/Japanese', 'Howl\'s Moving Castle/Fantasy/Japanese',
  'My Neighbor Totoro/Family/Japanese', 'A Silent Voice/Drama/Japanese'
];

export const parseCatalogMovies = (offset = 20): Movie[] => {
  return RAW_CATALOG_DATA.map((entry, idx) => {
    const [title, genre, lang] = entry.split('/');
    let cat = 'Hollywood';
    if (lang === 'Hindi') cat = 'Bollywood';
    else if (['Telugu', 'Tamil', 'Kannada', 'Malayalam'].includes(lang)) cat = 'South';
    else if (lang === 'Japanese') cat = 'Anime';

    const genres = cat === 'Anime' ? ['Anime', genre] : [genre];
    const isPaid = [2, 5, 8].includes(idx % 10);
    const priceList = [49, 79, 99, 149];
    const price = priceList[idx % 4];

    return {
      i: offset + idx,
      id: `mov_cat_${offset + idx}`,
      title,
      tagline: `${genre} · ${lang}`,
      description: `${title} is a celebrated ${genre} classic in ${lang}. Available to watch on iMovies with high-fidelity sound and visual remaster.`,
      genres,
      dur: 110 + ((idx * 7) % 65),
      rating: +(8.0 + ((idx * 13) % 19) / 10).toFixed(1),
      cert: 'U/A',
      director: 'Acclaimed Director',
      lang: lang || 'Hindi',
      cat,
      cin: false,
      paid: isPaid,
      price
    };
  });
};

export const getAllInitialMovies = (): Movie[] => {
  const catalog = parseCatalogMovies(INITIAL_CINEMA_MOVIES.length);
  const all = [...INITIAL_CINEMA_MOVIES, ...catalog];
  all.forEach(m => {
    if (!m.poster && !m.img) {
      m.poster = generateMoviePosterSvg(m);
    }
  });
  return all;
};
