import React from 'react';
import { CakeCard } from './CakeCard';
import { Sparkles } from 'lucide-react';
import { playPopSound } from '../utils/sound';

export const CakeGrid = ({
  cakes,
  selectedCategory,
  searchQuery,
  onSelectCake,
  onQuickOrder,
  onResetFilters
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Title & Count */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-4xl font-comic text-black flex items-center gap-2">
            <span>{searchQuery ? `SEARCH RESULTS FOR "${searchQuery.toUpperCase()}"` : 'EXPLORE ALL COMIC CAKES'}</span>
            <Sparkles className="w-6 h-6 text-comic-red" />
          </h2>
          <p className="text-xs sm:text-sm font-bold text-gray-700">
            Showing <strong className="text-comic-red">{cakes.length}</strong> super fresh cakes ready for your superhero celebration!
          </p>
        </div>
      </div>

      {/* Grid or Empty State */}
      {cakes.length === 0 ? (
        <div className="comic-box rounded-2xl p-10 text-center max-w-lg mx-auto my-12 bg-white space-y-4">
          <div className="text-6xl animate-bounce">🎂🔍</div>
          <h3 className="font-comic text-2xl text-black">NO SUPER CAKES FOUND!</h3>
          <p className="text-sm font-bold text-gray-600">
            Holy frosting! We couldn't find any cakes matching your filters or search keywords.
          </p>
          <button
            onClick={() => { playPopSound(); onResetFilters(); }}
            className="comic-btn bg-comic-red text-white px-6 py-2.5 rounded-xl text-base"
          >
            RESET ALL FILTERS!
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cakes.map((cake) => (
            <CakeCard
              key={cake.id}
              cake={cake}
              onSelectCake={onSelectCake}
              onQuickOrder={onQuickOrder}
            />
          ))}
        </div>
      )}
    </section>
  );
};
