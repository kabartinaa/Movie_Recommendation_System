import React, { useState, useEffect } from 'react';
import { User, Heart, Bookmark, History, Sparkles, Play, Clock, BarChart3, Settings } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MovieCard } from '../components/MovieCard';

export const UserProfilePage = ({ onPlay, onSelect, openAuthModal }) => {
  const { user, userStats, fetchProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('watchLater');
  const [watchLaterList, setWatchLaterList] = useState([]);
  const [likedList, setLikedList] = useState([]);
  const [watchHistoryList, setWatchHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadUserData = async () => {
      setLoading(true);
      try {
        await fetchProfile();

        const [wlRes, likedRes, historyRes] = await Promise.all([
          axios.get('/api/activity/watch-later/list'),
          axios.get('/api/activity/liked'),
          axios.get('/api/activity/watch-history')
        ]);

        setWatchLaterList(wlRes.data);
        setLikedList(likedRes.data);
        setWatchHistoryList(historyRes.data);
      } catch (err) {
        console.error('Error loading profile lists:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">User Login Required</h2>
        <p className="text-gray-400 mb-6">Sign in to view your activity tracking, preferences dashboard, and saved lists.</p>
        <button onClick={openAuthModal} className="px-6 py-3 rounded-full bg-rose-600 text-white font-bold">Sign In Now</button>
      </div>
    );
  }

  const langBreakdown = userStats?.language_breakdown || { Tamil: 50, Hindi: 30, Bollywood: 20 };
  const topGenres = userStats?.frequently_liked_genres || ['Family', 'Emotion', 'Motivation'];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-fadeIn">
      {/* User Header */}
      <div className="bg-gradient-to-r from-[#171b2e] via-[#1a1529] to-[#1e1729] border border-[#272f48] rounded-3xl p-6 md:p-8 shadow-2xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white">{user.name}</h1>
              <p className="text-xs md:text-sm text-gray-400">{user.email}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {user.preferred_languages?.map((lang, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-full bg-rose-600/20 text-rose-400 border border-rose-500/30 text-xs font-semibold">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Preference Analytics Box */}
          <div className="bg-[#0e111a] border border-[#242a3f] rounded-2xl p-4 min-w-[280px]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center space-x-1 mb-3">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>User Preference Profile</span>
            </h3>

            {/* Language Progress Bars */}
            <div className="space-y-2 mb-3">
              {Object.entries(langBreakdown).map(([lang, pct]) => (
                <div key={lang}>
                  <div className="flex justify-between text-xs text-gray-300 mb-1">
                    <span>{lang}</span>
                    <span className="font-bold">{pct}%</span>
                  </div>
                  <div className="w-full bg-[#181d2e] h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        lang === 'Tamil' ? 'bg-rose-500' : lang === 'Hindi' ? 'bg-purple-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#20263b] flex items-center justify-between text-xs">
              <span className="text-gray-400">Top Genres:</span>
              <span className="text-purple-300 font-bold">{topGenres.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-3 mb-6 border-b border-[#22283b] pb-3">
        <button
          onClick={() => setActiveTab('watchLater')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
            activeTab === 'watchLater'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
              : 'bg-[#141726] text-gray-400 hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4 fill-current" />
          <span>Watch Later ({watchLaterList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('liked')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
            activeTab === 'liked'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
              : 'bg-[#141726] text-gray-400 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4 fill-current" />
          <span>Liked Movies ({likedList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
            activeTab === 'history'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
              : 'bg-[#141726] text-gray-400 hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Watch History ({watchHistoryList.length})</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'watchLater' && (
        <div>
          {watchLaterList.length === 0 ? (
            <div className="text-center py-16 bg-[#121624] rounded-3xl border border-[#23293e]">
              <Bookmark className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">Your Watch Later list is currently empty.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {watchLaterList.map(movie => (
                <MovieCard key={movie._id} movie={movie} onPlay={onPlay} onSelect={onSelect} openAuthModal={openAuthModal} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'liked' && (
        <div>
          {likedList.length === 0 ? (
            <div className="text-center py-16 bg-[#121624] rounded-3xl border border-[#23293e]">
              <Heart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">You haven't liked any movies yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {likedList.map(movie => (
                <MovieCard key={movie._id} movie={movie} onPlay={onPlay} onSelect={onSelect} openAuthModal={openAuthModal} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          {watchHistoryList.length === 0 ? (
            <div className="text-center py-16 bg-[#121624] rounded-3xl border border-[#23293e]">
              <History className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No watch history recorded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {watchHistoryList.map(item => {
                if (!item.movie_id) return null;
                const m = item.movie_id;
                return (
                  <div key={item._id} className="bg-[#121624] border border-[#252c42] rounded-2xl p-4 flex gap-4 items-center">
                    <img src={m.poster} alt={m.title} className="w-20 h-28 object-cover rounded-xl flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-600/80 text-white">{m.language}</span>
                      <h4 className="font-bold text-white text-base truncate mt-1">{m.title}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{item.completion_percentage}% watched</p>
                      
                      {/* Progress bar */}
                      <div className="w-full bg-[#1b2238] h-1.5 rounded-full overflow-hidden my-2">
                        <div className="bg-rose-500 h-full rounded-full" style={{ width: `${item.completion_percentage}%` }} />
                      </div>

                      <button 
                        onClick={() => onPlay(m, item.last_position)}
                        className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center space-x-1"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Resume Playback</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
