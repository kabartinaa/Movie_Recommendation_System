const Like = require('../models/Like');
const WatchLater = require('../models/WatchLater');
const WatchHistory = require('../models/WatchHistory');
const Movie = require('../models/Movie');

exports.toggleLike = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.user.userId;

    const existingLike = await Like.findOne({ user_id: userId, movie_id: movieId });

    let isLiked = false;
    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      await Movie.findByIdAndUpdate(movieId, { $inc: { likes_count: -1, trending_score: -5 } });
      isLiked = false;
    } else {
      await Like.create({ user_id: userId, movie_id: movieId });
      await Movie.findByIdAndUpdate(movieId, { $inc: { likes_count: 1, trending_score: 10 } });
      isLiked = true;
    }

    const updatedMovie = await Movie.findById(movieId);

    res.json({
      message: isLiked ? 'Movie added to likes' : 'Movie removed from likes',
      is_liked: isLiked,
      likes_count: updatedMovie.likes_count
    });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling like state', error: error.message });
  }
};

exports.toggleWatchLater = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.user.userId;

    const existingRecord = await WatchLater.findOne({ user_id: userId, movie_id: movieId });

    let isWatchLater = false;
    if (existingRecord) {
      await WatchLater.deleteOne({ _id: existingRecord._id });
      isWatchLater = false;
    } else {
      await WatchLater.create({ user_id: userId, movie_id: movieId });
      isWatchLater = true;
    }

    res.json({
      message: isWatchLater ? 'Added to Watch Later' : 'Removed from Watch Later',
      is_watch_later: isWatchLater
    });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling watch later state', error: error.message });
  }
};

exports.getWatchLaterList = async (req, res) => {
  try {
    const userId = req.user.userId;
    const items = await WatchLater.find({ user_id: userId }).populate('movie_id').sort({ created_at: -1 });
    const movies = items.map(item => item.movie_id).filter(Boolean);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching watch later list', error: error.message });
  }
};

exports.updateWatchProgress = async (req, res) => {
  try {
    const { movieId, lastPosition, completionPercentage } = req.body;
    const userId = req.user.userId;

    let history = await WatchHistory.findOne({ user_id: userId, movie_id: movieId });

    if (history) {
      history.last_position = lastPosition || history.last_position;
      history.completion_percentage = completionPercentage !== undefined ? completionPercentage : history.completion_percentage;
      history.watched_at = new Date();
      await history.save();
    } else {
      history = await WatchHistory.create({
        user_id: userId,
        movie_id: movieId,
        last_position: lastPosition || 0,
        completion_percentage: completionPercentage || 0,
        watched_at: new Date()
      });
      // Increment watch count on first watch session
      await Movie.findByIdAndUpdate(movieId, { $inc: { watch_count: 1, trending_score: 15 } });
    }

    res.json({
      message: 'Watch progress updated',
      watch_history: history
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating watch progress', error: error.message });
  }
};

exports.getWatchHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const history = await WatchHistory.find({ user_id: userId }).populate('movie_id').sort({ watched_at: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching watch history', error: error.message });
  }
};

exports.getLikedMovies = async (req, res) => {
  try {
    const userId = req.user.userId;
    const items = await Like.find({ user_id: userId }).populate('movie_id').sort({ created_at: -1 });
    const movies = items.map(item => item.movie_id).filter(Boolean);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching liked movies', error: error.message });
  }
};
