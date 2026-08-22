import React, { useState } from 'react';
import { 
  X, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, ShieldCheck, 
  MapPin, Calendar, Clock, CreditCard, Smartphone, Building, 
  Lock, Check, Loader2, Sparkles, AlertTriangle
} from 'lucide-react';
import { CartItem, CustomerDetails, DeliverySlot, PaymentMethod, PaymentDetails, Order } from '../types';
import { checkChennaiPincode } from '../data/chennaiPincodes';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currentPincode: string | null;
  localityName: string | null;
  deliveryFee: number;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currentPincode,
  localityName,
  deliveryFee,
  onOrderPlaced
}) => {
  if (!isOpen) return null;

  // Stepper state: 'details' -> 'slot' -> 'review_and_pay'
  const [step, setStep] = useState<'details' | 'slot' | 'review_and_pay'>('details');

  // Customer Form
  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    locality: localityName || '',
    pincode: currentPincode || '',
    deliveryInstructions: ''
  });

  // Errors state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Delivery Slots (Story 37 & 38)
  const today = new Date();
  const dateOptions = [
    { date: 'today', label: `Today (${today.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})` },
    { date: 'tomorrow', label: `Tomorrow (${new Date(Date.now() + 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})` },
    { date: 'day-after', label: `${new Date(Date.now() + 172800000).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}` }
  ];

  const timeSlots = [
    { id: 'morning', label: '🌅 Morning Slot (07:00 AM - 10:00 AM)', desc: 'Baked fresh at dawn' },
    { id: 'afternoon', label: '☀️ Afternoon Slot (11:00 AM - 02:00 PM)', desc: 'Midday freshness' },
    { id: 'evening', label: '🌇 Evening Tea Slot (03:00 PM - 06:00 PM)', desc: 'Perfect for tea time' },
    { id: 'night', label: '🌙 Dinner & Celebration Slot (06:00 PM - 09:00 PM)', desc: 'Fresh evening delivery' }
  ];

  const [selectedDate, setSelectedDate] = useState<string>(dateOptions[0].label);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(timeSlots[1].label);

  // Payment method (Story 43 & 44)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'other'>('gpay');
  const [upiId, setUpiId] = useState('luckyhector@okhdfcbank');
  
  // Card details
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4532 •••• •••• 8821',
    cardName: 'LUCKY HECTOR',
    expiry: '10/28',
    cvv: '•••'
  });

  // Payment processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Financial calculations
  const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
  const isFreeDelivery = subtotal >= 499;
  const actualDeliveryCharge = isFreeDelivery ? 0 : deliveryFee;
  const grandTotal = subtotal + actualDeliveryCharge;

  // Step 1: Validate Customer Details & Chennai PIN (Story 34, 35, 40)
  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!customer.fullName.trim()) errors.fullName = 'Full Name is required';
    
    const phoneClean = customer.phone.replace(/\D/g, '');
    if (!phoneClean || phoneClean.length !== 10) {
      errors.phone = 'Enter a valid 10-digit mobile number (e.g. 9840123456)';
    }

    if (!customer.addressLine1.trim()) errors.addressLine1 = 'Street Address / House No. is required';

    // PIN code verification (Story 34 & 35)
    const pinCheck = checkChennaiPincode(customer.pincode);
    if (!pinCheck.isDeliverable) {
      errors.pincode = pinCheck.message || 'Delivery is restricted to Chennai City PIN codes (600xxx).';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextFromDetails = () => {
    if (validateStep1()) {
      setStep('slot');
    }
  };

  // Step 4 & 5: Online Payment Simulation (Story 43, 44, 45, 46, 47)
  const handleSimulatePayment = (forceFail = false) => {
    setIsProcessing(true);
    setPaymentError(null);

    setTimeout(() => {
      setIsProcessing(false);

      if (forceFail) {
        setPaymentError('Simulated Payment Declined: Bank server timed out or insufficient funds. Please retry or choose another payment method.');
        return;
      }

      // Generate unique Chennai Bakery Order ID (Story 47)
      const randomOrderNum = Math.floor(10000 + Math.random() * 90000);
      const newOrder: Order = {
        orderId: `CHN-BK-${randomOrderNum}`,
        createdAt: new Date().toISOString(),
        items,
        customer,
        deliverySlot: {
          dateLabel: selectedDate,
          timeSlot: selectedTimeSlot
        },
        pricing: {
          subtotal,
          deliveryFee: actualDeliveryCharge,
          taxes: 0,
          discount: 0,
          totalAmount: grandTotal
        },
        payment: {
          method: paymentMethod,
          status: 'PAID',
          transactionId: `TXN-UPI-${Math.floor(100000000 + Math.random() * 900000000)}`,
          paidAt: new Date().toLocaleTimeString('en-IN')
        },
        status: 'Confirmed'
      };

      onOrderPlaced(newOrder);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-orange-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden border-4 border-orange-100 animate-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black font-['Outfit']">Chennai Bakery Checkout</h2>
              <p className="text-xs text-orange-100 font-medium">Step {step === 'details' ? '1 of 3' : step === 'slot' ? '2 of 3' : '3 of 3'}</p>
            </div>
          </div>
          <button
            id="close-checkout-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="grid grid-cols-3 bg-orange-50 border-b-2 border-orange-100 text-xs font-black text-center">
          <div className={`py-3 flex items-center justify-center gap-1.5 border-r border-orange-100 ${
            step === 'details' ? 'bg-orange-500 text-white' : 'text-orange-900/70'
          }`}>
            <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[10px]">1</span>
            <span>Delivery Address</span>
          </div>

          <div className={`py-3 flex items-center justify-center gap-1.5 border-r border-orange-100 ${
            step === 'slot' ? 'bg-orange-500 text-white' : 'text-orange-900/70'
          }`}>
            <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[10px]">2</span>
            <span>Delivery Slot</span>
          </div>

          <div className={`py-3 flex items-center justify-center gap-1.5 ${
            step === 'review_and_pay' ? 'bg-orange-500 text-white' : 'text-orange-900/70'
          }`}>
            <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[10px]">3</span>
            <span>Review & Pay</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {/* STEP 1: Customer Details & Chennai PIN (Story 40) */}
          {step === 'details' && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h3 className="text-sm font-black text-orange-950 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <span>Where should we deliver your fresh bakes?</span>
                </h3>
                <p className="text-xs text-orange-900/70 mt-0.5 font-medium">Delivery is exclusive to Chennai City addresses.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-orange-950 uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    id="checkout-name-input"
                    type="text"
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    placeholder="e.g. Lucky Hector"
                    className="w-full px-4 py-3 bg-orange-50/50 border-2 border-orange-100 rounded-2xl text-sm focus:outline-none focus:border-orange-500 font-medium text-orange-950"
                  />
                  {formErrors.fullName && <p className="text-xs text-rose-600 mt-1 font-bold">{formErrors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-black text-orange-950 uppercase mb-1">
                    Phone Number (10 Digits) *
                  </label>
                  <input
                    id="checkout-phone-input"
                    type="tel"
                    maxLength={10}
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value.replace(/\D/g, '') })}
                    placeholder="e.g. 9840123456"
                    className="w-full px-4 py-3 bg-orange-50/50 border-2 border-orange-100 rounded-2xl text-sm focus:outline-none focus:border-orange-500 font-medium text-orange-950"
                  />
                  {formErrors.phone && <p className="text-xs text-rose-600 mt-1 font-bold">{formErrors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-orange-950 uppercase mb-1">
                    Chennai PIN Code (600xxx) *
                  </label>
                  <input
                    id="checkout-pincode-input"
                    type="text"
                    maxLength={6}
                    value={customer.pincode}
                    onChange={(e) => {
                      const pin = e.target.value.replace(/\D/g, '');
                      setCustomer({ ...customer, pincode: pin });
                      const check = checkChennaiPincode(pin);
                      if (check.isDeliverable && check.location) {
                        setCustomer(prev => ({ ...prev, pincode: pin, locality: check.location?.locality || prev.locality }));
                      }
                    }}
                    placeholder="e.g. 600017"
                    className="w-full px-4 py-3 bg-orange-50/50 border-2 border-orange-100 rounded-2xl text-sm focus:outline-none focus:border-orange-500 font-medium text-orange-950"
                  />
                  {formErrors.pincode && <p className="text-xs text-rose-600 mt-1 font-bold">{formErrors.pincode}</p>}
                </div>

                <div>
                  <label className="block text-xs font-black text-orange-950 uppercase mb-1">
                    Locality / Area Name *
                  </label>
                  <input
                    id="checkout-locality-input"
                    type="text"
                    value={customer.locality}
                    onChange={(e) => setCustomer({ ...customer, locality: e.target.value })}
                    placeholder="e.g. T. Nagar / Mylapore / Adyar"
                    className="w-full px-4 py-3 bg-orange-50/50 border-2 border-orange-100 rounded-2xl text-sm focus:outline-none focus:border-orange-500 font-medium text-orange-950"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-orange-950 uppercase mb-1">
                  Complete Door No., Building, Street Address *
                </label>
                <textarea
                  id="checkout-address-input"
                  rows={2}
                  value={customer.addressLine1}
                  onChange={(e) => setCustomer({ ...customer, addressLine1: e.target.value })}
                  placeholder="e.g. Flat 3B, Golden Towers, 14th Avenue, Near Pondy Bazaar"
                  className="w-full px-4 py-3 bg-orange-50/50 border-2 border-orange-100 rounded-2xl text-sm focus:outline-none focus:border-orange-500 font-medium text-orange-950"
                />
                {formErrors.addressLine1 && <p className="text-xs text-rose-600 mt-1 font-bold">{formErrors.addressLine1}</p>}
              </div>

              <div>
                <label className="block text-xs font-black text-orange-950 uppercase mb-1">
                  Delivery Notes / Cake Message (Optional)
                </label>
                <input
                  id="checkout-instructions-input"
                  type="text"
                  value={customer.deliveryInstructions}
                  onChange={(e) => setCustomer({ ...customer, deliveryInstructions: e.target.value })}
                  placeholder="e.g. Happy Birthday Varun! / Leave at security gate"
                  className="w-full px-4 py-3 bg-orange-50/50 border-2 border-orange-100 rounded-2xl text-sm focus:outline-none focus:border-orange-500 font-medium text-orange-950"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Delivery Slot Selection (Story 37 & 38) */}
          {step === 'slot' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-sm font-black text-orange-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span>Choose Your Delivery Date (Story 37)</span>
                </h3>
                <p className="text-xs text-orange-900/70 mt-0.5 font-medium">Freshly baked deck-oven batches are prepared for each slot.</p>
              </div>

              {/* Date Options */}
              <div className="grid grid-cols-3 gap-3">
                {dateOptions.map((opt) => {
                  const isSelected = selectedDate === opt.label;
                  return (
                    <button
                      key={opt.date}
                      id={`slot-date-${opt.date}`}
                      onClick={() => setSelectedDate(opt.label)}
                      className={`p-4 rounded-2xl border-2 text-center transition cursor-pointer ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50 text-orange-950 font-black shadow-xs'
                          : 'border-orange-100 bg-white hover:border-orange-200 text-orange-900/80 font-bold'
                      }`}
                    >
                      <span className="text-xs font-black block">{opt.label}</span>
                      <span className="text-[10px] text-teal-700 font-black mt-0.5 block">Slots Available</span>
                    </button>
                  );
                })}
              </div>

              <div>
                <h3 className="text-sm font-black text-orange-950 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span>Select Time Window (Story 38)</span>
                </h3>

                <div className="space-y-2.5">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot.label;
                    return (
                      <button
                        key={slot.id}
                        id={`time-slot-${slot.id}`}
                        onClick={() => setSelectedTimeSlot(slot.label)}
                        className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition cursor-pointer ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50 text-orange-950 font-bold shadow-xs'
                            : 'border-orange-100 bg-white hover:border-orange-200 text-orange-900/80 font-medium'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-black text-orange-950">{slot.label}</p>
                          <p className="text-xs text-orange-900/70 font-medium">{slot.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-orange-500 bg-orange-500 text-white' : 'border-orange-200'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Order Review & Online Payment (Story 41, 43, 44, 45) */}
          {step === 'review_and_pay' && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Order Review Summary Card (Story 41 - Must Have) */}
              <div className="bg-orange-50/60 border-2 border-orange-100 rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b-2 border-orange-100 pb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-orange-950">Order Items Review</span>
                  <span className="text-xs text-orange-900/70 font-bold">{items.length} items</span>
                </div>

                <div className="divide-y divide-orange-100 max-h-36 overflow-y-auto space-y-2 font-medium">
                  {items.map((item) => (
                    <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-orange-950">{item.product.name}</span>
                        <span className="text-orange-900/70 ml-1">({item.selectedSize.name} × {item.quantity})</span>
                      </div>
                      <span className="font-black text-orange-950">₹{item.itemTotal}</span>
                    </div>
                  ))}
                </div>

                {/* Delivery details snapshot */}
                <div className="pt-2 border-t-2 border-orange-100 text-xs text-orange-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-medium">
                  <div>
                    <strong className="font-bold text-orange-950">Deliver to:</strong> {customer.fullName}, {customer.locality} ({customer.pincode})
                  </div>
                  <div>
                    <strong className="font-bold text-orange-950">Slot:</strong> {selectedDate}, {selectedTimeSlot.split('(')[1]?.replace(')', '') || selectedTimeSlot}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="pt-2 border-t-2 border-orange-100 space-y-1 text-xs text-orange-900 font-medium">
                  <div className="flex justify-between">
                    <span>Items Subtotal:</span>
                    <span className="font-bold text-orange-950">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charge (Chennai):</span>
                    <span>{actualDeliveryCharge === 0 ? <strong className="text-teal-700 font-black">FREE</strong> : `₹${actualDeliveryCharge}`}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-orange-950 pt-2 border-t border-orange-200">
                    <span>Total Amount to Pay:</span>
                    <span className="text-orange-600 text-lg font-['Outfit']">₹{grandTotal} INR</span>
                  </div>
                </div>

                {/* Loyalty points gain announcement */}
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-center justify-between font-medium">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Loyalty Points to Earn:</span>
                  </div>
                  <span className="font-black text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full text-xs">
                    +{Math.max(10, Math.round(grandTotal / 10))} Pts
                  </span>
                </div>
              </div>

              {/* Online Payment Method Selection (Story 43 & 44 - Must Have) */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-orange-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-teal-600" />
                  <span>Select Secure Digital Payment Method (Story 43 & 44)</span>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    id="pay-method-upi"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'border-orange-500 bg-orange-50 text-orange-950 font-bold shadow-xs'
                        : 'border-orange-100 bg-white text-orange-900/80 font-medium'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-orange-600 shrink-0" />
                    <div className="text-left">
                      <span className="text-xs font-black block">UPI Instant Pay</span>
                      <span className="text-[10px] text-orange-900/60 font-medium">GPay, PhonePe, Paytm</span>
                    </div>
                  </button>

                  <button
                    id="pay-method-card"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-orange-500 bg-orange-50 text-orange-950 font-bold shadow-xs'
                        : 'border-orange-100 bg-white text-orange-900/80 font-medium'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-orange-600 shrink-0" />
                    <div className="text-left">
                      <span className="text-xs font-black block">Cards / Netbanking</span>
                      <span className="text-[10px] text-orange-900/60 font-medium">Visa, RuPay, Master</span>
                    </div>
                  </button>
                </div>

                {/* UPI Sub-options */}
                {paymentMethod === 'upi' && (
                  <div className="p-4 rounded-2xl bg-orange-50/70 border-2 border-orange-100 space-y-3">
                    <span className="text-xs font-black text-orange-950 block">Choose your UPI App:</span>
                    <div className="flex gap-2">
                      {['gpay', 'phonepe', 'paytm', 'other'].map((app) => (
                        <button
                          key={app}
                          id={`upi-app-${app}`}
                          onClick={() => setUpiApp(app as any)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-black border-2 uppercase transition cursor-pointer ${
                            upiApp === app ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-orange-950 border-orange-100'
                          }`}
                        >
                          {app === 'gpay' ? 'Google Pay' : app === 'phonepe' ? 'PhonePe' : app === 'paytm' ? 'Paytm' : 'BHIM UPI'}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-orange-900 mb-1">
                        UPI ID / VPA
                      </label>
                      <input
                        id="upi-id-input"
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@okhdfcbank"
                        className="w-full px-3.5 py-2.5 bg-white border-2 border-orange-100 rounded-xl text-xs font-mono text-orange-950 font-bold"
                      />
                    </div>
                  </div>
                )}

                {/* Card Sub-options */}
                {paymentMethod === 'card' && (
                  <div className="p-4 rounded-2xl bg-orange-50/70 border-2 border-orange-100 space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-orange-900 mb-1">Card Number</label>
                      <input
                        id="card-number-input"
                        type="text"
                        value={cardDetails.cardNumber}
                        onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border-2 border-orange-100 rounded-xl text-xs font-mono font-bold text-orange-950"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-orange-900 mb-1">Expiry (MM/YY)</label>
                        <input
                          id="card-expiry-input"
                          type="text"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border-2 border-orange-100 rounded-xl text-xs font-mono font-bold text-orange-950"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-orange-900 mb-1">CVV</label>
                        <input
                          id="card-cvv-input"
                          type="password"
                          maxLength={3}
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border-2 border-orange-100 rounded-xl text-xs font-mono font-bold text-orange-950"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Error Handling (Story 45) */}
                {paymentError && (
                  <div className="p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl text-xs text-rose-950 flex items-start gap-2.5 font-medium">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Payment Attempt Failed</p>
                      <p>{paymentError}</p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-orange-50/70 p-4 sm:p-5 border-t-2 border-orange-100 flex items-center justify-between gap-4">
          {step !== 'details' ? (
            <button
              id="checkout-back-step-btn"
              onClick={() => setStep(step === 'review_and_pay' ? 'slot' : 'details')}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-5 py-3 rounded-2xl border-2 border-orange-200 hover:bg-orange-100 text-orange-950 text-xs font-black transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div className="text-xs text-orange-900/70 font-medium">
              Deliverable to Chennai PINs (600xxx)
            </div>
          )}

          <div className="flex items-center gap-3">
            {step === 'details' && (
              <button
                id="checkout-to-slot-btn"
                onClick={handleNextFromDetails}
                className="flex items-center gap-1.5 px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl text-xs transition cursor-pointer shadow-md shadow-orange-500/20"
              >
                <span>Select Delivery Slot</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 'slot' && (
              <button
                id="slot-to-review-btn"
                onClick={() => setStep('review_and_pay')}
                className="flex items-center gap-1.5 px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl text-xs transition cursor-pointer shadow-md shadow-orange-500/20"
              >
                <span>Review Order & Pay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 'review_and_pay' && (
              <div className="flex items-center gap-2">
                {/* Secondary Test Failure button for Story 45 demonstration */}
                <button
                  id="simulate-fail-payment-btn"
                  onClick={() => handleSimulatePayment(true)}
                  disabled={isProcessing}
                  title="Demonstrates Story 45: failed payment does not create a confirmed order"
                  className="px-4 py-3.5 rounded-2xl border-2 border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-black transition cursor-pointer"
                >
                  Test Fail
                </button>

                <button
                  id="simulate-success-payment-btn"
                  onClick={() => handleSimulatePayment(false)}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-3.5 bg-teal-500 hover:bg-teal-600 text-white font-black rounded-2xl text-xs transition cursor-pointer shadow-md shadow-teal-500/25 active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authorizing ₹{grandTotal}...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ₹{grandTotal} & Place Order</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
