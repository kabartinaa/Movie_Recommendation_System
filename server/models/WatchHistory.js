const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movie_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  watched_at: { type: Date, default: Date.now },
  duration: { type: Number, default: 0 }, // playback position in seconds
  completion_percentage: { type: Number, default: 0 },
  last_position: { type: Number, default: 0 }
});

watchHistorySchema.index({ user_id: 1, movie_id: 1 }, { unique: true });

module.exports = mongoose.model('WatchHistory', watchHistorySchema);
