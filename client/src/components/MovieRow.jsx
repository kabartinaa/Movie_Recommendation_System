import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MovieCard } from './MovieCard';

export const MovieRow = ({ title, icon: Icon, movies = [], onPlay, onSelect, openAuthModal, subtitle }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="my-8 relative group/row">
      <div className="flex items-center justify-between px-4 md:px-8 mb-3">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center space-x-2 tracking-tight">
            {Icon && <Icon className="w-6 h-6 text-rose-500" />}
            <span>{title}</span>
          </h2>
          {subtitle && <p className="text-xs md:text-sm text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/70 text-white backdrop-blur-md opacity-0 group-hover/row:opacity-100 hover:bg-rose-600 transition-all shadow-xl"
        title="Scroll Left"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button 
        onClick={() => scroll('right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/70 text-white backdrop-blur-md opacity-0 group-hover/row:opacity-100 hover:bg-rose-600 transition-all shadow-xl"
        title="Scroll Right"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Scrollable Container */}
      <div 
        ref={rowRef}
        className="flex space-x-4 md:space-x-6 overflow-x-auto no-scrollbar px-4 md:px-8 py-3 scroll-smooth"
      >
        {movies.map((movie) => (
          <MovieCard
            key={movie._id || movie.id}
            movie={movie}
            onPlay={onPlay}
            onSelect={onSelect}
            openAuthModal={openAuthModal}
          />
        ))}
      </div>
    </div>
  );
};
