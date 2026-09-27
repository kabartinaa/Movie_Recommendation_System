import React, { useState } from 'react';
import { Sparkles, Smile, Frown, Zap, Heart, Compass, Send, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { MovieCard } from './MovieCard';

const SAMPLE_PROMPTS = [
  "I am feeling stressed and want to watch something positive.",
  "I am feeling low and need motivation.",
  "Want a heartwarming Tamil family movie with lots of emotion.",
  "Feeling nostalgic and looking for a classic Hindi feel-good story."
];

export const MoodDetector = ({ onPlay, onSelect, openAuthModal }) => {
  const [moodText, setMoodText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async (textToSubmit) => {
    const text = textToSubmit || moodText;
    if (!text || text.trim() === '') return;

    setLoading(true);
    try {
      const res = await axios.post('/api/mood/detect', { mood_text: text });
      setResult(res.data);
    } catch (err) {
      console.error('Error analyzing mood:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptClick = (prompt) => {
    setMoodText(prompt);
    handleAnalyze(prompt);
  };

  return (
    <div className="bg-gradient-to-r from-[#171b2d] via-[#1a1429] to-[#1e1728] border border-[#2b304c] rounded-3xl p-6 md:p-8 shadow-2xl my-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-rose-500 to-purple-600 text-white shadow-lg">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              AI Mood Detector
            </h2>
            <p className="text-sm text-gray-300">
              Describe how you feel right now in natural language, and let our system find the perfect movie for your emotional state.
            </p>
          </div>
        </div>

        {/* Input Box */}
        <div className="mt-6 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <input 
              type="text"
              value={moodText}
              onChange={(e) => setMoodText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder='e.g. "I am feeling stressed and want to watch something positive."'
              className="w-full px-5 py-4 rounded-2xl bg-[#0e111a] border border-[#2e344e] text-white placeholder-gray-400 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all text-base"
            />
          </div>
          <button 
            onClick={() => handleAnalyze()}
            disabled={loading || !moodText.trim()}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/30 transition-all hover:scale-[1.02] active:scale-95"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Detect Mood</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Sample Prompt Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400 font-medium mr-1">Try asking:</span>
          {SAMPLE_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handlePromptClick(prompt)}
              className="px-3 py-1.5 rounded-xl bg-[#141826] hover:bg-[#20263b] border border-[#2b3046] text-xs text-gray-300 transition-colors text-left"
            >
              "{prompt}"
            </button>
          ))}
        </div>

        {/* Results display */}
        {result && (
          <div className="mt-8 pt-6 border-t border-[#2b304c]/60 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 bg-[#0f121c] p-4 rounded-2xl border border-[#23273c]">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-gray-400">Detected Mood State:</span>
                  <span className="px-3 py-1 text-sm font-extrabold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    {result.mood_analysis.detected_mood}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mt-1">
                  {result.mood_analysis.explanation}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {result.mood_analysis.mapped_genres.map((g, i) => (
                  <span key={i} className="px-3 py-1 text-xs font-semibold rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {g}
                  </span>
                ))}
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-4">
              Mood-Matched Recommendations ({result.recommended_movies.length})
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {result.recommended_movies.map((movie) => (
                <MovieCard
                  key={movie._id}
                  movie={movie}
                  onPlay={onPlay}
                  onSelect={onSelect}
                  openAuthModal={openAuthModal}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
