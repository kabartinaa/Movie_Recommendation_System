const Movie = require('../models/Movie');
const Like = require('../models/Like');
const WatchHistory = require('../models/WatchHistory');
const SearchHistory = require('../models/SearchHistory');
const WatchLater = require('../models/WatchLater');
const User = require('../models/User');

/**
 * Multi-Signal Personalized Recommendation Service
 */
async function getPersonalizedRecommendations(userId, limit = 12) {
  const user = await User.findById(userId);
  if (!user) {
    return await Movie.find().sort({ trending_score: -1 }).limit(limit);
  }

  // Fetch all user engagement signals
  const likes = await Like.find({ user_id: userId }).populate('movie_id');
  const watchHistories = await WatchHistory.find({ user_id: userId }).populate('movie_id');
  const searchHistories = await SearchHistory.find({ user_id: userId }).sort({ searched_at: -1 }).limit(20);
  const watchLaterItems = await WatchLater.find({ user_id: userId });

  const watchLaterMovieIds = new Set(watchLaterItems.map(w => w.movie_id.toString()));
  const watchedMovieIds = new Set(watchHistories.map(w => w.movie_id ? w.movie_id._id.toString() : ''));

  // Calculate Language & Genre Frequency Profiles
  const langFreq = {};
  const genreFreq = {};

  // 1. Explicit Preferences
  (user.preferred_languages || []).forEach(l => {
    langFreq[l] = (langFreq[l] || 0) + 3;
  });
  (user.preferred_genres || []).forEach(g => {
    genreFreq[g] = (genreFreq[g] || 0) + 3;
  });

  // 2. Liked Movies signals
  likes.forEach(like => {
    if (like.movie_id) {
      const m = like.movie_id;
      if (m.language) langFreq[m.language] = (langFreq[m.language] || 0) + 4;
      (m.genres || []).forEach(g => {
        genreFreq[g] = (genreFreq[g] || 0) + 4;
      });
    }
  });

  // 3. Watch History signals (weighted by completion)
  watchHistories.forEach(wh => {
    if (wh.movie_id) {
      const m = wh.movie_id;
      const weight = wh.completion_percentage > 50 ? 3 : 1;
      if (m.language) langFreq[m.language] = (langFreq[m.language] || 0) + weight;
      (m.genres || []).forEach(g => {
        genreFreq[g] = (genreFreq[g] || 0) + weight;
      });
    }
  });

  // 4. Search signals
  const searchTerms = searchHistories.map(s => s.search_query.toLowerCase()).join(' ');

  // Fetch all candidate movies
  const allMovies = await Movie.find({});

  // Score each movie
  const scoredMovies = allMovies.map(movie => {
    let score = movie.trending_score || 0;

    // Language affinity score
    if (langFreq[movie.language]) {
      score += langFreq[movie.language] * 8;
    }

    // Genre affinity score
    (movie.genres || []).forEach(g => {
      if (genreFreq[g]) {
        score += genreFreq[g] * 7;
      }
    });

    // Search query relevance score
    const titleLower = movie.title.toLowerCase();
    const castLower = (movie.cast || []).map(c => c.toLowerCase()).join(' ');
    const descLower = movie.description.toLowerCase();

    searchHistories.forEach(sh => {
      const q = sh.search_query.toLowerCase();
      if (titleLower.includes(q) || movie.language.toLowerCase().includes(q)) score += 15;
      if (movie.genres.some(g => g.toLowerCase().includes(q))) score += 12;
      if (castLower.includes(q)) score += 10;
    });

    // Watch Later bonus
    if (watchLaterMovieIds.has(movie._id.toString())) {
      score += 20;
    }

    // Slightly penalize already 100% completed movies to promote discovery
    const whRecord = watchHistories.find(wh => wh.movie_id && wh.movie_id._id.toString() === movie._id.toString());
    if (whRecord && whRecord.completion_percentage >= 90) {
      score *= 0.5;
    }

    return { movie, score };
  });

  // Sort by score descending
  scoredMovies.sort((a, b) => b.score - a.score);

  return scoredMovies.slice(0, limit).map(item => item.movie);
}

/**
 * Get profile analysis stats for user (e.g. 70% Tamil, 20% Hindi, 10% Bollywood)
 */
async function getUserPreferenceStats(userId) {
  const user = await User.findById(userId);
  const likes = await Like.find({ user_id: userId }).populate('movie_id');
  const watchHistories = await WatchHistory.find({ user_id: userId }).populate('movie_id');

  const langCounts = { Tamil: 0, Hindi: 0, Bollywood: 0 };
  const genreCounts = { Emotion: 0, Motivation: 0, Family: 0, Inspirational: 0, 'Feel-good': 0 };

  let totalSignals = 0;

  // Include explicit preferences as initial seed weights
  (user?.preferred_languages || []).forEach(l => {
    if (langCounts[l] !== undefined) { langCounts[l] += 2; totalSignals += 2; }
  });
  (user?.preferred_genres || []).forEach(g => {
    if (genreCounts[g] !== undefined) { genreCounts[g] += 2; }
  });

  // Process likes
  likes.forEach(like => {
    if (like.movie_id) {
      const m = like.movie_id;
      if (m.language && langCounts[m.language] !== undefined) {
        langCounts[m.language] += 3;
        totalSignals += 3;
      }
      (m.genres || []).forEach(g => {
        if (genreCounts[g] !== undefined) genreCounts[g] += 3;
      });
    }
  });

  // Process watch history
  watchHistories.forEach(wh => {
    if (wh.movie_id) {
      const m = wh.movie_id;
      if (m.language && langCounts[m.language] !== undefined) {
        langCounts[m.language] += 1;
        totalSignals += 1;
      }
      (m.genres || []).forEach(g => {
        if (genreCounts[g] !== undefined) genreCounts[g] += 1;
      });
    }
  });

  // Calculate percentages
  const languagePercentages = {};
  if (totalSignals > 0) {
    for (const [lang, count] of Object.entries(langCounts)) {
      languagePercentages[lang] = Math.round((count / totalSignals) * 100);
    }
  } else {
    // Default evenly split if no activity yet
    languagePercentages.Tamil = 40;
    languagePercentages.Hindi = 30;
    languagePercentages.Bollywood = 30;
  }

  // Find top genres
  const sortedGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([genre]) => genre);

  return {
    language_breakdown: languagePercentages,
    frequently_liked_genres: sortedGenres.slice(0, 3)
  };
}

module.exports = {
  getPersonalizedRecommendations,
  getUserPreferenceStats
};
