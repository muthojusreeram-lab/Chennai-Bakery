import React from 'react';
import { X, ShieldCheck, Droplets, Sparkles, Award, CheckCircle2, ThermometerSnowflake, PackageCheck, Utensils } from 'lucide-react';

interface HygieneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HygieneModal: React.FC<HygieneModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-orange-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-orange-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-white relative">
          <button
            id="close-hygiene-modal-btn"
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-2xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black font-['Outfit']">Hygiene & Food Safety Standards</h2>
                <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-teal-800/60 text-teal-100">
                  Certified Safe
                </span>
              </div>
              <p className="text-xs text-teal-100 font-medium">
                100% Transparency on our baking hygiene, certifications & ingredient sourcing
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-7 space-y-6">
          
          {/* FSSAI & Accreditation Card */}
          <div className="bg-teal-50/70 border-2 border-teal-100 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black text-teal-900 uppercase tracking-wide">FSSAI Central Compliance</p>
                <p className="text-base font-black text-orange-950 font-mono">Lic. No: 12424008000451</p>
                <p className="text-[11px] text-orange-900/70 font-medium">Government of Tamil Nadu Food Safety and Standards Authority</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-teal-800 bg-white px-3.5 py-2 rounded-2xl border-2 border-teal-200 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                ISO 22000:2018 Certified
              </span>
            </div>
          </div>

          {/* Pillars of Kitchen Hygiene */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-5 rounded-3xl bg-orange-50/50 border-2 border-orange-100 space-y-2">
              <div className="flex items-center gap-2.5 text-teal-700 font-black text-sm">
                <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center">
                  <Droplets className="w-4 h-4 text-teal-600" />
                </div>
                <span>100% RO Mineral Water</span>
              </div>
              <p className="text-xs text-orange-900/80 leading-relaxed font-medium">
                All kneading, dough resting, and syrup reductions are prepared strictly using multi-stage Reverse Osmosis UV purified drinking water.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-orange-50/50 border-2 border-orange-100 space-y-2">
              <div className="flex items-center gap-2.5 text-orange-700 font-black text-sm">
                <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Utensils className="w-4 h-4 text-orange-600" />
                </div>
                <span>SS-304 Food Grade Kitchen</span>
              </div>
              <p className="text-xs text-orange-900/80 leading-relaxed font-medium">
                All worktables, planetary mixers, and stone-deck ovens are surgical-grade SS-304 stainless steel sanitized every 4 hours.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-orange-50/50 border-2 border-orange-100 space-y-2">
              <div className="flex items-center gap-2.5 text-orange-800 font-black text-sm">
                <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
                  <ThermometerSnowflake className="w-4 h-4 text-orange-600" />
                </div>
                <span>18°C Controlled Prep Rooms</span>
              </div>
              <p className="text-xs text-orange-900/80 leading-relaxed font-medium">
                Pastry rolling and fresh cream whipping rooms operate in strict climate-controlled environments to prevent bacterial growth.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-orange-50/50 border-2 border-orange-100 space-y-2">
              <div className="flex items-center gap-2.5 text-teal-700 font-black text-sm">
                <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center">
                  <PackageCheck className="w-4 h-4 text-teal-600" />
                </div>
                <span>Tamper-Evident Safety Seals</span>
              </div>
              <p className="text-xs text-orange-900/80 leading-relaxed font-medium">
                Every pastry box, cake box, and cookie tin is hand-sealed with a tamper-evident holographic seal before departing the bakery hub.
              </p>
            </div>

          </div>

          {/* Sourcing Commitment */}
          <div className="border-t-2 border-orange-100 pt-4 space-y-3">
            <h3 className="text-sm font-black text-orange-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Ingredient Quality & Ethical Sourcing</span>
            </h3>
            <ul className="space-y-2 text-xs text-orange-900/80 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong className="text-orange-950 font-bold">No Artificial Trans Fats:</strong> Zero hydrogenated palm oil or vanaspati. We bake strictly with pure churned cow butter and desi ghee.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong className="text-orange-950 font-bold">Native Tamil Nadu Produce:</strong> Organic Karupatti sourced from Tuticorin, Millets from Dharmapuri, and shade-grown Arabica from Nilgiris.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong className="text-orange-950 font-bold">Zero Chemical Preservatives:</strong> Bread and cakes are baked fresh on the day of order with completely clean labels.</span>
              </li>
            </ul>
          </div>

          {/* Close Button */}
          <button
            id="dismiss-hygiene-modal-btn"
            onClick={onClose}
            className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white font-black rounded-2xl text-xs transition cursor-pointer shadow-md shadow-teal-500/20"
          >
            I Understand & Trust Chennai Bakery
          </button>

        </div>
      </div>
    </div>
  );
};
