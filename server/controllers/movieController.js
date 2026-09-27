const Movie = require('../models/Movie');
const Like = require('../models/Like');
const WatchLater = require('../models/WatchLater');
const WatchHistory = require('../models/WatchHistory');
const SearchHistory = require('../models/SearchHistory');

exports.getTrendingMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ trending_score: -1, watch_count: -1 }).limit(10);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trending movies', error: error.message });
  }
};

exports.getHomeFeed = async (req, res) => {
  try {
    const trending = await Movie.find().sort({ trending_score: -1 }).limit(8);
    const emotional = await Movie.find({ genres: 'Emotion' }).limit(8);
    const motivational = await Movie.find({ genres: 'Motivation' }).limit(8);
    const family = await Movie.find({ genres: 'Family' }).limit(8);
    const tamil = await Movie.find({ language: 'Tamil' }).limit(8);
    const hindi = await Movie.find({ language: 'Hindi' }).limit(8);
    const bollywood = await Movie.find({ language: 'Bollywood' }).limit(8);

    res.json({
      trending,
      emotional,
      motivational,
      family,
      tamil,
      hindi,
      bollywood
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching home feed categories', error: error.message });
  }
};

exports.searchMovies = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.json([]);
    }

    const query = q.trim();

    // Record search history if user is logged in
    if (req.user && req.user.userId) {
      await SearchHistory.create({
        user_id: req.user.userId,
        search_query: query
      });
    }

    const regex = new RegExp(query, 'i');
    const movies = await Movie.find({
      $or: [
        { title: regex },
        { language: regex },
        { genres: regex },
        { cast: regex },
        { description: regex }
      ]
    }).limit(20);

    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error searching movies', error: error.message });
  }
};

exports.getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    let isLiked = false;
    let isWatchLater = false;
    let watchHistory = null;

    if (req.user && req.user.userId) {
      const likedRecord = await Like.findOne({ user_id: req.user.userId, movie_id: id });
      isLiked = !!likedRecord;

      const watchLaterRecord = await WatchLater.findOne({ user_id: req.user.userId, movie_id: id });
      isWatchLater = !!watchLaterRecord;

      watchHistory = await WatchHistory.findOne({ user_id: req.user.userId, movie_id: id });
    }

    res.json({
      movie,
      user_status: {
        is_liked: isLiked,
        is_watch_later: isWatchLater,
        last_position: watchHistory ? watchHistory.last_position : 0,
        completion_percentage: watchHistory ? watchHistory.completion_percentage : 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movie details', error: error.message });
  }
};

exports.searchYouTube = async (req, res) => {
  try {
    const { title, year, language } = req.query;

    if (!title) {
      return res.status(400).json({ message: 'Movie title is required.' });
    }

    // Exact query construction: e.g. "Varisu 2023 Tamil full movie"
    const searchQuery = `${title} ${year || ''} ${language || ''} full movie`.replace(/\s+/g, ' ').trim();
    const encodedQuery = encodeURIComponent(searchQuery);
    const searchUrl = `https://www.youtube.com/results?search_query=${encodedQuery}`;

    const apiKey = process.env.YOUTUBE_API_KEY;

    if (apiKey) {
      try {
        const langCode = language === 'Tamil' ? 'ta' : language === 'Hindi' ? 'hi' : 'en';
        const ytApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodedQuery}&regionCode=IN&relevanceLanguage=${langCode}&maxResults=5&key=${apiKey}`;
        
        const response = await fetch(ytApiUrl);
        if (response.ok) {
          const data = await response.json();
          const items = (data.items || []).map(item => ({
            id: item.id.videoId,
            video_id: item.id.videoId,
            title: item.snippet.title,
            channel: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
            watch_url: `https://www.youtube.com/watch?v=${item.id.videoId}`
          }));

          return res.json({
            search_query: searchQuery,
            search_url: searchUrl,
            results: items
          });
        }
      } catch (err) {
        console.warn('YouTube API call failed, using structured YouTube search link fallback:', err.message);
      }
    }

    // Standard YouTube search results fallback
    res.json({
      search_query: searchQuery,
      search_url: searchUrl,
      results: [
        {
          id: 'yt_direct_1',
          video_id: 'direct',
          title: `${title} (${year || ''}) ${language || ''} Full Movie`,
          channel: 'YouTube Official Search',
          thumbnail: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80',
          watch_url: searchUrl
        }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: 'Error executing YouTube movie search', error: error.message });
  }
};
