const mongoose = require('mongoose');
const User = require('./models/User');
const Movie = require('./models/Movie');
const Like = require('./models/Like');
const WatchLater = require('./models/WatchLater');
const WatchHistory = require('./models/WatchHistory');
const SearchHistory = require('./models/SearchHistory');
const { movies: seedData } = require('./seed');
const { analyzeMood } = require('./services/moodService');
const { getPersonalizedRecommendations, getUserPreferenceStats } = require('./services/recommendationService');
const bcrypt = require('bcryptjs');

async function runVerification() {
  console.log('--- STARTING SYSTEM VERIFICATION TESTS ---');

  // Connect to embedded memory server
  const { MongoMemoryServer } = require('mongodb-memory-server');
  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  console.log('✓ In-Memory MongoDB connected successfully.');

  // Seed database
  await Movie.deleteMany({});
  const seeded = await Movie.insertMany(seedData);
  console.log(`✓ Seeded ${seeded.length} Tamil, Hindi & Bollywood movies.`);

  // Test 1: User Registration
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: hashedPassword,
    preferred_languages: ['Tamil', 'Hindi'],
    preferred_genres: ['Emotion', 'Motivation', 'Family']
  });
  console.log(`✓ Created test user: ${user.name} (${user.email})`);

  // Test 2: NLP Mood Detector Service
  const sampleMoodInput = "I am feeling stressed and want to watch something positive.";
  const moodResult = analyzeMood(sampleMoodInput);
  console.log('✓ NLP Mood Detector Output:', JSON.stringify(moodResult, null, 2));

  if (moodResult.detected_mood !== 'Stressed' && moodResult.detected_mood !== 'Happy') {
    throw new Error('Mood detection failed to recognize stressed/positive input');
  }

  // Test 3: Activity Tracking (Search, Like, Watch Later, Watch History)
  const jailerMovie = await Movie.findOne({ title: 'Jailer' });
  const threeIdiotsMovie = await Movie.findOne({ title: '3 Idiots' });

  // Record searches
  await SearchHistory.create({ user_id: user._id, search_query: 'Tamil family movies' });
  await SearchHistory.create({ user_id: user._id, search_query: 'Rajinikanth' });

  // Like movie
  await Like.create({ user_id: user._id, movie_id: jailerMovie._id });
  await Movie.findByIdAndUpdate(jailerMovie._id, { $inc: { likes_count: 1 } });

  // Add Watch Later
  await WatchLater.create({ user_id: user._id, movie_id: threeIdiotsMovie._id });

  // Watch History progress
  await WatchHistory.create({
    user_id: user._id,
    movie_id: jailerMovie._id,
    last_position: 450,
    completion_percentage: 45
  });

  console.log('✓ Activity tracking recorded: Searches, Likes, Watch Later & Watch Progress.');

  // Test 4: Personalized Recommendation Engine
  const recommendations = await getPersonalizedRecommendations(user._id, 5);
  console.log('✓ Recommended Movies For You:', recommendations.map(m => `${m.title} (${m.language} - ${m.genres.join(', ')})`));

  // Test 5: User Preference Stats
  const stats = await getUserPreferenceStats(user._id);
  console.log('✓ Preference Stats Dashboard:', JSON.stringify(stats, null, 2));

  await mongoose.connection.close();
  await mongod.stop();

  console.log('--- ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ---');
}

runVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
