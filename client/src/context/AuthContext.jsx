import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('cinema_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('cinema_token') || null);
  const [userStats, setUserStats] = useState(null);
  const [likedMovies, setLikedMovies] = useState([]);
  const [watchLaterMovies, setWatchLaterMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Set default axios header
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  const fetchProfile = async () => {
    if (!token) return;
    try {
      const res = await axios.get('/api/auth/profile');
      setUser(res.data.user);
      setUserStats(res.data.preference_stats);
      localStorage.setItem('cinema_user', JSON.stringify(res.data.user));

      // Fetch likes & watch later
      const likedRes = await axios.get('/api/activity/liked');
      setLikedMovies(likedRes.data.map(m => m._id));

      const wlRes = await axios.get('/api/activity/watch-later/list');
      setWatchLaterMovies(wlRes.data.map(m => m._id));
    } catch (err) {
      console.error('Error fetching profile:', err);
      if (err.response && err.response.status === 401) {
        logout();
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    const { token: authToken, user: userData } = res.data;
    setToken(authToken);
    setUser(userData);
    localStorage.setItem('cinema_token', authToken);
    localStorage.setItem('cinema_user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    return userData;
  };

  const register = async (name, email, password, preferred_languages, preferred_genres) => {
    const res = await axios.post('/api/auth/register', {
      name,
      email,
      password,
      preferred_languages,
      preferred_genres
    });
    const { token: authToken, user: userData } = res.data;
    setToken(authToken);
    setUser(userData);
    localStorage.setItem('cinema_token', authToken);
    localStorage.setItem('cinema_user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    return userData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setUserStats(null);
    setLikedMovies([]);
    setWatchLaterMovies([]);
    localStorage.removeItem('cinema_token');
    localStorage.removeItem('cinema_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const toggleLikeMovie = async (movieId) => {
    if (!token) return false;
    const res = await axios.post('/api/activity/like', { movieId });
    if (res.data.is_liked) {
      setLikedMovies(prev => [...prev, movieId]);
    } else {
      setLikedMovies(prev => prev.filter(id => id !== movieId));
    }
    fetchProfile(); // refresh preference stats
    return res.data.is_liked;
  };

  const toggleWatchLaterMovie = async (movieId) => {
    if (!token) return false;
    const res = await axios.post('/api/activity/watch-later', { movieId });
    if (res.data.is_watch_later) {
      setWatchLaterMovies(prev => [...prev, movieId]);
    } else {
      setWatchLaterMovies(prev => prev.filter(id => id !== movieId));
    }
    fetchProfile();
    return res.data.is_watch_later;
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      userStats,
      likedMovies,
      watchLaterMovies,
      login,
      register,
      logout,
      fetchProfile,
      toggleLikeMovie,
      toggleWatchLaterMovie
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
