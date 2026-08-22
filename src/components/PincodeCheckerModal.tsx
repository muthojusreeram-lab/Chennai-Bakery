import React, { useState } from 'react';
import { X, MapPin, CheckCircle2, AlertCircle, Sparkles, Navigation, Clock, ShieldCheck } from 'lucide-react';
import { checkChennaiPincode } from '../data/chennaiPincodes';
import { ChennaiPinLocation } from '../types';

interface PincodeCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPincode: string | null;
  onPincodeVerified: (location: ChennaiPinLocation) => void;
}

export const PincodeCheckerModal: React.FC<PincodeCheckerModalProps> = ({
  isOpen,
  onClose,
  currentPincode,
  onPincodeVerified
}) => {
  const [pinInput, setPinInput] = useState(currentPincode || '');
  const [verificationResult, setVerificationResult] = useState<{
    tested: boolean;
    isDeliverable: boolean;
    location?: ChennaiPinLocation;
    message: string;
  } | null>(currentPincode ? checkChennaiPincode(currentPincode) ? { tested: true, ...checkChennaiPincode(currentPincode) } : null : null);

  if (!isOpen) return null;

  const handleVerify = (codeToTest?: string) => {
    const code = (codeToTest || pinInput).trim();
    if (!code) return;
    const result = checkChennaiPincode(code);
    setVerificationResult({ tested: true, ...result });
    if (result.isDeliverable && result.location) {
      onPincodeVerified(result.location);
    }
  };

  const popularPincodes = [
    { name: 'T. Nagar', pin: '600017' },
    { name: 'Mylapore', pin: '600004' },
    { name: 'Anna Nagar', pin: '600040' },
    { name: 'Adyar / Besant Nagar', pin: '600020' },
    { name: 'Velachery', pin: '600042' },
    { name: 'OMR / Perungudi', pin: '600096' },
    { name: 'Nungambakkam', pin: '600034' },
    { name: 'Porur', pin: '600116' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-orange-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden border-4 border-orange-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white relative">
          <button
            id="close-pincode-modal-btn"
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-2xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-inner">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black font-['Outfit']">Chennai Delivery Check</h2>
              <p className="text-xs text-orange-100 font-medium">Fresh artisan bakes delivered across Chennai City</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7 space-y-6">
          <div>
            <label className="block text-xs font-black text-orange-950 uppercase tracking-wider mb-2">
              Enter 6-Digit Chennai PIN Code
            </label>
            <div className="flex gap-2.5">
              <div className="relative flex-1">
                <input
                  id="pincode-modal-input"
                  type="text"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setPinInput(val);
                    if (val.length === 6) {
                      handleVerify(val);
                    }
                  }}
                  placeholder="e.g. 600017 (T. Nagar)"
                  className="w-full pl-11 pr-4 py-3 bg-orange-50/50 border-2 border-orange-100 rounded-2xl text-base font-black text-orange-950 focus:outline-none focus:border-orange-500 focus:bg-white transition"
                />
                <Navigation className="w-4 h-4 text-orange-600 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
              <button
                id="check-pincode-btn"
                onClick={() => handleVerify()}
                disabled={pinInput.length !== 6}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black rounded-2xl text-xs transition cursor-pointer shadow-md shadow-orange-500/20"
              >
                Check
              </button>
            </div>
          </div>

          {/* Verification Result Notification */}
          {verificationResult && verificationResult.tested && (
            <div
              id="pincode-result-box"
              className={`p-4 sm:p-5 rounded-3xl border-2 transition-all ${
                verificationResult.isDeliverable
                  ? 'bg-teal-50 border-teal-200 text-teal-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-start gap-3">
                {verificationResult.isDeliverable ? (
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-black">
                      {verificationResult.isDeliverable ? 'Deliverable to this Address!' : 'Delivery Not Available'}
                    </p>
                    {verificationResult.isDeliverable && (
                      <span className="text-[10px] uppercase font-black px-2.5 py-0.5 bg-teal-200 text-teal-900 rounded-full">
                        Active Zone
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-orange-900/80 leading-relaxed font-medium">
                    {verificationResult.message}
                  </p>

                  {verificationResult.isDeliverable && verificationResult.location && (
                    <div className="mt-3 pt-3 border-t-2 border-teal-200/60 grid grid-cols-2 gap-2 text-xs font-bold">
                      <div className="flex items-center gap-1.5 text-teal-800">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        <span>{verificationResult.location.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-teal-800 justify-end">
                        <span>Standard Delivery: ₹{verificationResult.location.deliveryFee}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quick Popular Locality Selectors */}
          <div>
            <p className="text-xs font-black text-orange-950 mb-2.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Or pick a popular Chennai neighbourhood:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {popularPincodes.map((item) => (
                <button
                  key={item.pin}
                  id={`pincode-pill-${item.pin}`}
                  onClick={() => {
                    setPinInput(item.pin);
                    handleVerify(item.pin);
                  }}
                  className={`text-xs px-3.5 py-2 rounded-xl border-2 transition font-bold cursor-pointer ${
                    pinInput === item.pin
                      ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                      : 'bg-orange-50/50 hover:bg-orange-100 border-orange-100 text-orange-950'
                  }`}
                >
                  {item.name} <span className="text-[10px] opacity-75">({item.pin})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Guarantee Note */}
          <div className="bg-orange-50 rounded-2xl p-3.5 flex items-center gap-3 border-2 border-orange-100 text-xs text-orange-900 font-medium">
            <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
            <p>
              All orders are dispatched in temperature-controlled, sealed safety boxes to preserve bakery fresh aroma.
            </p>
          </div>

          {/* Confirm and Proceed Button */}
          {verificationResult?.isDeliverable && (
            <button
              id="confirm-pincode-btn"
              onClick={onClose}
              className="w-full py-3.5 bg-teal-500 hover:bg-teal-600 text-white font-black rounded-2xl text-xs transition cursor-pointer shadow-md shadow-teal-500/20 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Set as Delivery Location & Browse</span>
            </button>
          )}

        </div>
      </div>
    </div>
  );
};
