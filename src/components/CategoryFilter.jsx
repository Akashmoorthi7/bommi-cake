import React from 'react';
import { CAKE_CATEGORIES } from '../data/cakes';
import { playPopSound } from '../utils/sound';
import { Sparkles, Filter, Leaf } from 'lucide-react';

export const CategoryFilter = ({
  selectedCategory,
  onSelectCategory,
  egglessOnly,
  setEgglessOnly,
  sortBy,
  setSortBy,
}) => {
  return (
    <div className="bg-comic-cream py-6 border-b-3 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header with comic speech bubble */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎂</span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-comic tracking-wide text-black flex items-center gap-2">
                PICK YOUR FLAVOR REALM <Sparkles className="w-5 h-5 text-comic-red" />
              </h2>
              <p className="text-xs sm:text-sm font-bold text-gray-700">
                Browse our top comic superhero collections or filter by your favorite occasion!
              </p>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Eggless toggle */}
            <button
              onClick={() => {
                playPopSound();
                setEgglessOnly(!egglessOnly);
              }}
              className={`comic-badge px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs sm:text-sm font-bold cursor-pointer transition-all ${
                egglessOnly
                  ? 'bg-comic-green text-black border-2 border-black scale-105'
                  : 'bg-white text-gray-800 hover:bg-green-50'
              }`}
            >
              <Leaf className={`w-3.5 h-3.5 ${egglessOnly ? 'text-green-900 fill-green-800' : 'text-gray-500'}`} />
              <span>100% EGGLESS ONLY</span>
              {egglessOnly && <span className="bg-black text-white text-[10px] px-1 rounded">ON</span>}
            </button>

            {/* Sort by dropdown */}
            <div className="flex items-center bg-white border-2 border-black rounded-lg shadow-comic-sm px-2 py-1 text-xs sm:text-sm font-bold">
              <Filter className="w-3.5 h-3.5 mr-1.5 text-gray-600" />
              <select
                value={sortBy}
                onChange={(e) => {
                  playPopSound();
                  setSortBy(e.target.value);
                }}
                className="bg-transparent border-none outline-none font-bold cursor-pointer"
              >
                <option value="featured">Featured / Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated (★)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {CAKE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  playPopSound();
                  onSelectCategory(cat.id);
                }}
                className={`comic-btn px-4 py-2 rounded-xl text-sm sm:text-base font-comic whitespace-nowrap transition-transform duration-150 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-comic-red text-white -translate-y-1 shadow-comic-md'
                    : 'bg-white text-black hover:bg-comic-yellow'
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                <span>{cat.name}</span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-comic-yellow animate-ping ml-1" />
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
