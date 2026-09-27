import React, { useState } from 'react';
import axios from 'axios';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { HomePage } from './pages/HomePage';
import { MovieDetailsPage } from './pages/MovieDetailsPage';
import { UserProfilePage } from './pages/UserProfilePage';

function logMovieDetails(movie) {
  if (!movie) return;
  const tmdbId = movie.tmdbId || movie.tmdb_id;
  const title = movie.title;
  const releaseDate = movie.releaseDate || movie.release_date || movie.release_year;
  const runtime = movie.runtime || movie.duration;
  const language = movie.language;
  const videoSource = movie.video_url || 'Unavailable';
  const streamingProviders = movie.watch_providers?.map(p => `${p.provider_name} (${p.type})`).join(', ') || 'None';

  console.log('--- Movie Selected ---');
  console.log('TMDB ID:', tmdbId);
  console.log('Title:', title);
  console.log('Release Date:', releaseDate);
  console.log('Runtime:', runtime);
  console.log('Language:', language);
  console.log('Video Source:', videoSource);
  console.log('Streaming Provider:', streamingProviders);
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'details', 'profile'
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeVideoMovie, setActiveVideoMovie] = useState(null);
  const [resumePosition, setResumePosition] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query) => {
    if (!query || query.trim() === '') {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setCurrentPage('home');
    setIsSearching(true);
    try {
      const res = await axios.get(`/api/movies/search?q=${encodeURIComponent(query)}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleSelectMovie = (movie) => {
    logMovieDetails(movie);
    setSelectedMovie(movie);
    setCurrentPage('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayMovie = (movie, position = 0) => {
    logMovieDetails(movie);
    setActiveVideoMovie(movie);
    setResumePosition(position);
  };

  const handleOpenMoodDetector = () => {
    setCurrentPage('home');
    setTimeout(() => {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#0b0d14] text-gray-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Navigation Header */}
      <Navbar 
        onSearch={handleSearch}
        openAuthModal={() => setShowAuthModal(true)}
        onOpenMoodDetector={handleOpenMoodDetector}
        onNavigateHome={() => { setCurrentPage('home'); setIsSearching(false); }}
        onNavigateProfile={() => { setCurrentPage('profile'); setIsSearching(false); }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage 
            onPlay={handlePlayMovie}
            onSelect={handleSelectMovie}
            openAuthModal={() => setShowAuthModal(true)}
            searchResults={searchResults}
            isSearching={isSearching}
          />
        )}

        {currentPage === 'details' && (
          <MovieDetailsPage 
            movie={selectedMovie}
            onBack={() => setCurrentPage('home')}
            onPlay={handlePlayMovie}
            openAuthModal={() => setShowAuthModal(true)}
          />
        )}

        {currentPage === 'profile' && (
          <UserProfilePage 
            onPlay={handlePlayMovie}
            onSelect={handleSelectMovie}
            openAuthModal={() => setShowAuthModal(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#08090f] border-t border-[#181d2c] py-8 text-center text-xs text-gray-400">
        <p>© 2026 CineMood Streaming Platform. Personalized Tamil, Hindi & Bollywood Cinema.</p>
      </footer>

      {/* Modals */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {activeVideoMovie && (
        <VideoPlayerModal 
          movie={activeVideoMovie}
          initialPosition={resumePosition}
          onClose={() => setActiveVideoMovie(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
