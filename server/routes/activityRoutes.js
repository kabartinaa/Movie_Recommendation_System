const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/like', requireAuth, activityController.toggleLike);
router.get('/liked', requireAuth, activityController.getLikedMovies);

router.post('/watch-later', requireAuth, activityController.toggleWatchLater);
router.get('/watch-later/list', requireAuth, activityController.getWatchLaterList);

router.post('/watch-progress', requireAuth, activityController.updateWatchProgress);
router.get('/watch-history', requireAuth, activityController.getWatchHistory);

module.exports = router;
