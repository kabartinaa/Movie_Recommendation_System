const mongoose = require('mongoose');
const Movie = require('./models/Movie');
require('dotenv').config();

const movies = [
  // TAMIL MOVIES
  {
    tmdb_id: 830788,
    tmdbId: 830788,
    title: "Varisu",
    original_title: "Varisu",
    originalTitle: "Varisu",
    release_date: "2023-01-11",
    releaseDate: "2023-01-11",
    release_year: 2023,
    language: "Tamil",
    genres: ["Family", "Feel-good", "Emotion"],
    description: "The youngest son of a business tycoon returns home to reunite his fractured family when an unexpected tragedy threatens their empire.",
    poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80",
    video_url: "",
    video_type: "unavailable",
    authorized_source: "",
    watch_providers: [
      { provider_name: "Amazon Prime Video", type: "subscription", link: "https://www.primevideo.com" },
      { provider_name: "YouTube Movies", type: "rent/buy", link: "https://www.youtube.com/feed/storefront" }
    ],
    duration: "2h 50m",
    runtime: "2h 50m",
    duration_minutes: 170,
    cast: ["Thalapathy Vijay", "Rashmika Mandanna", "Prakash Raj", "Jayasudha"],
    rating: 4.5,
    watch_count: 1300,
    likes_count: 940,
    trending_score: 92
  },
  {
    tmdb_id: 866346,
    tmdbId: 866346,
    title: "Jailer",
    original_title: "Jailer",
    originalTitle: "Jailer",
    release_date: "2023-08-10",
    releaseDate: "2023-08-10",
    release_year: 2023,
    language: "Tamil",
    genres: ["Motivation", "Emotion", "Family"],
    description: "A retired prison warden embarks on a relentless mission to save his kidnapped son, navigating family values and epic courage.",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80",
    video_url: "",
    video_type: "unavailable",
    authorized_source: "",
    watch_providers: [
      { provider_name: "Amazon Prime Video", type: "subscription", link: "https://www.primevideo.com" }
    ],
    duration: "2h 48m",
    runtime: "2h 48m",
    duration_minutes: 168,
    cast: ["Rajinikanth", "Mohanlal", "Shivarajkumar", "Ramya Krishnan"],
    rating: 4.8,
    watch_count: 1420,
    likes_count: 980,
    trending_score: 95
  },
  {
    tmdb_id: 653574,
    tmdbId: 653574,
    title: "Soorarai Pottru",
    original_title: "Soorarai Pottru",
    originalTitle: "Soorarai Pottru",
    release_date: "2020-11-12",
    releaseDate: "2020-11-12",
    release_year: 2020,
    language: "Tamil",
    genres: ["Motivation", "Inspirational", "Emotion"],
    description: "An inspiring biographical journey of Nedumaaran Rajangam, a former IAF captain who dreams of making low-cost air travel accessible to every common family.",
    poster: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80",
    video_url: "",
    video_type: "unavailable",
    authorized_source: "",
    watch_providers: [
      { provider_name: "Amazon Prime Video", type: "subscription", link: "https://www.primevideo.com" }
    ],
    duration: "2h 33m",
    runtime: "2h 33m",
    duration_minutes: 153,
    cast: ["Suriya", "Aparna Balamurali", "Paresh Rawal"],
    rating: 4.9,
    watch_count: 1850,
    likes_count: 1420,
    trending_score: 98
  },
  {
    tmdb_id: 611634,
    tmdbId: 611634,
    title: "Asuran",
    original_title: "Asuran",
    originalTitle: "Asuran",
    release_date: "2019-10-04",
    releaseDate: "2019-10-04",
    release_year: 2019,
    language: "Tamil",
    genres: ["Emotion", "Family", "Motivation"],
    description: "A loving father fights against systemic social injustice to protect his young son from taking a violent path.",
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    video_url: "",
    video_type: "unavailable",
    authorized_source: "",
    watch_providers: [
      { provider_name: "Amazon Prime Video", type: "subscription", link: "https://www.primevideo.com" }
    ],
    duration: "2h 21m",
    runtime: "2h 21m",
    duration_minutes: 141,
    cast: ["Dhanush", "Manju Warrier", "Prakash Raj"],
    rating: 4.7,
    watch_count: 1100,
    likes_count: 890,
    trending_score: 88
  },
  {
    tmdb_id: 283120,
    tmdbId: 283120,
    title: "Karnan (Classic)",
    original_title: "Karnan",
    originalTitle: "Karnan",
    release_date: "1964-01-14",
    releaseDate: "1964-01-14",
    release_year: 1964,
    language: "Tamil",
    genres: ["Emotion", "Inspirational", "Family"],
    description: "The epic legendary Tamil classic depicting the tragic and noble journey of Karnan from Mahabharatam. Full length public archive masterpiece.",
    poster: "https://images.unsplash.com/photo-1518676599602-f1705374c728?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1518676599602-f1705374c728?auto=format&fit=crop&w=1200&q=80",
    video_url: "https://ia800303.us.archive.org/24/items/Karnan1964TamilFullMovie/Karnan1964TamilFullMovie.mp4",
    video_type: "full_movie",
    authorized_source: "Internet Archive Public Domain",
    watch_providers: [
      { provider_name: "Internet Archive (Free Public Stream)", type: "free", link: "https://archive.org" }
    ],
    duration: "2h 55m",
    runtime: "2h 55m",
    duration_minutes: 175,
    cast: ["Sivaji Ganesan", "N. T. Rama Rao", "Devika"],
    rating: 4.9,
    watch_count: 2300,
    likes_count: 1890,
    trending_score: 96
  },
  {
    tmdb_id: 847926,
    tmdbId: 847926,
    title: "Thunivu",
    original_title: "Thunivu",
    originalTitle: "Thunivu",
    release_date: "2023-01-11",
    releaseDate: "2023-01-11",
    release_year: 2023,
    language: "Tamil",
    genres: ["Motivation", "Feel-good"],
    description: "A mastermind exposes dark financial frauds in a daring bank takeover that delivers justice to the innocent public.",
    poster: "https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=1200&q=80",
    video_url: "",
    video_type: "unavailable",
    authorized_source: "",
    watch_providers: [
      { provider_name: "Netflix", type: "subscription", link: "https://www.netflix.com" }
    ],
    duration: "2h 26m",
    runtime: "2h 26m",
    duration_minutes: 146,
    cast: ["Ajith Kumar", "Manju Warrier", "Samuthirakani"],
    rating: 4.4,
    watch_count: 850,
    likes_count: 640,
    trending_score: 80
  },

  // HINDI / BOLLYWOOD MOVIES
  {
    tmdb_id: 19404,
    tmdbId: 19404,
    title: "3 Idiots",
    original_title: "3 Idiots",
    originalTitle: "3 Idiots",
    release_date: "2009-12-23",
    releaseDate: "2009-12-23",
    release_year: 2009,
    language: "Bollywood",
    genres: ["Motivation", "Feel-good", "Family", "Inspirational"],
    description: "Two friends search for their long-lost college companion while recalling how his unconventional wisdom transformed their lives and career outlook.",
    poster: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1200&q=80",
    video_url: "",
    video_type: "unavailable",
    authorized_source: "",
    watch_providers: [
      { provider_name: "Amazon Prime Video", type: "subscription", link: "https://www.primevideo.com" },
      { provider_name: "YouTube Movies", type: "rent/buy", link: "https://www.youtube.com/feed/storefront" }
    ],
    duration: "2h 50m",
    runtime: "2h 50m",
    duration_minutes: 170,
    cast: ["Aamir Khan", "R. Madhavan", "Sharman Joshi", "Kareena Kapoor"],
    rating: 4.9,
    watch_count: 2400,
    likes_count: 1950,
    trending_score: 99
  },
  {
    tmdb_id: 360814,
    tmdbId: 360814,
    title: "Dangal",
    original_title: "Dangal",
    originalTitle: "Dangal",
    release_date: "2016-12-21",
    releaseDate: "2016-12-21",
    release_year: 2016,
    language: "Hindi",
    genres: ["Motivation", "Inspirational", "Family", "Emotion"],
    description: "Former wrestler Mahavir Singh Phogat overcomes all odds to train his daughters Geeta and Babita to become world-class Olympic champions.",
    poster: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    video_url: "",
    video_type: "unavailable",
    authorized_source: "",
    watch_providers: [
      { provider_name: "Disney+ Hotstar", type: "subscription", link: "https://www.hotstar.com" }
    ],
    duration: "2h 49m",
    runtime: "2h 49m",
    duration_minutes: 169,
    cast: ["Aamir Khan", "Fatima Sana Shaikh", "Sanya Malhotra", "Sakshi Tanwar"],
    rating: 4.9,
    watch_count: 2100,
    likes_count: 1780,
    trending_score: 97
  },
  {
    tmdb_id: 872906,
    tmdbId: 872906,
    title: "Jawan",
    original_title: "Jawan",
    originalTitle: "Jawan",
    release_date: "2023-09-07",
    releaseDate: "2023-09-07",
    release_year: 2023,
    language: "Bollywood",
    genres: ["Motivation", "Emotion", "Inspirational"],
    description: "A high-octane emotional saga of a former soldier who unleashes a crusade against corruption to fulfill a promise to his people.",
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
    video_url: "",
    video_type: "unavailable",
    authorized_source: "",
    watch_providers: [
      { provider_name: "Netflix", type: "subscription", link: "https://www.netflix.com" }
    ],
    duration: "2h 49m",
    runtime: "2h 49m",
    duration_minutes: 169,
    cast: ["Shah Rukh Khan", "Nayanthara", "Vijay Sethupathi", "Deepika Padukone"],
    rating: 4.7,
    watch_count: 1980,
    likes_count: 1540,
    trending_score: 96
  },
  {
    tmdb_id: 38402,
    tmdbId: 38402,
    title: "Devdas (Classic)",
    original_title: "Devdas",
    originalTitle: "Devdas",
    release_date: "1955-12-30",
    releaseDate: "1955-12-30",
    release_year: 1955,
    language: "Hindi",
    genres: ["Emotion", "Family", "Inspirational"],
    description: "The legendary Hindi classic emotional masterpiece based on Sarat Chandra Chattopadhyay's novel. Authorized full-length public domain archive.",
    poster: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
    video_url: "https://ia800201.us.archive.org/12/items/Devdas1955FullHindiMovie/Devdas1955FullHindiMovie.mp4",
    video_type: "full_movie",
    authorized_source: "Internet Archive Public Domain",
    watch_providers: [
      { provider_name: "Internet Archive (Free Public Stream)", type: "free", link: "https://archive.org" }
    ],
    duration: "2h 32m",
    runtime: "2h 32m",
    duration_minutes: 152,
    cast: ["Dilip Kumar", "Vyjayanthimala", "Motilal", "Suchitra Sen"],
    rating: 4.8,
    watch_count: 1950,
    likes_count: 1620,
    trending_score: 94
  },
  {
    tmdb_id: 592834,
    tmdbId: 592834,
    title: "Chhichhore",
    original_title: "Chhichhore",
    originalTitle: "Chhichhore",
    release_date: "2019-09-06",
    releaseDate: "2019-09-06",
    release_year: 2019,
    language: "Hindi",
    genres: ["Motivation", "Feel-good", "Family", "Emotion"],
    description: "Following a tragic incident, a middle-aged man reunites with his college buddies to teach his teenage son that failure is just a step toward true victory.",
    poster: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    video_url: "",
    video_type: "unavailable",
    authorized_source: "",
    watch_providers: [
      { provider_name: "Disney+ Hotstar", type: "subscription", link: "https://www.hotstar.com" }
    ],
    duration: "2h 23m",
    runtime: "2h 23m",
    duration_minutes: 143,
    cast: ["Sushant Singh Rajput", "Shraddha Kapoor", "Varun Sharma"],
    rating: 4.8,
    watch_count: 1720,
    likes_count: 1410,
    trending_score: 91
  },
  {
    tmdb_id: 62835,
    tmdbId: 62835,
    title: "Zindagi Na Milegi Dobara",
    original_title: "Zindagi Na Milegi Dobara",
    originalTitle: "Zindagi Na Milegi Dobara",
    release_date: "2011-07-15",
    releaseDate: "2011-07-15",
    release_year: 2011,
    language: "Bollywood",
    genres: ["Feel-good", "Inspirational", "Emotion"],
    description: "Three lifelong friends take a transformative road trip across Spain, overcoming deep-seated fears and rediscovering the joy of living in the moment.",
    poster: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
    video_url: "",
    video_type: "unavailable",
    authorized_source: "",
    watch_providers: [
      { provider_name: "Netflix", type: "subscription", link: "https://www.netflix.com" },
      { provider_name: "Amazon Prime Video", type: "subscription", link: "https://www.primevideo.com" }
    ],
    duration: "2h 35m",
    runtime: "2h 35m",
    duration_minutes: 155,
    cast: ["Hrithik Roshan", "Farhan Akhtar", "Abhay Deol", "Katrina Kaif"],
    rating: 4.8,
    watch_count: 1530,
    likes_count: 1280,
    trending_score: 89
  }
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri) {
      await mongoose.connect(mongoUri);
    } else {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('Connected to In-Memory MongoDB Server for Seeding');
    }

    await Movie.deleteMany({});
    await Movie.insertMany(movies);
    console.log(`Successfully seeded ${movies.length} movies into the database!`);
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { movies, seedDatabase };
