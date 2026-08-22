import React, { useState, useEffect } from 'react';
import { 
  X, Award, Sparkles, Star, Gift, ShieldCheck, 
  ChevronRight, ArrowRight, UserCheck, RefreshCw, 
  Check, LogOut, Info, Tag, ShoppingBag 
} from 'lucide-react';
import { LoyaltyUser } from '../types';
import { DatabaseService } from '../data/database';

interface LoyaltyAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenStorefront?: () => void;
}

export const LoyaltyAccountModal: React.FC<LoyaltyAccountModalProps> = ({
  isOpen,
  onClose,
  onOpenStorefront
}) => {
  if (!isOpen) return null;

  const [loyaltyUser, setLoyaltyUser] = useState<LoyaltyUser>(() => DatabaseService.getLoyaltyUser());
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(loyaltyUser.name);
  const [phoneInput, setPhoneInput] = useState<string>(loyaltyUser.phone);
  const [emailInput, setEmailInput] = useState<string>(loyaltyUser.email);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    setLoyaltyUser(DatabaseService.getLoyaltyUser());
  }, [isOpen]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = DatabaseService.updateLoyaltyProfile({
      name: nameInput.trim() || loyaltyUser.name,
      phone: phoneInput.trim() || loyaltyUser.phone,
      email: emailInput.trim() || loyaltyUser.email
    });
    setLoyaltyUser(updated);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Tier calculation progress
  const tiers = [
    { name: 'Bronze', min: 0, max: 299, color: 'from-amber-700 to-amber-900', perks: '1 Pt per ₹10 spent, Birthday Cake 5% off' },
    { name: 'Silver', min: 300, max: 999, color: 'from-slate-400 to-slate-600', perks: '1.25x Points multiplier, Priority Baking slot' },
    { name: 'Gold', min: 1000, max: 1999, color: 'from-amber-400 to-amber-600', perks: '1.5x Points, Free Delivery on all Chennai orders' },
    { name: 'Mylapore Club', min: 2000, max: 10000, color: 'from-orange-500 to-rose-600', perks: 'VIP Taster box, Secret seasonal flavor preview' }
  ];

  const currentTierObj = tiers.find(t => t.name.toLowerCase() === loyaltyUser.tier.toLowerCase()) || tiers[1];
  const nextTierObj = tiers[tiers.indexOf(currentTierObj) + 1] || null;

  const pointsToNext = nextTierObj ? Math.max(0, nextTierObj.min - loyaltyUser.points) : 0;
  const progressPercent = nextTierObj 
    ? Math.min(100, Math.round(((loyaltyUser.points - currentTierObj.min) / (nextTierObj.min - currentTierObj.min)) * 100))
    : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-orange-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="loyalty-program-modal"
        className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden border-4 border-orange-200 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
      >
        {/* Top VIP Gradient Banner */}
        <div className="relative bg-gradient-to-r from-orange-600 via-amber-500 to-orange-700 text-white p-6 sm:p-7 shrink-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-[11px] font-black uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-amber-200" />
                <span>Chennai Bakery Rewards</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-300 text-orange-950 text-[10px] font-black uppercase tracking-wider">
                {loyaltyUser.tier} Tier
              </span>
            </div>

            <button
              id="close-loyalty-modal-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-orange-100 font-bold uppercase tracking-wider">
                {loyaltyUser.name}
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-black font-['Outfit'] tracking-tight">
                  {loyaltyUser.points}
                </span>
                <span className="text-sm font-bold text-orange-100 uppercase">
                  Bakes Points
                </span>
              </div>
              <p className="text-xs text-orange-100 font-medium mt-1">
                Redeemable value: <strong className="text-white font-bold">₹{Math.floor(loyaltyUser.points / 10)}</strong> off your next order
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-orange-200 uppercase font-black tracking-wider block">
                Member ID
              </span>
              <span className="text-xs font-mono font-bold text-white bg-black/20 px-2.5 py-1 rounded-lg">
                {loyaltyUser.customerId}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6">

          {/* Tier Progress Bar */}
          <div className="bg-orange-50/70 p-4 rounded-2xl border-2 border-orange-100 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-orange-950 uppercase tracking-wider">
                Tier Progress ({loyaltyUser.tier})
              </span>
              {nextTierObj ? (
                <span className="text-orange-600 font-bold">
                  {pointsToNext} more pts to {nextTierObj.name}
                </span>
              ) : (
                <span className="text-teal-700 font-bold">Max Tier Achieved 🎉</span>
              )}
            </div>

            <div className="w-full bg-orange-200/60 rounded-full h-3 overflow-hidden p-0.5">
              <div 
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-[11px] text-orange-900/70 font-medium leading-relaxed">
              Current Tier Perk: <strong className="text-orange-950 font-bold">{currentTierObj.perks}</strong>
            </p>
          </div>

          {/* How to Earn Points Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-orange-950 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>How Chennai Bakery Points Work</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-xs space-y-1">
                <span className="font-black text-amber-950 flex items-center gap-1">
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                  Earn on Every Order
                </span>
                <p className="text-amber-900/80 text-[11px] leading-relaxed">
                  Earn 1 Point for every ₹10 spent on all cakes, breads, cookies & buns.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200/70 text-xs space-y-1">
                <span className="font-black text-teal-950 flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5 text-teal-600" />
                  Auto Redemption
                </span>
                <p className="text-teal-900/80 text-[11px] leading-relaxed">
                  Points can be deducted directly at checkout for discounts on fresh Chennai deliveries.
                </p>
              </div>
            </div>
          </div>

          {/* Customer Profile Details / Edit */}
          <div className="space-y-3 border-t-2 border-orange-100 pt-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-orange-950 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-orange-500" />
                <span>Customer Profile Details</span>
              </h3>

              {!isEditing && (
                <button
                  type="button"
                  id="edit-loyalty-profile-btn"
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold text-orange-600 hover:text-orange-800 transition cursor-pointer"
                >
                  Edit Details
                </button>
              )}
            </div>

            {savedSuccess && (
              <div className="p-2.5 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-3 bg-orange-50/50 p-4 rounded-2xl border border-orange-200">
                <div>
                  <label className="block text-[11px] font-bold text-orange-900 mb-1">Full Name</label>
                  <input
                    type="text"
                    id="loyalty-name-input"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 bg-white border border-orange-200 rounded-xl text-xs font-medium text-orange-950 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-orange-900 mb-1">Phone</label>
                    <input
                      type="tel"
                      id="loyalty-phone-input"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      required
                      className="w-full px-3.5 py-2 bg-white border border-orange-200 rounded-xl text-xs font-medium text-orange-950 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-orange-900 mb-1">Email</label>
                    <input
                      type="email"
                      id="loyalty-email-input"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      required
                      className="w-full px-3.5 py-2 bg-white border border-orange-200 rounded-xl text-xs font-medium text-orange-950 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 text-xs font-bold text-orange-800 hover:bg-orange-100 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="save-loyalty-profile-btn"
                    className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black rounded-xl cursor-pointer shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-orange-50/40 p-4 rounded-2xl border border-orange-100/80 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-orange-800/70 font-medium">Customer Name:</span>
                  <span className="font-bold text-orange-950">{loyaltyUser.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-800/70 font-medium">Registered Phone:</span>
                  <span className="font-mono font-bold text-orange-950">{loyaltyUser.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-800/70 font-medium">Email ID:</span>
                  <span className="font-medium text-orange-950">{loyaltyUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-800/70 font-medium">Lifetime Points Earned:</span>
                  <span className="font-black text-amber-700">{loyaltyUser.lifetimeEarned} pts</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-orange-50/80 border-t-2 border-orange-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-orange-900/70 font-medium">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Chennai Bakery Bakes Club</span>
          </div>

          <button
            id="start-shopping-loyalty-btn"
            onClick={() => {
              onClose();
              if (onOpenStorefront) onOpenStorefront();
            }}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl text-xs shadow-md shadow-orange-500/20 transition cursor-pointer flex items-center gap-1.5"
          >
            <span>Order Fresh Bakes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
