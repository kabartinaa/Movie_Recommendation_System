import React, { useState } from 'react';
import { Play, Heart, Bookmark, Star, Film } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const MovieCard = ({ movie, onPlay, onSelect, openAuthModal }) => {
  const { user, likedMovies, watchLaterMovies, toggleLikeMovie, toggleWatchLaterMovie } = useAuth();
  const [imgError, setImgError] = useState(false);

  const isLiked = likedMovies.includes(movie._id);
  const isWatchLater = watchLaterMovies.includes(movie._id);

  const handleLike = (e) => {
    e.stopPropagation();
    if (!user) {
      openAuthModal();
      return;
    }
    toggleLikeMovie(movie._id);
  };

  const handleWatchLater = (e) => {
    e.stopPropagation();
    if (!user) {
      openAuthModal();
      return;
    }
    toggleWatchLaterMovie(movie._id);
  };

  return (
    <div 
      onClick={() => onSelect && onSelect(movie)}
      className="group relative flex-shrink-0 w-52 md:w-60 bg-[#141724] border border-[#23273b] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-rose-500/50 transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer"
    >
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-gradient-to-b from-[#1c2236] to-[#0e111a] flex items-center justify-center">
        {!imgError && movie.poster ? (
          <img 
            src={movie.poster} 
            alt={movie.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          /* Fallback Poster Banner if Image Fails to Load */
          <div className="w-full h-full p-4 flex flex-col items-center justify-center text-center bg-gradient-to-br from-rose-950/60 via-[#181d30] to-purple-950/60">
            <div className="p-3 rounded-full bg-rose-600/20 text-rose-400 mb-2 border border-rose-500/30">
              <Film className="w-8 h-8" />
            </div>
            <h4 className="font-extrabold text-white text-base leading-tight line-clamp-3 mb-1">
              {movie.title}
            </h4>
            <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">
              {movie.language} Cinema
            </span>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141724] via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-600/90 text-white backdrop-blur-md shadow">
            {movie.language}
          </span>
          <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-black/60 text-amber-400 text-xs font-bold backdrop-blur-md">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{movie.rating}</span>
          </div>
        </div>

        {/* Hover Action Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button 
            onClick={(e) => { e.stopPropagation(); onPlay(movie); }}
            className="p-4 rounded-full bg-rose-600 text-white shadow-xl shadow-rose-600/40 hover:scale-110 hover:bg-rose-500 transition-all duration-200"
            title="Play Movie"
          >
            <Play className="w-6 h-6 fill-current translate-x-0.5" />
          </button>
        </div>

        {/* Quick Action Buttons */}
        <div className="absolute bottom-3 right-3 flex items-center space-x-2 z-10">
          <button 
            onClick={handleLike}
            className={`p-2 rounded-full backdrop-blur-md transition-colors ${
              isLiked 
                ? 'bg-rose-600 text-white' 
                : 'bg-black/50 text-gray-300 hover:text-white hover:bg-black/80'
            }`}
            title={isLiked ? "Unlike" : "Like Movie"}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button 
            onClick={handleWatchLater}
            className={`p-2 rounded-full backdrop-blur-md transition-colors ${
              isWatchLater 
                ? 'bg-amber-500 text-black' 
                : 'bg-black/50 text-gray-300 hover:text-white hover:bg-black/80'
            }`}
            title={isWatchLater ? "Remove from Watch Later" : "Save for Watch Later"}
          >
            <Bookmark className={`w-4 h-4 ${isWatchLater ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Details Footer */}
      <div className="p-3.5">
        <h3 className="font-bold text-white text-base truncate group-hover:text-rose-400 transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between mt-1 text-xs text-gray-400">
          <span>{movie.release_year}</span>
          <span>{movie.duration}</span>
        </div>

        {/* Genre Tags */}
        <div className="flex flex-wrap gap-1 mt-2.5">
          {movie.genres.slice(0, 2).map((genre, idx) => (
            <span key={idx} className="px-2 py-0.5 text-[10px] rounded-md bg-[#1f2436] text-gray-300 font-medium">
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
