import React, { useState, useEffect } from 'react';
import { Flame, Heart, Zap, Users, Sparkles, Play, Info, Star } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MovieCard } from '../components/MovieCard';
import { MovieRow } from '../components/MovieRow';
import { MoodDetector } from '../components/MoodDetector';

export const HomePage = ({ onPlay, onSelect, openAuthModal, searchResults, isSearching }) => {
  const { user } = useAuth();
  const [feed, setFeed] = useState({
    trending: [],
    emotional: [],
    motivational: [],
    family: [],
    tamil: [],
    hindi: [],
    bollywood: []
  });
  const [personalized, setPersonalized] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await axios.get('/api/movies/home-feed');
        setFeed(res.data);
        if (res.data.trending && res.data.trending.length > 0) {
          setFeaturedMovie(res.data.trending[0]);
        }
      } catch (err) {
        console.error('Error fetching home feed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  useEffect(() => {
    if (user) {
      axios.get('/api/recommendations/personalized')
        .then(res => setPersonalized(res.data))
        .catch(err => console.error('Error fetching personalized recommendations:', err));
    } else {
      setPersonalized([]);
    }
  }, [user]);

  if (isSearching) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          Search Results ({searchResults.length})
        </h2>
        {searchResults.length === 0 ? (
          <div className="text-center py-16 bg-[#121524] rounded-3xl border border-[#23283c]">
            <p className="text-gray-400">No movies found matching your search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {searchResults.map((movie) => (
              <MovieCard key={movie._id} movie={movie} onPlay={onPlay} onSelect={onSelect} openAuthModal={openAuthModal} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="pb-16">
      {/* Featured Hero Banner */}
      {featuredMovie && (
        <div className="relative w-full min-h-[380px] md:min-h-[460px] flex flex-col justify-end p-6 md:p-12 overflow-hidden bg-black mb-6">
          <img 
            src={featuredMovie.poster} 
            alt={featuredMovie.title}
            className="absolute inset-0 w-full h-full object-cover object-top opacity-40 filter blur-[1px] scale-105"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d14] via-[#0b0d14]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0d14] via-[#0b0d14]/80 to-transparent" />

          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center space-x-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-extrabold text-xs tracking-wider uppercase">
                {featuredMovie.language} Blockbuster
              </span>
              <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-black/60 text-amber-400 text-xs font-bold backdrop-blur-md">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{featuredMovie.rating}</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none mb-3">
              {featuredMovie.title}
            </h1>

            <p className="text-sm md:text-base text-gray-300 line-clamp-3 mb-6 font-medium">
              {featuredMovie.description}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => onPlay(featuredMovie)}
                className="px-8 py-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm md:text-base flex items-center space-x-2 shadow-xl shadow-rose-600/40 transition-all hover:scale-105"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Watch Now</span>
              </button>

              <button 
                onClick={() => onSelect(featuredMovie)}
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm md:text-base flex items-center space-x-2 backdrop-blur-md transition-all"
              >
                <Info className="w-5 h-5" />
                <span>More Details</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Mood Detector Highlight Section */}
        <div className="px-4 md:px-8">
          <MoodDetector onPlay={onPlay} onSelect={onSelect} openAuthModal={openAuthModal} />
        </div>

        {/* Personalized "For You" Feed if logged in */}
        {user && personalized.length > 0 && (
          <MovieRow 
            title="For You — Recommended"
            subtitle="Calculated from your searches, likes, watch history, and preferences"
            icon={Sparkles}
            movies={personalized}
            onPlay={onPlay}
            onSelect={onSelect}
            openAuthModal={openAuthModal}
          />
        )}

        {/* 🔥 Trending Now */}
        <MovieRow 
          title="Trending Now"
          subtitle="Top streamed movies across Tamil, Hindi & Bollywood"
          icon={Flame}
          movies={feed.trending}
          onPlay={onPlay}
          onSelect={onSelect}
          openAuthModal={openAuthModal}
        />

        {/* ❤️ Emotional Movies */}
        <MovieRow 
          title="Emotional Movies"
          subtitle="Heartwarming sagas and deep emotional storytelling"
          icon={Heart}
          movies={feed.emotional}
          onPlay={onPlay}
          onSelect={onSelect}
          openAuthModal={openAuthModal}
        />

        {/* 💪 Motivational Movies */}
        <MovieRow 
          title="Motivational Cinema"
          subtitle="High-energy journeys of perseverance and triumph"
          icon={Zap}
          movies={feed.motivational}
          onPlay={onPlay}
          onSelect={onSelect}
          openAuthModal={openAuthModal}
        />

        {/* 👨‍👩‍👧 Family Movies */}
        <MovieRow 
          title="Family Movies"
          subtitle="Wholesome feel-good films to enjoy with your loved ones"
          icon={Users}
          movies={feed.family}
          onPlay={onPlay}
          onSelect={onSelect}
          openAuthModal={openAuthModal}
        />

        {/* Tamil Movies */}
        <MovieRow 
          title="Tamil Cinema"
          subtitle="Top rated Tamil blockbusters and emotional dramas"
          movies={feed.tamil}
          onPlay={onPlay}
          onSelect={onSelect}
          openAuthModal={openAuthModal}
        />

        {/* Hindi & Bollywood */}
        <MovieRow 
          title="Hindi & Bollywood Cinema"
          subtitle="Popular Bollywood hits, inspirational true stories, and feel-good gems"
          movies={feed.bollywood.concat(feed.hindi)}
          onPlay={onPlay}
          onSelect={onSelect}
          openAuthModal={openAuthModal}
        />
      </div>
    </div>
  );
};
