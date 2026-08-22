import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight, Sparkles, Plus, Check } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onClearWishlist: () => void;
  onAddToCart: (product: Product) => void;
  onAddAllToCart: () => void;
  cartProductIds: string[];
  onOpenProductDetail: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onClearWishlist,
  onAddToCart,
  onAddAllToCart,
  cartProductIds,
  onOpenProductDetail
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-orange-950/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l-4 border-orange-100 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-rose-50 to-orange-50 border-b-2 border-orange-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h2 className="text-lg font-black text-orange-950 font-['Outfit']">My Saved Bakes</h2>
                <p className="text-xs text-orange-900/70 font-medium">
                  {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved for later
                </p>
              </div>
            </div>

            <button
              id="close-wishlist-btn"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white hover:bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-900 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-4">
                <div className="w-20 h-20 rounded-full bg-rose-50 border-2 border-rose-100 flex items-center justify-center mx-auto text-rose-400">
                  <Heart className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-orange-950 font-['Outfit']">Your Wishlist is Empty</h3>
                  <p className="text-xs text-orange-900/70 max-w-xs mx-auto mt-1 font-medium leading-relaxed">
                    Click the heart icon on any cake, sourdough bread, or Chennai Iyengar bun to save it for your future celebrations.
                  </p>
                </div>
                <button
                  id="wishlist-empty-explore-btn"
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs transition cursor-pointer shadow-md shadow-orange-500/20"
                >
                  Explore Chennai Bakery Menu
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-orange-900/70 pb-2 border-b border-orange-100">
                  <span className="font-bold">Items you love</span>
                  <button
                    id="clear-all-wishlist-btn"
                    onClick={onClearWishlist}
                    className="text-rose-600 hover:text-rose-700 font-bold transition cursor-pointer text-[11px]"
                  >
                    Clear All
                  </button>
                </div>

                {wishlistProducts.map((product) => {
                  const inCart = cartProductIds.includes(product.id);
                  return (
                    <div
                      key={product.id}
                      id={`wishlist-item-${product.id}`}
                      className="p-4 rounded-3xl border-2 border-orange-100 bg-white hover:border-orange-200 transition flex gap-3.5 items-center shadow-xs"
                    >
                      {/* Product Thumbnail */}
                      <img
                        src={product.image}
                        alt={product.name}
                        onClick={() => {
                          onOpenProductDetail(product);
                          onClose();
                        }}
                        className="w-16 h-16 rounded-2xl object-cover border border-orange-100 cursor-pointer shrink-0"
                      />

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        {product.tamilName && (
                          <span className="text-[10px] text-orange-500 font-bold block truncate">
                            {product.tamilName}
                          </span>
                        )}
                        <h4
                          onClick={() => {
                            onOpenProductDetail(product);
                            onClose();
                          }}
                          className="text-xs sm:text-sm font-black text-orange-950 truncate cursor-pointer hover:text-orange-600 transition"
                        >
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-black text-orange-600 font-['Outfit']">
                            ₹{product.basePrice}
                          </span>
                          <span className="text-[10px] text-orange-900/60 font-medium">
                            • {product.sizes[0]?.name || 'Standard'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <button
                          id={`wishlist-add-cart-${product.id}`}
                          onClick={() => onAddToCart(product)}
                          className={`p-2.5 rounded-xl transition cursor-pointer flex items-center justify-center ${
                            inCart
                              ? 'bg-teal-500 text-white'
                              : 'bg-orange-500 hover:bg-orange-600 text-white shadow-xs'
                          }`}
                          title={inCart ? 'Already in Cart (Add another)' : 'Add to Cart'}
                        >
                          {inCart ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4 stroke-[3]" />}
                        </button>

                        <button
                          id={`wishlist-remove-${product.id}`}
                          onClick={() => onRemoveFromWishlist(product.id)}
                          className="p-2 rounded-xl text-orange-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer flex items-center justify-center"
                          title="Remove from Wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer with Move All To Cart */}
          {wishlistProducts.length > 0 && (
            <div className="p-6 bg-orange-50/50 border-t-2 border-orange-100 space-y-3">
              <button
                id="wishlist-add-all-btn"
                onClick={() => {
                  onAddAllToCart();
                  onClose();
                }}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl text-xs transition cursor-pointer shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Move All to Cart ({wishlistProducts.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
