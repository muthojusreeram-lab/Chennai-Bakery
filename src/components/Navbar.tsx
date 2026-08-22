import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBag, MapPin, ShieldCheck, X, Sparkles, Phone, ChevronRight, LayoutDashboard, Shield, Heart, Award, Star } from 'lucide-react';
import { Product } from '../types';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  loyaltyPoints?: number;
  loyaltyTier?: string;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenLoyalty?: () => void;
  onOpenPincodeChecker: () => void;
  onOpenHygieneModal: () => void;
  onOpenAdmin: () => void;
  currentPincode: string | null;
  localityName: string | null;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  cartCount,
  cartTotal,
  wishlistCount,
  loyaltyPoints = 320,
  loyaltyTier = 'Silver',
  onOpenCart,
  onOpenWishlist,
  onOpenLoyalty,
  onOpenPincodeChecker,
  onOpenHygieneModal,
  onOpenAdmin,
  currentPincode,
  localityName,
  products,
  onSelectProduct
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Autocomplete suggestions based on query (Story 1 & 3)
  const suggestions = searchQuery.trim().length >= 2
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.dietaryTags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b-4 border-orange-200 shadow-sm">
      {/* Top Banner for Fresh Chennai City Delivery */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-white text-xs py-1.5 px-4 font-semibold">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white text-orange-600 font-black text-[10px] tracking-wider uppercase shadow-xs">
              Fresh Daily
            </span>
            <span className="text-orange-50">Baking daily with 100% RO water & pure cow butter. Doorstep delivery across Chennai!</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px] text-orange-100">
            {onOpenLoyalty && (
              <>
                <button
                  id="top-loyalty-rewards-btn"
                  onClick={onOpenLoyalty}
                  className="hover:text-white flex items-center gap-1.5 cursor-pointer transition font-bold bg-amber-400/20 hover:bg-amber-400/30 px-2.5 py-0.5 rounded-full text-amber-100"
                >
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  <span>Rewards: {loyaltyPoints} Pts</span>
                </button>
                <span>•</span>
              </>
            )}
            <button 
              id="top-admin-portal-btn"
              onClick={onOpenAdmin}
              className="hover:text-white flex items-center gap-1.5 cursor-pointer transition font-bold bg-white/20 hover:bg-white/30 px-2.5 py-0.5 rounded-full text-white"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-amber-200" />
              <span>Admin Portal</span>
            </button>
            <span>•</span>
            <button 
              id="top-hygiene-btn"
              onClick={onOpenHygieneModal}
              className="hover:text-white flex items-center gap-1 cursor-pointer transition font-bold"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-200" />
              <span>FSSAI & Hygiene Standards</span>
            </button>
            <span>•</span>
            <span className="flex items-center gap-1 font-bold">
              <Phone className="w-3 h-3" />
              <span>Chennai Hub: 044-2811-4500</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-22 gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-12 sm:w-14 h-12 sm:h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl sm:text-3xl shadow-lg shadow-orange-200 group-hover:scale-105 transition-transform duration-300">
                C
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-orange-950 leading-none tracking-tight font-['Outfit']">
                    CHENNAI BAKERY
                  </h1>
                </div>
                <span className="text-[10px] font-bold text-orange-400 tracking-[0.2em] mt-1 uppercase">
                  ESTD 1992 • MOUNT ROAD
                </span>
              </div>
            </a>
          </div>

          {/* Search Bar with Autocomplete (Story 1 & 3) */}
          <div className="flex-1 max-w-md mx-2 sm:mx-6 relative" ref={searchContainerRef}>
            <div className="relative flex items-center">
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search filter coffee cakes, tea buns, cookies..."
                className="w-full bg-orange-50/80 border-2 border-orange-100 rounded-2xl py-2.5 sm:py-3 pl-11 pr-10 text-sm focus:outline-none focus:border-orange-400 text-orange-950 placeholder-orange-300 font-medium transition"
              />
              <Search className="w-4 h-4 text-orange-400 absolute left-4 top-1/2 -translate-y-1/2 stroke-[2.5]" />
              {searchQuery && (
                <button
                  id="clear-search-btn"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-orange-400 hover:text-orange-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Autocomplete Suggestions Dropdown */}
            {isSearchFocused && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border-2 border-orange-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3 text-xs font-black text-orange-950 bg-orange-50 border-b border-orange-100 flex items-center justify-between uppercase tracking-wider">
                  <span>Product Suggestions</span>
                  <span className="text-[10px] text-orange-500 font-bold">{suggestions.length} items found</span>
                </div>
                <div className="divide-y divide-orange-50 max-h-72 overflow-y-auto">
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      id={`suggestion-${item.id}`}
                      onClick={() => {
                        onSelectProduct(item);
                        setIsSearchFocused(false);
                      }}
                      className="w-full p-3 text-left flex items-center gap-3 hover:bg-orange-50/80 transition cursor-pointer"
                    >
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-11 h-11 object-cover rounded-xl shrink-0 border-2 border-orange-100"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-black text-orange-950 truncate font-['Outfit']">{item.name}</p>
                          <span className="text-sm font-black text-orange-600 shrink-0 ml-2">₹{item.basePrice}</span>
                        </div>
                        <p className="text-xs text-orange-800/70 truncate">{item.shortDescription}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-orange-300" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Controls: Location & Cart */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Delivery Location Quick Button (Story 34) */}
            <button
              id="header-pincode-btn"
              onClick={onOpenPincodeChecker}
              className="hidden md:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-teal-50 hover:bg-teal-100/70 border-2 border-teal-100 text-teal-950 text-xs font-bold transition cursor-pointer text-left shadow-xs"
              title="Check delivery eligibility for your Chennai PIN code"
            >
              <div className="w-8 h-8 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-xs">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-teal-600 uppercase tracking-widest font-black">
                  {currentPincode ? 'Delivery to' : 'Chennai Delivery'}
                </span>
                <span className="font-black text-teal-900 max-w-[130px] truncate">
                  {localityName ? `${localityName}` : 'Adyar, Chennai'}
                </span>
              </div>
            </button>

            {/* Customer Loyalty Program Balance Pill */}
            {onOpenLoyalty && (
              <button
                id="header-loyalty-points-btn"
                onClick={onOpenLoyalty}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-950 text-xs font-black transition cursor-pointer shadow-xs group"
                title={`You have ${loyaltyPoints} Chennai Bakery Points (${loyaltyTier} Tier)`}
              >
                <div className="w-6 h-6 rounded-full bg-amber-400 text-orange-950 flex items-center justify-center shadow-xs">
                  <Award className="w-3.5 h-3.5 text-orange-950" />
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <div className="flex items-center gap-1">
                    <span className="font-black text-amber-950">{loyaltyPoints}</span>
                    <span className="text-[10px] text-amber-700 uppercase font-black tracking-wider">Pts</span>
                  </div>
                  <span className="text-[9px] text-orange-600 font-bold uppercase tracking-wider">{loyaltyTier}</span>
                </div>
              </button>
            )}

            {/* Admin Portal Trigger */}
            <button
              id="header-admin-portal-btn"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2.5 rounded-2xl border-2 border-orange-200 bg-orange-50/70 hover:bg-orange-100 text-orange-950 text-xs font-black transition cursor-pointer shadow-xs"
              title="Open Admin Dashboard (CRUD Products & Orders)"
            >
              <LayoutDashboard className="w-4 h-4 text-orange-600" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Hygiene & Quality Modal Trigger */}
            <button
              id="header-hygiene-btn"
              onClick={onOpenHygieneModal}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border-2 border-orange-100 bg-white hover:bg-orange-50 text-orange-900 text-xs font-bold transition cursor-pointer shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span>Hygiene Standards</span>
            </button>

            {/* Wishlist Button */}
            <button
              id="header-wishlist-btn"
              onClick={onOpenWishlist}
              className="relative p-3 rounded-2xl border-2 border-orange-200 bg-rose-50/60 hover:bg-rose-100/80 text-rose-900 transition cursor-pointer shadow-xs"
              title="Saved Bakes (Wishlist)"
              aria-label="View Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-rose-600'}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button with Count & Total (Story 28, 29, 30) */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black shadow-lg shadow-orange-200 transition cursor-pointer active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-white shadow-xs animate-bounce">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[9px] font-bold uppercase tracking-widest text-orange-200">Cart</span>
                <span className="text-sm font-black font-['Outfit']">₹{cartTotal}</span>
              </div>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
