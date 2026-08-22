import React from 'react';
import { Eye, Plus, Check, Flame, ShieldAlert, Sparkles, Heart, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  isInCart: boolean;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
  productRating?: number;
  productReviewCount?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onQuickAdd,
  isInCart,
  isWishlisted = false,
  onToggleWishlist,
  productRating,
  productReviewCount
}) => {
  const rating = productRating ?? product.rating ?? 4.9;
  const reviewCount = productReviewCount ?? product.reviewCount ?? 16;
  return (
    <div 
      id={`product-card-${product.id}`}
      className="group bg-white p-4 sm:p-5 rounded-[2.5rem] border-2 border-orange-100 shadow-xs hover:shadow-xl hover:border-orange-300 transition-all duration-300 flex flex-col justify-between relative"
    >
      {/* Product Image Container */}
      <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-orange-50 border border-orange-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-orange-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Wishlist Heart Button (Top Right) */}
        {onToggleWishlist && (
          <button
            id={`wishlist-toggle-${product.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className={`absolute top-3 right-3 z-30 w-9 h-9 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-90 ${
              isWishlisted
                ? 'bg-white text-rose-500 ring-2 ring-rose-300 shadow-rose-500/20'
                : 'bg-black/30 hover:bg-black/50 text-white backdrop-blur-xs'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
            aria-label={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
          >
            <Heart 
              className={`w-4 h-4 transition-transform ${isWishlisted ? 'fill-rose-500 scale-110' : 'hover:scale-110'}`} 
            />
          </button>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 max-w-[70%]">
          {product.isChennaiSpecial && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3 h-3 text-yellow-200" />
              Chennai Special
            </span>
          )}
          {product.dietaryTags.includes('diabetic-friendly') && (
            <span className="px-2.5 py-1 rounded-full bg-teal-500 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
              Diabetic Safe
            </span>
          )}
          {product.dietaryTags.includes('low-calorie') && (
            <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
              Low-Calorie
            </span>
          )}
          {product.dietaryTags.includes('eggless') && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
              100% Veg
            </span>
          )}
        </div>

        {/* Availability Badge (Story 8) */}
        {!product.isAvailable ? (
          <div className="absolute inset-0 bg-orange-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center z-20">
            <span className="px-3 py-1.5 bg-rose-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md mb-1">
              Sold Out Today
            </span>
            <p className="text-[11px] text-orange-200 font-medium">Fresh batch in oven tomorrow 7 AM</p>
          </div>
        ) : (
          <div className="absolute bottom-3 left-3 text-white z-10">
            <span className="text-[11px] font-bold bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-xl">
              Fresh Daily • {product.sizes[0]?.name}
            </span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="pt-4 flex-1 flex flex-col justify-between space-y-3">
        
        <div className="space-y-1">
          {product.tamilName && (
            <p className="text-[11px] text-orange-500 font-bold uppercase tracking-wider">
              {product.tamilName}
            </p>
          )}
          <h3 
            onClick={() => onOpenDetails(product)}
            className="text-base sm:text-lg font-black text-orange-950 group-hover:text-orange-600 transition cursor-pointer line-clamp-1 font-['Outfit']"
          >
            {product.name}
          </h3>

          {/* Customer Rating & Reviews Count (Story Requirement) */}
          <div 
            onClick={() => onOpenDetails(product)}
            className="flex items-center gap-1.5 cursor-pointer pt-0.5"
            title={`${rating} out of 5 stars based on ${reviewCount} Chennai customer reviews`}
          >
            <div className="flex items-center gap-0.5 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-black text-orange-950">{rating.toFixed(1)}</span>
            </div>
            <span className="text-[11px] text-orange-900/60 font-medium">({reviewCount} reviews)</span>
          </div>

          <p className="text-xs text-orange-900/70 line-clamp-2 leading-relaxed font-medium">
            {product.shortDescription}
          </p>
        </div>

        {/* Nutrition Highlights (Calories & Carbs per serving - Story 22 & 23) */}
        <div className="pt-2 border-t border-orange-100 flex items-center justify-between text-[11px] text-orange-950">
          <div className="flex items-center gap-1 text-orange-600 font-black">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>{product.nutrition.calories} kcal <span className="text-[9px] font-normal text-orange-900/60">/srv</span></span>
          </div>
          <div className="text-[10px] text-teal-800 bg-teal-50 px-2.5 py-1 rounded-xl border border-teal-100 font-bold">
            Sugar: {product.nutrition.sugar}g • Carbs: {product.nutrition.carbohydrates}g
          </div>
        </div>

        {/* Price & Action Button */}
        <div className="pt-2 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-orange-400 uppercase font-black tracking-wider block">Starts from</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-orange-950 font-['Outfit']">
                ₹{product.basePrice}
              </span>
              <span className="text-[10px] text-orange-400 font-bold">INR</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id={`view-details-btn-${product.id}`}
              onClick={() => onOpenDetails(product)}
              className="p-3 rounded-2xl border-2 border-orange-100 hover:border-orange-300 bg-orange-50/50 hover:bg-orange-100 text-orange-900 transition cursor-pointer text-xs font-bold"
              title="View Ingredients, Nutrition & Allergens"
            >
              <Eye className="w-4 h-4" />
            </button>

            {product.isAvailable && (
              <button
                id={`add-to-cart-btn-${product.id}`}
                onClick={() => onQuickAdd(product)}
                className={`flex items-center gap-1.5 px-4 py-3 rounded-2xl text-xs font-black transition cursor-pointer shadow-md active:scale-95 ${
                  isInCart
                    ? 'bg-teal-500 hover:bg-teal-600 text-white shadow-teal-500/20'
                    : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
                }`}
              >
                {isInCart ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Add</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
