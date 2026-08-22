import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Clock, 
  Printer, 
  ArrowRight, 
  ChefHat, 
  Truck, 
  Home, 
  RefreshCw, 
  Phone, 
  Sparkles, 
  ShieldCheck, 
  PackageCheck,
  Navigation
} from 'lucide-react';
import { Order } from '../types';

interface OrderConfirmationModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onContinueShopping: () => void;
}

export type OrderTrackerStage = 'Received' | 'Baking' | 'Out for Delivery' | 'Delivered';

interface StageConfig {
  id: OrderTrackerStage;
  label: string;
  subLabel: string;
  icon: React.ElementType;
  timeEstimate: string;
  description: string;
}

const STAGES: StageConfig[] = [
  {
    id: 'Received',
    label: 'Received',
    subLabel: 'Order Confirmed',
    icon: CheckCircle2,
    timeEstimate: 'Instant',
    description: 'Payment verified & order sent to Chennai Bakery baking queue.'
  },
  {
    id: 'Baking',
    label: 'Baking',
    subLabel: 'In Stone Deck Oven',
    icon: ChefHat,
    timeEstimate: '~25 mins',
    description: 'Master bakers are crafting your batch with 100% pure butter & RO water.'
  },
  {
    id: 'Out for Delivery',
    label: 'Out for Delivery',
    subLabel: 'Chennai Express Dispatch',
    icon: Truck,
    timeEstimate: '~20 mins',
    description: 'Packed in insulated thermal boxes & dispatched with local Chennai rider.'
  },
  {
    id: 'Delivered',
    label: 'Delivered',
    subLabel: 'At Your Doorstep',
    icon: Home,
    timeEstimate: 'Completed',
    description: 'Handed over fresh and warm at your Chennai address. Enjoy your treats!'
  }
];

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  isOpen,
  onClose,
  onContinueShopping
}) => {
  const [currentStage, setCurrentStage] = useState<OrderTrackerStage>('Received');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Sync with order or reset to 'Received' / 'Baking' when modal opens
  useEffect(() => {
    if (order) {
      if (order.status === 'Baking Fresh') {
        setCurrentStage('Baking');
      } else if (order.status === 'Dispatched') {
        setCurrentStage('Out for Delivery');
      } else if (order.status === 'Delivered') {
        setCurrentStage('Delivered');
      } else {
        setCurrentStage('Received');
      }
    }
  }, [order, isOpen]);

  if (!isOpen || !order) return null;

  const currentStageIndex = STAGES.findIndex(s => s.id === currentStage);

  const handlePrint = () => {
    window.print();
  };

  const handleRefreshStatus = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleAdvanceStage = () => {
    const nextIndex = (currentStageIndex + 1) % STAGES.length;
    setCurrentStage(STAGES[nextIndex].id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-orange-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border-4 border-orange-100 animate-in zoom-in-95 duration-200">
        
        {/* Success Header */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-7 text-white text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-xs mx-auto flex items-center justify-center shadow-lg mb-3">
            <CheckCircle2 className="w-9 h-9 text-white stroke-[2.5]" />
          </div>
          <span className="inline-block px-3.5 py-1 rounded-full bg-teal-800/70 text-teal-100 text-xs font-black uppercase tracking-wider mb-1">
            Payment Confirmed • Order Placed
          </span>
          <h2 className="text-2xl font-black font-['Outfit']">Thank You, {order.customer.fullName}!</h2>
          <p className="text-xs text-teal-100 mt-1 font-medium">
            Your fresh batch order is officially in our kitchen queue.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Order ID & Reference Banner */}
          <div className="bg-orange-50/70 border-2 border-orange-100 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <span className="text-[10px] uppercase font-black text-orange-800 tracking-wider">Unique Order Reference #</span>
              <p className="text-xl font-black text-orange-950 font-mono">{order.orderId}</p>
              <p className="text-xs text-orange-900/70 font-medium">Txn: {order.payment.transactionId} ({order.payment.method.toUpperCase()})</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="print-invoice-btn"
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-2xl bg-white hover:bg-orange-50 border-2 border-orange-200 text-xs font-black text-orange-950 flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4 text-orange-600" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CUSTOMER ORDER STATUS TRACKER ('Received', 'Baking', 'Out for Delivery', 'Delivered') */}
          {/* ========================================================================= */}
          <div 
            id="customer-order-status-tracker"
            className="bg-orange-50/50 border-2 border-orange-200/80 rounded-[2rem] p-5 sm:p-6 space-y-5 shadow-xs"
          >
            {/* Tracker Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-orange-200/60 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 block">
                  Live Order Tracker
                </span>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-orange-950 font-['Outfit']">
                    Current Stage: <span className="text-teal-700">{currentStage}</span>
                  </h3>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
                  </span>
                </div>
              </div>

              {/* Status Action Controls */}
              <div className="flex items-center gap-2">
                <button
                  id="tracker-refresh-btn"
                  onClick={handleRefreshStatus}
                  disabled={isRefreshing}
                  className="px-3 py-1.5 bg-white hover:bg-orange-100/70 border border-orange-200 rounded-xl text-[11px] font-bold text-orange-900 flex items-center gap-1.5 transition cursor-pointer"
                  title="Check latest status from kitchen"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-orange-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>{isRefreshing ? 'Checking...' : 'Refresh Status'}</span>
                </button>

                <button
                  id="tracker-advance-simulation-btn"
                  onClick={handleAdvanceStage}
                  className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-[11px] font-black transition cursor-pointer shadow-xs active:scale-95"
                  title="Click to simulate advancing order stage for testing"
                >
                  Simulate Next Stage →
                </button>
              </div>
            </div>

            {/* Visual Step Progress Indicator */}
            <div className="relative pt-2 pb-1">
              {/* Progress Connecting Line */}
              <div className="absolute top-7 left-6 right-6 h-1 bg-orange-200 -translate-y-1/2 z-0">
                <div 
                  className="h-full bg-teal-500 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%` }}
                />
              </div>

              {/* 4 Stage Nodes */}
              <div className="relative z-10 grid grid-cols-4 gap-1 sm:gap-2">
                {STAGES.map((stage, idx) => {
                  const Icon = stage.icon;
                  const isCompleted = idx < currentStageIndex;
                  const isCurrent = idx === currentStageIndex;

                  return (
                    <button
                      key={stage.id}
                      id={`tracker-step-${stage.id.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => setCurrentStage(stage.id)}
                      className="flex flex-col items-center text-center group cursor-pointer transition focus:outline-none"
                    >
                      {/* Step Circle */}
                      <div 
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          isCompleted
                            ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20'
                            : isCurrent
                            ? 'bg-orange-500 text-white ring-4 ring-orange-200 scale-110 shadow-lg shadow-orange-500/30'
                            : 'bg-white text-orange-400 border-2 border-orange-200'
                        }`}
                      >
                        <Icon className="w-5 h-5 stroke-[2.5]" />
                      </div>

                      {/* Label & Sublabel */}
                      <div className="mt-2 space-y-0.5 max-w-[80px] sm:max-w-none">
                        <p className={`text-[11px] sm:text-xs font-black transition ${
                          isCurrent ? 'text-orange-950 font-bold' : isCompleted ? 'text-teal-800 font-bold' : 'text-orange-900/50'
                        }`}>
                          {stage.label}
                        </p>
                        <span className={`hidden sm:block text-[9px] font-medium leading-tight ${
                          isCurrent ? 'text-orange-600 font-bold' : 'text-orange-900/40'
                        }`}>
                          {stage.subLabel}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Stage Detail Callout Card */}
            <div className="bg-white rounded-2xl p-4 border border-orange-200 shadow-xs flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                {currentStage === 'Received' && <CheckCircle2 className="w-5 h-5" />}
                {currentStage === 'Baking' && <ChefHat className="w-5 h-5" />}
                {currentStage === 'Out for Delivery' && <Truck className="w-5 h-5" />}
                {currentStage === 'Delivered' && <Home className="w-5 h-5" />}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span className="text-xs font-black text-orange-950 font-['Outfit']">
                    {STAGES[currentStageIndex]?.label}: {STAGES[currentStageIndex]?.subLabel}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-200">
                    Est: {STAGES[currentStageIndex]?.timeEstimate}
                  </span>
                </div>
                <p className="text-xs text-orange-900/80 font-medium leading-relaxed">
                  {STAGES[currentStageIndex]?.description}
                </p>
              </div>
            </div>

            {/* Chennai Delivery Partner Note */}
            <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs text-teal-950">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center shrink-0">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-teal-700 block">Assigned Dispatch Hub</span>
                  <span className="font-bold text-teal-900">Chennai South Hub (Adyar Deck) • Rider: Senthil K.</span>
                </div>
              </div>
              <a 
                href="tel:04428114500" 
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-teal-100 border border-teal-300 text-teal-900 text-[11px] font-black flex items-center gap-1 shrink-0 transition"
              >
                <Phone className="w-3 h-3 text-teal-600" />
                <span>Call Hub</span>
              </a>
            </div>

          </div>

          {/* Delivery & Slot Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-orange-50/60 border-2 border-orange-100 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-orange-900 uppercase">
                <Calendar className="w-4 h-4 text-orange-600" />
                <span>Selected Delivery Slot</span>
              </div>
              <p className="text-sm font-black text-orange-950">{order.deliverySlot.dateLabel}</p>
              <p className="text-xs text-orange-900/70 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                <span>{order.deliverySlot.timeSlot}</span>
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-orange-50/60 border-2 border-orange-100 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-orange-900 uppercase">
                <MapPin className="w-4 h-4 text-orange-600" />
                <span>Delivery Address (Chennai)</span>
              </div>
              <p className="text-xs font-black text-orange-950">{order.customer.addressLine1}</p>
              <p className="text-xs text-orange-900/80 font-medium">{order.customer.locality}, Chennai - {order.customer.pincode}</p>
              <p className="text-xs text-orange-900/60 font-medium">Phone: {order.customer.phone}</p>
            </div>
          </div>

          {/* Ordered Items List */}
          <div className="border-2 border-orange-100 rounded-3xl p-5 space-y-3">
            <h3 className="text-xs font-black text-orange-950 uppercase tracking-wider">
              Ordered Fresh Bakes ({order.items.length} items)
            </h3>
            <div className="divide-y divide-orange-100 space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.product.image} alt={item.product.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <p className="font-bold text-orange-950">{item.product.name}</p>
                      <p className="text-orange-900/70 font-medium">{item.selectedSize.name} × {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-black text-orange-950">₹{item.itemTotal}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t-2 border-orange-100 space-y-1 text-xs font-medium">
              <div className="flex justify-between text-orange-900/80">
                <span>Subtotal:</span>
                <span className="font-bold text-orange-950">₹{order.pricing.subtotal}</span>
              </div>
              <div className="flex justify-between text-orange-900/80">
                <span>Chennai Delivery:</span>
                <span>{order.pricing.deliveryFee === 0 ? <strong className="text-teal-700 font-black">FREE</strong> : `₹${order.pricing.deliveryFee}`}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-orange-950 pt-2 border-t border-orange-200">
                <span>Total Paid (INR):</span>
                <span className="text-teal-700 text-lg font-['Outfit']">₹{order.pricing.totalAmount}</span>
              </div>
            </div>

            {/* Loyalty points credit confirmation */}
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-amber-950 font-bold">Chennai Bakes Club Points Credited:</span>
              </div>
              <span className="font-black text-amber-900 bg-amber-200 px-2.5 py-0.5 rounded-full">
                +{Math.max(10, Math.round(order.pricing.totalAmount / 10))} Pts
              </span>
            </div>
          </div>

          {/* Action button */}
          <button
            id="order-confirm-continue-shopping-btn"
            onClick={onContinueShopping}
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl text-xs transition cursor-pointer shadow-md shadow-orange-500/25 flex items-center justify-center gap-2"
          >
            <span>Back to Chennai Bakery Menu</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      </div>
    </div>
  );
};
