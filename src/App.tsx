/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, Search, MapPin, ShieldCheck, HeartPulse, 
  ShoppingBag, ChevronLeft, ChevronRight, Cake, Cookie, 
  Wheat, Leaf, Filter, Award, CheckCircle2, ArrowRight, 
  Flame, Phone, Heart, Clock, AlertCircle
} from 'lucide-react';

import { Product, CategoryId, DietaryTag, CartItem, ProductSizeOption, Order, ChennaiPinLocation, LoyaltyUser } from './types';
import { CATEGORIES, DIETARY_FILTERS } from './data/products';
import { CHENNAI_PINCODES, checkChennaiPincode } from './data/chennaiPincodes';
import { DatabaseService } from './data/database';

import { Navbar } from './components/Navbar';
import { CategoryFilter } from './components/CategoryFilter';
import { DietaryFilterBar } from './components/DietaryFilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { PincodeCheckerModal } from './components/PincodeCheckerModal';
import { HygieneModal } from './components/HygieneModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { LoyaltyAccountModal } from './components/LoyaltyAccountModal';
import { WishlistDrawer } from './components/WishlistDrawer';

const ITEMS_PER_PAGE = 8;

export default function App() {
  // Database-backed Products State
  const [productsList, setProductsList] = useState<Product[]>(() => DatabaseService.getProducts());

  // Customer Loyalty Program State
  const [loyaltyUser, setLoyaltyUser] = useState<LoyaltyUser>(() => DatabaseService.getLoyaltyUser());

  // Listen for database updates (Add / Edit / Delete / Orders / Loyalty)
  useEffect(() => {
    const handleProductsUpdated = (e: any) => {
      if (e.detail) {
        setProductsList(e.detail);
      } else {
        setProductsList(DatabaseService.getProducts());
      }
    };

    const handleLoyaltyUpdated = (e: any) => {
      if (e.detail) {
        setLoyaltyUser(e.detail);
      } else {
        setLoyaltyUser(DatabaseService.getLoyaltyUser());
      }
    };

    window.addEventListener('chennai_bakery_products_updated', handleProductsUpdated);
    window.addEventListener('chennai_bakery_loyalty_updated', handleLoyaltyUpdated);
    return () => {
      window.removeEventListener('chennai_bakery_products_updated', handleProductsUpdated);
      window.removeEventListener('chennai_bakery_loyalty_updated', handleLoyaltyUpdated);
    };
  }, []);

  // Customer Wishlist State (Persisted in localStorage)
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('chennai_bakery_wishlist_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('chennai_bakery_wishlist_ids', JSON.stringify(wishlistIds));
    } catch {
      // safe fallback
    }
  }, [wishlistIds]);

  // Navigation & Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [selectedDietaryTags, setSelectedDietaryTags] = useState<DietaryTag[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Delivery & PIN State
  const [currentPincode, setCurrentPincode] = useState<string | null>('600017'); // Default to T. Nagar hub for smooth demo
  const [localityName, setLocalityName] = useState<string | null>('T. Nagar');
  const [deliveryFee, setDeliveryFee] = useState<number>(25);

  // Cart State (Persisted in session/local state)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const initialProds = DatabaseService.getProducts();
    const firstProd = initialProds[0] || null;
    if (!firstProd) return [];
    return [
      {
        id: `${firstProd.id}-default`,
        product: firstProd,
        selectedSize: firstProd.sizes[0] || { id: 'std', name: 'Standard (500g)', priceMultiplier: 1 },
        quantity: 1,
        unitPrice: firstProd.basePrice,
        itemTotal: firstProd.basePrice
      }
    ];
  });

  // Modal Visibility States
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState<boolean>(false);
  const [isHygieneModalOpen, setIsHygieneModalOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isOrderConfirmedOpen, setIsOrderConfirmedOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState<boolean>(false);

  // Gated Admin Portal Opening
  const handleOpenAdminPortal = () => {
    if (DatabaseService.isAdminAuthenticated()) {
      setIsAdminOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };
  
  // Active Selected Product for Detail View
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Filter & Search Engine (Story 1, 4, 5, 10, 11)
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      // 1. Search Query Filter (misspellings/substrings in name, category, tags, description)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesTamil = product.tamilName?.toLowerCase().includes(q);
        const matchesDesc = product.shortDescription.toLowerCase().includes(q) || product.description.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        const matchesIngredients = product.ingredients.some(ing => ing.toLowerCase().includes(q));
        const matchesTags = product.dietaryTags.some(tag => tag.toLowerCase().includes(tag));

        if (!matchesName && !matchesTamil && !matchesDesc && !matchesCat && !matchesIngredients && !matchesTags) {
          return false;
        }
      }

      // 2. Category Filter (Story 4 & 5)
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'eggless') {
          if (product.category !== 'eggless' && !product.dietaryTags.includes('eggless')) {
            return false;
          }
        } else if (selectedCategory === 'healthy') {
          if (
            product.category !== 'healthy' && 
            !product.dietaryTags.includes('diabetic-friendly') && 
            !product.dietaryTags.includes('low-calorie') &&
            !product.dietaryTags.includes('low-sugar')
          ) {
            return false;
          }
        } else if (product.category !== selectedCategory) {
          return false;
        }
      }

      // 3. Dietary & Health Filters (Story 10 & 11)
      if (selectedDietaryTags.length > 0) {
        const matchesAllTags = selectedDietaryTags.every(tag => product.dietaryTags.includes(tag));
        if (!matchesAllTags) return false;
      }

      return true;
    });
  }, [productsList, searchQuery, selectedCategory, selectedDietaryTags]);

  // Reset pagination when filter criteria change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedDietaryTags]);

  // Pagination calculation (Story 1 & 4)
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Cart Calculations (Story 28, 29, 30)
  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.itemTotal, 0);
  }, [cartItems]);

  // Add to cart handler
  const handleAddToCart = (product: Product, size: ProductSizeOption, quantity: number) => {
    const itemKey = `${product.id}-${size.id}`;
    const unitPrice = Math.round(product.basePrice * size.priceMultiplier);
    
    setCartItems((prevItems) => {
      const existingIdx = prevItems.findIndex(i => i.id === itemKey);
      if (existingIdx >= 0) {
        const updated = [...prevItems];
        const newQty = updated[existingIdx].quantity + quantity;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          itemTotal: unitPrice * newQty
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            id: itemKey,
            product,
            selectedSize: size,
            quantity,
            unitPrice,
            itemTotal: unitPrice * quantity
          }
        ];
      }
    });
  };

  const handleQuickAdd = (product: Product) => {
    const defaultSize = product.sizes[0];
    handleAddToCart(product, defaultSize, 1);
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems((prev) => 
      prev.map((item) => 
        item.id === cartItemId
          ? { ...item, quantity: newQty, itemTotal: item.unitPrice * newQty }
          : item
      )
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter(i => i.id !== cartItemId));
  };

  // Dietary Tag Toggles
  const handleToggleDietaryTag = (tag: DietaryTag) => {
    setSelectedDietaryTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleClearDietaryTags = () => {
    setSelectedDietaryTags([]);
  };

  // Verified PIN callback
  const handlePincodeVerified = (location: ChennaiPinLocation) => {
    setCurrentPincode(location.pincode);
    setLocalityName(location.locality);
    setDeliveryFee(location.deliveryFee);
  };

  // Wishlist Action Handlers
  const wishlistProducts = useMemo(() => {
    return productsList.filter(p => wishlistIds.includes(p.id));
  }, [productsList, wishlistIds]);

  const handleToggleWishlist = (product: Product) => {
    setWishlistIds(prev => {
      const exists = prev.includes(product.id);
      return exists ? prev.filter(id => id !== product.id) : [...prev, product.id];
    });
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlistIds(prev => prev.filter(id => id !== productId));
  };

  const handleClearWishlist = () => {
    setWishlistIds([]);
  };

  const handleAddAllWishlistToCart = () => {
    wishlistProducts.forEach(product => {
      handleQuickAdd(product);
    });
    setIsWishlistOpen(false);
    setIsCartOpen(true);
  };

  // Order Placement Success callback (Story 46 & 47)
  const handleOrderPlaced = (order: Order) => {
    // Record in local persistent database
    DatabaseService.recordNewCustomerOrder(order);
    
    setConfirmedOrder(order);
    setCartItems([]); // Clear cart
    setIsCheckoutOpen(false);
    setIsOrderConfirmedOpen(true);
  };

  const heroSpecialProduct = productsList[0] || null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F0] text-orange-950">
      
      {/* 1. Header / Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartCount}
        cartTotal={cartTotal}
        wishlistCount={wishlistIds.length}
        loyaltyPoints={loyaltyUser.points}
        loyaltyTier={loyaltyUser.tier}
        onOpenLoyalty={() => setIsLoyaltyOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenPincodeChecker={() => setIsPincodeModalOpen(true)}
        onOpenHygieneModal={() => setIsHygieneModalOpen(true)}
        onOpenAdmin={handleOpenAdminPortal}
        currentPincode={currentPincode}
        localityName={localityName}
        products={productsList}
        onSelectProduct={(p) => setSelectedProductForDetail(p)}
      />

      {/* 2. Hero & Brand Showcase Banner (Vibrant Palette Hero: Sunshine Gold Canvas) */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="bg-[#FFD55F] rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-sm border-4 border-white text-orange-950">
          
          {/* Subtle Ambient Shapes */}
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/30 blur-2xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-orange-400/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-orange-600 font-black text-xs uppercase tracking-widest shadow-xs">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span>Chennai's Daily Artisan Deck-Oven Bakery</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-['Outfit'] leading-tight text-orange-950">
                Authentic Flavours & <br />
                <span className="text-orange-600 underline decoration-white decoration-wavy decoration-2">Diabetic-Safe Bakes</span>
              </h1>

              <p className="text-sm sm:text-base text-orange-900/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Indulge in Kumbakonam Filter Coffee cakes, ancient Karupatti millet bakes, and 100% eggless diabetic delights. Baked fresh daily with 100% RO mineral water and delivered across Chennai.
              </p>

              {/* Quick Trust Highlights */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 text-xs">
                <button 
                  onClick={() => setIsPincodeModalOpen(true)}
                  className="bg-white/80 hover:bg-white text-orange-950 font-bold px-3.5 py-2 rounded-2xl border-2 border-orange-200/60 flex items-center gap-2 cursor-pointer transition shadow-xs"
                >
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <span>Doorstep Chennai Delivery</span>
                </button>

                <button 
                  onClick={() => setIsHygieneModalOpen(true)}
                  className="bg-white/80 hover:bg-white text-orange-950 font-bold px-3.5 py-2 rounded-2xl border-2 border-orange-200/60 flex items-center gap-2 cursor-pointer transition shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>FSSAI & RO Water Certified</span>
                </button>

                <button 
                  onClick={() => {
                    setSelectedCategory('healthy');
                    handleToggleDietaryTag('diabetic-friendly');
                  }}
                  className="bg-white/80 hover:bg-white text-orange-950 font-bold px-3.5 py-2 rounded-2xl border-2 border-orange-200/60 flex items-center gap-2 cursor-pointer transition shadow-xs"
                >
                  <HeartPulse className="w-4 h-4 text-rose-500" />
                  <span>Diabetic & Low-Calorie</span>
                </button>
              </div>
            </div>

            {/* Right Feature Card */}
            {heroSpecialProduct && (
              <div className="lg:col-span-5">
                <div className="bg-white rounded-[2.5rem] p-6 border-4 border-orange-100 shadow-xl text-orange-950 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-black tracking-widest text-orange-500 font-mono">Today's Special</span>
                    <span className="px-3 py-1 rounded-full bg-teal-500 text-white font-black text-[10px] uppercase tracking-wider shadow-xs">100% Fresh Bake</span>
                  </div>

                  <div className="flex gap-4 items-center">
                    <img
                      src={heroSpecialProduct.image}
                      alt={heroSpecialProduct.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-md border-2 border-orange-100"
                    />
                    <div>
                      <h3 className="text-base sm:text-lg font-black font-['Outfit'] text-orange-950 leading-snug">{heroSpecialProduct.name}</h3>
                      <p className="text-xs text-orange-900/70 line-clamp-2 mt-1 font-medium">{heroSpecialProduct.shortDescription}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xl font-black text-orange-600 font-['Outfit']">₹{heroSpecialProduct.basePrice}</span>
                        <span className="text-xs text-orange-400 font-bold line-through">₹{heroSpecialProduct.basePrice + 100}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      id="hero-order-special-btn"
                      onClick={() => setSelectedProductForDetail(heroSpecialProduct)}
                      className="flex-1 py-3 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-950 text-xs font-black transition border-2 border-orange-200/80 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>View & Customize</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id="hero-quick-add-btn"
                      onClick={() => handleQuickAdd(heroSpecialProduct)}
                      className="px-5 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black transition shadow-md shadow-orange-500/20 cursor-pointer active:scale-95"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* 3. Main Content Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        
        {/* Category Navigation Bar (Story 4 & 5) */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />

        {/* Dietary & Health Filters Bar (Story 10 & 11) */}
        <DietaryFilterBar
          selectedTags={selectedDietaryTags}
          onToggleTag={handleToggleDietaryTag}
          onClearTags={handleClearDietaryTags}
          filteredCount={filteredProducts.length}
          totalCount={productsList.length}
        />

        {/* Active Filters Summary Header if filtered */}
        {(searchQuery || selectedCategory !== 'all' || selectedDietaryTags.length > 0) && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-orange-900 border-b border-orange-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-orange-950">Active Criteria:</span>
              {searchQuery && (
                <span className="px-3 py-1 rounded-xl bg-orange-100 text-orange-900 font-bold border border-orange-200">
                  Search: "{searchQuery}"
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="px-3 py-1 rounded-xl bg-orange-100 text-orange-900 font-bold border border-orange-200 capitalize">
                  Category: {selectedCategory}
                </span>
              )}
              {selectedDietaryTags.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-xl bg-teal-100 text-teal-900 font-bold border border-teal-200 capitalize">
                  {tag.replace('-', ' ')}
                </span>
              ))}
            </div>

            <button
              id="reset-all-filters-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDietaryTags([]);
              }}
              className="text-orange-600 font-black hover:underline cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Product Grid / Paginated Results (Story 1, 4, 7, 8) */}
        {paginatedProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white rounded-[2.5rem] border-2 border-orange-100 p-8 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 mx-auto flex items-center justify-center">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-orange-950 font-['Outfit']">No Bakery Products Found</h3>
            <p className="text-xs sm:text-sm text-orange-900/70 max-w-md mx-auto font-medium">
              We couldn't find items matching your search or dietary filter combination. Try clearing filters or exploring all categories.
            </p>
            <button
              id="clear-empty-search-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDietaryTags([]);
              }}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black rounded-2xl shadow-md shadow-orange-500/20 transition cursor-pointer"
            >
              Show All Fresh Bakes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {paginatedProducts.map((product) => {
              const isInCart = cartItems.some(i => i.product.id === product.id);
              const isWishlisted = wishlistIds.includes(product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenDetails={(p) => setSelectedProductForDetail(p)}
                  onQuickAdd={handleQuickAdd}
                  isInCart={isInCart}
                  isWishlisted={isWishlisted}
                  onToggleWishlist={handleToggleWishlist}
                />
              );
            })}
          </div>
        )}

        {/* Pagination Bar (Story 1 & 4) */}
        {totalPages > 1 && (
          <div className="pt-6 flex items-center justify-between border-t-2 border-orange-100">
            <p className="text-xs text-orange-900/80 font-bold">
              Showing page <strong className="text-orange-950">{currentPage}</strong> of <strong className="text-orange-950">{totalPages}</strong> ({filteredProducts.length} total items)
            </p>

            <div className="flex items-center gap-2">
              <button
                id="prev-page-btn"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2.5 rounded-2xl border-2 border-orange-100 hover:bg-orange-50 disabled:opacity-30 text-orange-950 transition cursor-pointer font-bold"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  id={`page-btn-${pg}`}
                  onClick={() => setCurrentPage(pg)}
                  className={`w-9 h-9 rounded-2xl text-xs font-black transition cursor-pointer ${
                    currentPage === pg
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'border-2 border-orange-100 hover:bg-orange-50 text-orange-950 bg-white'
                  }`}
                >
                  {pg}
                </button>
              ))}

              <button
                id="next-page-btn"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-2xl border-2 border-orange-100 hover:bg-orange-50 disabled:opacity-30 text-orange-950 transition cursor-pointer font-bold"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Chennai City Delivery Assurance Banner */}
        <section className="mt-12 bg-white rounded-[2.5rem] p-6 sm:p-8 border-2 border-orange-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x-2 divide-orange-100">
            
            <div className="space-y-2 pt-4 md:pt-0">
              <div className="flex items-center gap-3 text-orange-700 font-black text-sm">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <span>Chennai City Coverage</span>
              </div>
              <p className="text-xs text-orange-900/80 leading-relaxed font-medium">
                Covering T. Nagar, Mylapore, Adyar, Anna Nagar, Velachery, OMR, and 40+ Chennai localities with scheduled freshness.
              </p>
            </div>

            <div className="space-y-2 pt-4 md:pt-0 md:pl-6">
              <div className="flex items-center gap-3 text-teal-700 font-black text-sm">
                <div className="w-10 h-10 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-600">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <span>Diabetic & Health Focused</span>
              </div>
              <p className="text-xs text-orange-900/80 leading-relaxed font-medium">
                Clear nutritional disclosures on calories, sugar & carbohydrates. Authentic Ragi and palm jaggery options.
              </p>
            </div>

            <div className="space-y-2 pt-4 md:pt-0 md:pl-6">
              <div className="flex items-center gap-3 text-orange-700 font-black text-sm">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span>Hygiene & RO Water Standards</span>
              </div>
              <p className="text-xs text-orange-900/80 leading-relaxed font-medium">
                FSSAI certified, zero day-old reselling, and contactless packaging in sealed tamper-evident boxes.
              </p>
            </div>

          </div>
        </section>

      </main>

      {/* 4. Footer */}
      <footer className="bg-orange-950 text-orange-200 text-xs py-12 px-4 sm:px-6 lg:px-8 mt-16 border-t-4 border-orange-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center text-white font-black text-xl">
                C
              </div>
              <span className="text-xl font-black text-white font-['Outfit']">CHENNAI <span className="text-orange-400">BAKERY</span></span>
            </div>
            <p className="text-orange-200/80 text-xs leading-relaxed font-medium">
              Crafting authentic artisan cakes, fresh breads, healthy diabetic-friendly bakes, and nostalgic Chennai delicacies.
            </p>
            <p className="text-[11px] text-orange-400 font-mono font-bold">FSSAI Lic: 12424008000451</p>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-white font-black uppercase tracking-wider text-xs">Core Categories</h4>
            <ul className="space-y-1.5 font-medium">
              <li><button onClick={() => setSelectedCategory('cakes')} className="hover:text-white cursor-pointer transition">Artisan Cakes</button></li>
              <li><button onClick={() => setSelectedCategory('cookies')} className="hover:text-white cursor-pointer transition">Cookies & Biscuits</button></li>
              <li><button onClick={() => setSelectedCategory('breads')} className="hover:text-white cursor-pointer transition">Sourdough & Breads</button></li>
              <li><button onClick={() => setSelectedCategory('eggless')} className="hover:text-white cursor-pointer transition">100% Eggless Treats</button></li>
              <li><button onClick={() => setSelectedCategory('healthy')} className="hover:text-white cursor-pointer transition">Diabetic & Low-Calorie</button></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-white font-black uppercase tracking-wider text-xs">Chennai Delivery Hubs</h4>
            <p className="text-xs text-orange-200/80 leading-relaxed font-medium">
              Central Kitchen: Usman Road, T. Nagar, Chennai - 600017.<br />
              Delivering to Mylapore, Adyar, Anna Nagar, OMR, Velachery, Porur & all 600xxx zones.
            </p>
            <button
              id="footer-verify-pin-btn"
              onClick={() => setIsPincodeModalOpen(true)}
              className="text-orange-400 font-black hover:underline cursor-pointer flex items-center gap-1 text-xs"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Check Delivery Eligibility</span>
            </button>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-white font-black uppercase tracking-wider text-xs">Quality & Standards</h4>
            <p className="text-xs text-orange-200/80 leading-relaxed font-medium">
              All items are priced in INR (₹). We adhere to strict hygiene protocols and full ingredient disclosure.
            </p>
            <button
              id="footer-hygiene-btn"
              onClick={() => setIsHygieneModalOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-orange-900 hover:bg-orange-800 text-teal-300 font-bold flex items-center gap-1.5 transition cursor-pointer text-xs border border-orange-800"
            >
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Read Hygiene Certification</span>
            </button>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-orange-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-orange-400 text-[11px] font-bold">
          <p>© 2026 Chennai Bakery. All prices in INR (₹). Freshly baked with pride in Chennai.</p>
          <div className="flex items-center gap-4">
            <button
              id="footer-admin-link"
              onClick={handleOpenAdminPortal}
              className="text-orange-300 hover:text-white font-bold cursor-pointer transition underline decoration-orange-500"
            >
              Admin Dashboard
            </button>
            <span>•</span>
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Food Safety Guidelines</span>
          </div>
        </div>
      </footer>

      {/* 5. Modals and Slide-Overs */}
      
      {/* Admin Security Login Gateway */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoginOpen(false);
          setIsAdminOpen(true);
        }}
      />

      {/* Customer Loyalty Rewards & Points Balance Modal */}
      <LoyaltyAccountModal
        isOpen={isLoyaltyOpen}
        onClose={() => setIsLoyaltyOpen(false)}
        onOpenStorefront={() => setIsLoyaltyOpen(false)}
      />

      {/* Admin Dashboard Portal (CRUD Products & Orders Management) */}
      {isAdminOpen && (
        <AdminDashboard
          onClose={() => setIsAdminOpen(false)}
          onNavigateToStorefront={() => setIsAdminOpen(false)}
          onLogout={() => setIsAdminOpen(false)}
        />
      )}

      {/* Product Details & Customization Modal (Story 7, 8, 16, 19, 20, 21, 22, 23) */}
      <ProductDetailModal
        product={selectedProductForDetail}
        isOpen={Boolean(selectedProductForDetail)}
        onClose={() => setSelectedProductForDetail(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Shopping Cart Drawer (Story 28, 29, 30) */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onOpenPincodeChecker={() => {
          setIsCartOpen(false);
          setIsPincodeModalOpen(true);
        }}
        currentPincode={currentPincode}
        localityName={localityName}
        deliveryFee={deliveryFee}
      />

      {/* PIN Code Eligibility Checker Modal (Story 34 & 35) */}
      <PincodeCheckerModal
        isOpen={isPincodeModalOpen}
        onClose={() => setIsPincodeModalOpen(false)}
        currentPincode={currentPincode}
        onPincodeVerified={handlePincodeVerified}
      />

      {/* Hygiene & Standards Modal (Story 25) */}
      <HygieneModal
        isOpen={isHygieneModalOpen}
        onClose={() => setIsHygieneModalOpen(false)}
      />

      {/* Checkout & Online Payment Modal (Story 37, 38, 40, 41, 43, 44, 45) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        currentPincode={currentPincode}
        localityName={localityName}
        deliveryFee={deliveryFee}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Order Confirmation Receipt Modal (Story 46 & 47) */}
      <OrderConfirmationModal
        order={confirmedOrder}
        isOpen={isOrderConfirmedOpen}
        onClose={() => setIsOrderConfirmedOpen(false)}
        onContinueShopping={() => setIsOrderConfirmedOpen(false)}
      />

      {/* Customer Saved Bakes / Wishlist Slide-Over */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onClearWishlist={handleClearWishlist}
        onAddToCart={handleQuickAdd}
        onAddAllToCart={handleAddAllWishlistToCart}
        cartProductIds={cartItems.map(i => i.product.id)}
        onOpenProductDetail={(p) => {
          setIsWishlistOpen(false);
          setSelectedProductForDetail(p);
        }}
      />

    </div>
  );
}
