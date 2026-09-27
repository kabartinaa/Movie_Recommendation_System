import React, { useState } from 'react';
import { Film, Search, Sparkles, User, LogOut, Heart, Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onSearch, openAuthModal, onOpenMoodDetector, onNavigateHome, onNavigateProfile }) => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    onSearch(val);
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#0b0d14]/95 backdrop-blur-xl border-b border-[#1c2132]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div 
          onClick={onNavigateHome}
          className="flex items-center space-x-3 cursor-pointer group flex-shrink-0"
        >
          <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-600 to-purple-600 text-white shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg md:text-xl font-black tracking-tight text-white group-hover:text-rose-400 transition-colors">
              Cine<span className="text-rose-600">Mood</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-semibold text-gray-400 ml-2 px-2 py-0.5 rounded-full bg-[#181d2e] border border-[#272f48]">
              Tamil • Hindi • Bollywood
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-2 sm:mx-6 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search Tamil, Hindi, Bollywood, actors..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-[#141826] border border-[#252c42] text-xs md:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <button 
            onClick={onOpenMoodDetector}
            className="hidden sm:flex items-center space-x-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-rose-600/20 hover:from-purple-600/30 hover:to-rose-600/30 border border-purple-500/30 text-purple-300 font-semibold text-xs transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Mood Detector</span>
          </button>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 p-1 pr-3 rounded-full bg-[#161a29] border border-[#282f49] hover:border-rose-500/50 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden md:inline-block text-xs font-semibold text-white max-w-[100px] truncate">
                  {user.name}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div 
                  className="absolute right-0 mt-3 w-56 bg-[#121624] border border-[#272f48] rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn"
                  onClick={() => setShowDropdown(false)}
                >
                  <div className="px-3 py-2 border-b border-[#20273d] mb-1">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                  </div>

                  <button 
                    onClick={onNavigateProfile}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-300 hover:bg-[#1d2338] hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4 text-rose-400" />
                    <span>User Profile & Stats</span>
                  </button>

                  <button 
                    onClick={onNavigateProfile}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-300 hover:bg-[#1d2338] hover:text-white transition-colors"
                  >
                    <Bookmark className="w-4 h-4 text-amber-400" />
                    <span>Watch Later List</span>
                  </button>

                  <button 
                    onClick={onNavigateProfile}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-300 hover:bg-[#1d2338] hover:text-white transition-colors"
                  >
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>Liked Movies</span>
                  </button>

                  <div className="border-t border-[#20273d] my-1" />

                  <button 
                    onClick={logout}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={openAuthModal}
              className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs md:text-sm shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
