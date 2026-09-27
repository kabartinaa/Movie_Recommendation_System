const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  tmdb_id: { type: Number, required: true, unique: true },
  tmdbId: { type: Number }, // Alias field for frontend consistency
  title: { type: String, required: true, trim: true },
  original_title: { type: String, trim: true },
  originalTitle: { type: String, trim: true },
  release_date: { type: String },
  releaseDate: { type: String },
  release_year: { type: Number, required: true },
  language: { type: String, required: true, enum: ['Tamil', 'Hindi', 'Bollywood'] },
  genres: [{ type: String, required: true, enum: ['Emotion', 'Motivation', 'Family', 'Inspirational', 'Feel-good'] }],
  description: { type: String, required: true },
  poster: { type: String, required: true },
  backdrop: { type: String },
  video_url: { type: String, default: '' },
  video_type: { type: String, enum: ['full_movie', 'unavailable'], default: 'unavailable' },
  authorized_source: { type: String, default: '' },
  watch_providers: [{
    provider_name: { type: String, required: true },
    logo_path: { type: String },
    type: { type: String, default: 'stream' },
    link: { type: String }
  }],
  duration: { type: String, default: '2h 15m' },
  runtime: { type: String, default: '2h 15m' },
  duration_minutes: { type: Number, default: 135 },
  watch_count: { type: Number, default: 0 },
  likes_count: { type: Number, default: 0 },
  trending_score: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

// Auto-sync camelCase and snake_case properties on save
movieSchema.pre('save', function (next) {
  if (this.tmdb_id && !this.tmdbId) this.tmdbId = this.tmdb_id;
  if (this.tmdbId && !this.tmdb_id) this.tmdb_id = this.tmdbId;

  if (this.original_title && !this.originalTitle) this.originalTitle = this.original_title;
  if (this.originalTitle && !this.original_title) this.original_title = this.originalTitle;

  if (this.release_date && !this.releaseDate) this.releaseDate = this.release_date;
  if (this.releaseDate && !this.release_date) this.release_date = this.releaseDate;

  if (this.duration && !this.runtime) this.runtime = this.duration;
  if (this.runtime && !this.duration) this.duration = this.runtime;

  next();
});

// Transform JSON output so both tmdbId and tmdb_id are always returned to frontend
movieSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.tmdbId = ret.tmdb_id || ret.tmdbId;
    ret.tmdb_id = ret.tmdb_id || ret.tmdbId;
    ret.originalTitle = ret.original_title || ret.originalTitle || ret.title;
    ret.original_title = ret.original_title || ret.originalTitle || ret.title;
    ret.releaseDate = ret.release_date || ret.releaseDate || String(ret.release_year);
    ret.release_date = ret.release_date || ret.releaseDate || String(ret.release_year);
    ret.runtime = ret.duration || ret.runtime || '2h 15m';
    ret.duration = ret.duration || ret.runtime || '2h 15m';
    return ret;
  }
});

module.exports = mongoose.model('Movie', movieSchema);
