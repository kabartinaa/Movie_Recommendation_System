const mongoose = require('mongoose');

const moodHistorySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mood_text: { type: String, required: true },
  detected_mood: { type: String, required: true },
  mapped_genres: [{ type: String }],
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MoodHistory', moodHistorySchema);
