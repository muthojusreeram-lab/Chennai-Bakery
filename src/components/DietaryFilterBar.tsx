import React from 'react';
import { Filter, X, Check, Heart, Sparkles } from 'lucide-react';
import { DIETARY_FILTERS } from '../data/products';
import { DietaryTag } from '../types';

interface DietaryFilterBarProps {
  selectedTags: DietaryTag[];
  onToggleTag: (tag: DietaryTag) => void;
  onClearTags: () => void;
  filteredCount: number;
  totalCount: number;
}

export const DietaryFilterBar: React.FC<DietaryFilterBarProps> = ({
  selectedTags,
  onToggleTag,
  onClearTags,
  filteredCount,
  totalCount
}) => {
  return (
    <div className="bg-white rounded-[2rem] border-2 border-orange-100 p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Title and Active indicator */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-orange-950 uppercase tracking-wider">
                Dietary & Health Filters
              </span>
              {selectedTags.length > 0 && (
                <span className="text-[10px] bg-orange-500 text-white font-black px-2.5 py-0.5 rounded-full shadow-xs">
                  {selectedTags.length} active
                </span>
              )}
            </div>
            <p className="text-xs text-orange-900/70 font-medium">
              Showing <strong className="text-orange-950 font-black">{filteredCount}</strong> of {totalCount} freshly baked items
            </p>
          </div>
        </div>

        {/* Filter Badges / Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {DIETARY_FILTERS.map((item) => {
            const isSelected = selectedTags.includes(item.id as DietaryTag);
            return (
              <button
                key={item.id}
                id={`dietary-filter-${item.id}`}
                onClick={() => onToggleTag(item.id as DietaryTag)}
                title={item.description}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border-2 transition-all cursor-pointer ${
                  isSelected ? item.activeColor + ' shadow-sm scale-105 border-transparent' : item.color + ' border-orange-100/80 hover:border-orange-200'
                }`}
              >
                {isSelected ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
                )}
                <span>{item.label}</span>
              </button>
            );
          })}

          {selectedTags.length > 0 && (
            <button
              id="clear-dietary-filters-btn"
              onClick={onClearTags}
              className="flex items-center gap-1 px-3 py-2 rounded-2xl text-xs font-bold text-orange-600 hover:text-orange-950 hover:bg-orange-100/50 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
