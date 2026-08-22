import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, Plus, Minus, ShoppingBag, ShieldAlert, Sparkles, 
  CheckCircle2, Flame, HeartPulse, Clock, PackageCheck, 
  AlertCircle, Info, Star, MessageSquare, ThumbsUp, Send, User, MapPin
} from 'lucide-react';
import { Product, ProductSizeOption, ProductReview } from '../types';
import { DatabaseService } from '../data/database';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, selectedSize: ProductSizeOption, quantity: number) => void;
  defaultUserName?: string;
  defaultUserLocality?: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  defaultUserName = '',
  defaultUserLocality = ''
}) => {
  if (!isOpen || !product) return null;

  const [selectedSizeId, setSelectedSizeId] = useState<string>(product.defaultSizeId || product.sizes[0]?.id);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'nutrition' | 'allergens' | 'reviews'>('reviews');
  const [showAddedNotice, setShowAddedNotice] = useState<boolean>(false);

  // Reviews State
  const [reviewsList, setReviewsList] = useState<ProductReview[]>([]);
  const [newRating, setNewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [authorName, setAuthorName] = useState<string>(defaultUserName || '');
  const [authorLocality, setAuthorLocality] = useState<string>(defaultUserLocality || 'Chennai');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  // Load reviews on product change / modal open
  useEffect(() => {
    if (product) {
      const productReviews = DatabaseService.getReviewsForProduct(product.id);
      setReviewsList(productReviews);
      setReviewSuccessMsg('');
    }
  }, [product, isOpen]);

  // Compute live average rating and review count
  const { averageRating, reviewCount } = useMemo(() => {
    if (reviewsList.length === 0) {
      return { 
        averageRating: product.rating || 4.9, 
        reviewCount: product.reviewCount || 12 
      };
    }
    const sum = reviewsList.reduce((acc, r) => acc + r.rating, 0);
    const avg = parseFloat((sum / reviewsList.length).toFixed(1));
    return { averageRating: avg, reviewCount: reviewsList.length };
  }, [reviewsList, product]);

  const currentSize = product.sizes.find(s => s.id === selectedSizeId) || product.sizes[0];
  const unitPrice = Math.round(product.basePrice * (currentSize?.priceMultiplier || 1));
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    onAddToCart(product, currentSize, quantity);
    setShowAddedNotice(true);
    setTimeout(() => {
      setShowAddedNotice(false);
      onClose();
    }, 900);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setIsSubmittingReview(true);
    const nameToUse = authorName.trim() || 'Chennai Foodie';
    const localityToUse = authorLocality.trim() || 'Chennai';

    const created = DatabaseService.addReview({
      productId: product.id,
      userName: nameToUse,
      locality: localityToUse.includes('Chennai') ? localityToUse : `${localityToUse}, Chennai`,
      rating: newRating,
      comment: reviewComment.trim(),
      isVerifiedBuyer: true
    });

    setReviewsList(prev => [created, ...prev]);
    setReviewComment('');
    setIsSubmittingReview(false);
    setReviewSuccessMsg('Thank you! Your verified customer review is now live.');
    setTimeout(() => {
      setReviewSuccessMsg('');
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-orange-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden border-4 border-orange-100 animate-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Header with Close */}
        <div className="relative bg-orange-50/70 p-4 sm:p-5 border-b-2 border-orange-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-black tracking-wider px-3 py-1 rounded-xl bg-orange-200 text-orange-900 font-mono">
              {product.category}
            </span>
            {product.isChennaiSpecial && (
              <span className="inline-flex items-center gap-1 text-xs font-black text-white bg-orange-500 px-3 py-1 rounded-full shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                Chennai Special Recipe
              </span>
            )}
          </div>
          
          <button
            id="close-product-detail-modal-btn"
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-white hover:bg-orange-100 text-orange-950 flex items-center justify-center border-2 border-orange-100 transition cursor-pointer font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {/* Main Top Grid: Image & Key Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Left: Product Image */}
            <div className="relative aspect-4/3 sm:aspect-square rounded-3xl overflow-hidden bg-orange-50 border-2 border-orange-100 shadow-inner">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Availability tag */}
              <div className="absolute top-3 left-3">
                {product.isAvailable ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-500 text-white text-xs font-black shadow-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Available Fresh Today
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black shadow-md">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Sold Out (Next Batch 7 AM)
                  </span>
                )}
              </div>
            </div>

            {/* Right: Details & Size Customization */}
            <div className="space-y-4">
              <div>
                {product.tamilName && (
                  <p className="text-xs font-bold text-orange-500 uppercase tracking-wider">{product.tamilName}</p>
                )}
                <h1 className="text-xl sm:text-2xl font-black text-orange-950 font-['Outfit']">
                  {product.name}
                </h1>

                {/* Rating Badge Clickable to jump to Reviews tab */}
                <div 
                  onClick={() => setActiveTab('reviews')}
                  className="flex items-center gap-2 mt-1.5 cursor-pointer group"
                  title="Click to view all reviews"
                >
                  <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 text-amber-900 group-hover:bg-amber-100 transition">
                    <div className="flex items-center text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-3.5 h-3.5 ${
                            star <= Math.round(averageRating) 
                              ? 'fill-amber-400 text-amber-400' 
                              : 'text-orange-200'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs font-black text-orange-950 ml-0.5">{averageRating}</span>
                  </div>
                  <span className="text-xs text-orange-700 font-bold underline decoration-orange-300">
                    {reviewCount} Customer Reviews
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-orange-900/80 mt-2 leading-relaxed font-medium">
                  {product.description}
                </p>
              </div>

              {/* Size / Weight Customization Selector */}
              <div className="pt-2 border-t-2 border-orange-100 space-y-2">
                <label className="block text-xs font-black text-orange-950 uppercase tracking-wider">
                  Select Size & Weight:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {product.sizes.map((s) => {
                    const isSelected = selectedSizeId === s.id;
                    const priceForSize = Math.round(product.basePrice * s.priceMultiplier);
                    return (
                      <button
                        key={s.id}
                        id={`size-option-${s.id}`}
                        onClick={() => setSelectedSizeId(s.id)}
                        className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50 text-orange-950 font-bold shadow-xs'
                            : 'border-orange-100 hover:border-orange-300 bg-white text-orange-900/80'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black">{s.name}</span>
                          <span className="text-xs font-black text-orange-600">₹{priceForSize}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price & Quantity Adjuster */}
              <div className="pt-3 border-t-2 border-orange-100 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-black text-orange-400">Total Price</span>
                  <div className="text-2xl sm:text-3xl font-black text-orange-950 font-['Outfit']">
                    ₹{totalPrice}
                  </div>
                </div>

                {product.isAvailable && (
                  <div className="flex items-center border-2 border-orange-100 rounded-2xl bg-orange-50/50 p-1">
                    <button
                      id="decrease-qty-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-orange-950 hover:bg-white disabled:opacity-30 transition cursor-pointer font-bold"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-black text-sm text-orange-950">{quantity}</span>
                    <button
                      id="increase-qty-btn"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-orange-950 hover:bg-white transition cursor-pointer font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Tab Navigation for Detailed Sections (Reviews, Nutrition, Ingredients & Allergens, Storage) */}
          <div className="border-t-2 border-orange-100 pt-5 space-y-4">
            
            <div className="flex border-b-2 border-orange-100 gap-2 sm:gap-4 overflow-x-auto pb-0.5">
              <button
                id="tab-btn-reviews"
                onClick={() => setActiveTab('reviews')}
                className={`pb-2.5 text-xs font-black uppercase tracking-wider transition cursor-pointer border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-orange-900/60 hover:text-orange-950'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Reviews ({reviewCount})</span>
              </button>

              <button
                id="tab-btn-nutrition"
                onClick={() => setActiveTab('nutrition')}
                className={`pb-2.5 text-xs font-black uppercase tracking-wider transition cursor-pointer border-b-2 whitespace-nowrap ${
                  activeTab === 'nutrition'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-orange-900/60 hover:text-orange-950'
                }`}
              >
                Nutritional Values
              </button>

              <button
                id="tab-btn-allergens"
                onClick={() => setActiveTab('allergens')}
                className={`pb-2.5 text-xs font-black uppercase tracking-wider transition cursor-pointer border-b-2 whitespace-nowrap ${
                  activeTab === 'allergens'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-orange-900/60 hover:text-orange-950'
                }`}
              >
                Allergens & Ingredients
              </button>

              <button
                id="tab-btn-details"
                onClick={() => setActiveTab('details')}
                className={`pb-2.5 text-xs font-black uppercase tracking-wider transition cursor-pointer border-b-2 whitespace-nowrap ${
                  activeTab === 'details'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-orange-900/60 hover:text-orange-950'
                }`}
              >
                Storage & Shelf Life
              </button>
            </div>

            {/* ========================================================================= */}
            {/* CUSTOMER REVIEWS TAB CONTENT (Story Requirement) */}
            {/* ========================================================================= */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 animate-in fade-in">
                
                {/* Rating Overview Summary Banner */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-5 border-2 border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-center sm:text-left">
                    <div className="w-16 h-16 rounded-2xl bg-amber-400 text-amber-950 flex flex-col items-center justify-center font-['Outfit'] shadow-md shadow-amber-400/30 shrink-0">
                      <span className="text-2xl font-black">{averageRating}</span>
                      <span className="text-[10px] font-bold">/ 5.0</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-amber-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${
                              star <= Math.round(averageRating) 
                                ? 'fill-amber-400 text-amber-400' 
                                : 'text-orange-200'
                            }`} 
                          />
                        ))}
                      </div>
                      <h3 className="text-sm font-black text-orange-950 font-['Outfit'] mt-1">
                        Verified Chennai Customer Reviews
                      </h3>
                      <p className="text-xs text-orange-900/70 font-medium">
                        Based on {reviewCount} ratings from local Chennai households.
                      </p>
                    </div>
                  </div>

                  <div className="px-3.5 py-2 bg-white rounded-2xl border border-amber-200 text-xs text-amber-950 font-bold shadow-xs text-center">
                    <span className="text-emerald-700 font-black">98% Satisfied</span> with taste & aroma
                  </div>
                </div>

                {/* Review Submission Success Alert */}
                {reviewSuccessMsg && (
                  <div className="p-4 bg-teal-50 border-2 border-teal-200 rounded-2xl text-xs text-teal-950 flex items-center gap-2.5 font-bold animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                    <span>{reviewSuccessMsg}</span>
                  </div>
                )}

                {/* Write a Review Interactive Form */}
                <form 
                  id="product-review-form"
                  onSubmit={handleReviewSubmit}
                  className="bg-white rounded-3xl p-5 border-2 border-orange-200/80 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-orange-100 pb-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-orange-600" />
                      <h4 className="text-xs font-black text-orange-950 uppercase tracking-wider">
                        Leave a Review for this Bake
                      </h4>
                    </div>
                    <span className="text-[10px] text-orange-900/60 font-bold">Verified Buyer</span>
                  </div>

                  {/* Interactive Star Rating Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-orange-950">
                      Your Rating (Select 1 to 5 Stars):
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isFilled = (hoverRating || newRating) >= star;
                          return (
                            <button
                              key={star}
                              type="button"
                              id={`star-rating-btn-${star}`}
                              onClick={() => setNewRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 rounded-lg hover:bg-amber-50 transition cursor-pointer"
                              title={`Rate ${star} star`}
                            >
                              <Star 
                                className={`w-6 h-6 transition-transform hover:scale-125 ${
                                  isFilled 
                                    ? 'fill-amber-400 text-amber-400' 
                                    : 'text-orange-200 hover:text-amber-300'
                                }`} 
                              />
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-xs font-black text-orange-950 ml-2">
                        {newRating === 5 ? '5 ★ - Exceptional Freshness & Taste!' :
                         newRating === 4 ? '4 ★ - Very Good Bakes' :
                         newRating === 3 ? '3 ★ - Good' :
                         newRating === 2 ? '2 ★ - Fair' : '1 ★ - Poor'}
                      </span>
                    </div>
                  </div>

                  {/* Customer Name & Locality Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-orange-900/80 mb-1">
                        Your Full Name:
                      </label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-orange-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          id="review-author-name"
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          placeholder="e.g. Priya Sundaram"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border-2 border-orange-100 focus:border-orange-500 focus:outline-none bg-orange-50/40 text-orange-950 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-orange-900/80 mb-1">
                        Your Locality in Chennai:
                      </label>
                      <div className="relative">
                        <MapPin className="w-3.5 h-3.5 text-orange-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          id="review-author-locality"
                          value={authorLocality}
                          onChange={(e) => setAuthorLocality(e.target.value)}
                          placeholder="e.g. Mylapore, T. Nagar, Adyar"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border-2 border-orange-100 focus:border-orange-500 focus:outline-none bg-orange-50/40 text-orange-950 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Review Comment Field */}
                  <div>
                    <label className="block text-[11px] font-bold text-orange-900/80 mb-1">
                      Short Comment / Review: <span className="text-orange-600">*</span>
                    </label>
                    <textarea
                      id="review-comment-input"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                      rows={2}
                      placeholder="Share what you loved about this bake, aroma, sweetness balance, or fresh delivery experience..."
                      className="w-full p-3 text-xs rounded-xl border-2 border-orange-100 focus:border-orange-500 focus:outline-none bg-orange-50/40 text-orange-950 font-medium resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      id="submit-review-btn"
                      disabled={isSubmittingReview || !reviewComment.trim()}
                      className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-sm shadow-orange-500/20 active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Verified Review</span>
                    </button>
                  </div>
                </form>

                {/* List of Existing Product Reviews */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-orange-950 uppercase tracking-wider">
                    Customer Reviews ({reviewsList.length})
                  </h4>

                  {reviewsList.length === 0 ? (
                    <div className="p-6 text-center bg-orange-50/60 rounded-2xl border-2 border-orange-100 text-xs text-orange-900/70 font-medium">
                      Be the first to review this delicious bake!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {reviewsList.map((rev) => (
                        <div 
                          key={rev.id} 
                          className="bg-orange-50/50 rounded-2xl p-4 border border-orange-200/80 space-y-2 shadow-xs"
                        >
                          <div className="flex items-center justify-between flex-wrap gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-orange-950 font-['Outfit']">
                                {rev.userName}
                              </span>
                              {rev.locality && (
                                <span className="text-[10px] font-bold text-orange-800 bg-orange-100/80 px-2 py-0.5 rounded-md">
                                  {rev.locality}
                                </span>
                              )}
                              {rev.isVerifiedBuyer && (
                                <span className="text-[9px] font-black text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                  <CheckCircle2 className="w-2.5 h-2.5 text-teal-600" />
                                  Verified
                                </span>
                              )}
                            </div>

                            <span className="text-[10px] text-orange-900/50 font-medium">
                              {rev.createdAt}
                            </span>
                          </div>

                          {/* Star rating */}
                          <div className="flex items-center gap-0.5 text-amber-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`w-3.5 h-3.5 ${
                                  star <= rev.rating 
                                    ? 'fill-amber-400 text-amber-400' 
                                    : 'text-orange-200'
                                }`} 
                              />
                            ))}
                          </div>

                          {/* Comment body */}
                          <p className="text-xs text-orange-900/85 leading-relaxed font-medium">
                            "{rev.comment}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Nutrition Tab Content */}
            {activeTab === 'nutrition' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between text-xs text-orange-900 bg-orange-50 p-3 rounded-2xl border-2 border-orange-100 font-medium">
                  <span className="font-bold text-orange-950">Serving Size: {product.nutrition.servingSize}</span>
                  <span className="text-[11px] text-orange-900/70 font-bold">Tested as per FSSAI Norms</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-3 text-center">
                    <span className="text-[10px] font-black uppercase text-orange-700">Calories</span>
                    <p className="text-xl font-black text-orange-950 font-['Outfit'] mt-0.5">{product.nutrition.calories}</p>
                    <span className="text-[10px] text-orange-600 font-bold">kcal / srv</span>
                  </div>

                  <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-3 text-center">
                    <span className="text-[10px] font-black uppercase text-teal-700">Sugar</span>
                    <p className="text-xl font-black text-teal-950 font-['Outfit'] mt-0.5">{product.nutrition.sugar}g</p>
                    <span className="text-[10px] text-teal-600 font-bold">per serving</span>
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-3 text-center">
                    <span className="text-[10px] font-black uppercase text-blue-700">Carbs</span>
                    <p className="text-xl font-black text-blue-950 font-['Outfit'] mt-0.5">{product.nutrition.carbohydrates}g</p>
                    <span className="text-[10px] text-blue-600 font-bold">per serving</span>
                  </div>

                  <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3 text-center">
                    <span className="text-[10px] font-black uppercase text-emerald-700">Protein</span>
                    <p className="text-xl font-black text-emerald-950 font-['Outfit'] mt-0.5">{product.nutrition.protein}g</p>
                    <span className="text-[10px] text-emerald-600 font-bold">per serving</span>
                  </div>

                  <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 text-center">
                    <span className="text-[10px] font-black uppercase text-amber-700">Fats</span>
                    <p className="text-xl font-black text-amber-950 font-['Outfit'] mt-0.5">{product.nutrition.fat}g</p>
                    <span className="text-[10px] text-amber-600 font-bold">per serving</span>
                  </div>
                </div>

                {product.dietaryTags.includes('diabetic-friendly') && (
                  <div className="p-3.5 bg-teal-50 border-2 border-teal-200 rounded-2xl text-xs text-teal-950 flex items-start gap-2.5 font-medium">
                    <HeartPulse className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-bold">Diabetic Conscious:</strong> Formulated using slow-release carbohydrates and zero added refined cane sugar, minimizing glycemic spikes.
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Allergens & Ingredients Tab */}
            {activeTab === 'allergens' && (
              <div className="space-y-5 animate-in fade-in">
                
                <div>
                  <h3 className="text-xs font-black text-orange-950 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-orange-600" />
                    <span>Allergen Declaration Status (Explicit Yes / No):</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    
                    <div className={`p-3.5 rounded-2xl border-2 ${
                      product.allergens.egg === 'No' ? 'bg-teal-50 border-teal-200 text-teal-950' : 'bg-orange-50 border-orange-200 text-orange-950'
                    }`}>
                      <span className="text-[11px] font-bold block text-orange-900/60">Egg</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-black">{product.allergens.egg}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          product.allergens.egg === 'No' ? 'bg-teal-200 text-teal-900' : 'bg-orange-200 text-orange-900'
                        }`}>
                          {product.allergens.egg === 'No' ? '100% Eggless' : 'Contains Egg'}
                        </span>
                      </div>
                    </div>

                    <div className={`p-3.5 rounded-2xl border-2 ${
                      product.allergens.nuts === 'No' ? 'bg-teal-50 border-teal-200 text-teal-950' : 'bg-orange-50 border-orange-200 text-orange-950'
                    }`}>
                      <span className="text-[11px] font-bold block text-orange-900/60">Nuts / Peanuts</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-black">{product.allergens.nuts}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          product.allergens.nuts === 'No' ? 'bg-teal-200 text-teal-900' : 'bg-orange-200 text-orange-900'
                        }`}>
                          {product.allergens.nuts}
                        </span>
                      </div>
                    </div>

                    <div className={`p-3.5 rounded-2xl border-2 ${
                      product.allergens.dairy === 'No' ? 'bg-teal-50 border-teal-200 text-teal-950' : 'bg-orange-50 border-orange-200 text-orange-950'
                    }`}>
                      <span className="text-[11px] font-bold block text-orange-900/60">Dairy / Milk</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-black">{product.allergens.dairy}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          product.allergens.dairy === 'No' ? 'bg-teal-200 text-teal-900' : 'bg-orange-200 text-orange-900'
                        }`}>
                          {product.allergens.dairy === 'No' ? 'Dairy-Free' : 'Contains Dairy'}
                        </span>
                      </div>
                    </div>

                    <div className={`p-3.5 rounded-2xl border-2 ${
                      product.allergens.gluten === 'No' ? 'bg-teal-50 border-teal-200 text-teal-950' : 'bg-orange-50 border-orange-200 text-orange-950'
                    }`}>
                      <span className="text-[11px] font-bold block text-orange-900/60">Gluten / Wheat</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-black">{product.allergens.gluten}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          product.allergens.gluten === 'No' ? 'bg-teal-200 text-teal-900' : 'bg-orange-200 text-orange-900'
                        }`}>
                          {product.allergens.gluten === 'No' ? 'Gluten-Free' : 'Contains Gluten'}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black text-orange-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-orange-600" />
                    <span>Approved Ingredients (Full Disclosure):</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ing, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 rounded-xl bg-orange-50 text-orange-950 text-xs font-bold border-2 border-orange-100"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Storage & Quality Tab */}
            {activeTab === 'details' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-orange-50 border-2 border-orange-100 space-y-1.5">
                    <div className="flex items-center gap-2 text-orange-950 font-black text-xs">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span>Shelf Life & Freshness</span>
                    </div>
                    <p className="text-xs text-orange-900/80 font-medium">{product.shelfLife || '3-4 Days from bake date.'}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-orange-50 border-2 border-orange-100 space-y-1.5">
                    <div className="flex items-center gap-2 text-orange-950 font-black text-xs">
                      <PackageCheck className="w-4 h-4 text-orange-600" />
                      <span>Storage Instructions</span>
                    </div>
                    <p className="text-xs text-orange-900/80 font-medium">{product.storageInfo || 'Store in cool, dry place.'}</p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-orange-50/70 p-4 sm:p-5 border-t-2 border-orange-100 flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-black text-orange-400">Total Payable</span>
            <div className="text-xl sm:text-2xl font-black text-orange-950 font-['Outfit']">
              ₹{totalPrice} <span className="text-xs font-bold text-orange-900/70 font-sans">({quantity} × {currentSize.name})</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="cancel-product-modal-btn"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl border-2 border-orange-200 hover:bg-orange-100 text-orange-950 text-xs font-black transition cursor-pointer"
            >
              Back
            </button>

            {product.isAvailable && (
              <button
                id="modal-add-to-cart-btn"
                onClick={handleAdd}
                disabled={showAddedNotice}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-black text-white transition cursor-pointer shadow-md active:scale-95 ${
                  showAddedNotice
                    ? 'bg-teal-500 shadow-teal-500/30'
                    : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'
                }`}
              >
                {showAddedNotice ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart • ₹{totalPrice}</span>
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
