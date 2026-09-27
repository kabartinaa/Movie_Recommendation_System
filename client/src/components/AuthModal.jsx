import React, { useState } from 'react';
import { X, Film, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LANGUAGES = ['Tamil', 'Hindi', 'Bollywood'];
const GENRES = ['Emotion', 'Motivation', 'Family', 'Inspirational', 'Feel-good'];

export const AuthModal = ({ onClose }) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedLangs, setSelectedLangs] = useState(['Tamil', 'Hindi', 'Bollywood']);
  const [selectedGenres, setSelectedGenres] = useState(['Emotion', 'Motivation', 'Family', 'Feel-good']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleLang = (lang) => {
    setSelectedLangs(prev => 
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password, selectedLangs, selectedGenres);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#121624] border border-[#272f48] rounded-3xl p-6 md:p-8 shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#1e2438] text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-rose-600 to-purple-600 text-white shadow-lg">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-xs text-gray-400">
              {isLogin ? 'Sign in to access personalized movie feeds' : 'Tailor your regional & emotional preferences'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
              <input 
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-4 py-3 rounded-xl bg-[#0b0e17] border border-[#252c42] text-sm text-white focus:outline-none focus:border-rose-500 transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-4 py-3 rounded-xl bg-[#0b0e17] border border-[#252c42] text-sm text-white focus:outline-none focus:border-rose-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-[#0b0e17] border border-[#252c42] text-sm text-white focus:outline-none focus:border-rose-500 transition-all"
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">Preferred Languages</label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLang(lang)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 border transition-all ${
                        selectedLangs.includes(lang)
                          ? 'bg-rose-600/20 text-rose-400 border-rose-500/40'
                          : 'bg-[#0b0e17] text-gray-400 border-[#252c42]'
                      }`}
                    >
                      {selectedLangs.includes(lang) && <Check className="w-3.5 h-3.5" />}
                      <span>{lang}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">Preferred Genres</label>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map(genre => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 border transition-all ${
                        selectedGenres.includes(genre)
                          ? 'bg-purple-600/20 text-purple-400 border-purple-500/40'
                          : 'bg-[#0b0e17] text-gray-400 border-[#252c42]'
                      }`}
                    >
                      {selectedGenres.includes(genre) && <Check className="w-3.5 h-3.5" />}
                      <span>{genre}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all hover:scale-[1.01]"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          {isLogin ? "Don't have an account?" : "Already registered?"}{' '}
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-rose-400 font-bold hover:underline ml-1"
          >
            {isLogin ? 'Register now' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};
