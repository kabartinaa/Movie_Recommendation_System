const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  preferred_languages: [{ type: String, enum: ['Tamil', 'Hindi', 'Bollywood'] }],
  preferred_genres: [{ type: String, enum: ['Emotion', 'Motivation', 'Family', 'Inspirational', 'Feel-good'] }],
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
