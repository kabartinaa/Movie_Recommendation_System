/**
 * NLP Mood Classifier Service
 * Analyzes natural language mood input and maps emotional state to target movie genres & languages.
 */

const MOOD_MAP = {
  Stressed: {
    keywords: ['stressed', 'stress', 'tense', 'overwhelmed', 'tired', 'burnt out', 'exhausted', 'pressure', 'hard day', 'hectic', 'positive', 'relax'],
    genres: ['Feel-good', 'Family', 'Motivation'],
    description: 'Relieve stress with uplifting, feel-good family and motivational content.'
  },
  Sad: {
    keywords: ['sad', 'depressed', 'down', 'feeling low', 'unhappy', 'cry', 'grief', 'heartbroken', 'gloomy', 'cheer me up', 'better'],
    genres: ['Feel-good', 'Inspirational', 'Emotion'],
    description: 'Heartwarming feel-good and inspirational movies to brighten your spirits.'
  },
  Motivated: {
    keywords: ['motivated', 'inspire', 'inspiration', 'ambition', 'goals', 'drive', 'focus', 'work hard', 'energy', 'win', 'champion', 'success'],
    genres: ['Motivation', 'Inspirational'],
    description: 'High-energy motivational and inspirational cinema to fire up your drive.'
  },
  Emotional: {
    keywords: ['emotional', 'touching', 'moving', 'tears', 'heartfelt', 'feelings', 'deep', 'love', 'relationship', 'bond', 'soul'],
    genres: ['Emotion', 'Family'],
    description: 'Deeply moving and emotional stories that touch the heart.'
  },
  Relaxed: {
    keywords: ['relaxed', 'chill', 'calm', 'peaceful', 'cozy', 'light', 'easy', 'lazy', 'weekend', 'unwind'],
    genres: ['Feel-good', 'Family'],
    description: 'Cozy, lighthearted feel-good movies for a peaceful relaxation.'
  },
  Lonely: {
    keywords: ['lonely', 'alone', 'miss', 'missing', 'home', 'longing', 'comfort', 'warmth', 'friendship', 'together'],
    genres: ['Family', 'Feel-good', 'Emotion'],
    description: 'Warm family and feel-good cinema that brings comfort and togetherness.'
  },
  Excited: {
    keywords: ['excited', 'thrilled', 'hype', 'pumped', 'awesome', 'fun', 'great', 'action-packed', 'celebrate'],
    genres: ['Motivation', 'Inspirational', 'Feel-good'],
    description: 'Upbeat inspirational and motivational cinema to match your high energy.'
  },
  Nostalgic: {
    keywords: ['nostalgic', 'old days', 'memories', 'retro', 'past', 'childhood', 'classics', 'reminisce', 'vintage'],
    genres: ['Family', 'Emotion'],
    description: 'Classic emotional and family cinema evoking rich nostalgic warmth.'
  },
  'Family-oriented': {
    keywords: ['family', 'kids', 'parents', 'relatives', 'togetherness', 'home', 'values', 'father', 'mother', 'brother', 'sister'],
    genres: ['Family', 'Feel-good', 'Emotion'],
    description: 'Wholesome family cinema full of warmth, humor, and heart.'
  },
  Happy: {
    keywords: ['happy', 'joy', 'smile', 'laugh', 'good mood', 'cheerful', 'delighted', 'content', 'vibe'],
    genres: ['Feel-good', 'Motivation'],
    description: 'Joyful feel-good movies to double your happiness.'
  }
};

const LANGUAGE_KEYWORDS = {
  Tamil: ['tamil', 'kollywood', 'rajini', 'rajinikanth', 'vijay', 'thalapathy', 'ajith', 'kamal', 'suriya', 'dhanush', 'chennai'],
  Hindi: ['hindi', 'bollywood', 'srk', 'shah rukh', 'aamir', 'salman', 'ranbir', 'hrithik', 'mumbai'],
  Bollywood: ['bollywood', 'b-town', 'blockbuster']
};

function analyzeMood(text) {
  if (!text || typeof text !== 'string') {
    return {
      detected_mood: 'Feel-good',
      mapped_genres: ['Feel-good', 'Family'],
      explanation: 'Showing popular feel-good movies.',
      detected_languages: []
    };
  }

  const cleanText = text.toLowerCase();

  // Score each mood
  const scores = {};
  for (const [mood, data] of Object.entries(MOOD_MAP)) {
    let score = 0;
    for (const kw of data.keywords) {
      if (cleanText.includes(kw)) {
        score += kw.length > 5 ? 2 : 1;
      }
    }
    scores[mood] = score;
  }

  // Find top scoring mood
  let bestMood = 'Relaxed';
  let maxScore = 0;
  for (const [mood, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestMood = mood;
    }
  }

  // Fallback check if user explicitly mentions motivation / stress / family in raw text
  if (maxScore === 0) {
    if (cleanText.includes('motivat') || cleanText.includes('inspirational') || cleanText.includes('positive')) {
      bestMood = 'Motivated';
    } else if (cleanText.includes('sad') || cleanText.includes('cry') || cleanText.includes('low')) {
      bestMood = 'Sad';
    } else if (cleanText.includes('family') || cleanText.includes('parents')) {
      bestMood = 'Family-oriented';
    } else if (cleanText.includes('stress') || cleanText.includes('tired')) {
      bestMood = 'Stressed';
    }
  }

  const moodData = MOOD_MAP[bestMood] || MOOD_MAP['Relaxed'];

  // Check language mentions
  const detectedLanguages = [];
  for (const [lang, keywords] of Object.entries(LANGUAGE_KEYWORDS)) {
    if (keywords.some(kw => cleanText.includes(kw))) {
      detectedLanguages.push(lang);
    }
  }

  return {
    detected_mood: bestMood,
    mapped_genres: moodData.genres,
    explanation: moodData.description,
    detected_languages: detectedLanguages
  };
}

module.exports = { analyzeMood, MOOD_MAP };
