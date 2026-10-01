const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const activityRoutes = require('./routes/activityRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const Movie = require('./models/Movie');
const { movies: seedData } = require('./seed');

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/mood', recommendationRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Personalized Movie Streaming API'
  });
});

// MongoDB connection
let isConnected = false;

async function connectDB() {
  if (isConnected) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured');
  }

  await mongoose.connect(mongoUri);
  isConnected = true;

  console.log('Connected to MongoDB');

  // Seed movies only when collection is empty
  const movieCount = await Movie.countDocuments();

  if (movieCount === 0) {
    console.log('Movie collection empty. Seeding initial movie catalog...');
    await Movie.insertMany(seedData);
    console.log(`Seeded ${seedData.length} movies!`);
  }
}

// Connect database before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({
      error: 'Database connection failed'
    });
  }
});

// Local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;

  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Backend server running on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Failed to start server:', error);
    });
}

module.exports = app;