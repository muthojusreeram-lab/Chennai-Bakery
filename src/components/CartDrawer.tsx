import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, MapPin, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
  onOpenPincodeChecker: () => void;
  currentPincode: string | null;
  localityName: string | null;
  deliveryFee: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onOpenPincodeChecker,
  currentPincode,
  localityName,
  deliveryFee
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
  const isFreeDelivery = subtotal >= 499;
  const finalDeliveryCharge = subtotal === 0 ? 0 : (isFreeDelivery ? 0 : deliveryFee);
  const grandTotal = subtotal + finalDeliveryCharge;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-amber-100 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black font-['Outfit']">Your Bakery Cart</h2>
                <p className="text-xs text-orange-100 font-medium">
                  {items.length} {items.length === 1 ? 'item' : 'items'} freshly selected
                </p>
              </div>
            </div>
            <button
              id="close-cart-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition cursor-pointer text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Location Status Banner */}
          <div className="p-3.5 bg-orange-50 border-b border-orange-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-orange-950 min-w-0">
              <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
              <div className="truncate font-medium">
                {currentPincode ? (
                  <span>Delivering to <strong className="font-bold text-orange-950">{localityName || currentPincode}</strong></span>
                ) : (
                  <span className="text-orange-900 font-bold">Delivery restricted to Chennai</span>
                )}
              </div>
            </div>
            <button
              id="cart-change-pin-btn"
              onClick={onOpenPincodeChecker}
              className="text-orange-600 font-black hover:underline shrink-0 ml-2 cursor-pointer"
            >
              {currentPincode ? 'Change' : 'Verify PIN'}
            </button>
          </div>

          {/* Free delivery progress bar */}
          {subtotal > 0 && (
            <div className="px-5 py-3 bg-teal-50 border-b border-teal-100 text-xs text-teal-950 font-medium">
              {isFreeDelivery ? (
                <div className="flex items-center gap-1.5 font-bold text-teal-800">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>You unlocked <strong>FREE Doorstep Delivery</strong> in Chennai!</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span>Add <strong className="font-black text-teal-900">₹{499 - subtotal}</strong> more for FREE delivery</span>
                    <span className="font-black text-teal-900">{Math.min(100, Math.round((subtotal / 499) * 100))}%</span>
                  </div>
                  <div className="w-full bg-teal-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-teal-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotal / 499) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-orange-100 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 mx-auto flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-black text-orange-950 font-['Outfit']">Your Cart is Empty</h3>
                <p className="text-xs text-orange-900/70 max-w-xs mx-auto font-medium">
                  Explore our artisan cakes, diabetic-friendly bakes, and Chennai filter coffee specials.
                </p>
                <button
                  id="browse-products-cart-btn"
                  onClick={onClose}
                  className="mt-3 px-6 py-3 bg-orange-500 text-white text-xs font-black rounded-2xl shadow-md shadow-orange-500/20 hover:bg-orange-600 transition cursor-pointer"
                >
                  Start Adding Bakes
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5 items-center">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-100 shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-orange-950 truncate font-['Outfit']">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-orange-900/70 font-medium">
                      Size: <span className="text-orange-950 font-bold">{item.selectedSize.name}</span>
                    </p>
                    <p className="text-xs font-black text-orange-600 mt-0.5">
                      ₹{item.unitPrice} each
                    </p>

                    {/* Quantity Selector & Item Total */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border-2 border-orange-100 rounded-xl bg-orange-50/50 p-0.5">
                        <button
                          id={`decrease-cart-qty-${item.id}`}
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-orange-950 hover:bg-white transition cursor-pointer font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-black text-orange-950">
                          {item.quantity}
                        </span>
                        <button
                          id={`increase-cart-qty-${item.id}`}
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-orange-950 hover:bg-white transition cursor-pointer font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-orange-950">
                          ₹{item.itemTotal}
                        </span>
                        <button
                          id={`remove-cart-item-${item.id}`}
                          onClick={() => onRemoveItem(item.id)}
                          className="text-orange-300 hover:text-rose-600 p-1 transition cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Order Breakdown (Story 30 - Must Have) */}
          {items.length > 0 && (
            <div className="p-5 bg-orange-50/60 border-t-2 border-orange-100 space-y-3.5">
              <div className="space-y-2 text-xs text-orange-900 font-medium">
                <div className="flex justify-between">
                  <span>Item Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-black text-orange-950">₹{subtotal}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span>Delivery Fee (Chennai)</span>
                    {isFreeDelivery && (
                      <span className="text-[10px] bg-teal-100 text-teal-900 px-2 py-0.5 rounded-full font-black">
                        FREE
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-orange-950">
                    {finalDeliveryCharge === 0 ? <span className="text-teal-700 font-black">₹0</span> : `₹${finalDeliveryCharge}`}
                  </span>
                </div>

                <div className="pt-2 border-t border-orange-200 flex justify-between text-sm font-black text-orange-950">
                  <span>Total Payable Amount</span>
                  <span className="text-xl font-black text-orange-600 font-['Outfit']">₹{grandTotal}</span>
                </div>
              </div>

              <button
                id="proceed-to-checkout-btn"
                onClick={onProceedToCheckout}
                className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl text-sm shadow-md shadow-orange-500/20 transition cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-orange-900/70 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>100% Contactless Delivery & Secure Payment</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
