import React from 'react';
import { Cake, Cookie, Wheat, Leaf, HeartPulse, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { CategoryId } from '../types';

interface CategoryFilterProps {
  selectedCategory: CategoryId;
  onSelectCategory: (category: CategoryId) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const getIcon = (iconName: string, isSelected: boolean) => {
    const className = `w-4 h-4 ${isSelected ? 'text-white' : 'text-orange-600'}`;
    switch (iconName) {
      case 'Cake': return <Cake className={className} />;
      case 'Cookie': return <Cookie className={className} />;
      case 'Wheat': return <Wheat className={className} />;
      case 'Leaf': return <Leaf className={className} />;
      case 'HeartPulse': return <HeartPulse className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-black text-orange-950 uppercase tracking-wider font-['Outfit']">
          Select Category
        </h2>
        <span className="text-xs font-bold text-orange-400">16+ artisanal Chennai bakes today</span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`cat-btn-${cat.id}`}
              onClick={() => onSelectCategory(cat.id as CategoryId)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 border-2 border-orange-500 scale-[1.02]'
                  : 'bg-white hover:bg-orange-50/80 text-orange-900 border-2 border-orange-100 hover:border-orange-200 shadow-xs'
              }`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                isSelected ? 'bg-white/20' : 'bg-orange-100'
              }`}>
                {getIcon(cat.icon, isSelected)}
              </div>
              <span>{cat.name}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
                isSelected ? 'bg-white/20 text-white' : 'bg-orange-50 text-orange-700 border border-orange-100'
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

