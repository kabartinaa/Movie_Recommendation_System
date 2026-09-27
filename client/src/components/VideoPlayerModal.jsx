import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Play, Search, Youtube, Heart, Bookmark } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export const VideoPlayerModal = ({ movie, onClose }) => {
  const { user, likedMovies, watchLaterMovies, toggleLikeMovie, toggleWatchLaterMovie } = useAuth();
  
  const isLiked = likedMovies.includes(movie._id);
  const isWatchLater = watchLaterMovies.includes(movie._id);

  const [ytData, setYtData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Exact search query: e.g. "Varisu 2023 Tamil full movie"
  const searchQuery = `${movie.title} ${movie.release_year || ''} ${movie.language || ''} full movie`.replace(/\s+/g, ' ').trim();
  const directYoutubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;

  useEffect(() => {
    const fetchYtResults = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/movies/youtube-search', {
          params: {
            title: movie.title,
            year: movie.release_year,
            language: movie.language
          }
        });
        setYtData(res.data);
      } catch (err) {
        console.error('Error fetching YouTube results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchYtResults();
  }, [movie]);

  const handleOpenMainYouTube = () => {
    const targetUrl = ytData?.search_url || directYoutubeSearchUrl;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenResultLink = (watchUrl) => {
    window.open(watchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fadeIn p-4 md:p-6">
      <div 
        id="video-modal-container"
        className="relative w-full max-w-3xl bg-[#0e111a] rounded-3xl overflow-hidden border border-[#272c42] shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 bg-[#141724] border-b border-[#23283b] z-10">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-600 text-white">
              {movie.language}
            </span>
            <h2 className="text-xl font-extrabold text-white truncate max-w-md">
              {movie.title}
            </h2>
            <span className="text-xs text-gray-400 font-semibold">
              ({movie.release_year})
            </span>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-[#202538] hover:bg-rose-600 text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main YouTube Redirect Banner */}
          <div className="bg-gradient-to-r from-red-950/40 via-[#181a29] to-red-950/30 border border-red-500/30 rounded-3xl p-6 text-center relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-center space-x-2 text-red-500 mb-2">
              <Youtube className="w-8 h-8 fill-current" />
              <span className="font-extrabold text-lg text-white">Watch on YouTube</span>
            </div>

            <h3 className="text-2xl font-black text-white mb-1">
              {movie.title}
            </h3>
            <p className="text-xs font-semibold text-gray-300 mb-5">
              {movie.release_year} • {movie.language} Cinema • Runtime: {movie.duration}
            </p>

            <button
              onClick={handleOpenMainYouTube}
              className="px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-base inline-flex items-center space-x-3 shadow-xl shadow-red-600/40 hover:scale-105 transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>▶ Watch on YouTube</span>
              <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
            </button>

            <p className="text-[11px] text-gray-400 mt-4">
              Query: <span className="text-red-400 font-mono">"{searchQuery}"</span>
            </p>
          </div>

          {/* YouTube Matching Results List */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center space-x-2">
              <Search className="w-4 h-4 text-red-400" />
              <span>YouTube Results</span>
            </h4>

            {loading ? (
              <div className="py-8 text-center text-xs text-gray-400 animate-pulse">
                Searching YouTube for "{searchQuery}"...
              </div>
            ) : (
              <div className="space-y-3">
                {ytData?.results?.map((res, idx) => (
                  <div 
                    key={res.id || idx}
                    className="flex flex-col sm:flex-row items-center justify-between p-3.5 rounded-2xl bg-[#141724] border border-[#23283b] hover:border-red-500/40 transition-all gap-4"
                  >
                    <div className="flex items-center space-x-3.5 w-full sm:w-auto">
                      <div className="w-24 h-16 rounded-xl bg-gray-900 overflow-hidden flex-shrink-0 relative border border-[#262c42]">
                        <img 
                          src={res.thumbnail || movie.poster} 
                          alt={res.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Play className="w-5 h-5 text-white fill-current" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-bold text-white text-sm truncate max-w-sm">
                          {res.title}
                        </h5>
                        <p className="text-xs text-gray-400 mt-0.5 font-medium">
                          Channel: <span className="text-gray-300">{res.channel}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenResultLink(res.watch_url)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/40 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all flex-shrink-0"
                    >
                      <span>Watch on YouTube</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions (Like / Watch Later) */}
        <div className="p-4 bg-[#141724] border-t border-[#23283b] flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {movie.genres.join(', ')}
          </span>

          <div className="flex items-center space-x-3">
            {user && (
              <>
                <button
                  onClick={() => toggleLikeMovie(movie._id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isLiked ? 'bg-rose-600 text-white' : 'bg-[#202538] text-gray-300 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{isLiked ? 'Liked' : 'Like'}</span>
                </button>

                <button
                  onClick={() => toggleWatchLaterMovie(movie._id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isWatchLater ? 'bg-amber-500 text-black' : 'bg-[#202538] text-gray-300 hover:text-white'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isWatchLater ? 'fill-current' : ''}`} />
                  <span>{isWatchLater ? 'Saved' : 'Watch Later'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
