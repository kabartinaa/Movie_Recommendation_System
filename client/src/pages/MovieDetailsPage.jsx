import React, { useState, useEffect } from 'react';
import { Play, Heart, Bookmark, Star, ArrowLeft, Clock, Film, ExternalLink, Youtube } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export const MovieDetailsPage = ({ movie: initialMovie, onBack, onPlay, openAuthModal }) => {
  const { user, likedMovies, watchLaterMovies, toggleLikeMovie, toggleWatchLaterMovie } = useAuth();
  const [movieDetails, setMovieDetails] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [imgError, setImgError] = useState(false);

  const isLiked = initialMovie && likedMovies.includes(initialMovie._id);
  const isWatchLater = initialMovie && watchLaterMovies.includes(initialMovie._id);

  useEffect(() => {
    if (initialMovie && initialMovie._id) {
      axios.get(`/api/movies/${initialMovie._id}`)
        .then(res => {
          setMovieDetails(res.data.movie);
          setUserStatus(res.data.user_status);
        })
        .catch(err => console.error('Error fetching movie details:', err));
    }
  }, [initialMovie]);

  const movie = movieDetails || initialMovie;
  if (!movie) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 animate-fadeIn">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 px-4 py-2 rounded-full bg-[#161a29] border border-[#272e48] text-gray-300 hover:text-white mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-semibold">Back to Catalog</span>
      </button>

      {/* Main Details Card */}
      <div className="bg-[#121624] border border-[#272f48] rounded-3xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 p-6 md:p-8">
          {/* Poster Column */}
          <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-xl border border-[#252c42] bg-gradient-to-br from-rose-950/60 via-[#181d30] to-purple-950/60 flex items-center justify-center">
            {!imgError && movie.poster ? (
              <img 
                src={movie.poster} 
                alt={movie.title}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="p-6 text-center flex flex-col items-center justify-center">
                <div className="p-4 rounded-full bg-rose-600/20 text-rose-400 mb-3 border border-rose-500/30">
                  <Film className="w-12 h-12" />
                </div>
                <h3 className="font-extrabold text-white text-xl leading-tight mb-2">{movie.title}</h3>
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest">{movie.language} Cinema</span>
              </div>
            )}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-600 text-white font-extrabold text-xs">
              {movie.language}
            </div>
          </div>

          {/* Info Column */}
          <div className="md:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2 flex-wrap gap-y-1">
                <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-extrabold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{movie.rating} / 5</span>
                </div>
                <span className="text-sm font-semibold text-gray-400">{movie.release_year}</span>
                <span className="text-sm font-semibold text-gray-400">•</span>
                <span className="text-sm font-semibold text-gray-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {movie.duration}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
                {movie.title}
              </h1>

              {/* Genre Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((g, i) => (
                  <span key={i} className="px-3.5 py-1.5 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 font-semibold text-xs">
                    {g}
                  </span>
                ))}
              </div>

              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Synopsis</h3>
              <p className="text-gray-300 text-base leading-relaxed mb-6 font-medium">
                {movie.description}
              </p>

              {/* Cast */}
              {movie.cast && movie.cast.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Starring Cast</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.cast.map((actor, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-lg bg-[#1a2034] text-gray-200 text-xs font-semibold">
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Verified Watch Options */}
              {movie.watch_providers && movie.watch_providers.length > 0 && (
                <div className="mb-6 p-4 rounded-2xl bg-[#0f1322] border border-[#232a42]">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Official Licensed Streaming Platforms:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {movie.watch_providers.map((p, idx) => (
                      <a 
                        key={idx} 
                        href={p.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded-lg bg-[#1a2034] hover:bg-rose-600 text-gray-300 hover:text-white text-xs font-semibold flex items-center space-x-1 border border-[#28314e] transition-colors"
                      >
                        <span>{p.provider_name} ({p.type})</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#23293d]">
              <button 
                onClick={() => onPlay(movie, userStatus?.last_position || 0)}
                className="px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-base flex items-center space-x-2 shadow-xl shadow-red-600/30 transition-all hover:scale-105"
              >
                <Youtube className="w-6 h-6 fill-current" />
                <span>Watch Now</span>
              </button>

              <button 
                onClick={() => user ? toggleLikeMovie(movie._id) : openAuthModal()}
                className={`px-6 py-4 rounded-2xl font-bold text-sm flex items-center space-x-2 transition-all ${
                  isLiked 
                    ? 'bg-rose-600/20 text-rose-400 border border-rose-500/40' 
                    : 'bg-[#1a2034] text-gray-300 hover:text-white border border-[#272e48]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{isLiked ? 'Liked' : 'Like'}</span>
              </button>

              <button 
                onClick={() => user ? toggleWatchLaterMovie(movie._id) : openAuthModal()}
                className={`px-6 py-4 rounded-2xl font-bold text-sm flex items-center space-x-2 transition-all ${
                  isWatchLater 
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' 
                    : 'bg-[#1a2034] text-gray-300 hover:text-white border border-[#272e48]'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isWatchLater ? 'fill-current' : ''}`} />
                <span>{isWatchLater ? 'In Watch Later' : 'Add to Watch Later'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
