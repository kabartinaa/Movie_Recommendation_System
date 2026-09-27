const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/trending', movieController.getTrendingMovies);
router.get('/home-feed', movieController.getHomeFeed);
router.get('/search', optionalAuth, movieController.searchMovies);
router.get('/youtube-search', movieController.searchYouTube);
router.get('/:id', optionalAuth, movieController.getMovieDetails);

module.exports = router;
