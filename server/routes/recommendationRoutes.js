const express = require('express');
const router = express.Router();
const { optionalAuth, requireAuth } = require('../middleware/authMiddleware');
const { analyzeMood } = require('../services/moodService');
const { getPersonalizedRecommendations } = require('../services/recommendationService');
const Movie = require('../models/Movie');
const MoodHistory = require('../models/MoodHistory');

// GET /api/recommendations/personalized
router.get('/personalized', requireAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12;
    const recommendations = await getPersonalizedRecommendations(req.user.userId, limit);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Error generating recommendations', error: error.message });
  }
});

// POST /api/mood/detect
router.post('/detect', optionalAuth, async (req, res) => {
  try {
    const { mood_text } = req.body;

    if (!mood_text || mood_text.trim() === '') {
      return res.status(400).json({ message: 'Mood description is required.' });
    }

    const analysis = analyzeMood(mood_text);

    // Save mood history if user is logged in
    if (req.user && req.user.userId) {
      await MoodHistory.create({
        user_id: req.user.userId,
        mood_text: mood_text.trim(),
        detected_mood: analysis.detected_mood,
        mapped_genres: analysis.mapped_genres
      });
    }

    // Build movie filter query based on mapped genres
    const query = {
      genres: { $in: analysis.mapped_genres }
    };

    // If specific language detected in text, filter by it
    if (analysis.detected_languages && analysis.detected_languages.length > 0) {
      query.language = { $in: analysis.detected_languages };
    }

    let movies = await Movie.find(query).sort({ trending_score: -1 }).limit(10);

    // Fallback if no specific match
    if (movies.length === 0) {
      movies = await Movie.find().sort({ trending_score: -1 }).limit(10);
    }

    res.json({
      mood_analysis: analysis,
      recommended_movies: movies
    });
  } catch (error) {
    res.status(500).json({ message: 'Error detecting mood and recommending movies', error: error.message });
  }
});

module.exports = router;
