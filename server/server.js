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
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/mood', recommendationRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'Personalized Movie Streaming API' });
});

async function startServer() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri) {
      await mongoose.connect(mongoUri);
      console.log('Connected to MongoDB via URI');
    } else {
      console.log('No MONGODB_URI found. Starting embedded MongoMemoryServer...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('Connected to In-Memory MongoDB Server!');
    }

    // Auto-seed if movie collection is empty
    const movieCount = await Movie.countDocuments();
    if (movieCount === 0) {
      console.log('Movie collection empty. Seeding initial movie catalog...');
      await Movie.insertMany(seedData);
      console.log(`Seeded ${seedData.length} movies!`);
    }

    app.listen(PORT, () => {
      console.log(`Backend server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();
