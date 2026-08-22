import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Edit, Trash2, Search, Filter, RefreshCw, X, Check, 
  Upload, Image as ImageIcon, ShoppingBag, DollarSign, 
  Package, Users, MapPin, Calendar, Clock, AlertCircle, 
  CheckCircle2, ArrowLeft, ArrowRight, Eye, ShieldCheck, 
  ExternalLink, ChevronDown, ChevronUp, Printer, Sparkles,
  Layers, Tag, Info, TrendingUp, LogOut, Lock
} from 'lucide-react';

import { Product, CategoryId, DietaryTag } from '../types';
import { DatabaseService, AdminOrder, AdminOrderItem, ADMIN_SECURITY_CREDENTIALS } from '../data/database';
import { CATEGORIES } from '../data/products';

interface AdminDashboardProps {
  onClose: () => void;
  onNavigateToStorefront: () => void;
  onLogout?: () => void;
}

// Preset bakery stock photos for quick picking
const PRESET_BAKERY_IMAGES = [
  { label: 'Caramel & Coffee Cake', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80' },
  { label: 'Walnut & Nut Cake', url: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80' },
  { label: 'Millet & Jaggery Cake', url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80' },
  { label: 'Butter Biscuits / Cookies', url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80' },
  { label: 'Bakery Spice Bun / Bread', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80' },
  { label: 'Sourdough Artisan Loaf', url: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80' },
  { label: 'Chocolate Fudge Cake', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80' },
  { label: 'Berry Cheesecake', url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80' }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  onNavigateToStorefront,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  
  // Database States
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  
  // Search & Filter States for Products
  const [productSearch, setProductSearch] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  
  // Search & Filter States for Orders
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Product Add/Edit Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  
  // Form Fields
  const [formName, setFormName] = useState<string>('');
  const [formTamilName, setFormTamilName] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formShortDescription, setFormShortDescription] = useState<string>('');
  const [formPrice, setFormPrice] = useState<number | ''>(500);
  const [formCategory, setFormCategory] = useState<CategoryId>('cakes');
  const [formImage, setFormImage] = useState<string>(PRESET_BAKERY_IMAGES[0].url);
  const [formDietaryTags, setFormDietaryTags] = useState<DietaryTag[]>(['eggless']);
  const [formIngredients, setFormIngredients] = useState<string>('Pure Cow Butter, Refined Wheat, Sugar, Milk');
  const [formError, setFormError] = useState<string | null>(null);

  // Selected Order for Details Modal
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<AdminOrder | null>(null);

  // Delete Confirmation State
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Image Upload File Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Load from database
  const refreshData = () => {
    const loadedProducts = DatabaseService.getProducts();
    const loadedOrders = DatabaseService.getOrders();
    setProducts(loadedProducts);
    setOrders(loadedOrders);
  };

  useEffect(() => {
    refreshData();

    // Listen for storage events
    const handleProductsUpdated = () => refreshData();
    const handleOrdersUpdated = () => refreshData();

    window.addEventListener('chennai_bakery_products_updated', handleProductsUpdated);
    window.addEventListener('chennai_bakery_orders_updated', handleOrdersUpdated);

    return () => {
      window.removeEventListener('chennai_bakery_products_updated', handleProductsUpdated);
      window.removeEventListener('chennai_bakery_orders_updated', handleOrdersUpdated);
    };
  }, []);

  // Filtered Products
  const filteredProducts = products.filter(p => {
    if (selectedCategoryFilter !== 'all' && p.category !== selectedCategoryFilter) {
      return false;
    }
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.dietaryTags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter !== 'all' && o.orderStatus !== orderStatusFilter) {
      return false;
    }
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      return (
        o.orderId.toLowerCase().includes(q) ||
        o.customerId.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.shippingAddress.locality.toLowerCase().includes(q) ||
        o.shippingAddress.pincode.includes(q) ||
        o.productsOrdered.some(i => i.productName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'PAID' ? o.totalOrderValue : 0), 0);
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'Confirmed' || o.orderStatus === 'Baking Fresh').length;
  const totalProductsCount = products.length;

  // Filter Today's Received Orders and Revenue (Story Summary Card)
  const todayOrders = orders.filter(order => {
    if (!order.isoDate && !order.date) return true;
    try {
      const now = new Date();
      const orderDate = new Date(order.isoDate || order.date);
      // Check exact calendar date
      const isSameDate = (
        orderDate.getFullYear() === now.getFullYear() &&
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getDate() === now.getDate()
      );
      if (isSameDate) return true;
      // Or check text indicator
      if (order.date && (order.date.includes('Today') || order.deliverySlot?.dateLabel?.includes('Today') || order.date.includes('22 Aug'))) {
        return true;
      }
    } catch {
      return true;
    }
    return false;
  });

  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.paymentStatus === 'PAID' ? o.totalOrderValue : 0), 0);
  const todayOrdersCount = todayOrders.length;
  const todayAverageOrderValue = todayOrdersCount > 0 ? Math.round(todayRevenue / todayOrdersCount) : 0;

  // Open modal for adding a new product
  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setFormName('');
    setFormTamilName('');
    setFormDescription('');
    setFormShortDescription('');
    setFormPrice(500);
    setFormCategory('cakes');
    setFormImage(PRESET_BAKERY_IMAGES[0].url);
    setFormDietaryTags(['eggless']);
    setFormIngredients('Pure Cow Butter, Refined Wheat, Raw Cane Sugar, Milk, Spices');
    setFormError(null);
    setIsProductModalOpen(true);
  };

  // Open modal for editing an existing product
  const handleOpenEditModal = (product: Product) => {
    setEditingProductId(product.id);
    setFormName(product.name);
    setFormTamilName(product.tamilName || '');
    setFormDescription(product.description);
    setFormShortDescription(product.shortDescription);
    setFormPrice(product.basePrice);
    setFormCategory(product.category);
    setFormImage(product.image);
    setFormDietaryTags(product.dietaryTags);
    setFormIngredients(product.ingredients.join(', '));
    setFormError(null);
    setIsProductModalOpen(true);
  };

  // Handle Image File Upload (converts to Data URL for instant storage & preview)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    // Limit to reasonable size (< 4MB)
    if (file.size > 4 * 1024 * 1024) {
      setFormError('Image size is too large. Please select an image under 4MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormImage(reader.result);
        setFormError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Product Name is required.');
      return;
    }
    if (!formDescription.trim()) {
      setFormError('Product Description is required.');
      return;
    }
    if (!formPrice || Number(formPrice) <= 0) {
      setFormError('Please enter a valid positive Product Price.');
      return;
    }
    if (!formImage.trim()) {
      setFormError('Please provide a picture for the product (upload or enter URL).');
      return;
    }

    const ingredientsList = formIngredients
      .split(',')
      .map(i => i.trim())
      .filter(Boolean);

    if (editingProductId) {
      // Edit existing product
      const updated = DatabaseService.updateProduct(editingProductId, {
        name: formName.trim(),
        tamilName: formTamilName.trim() || undefined,
        description: formDescription.trim(),
        shortDescription: formShortDescription.trim() || formDescription.slice(0, 95) + '...',
        basePrice: Number(formPrice),
        category: formCategory,
        image: formImage.trim(),
        dietaryTags: formDietaryTags,
        ingredients: ingredientsList.length > 0 ? ingredientsList : ['Pure Butter', 'Wheat Flour', 'Sugar']
      });

      if (updated) {
        showToast(`Successfully updated "${formName}" in the database.`);
      }
    } else {
      // Add new product
      const created = DatabaseService.addProduct({
        name: formName.trim(),
        tamilName: formTamilName.trim() || undefined,
        description: formDescription.trim(),
        shortDescription: formShortDescription.trim(),
        basePrice: Number(formPrice),
        category: formCategory,
        image: formImage.trim(),
        dietaryTags: formDietaryTags,
        ingredients: ingredientsList
      });

      showToast(`Successfully saved new product "${created.name}" to the database.`);
    }

    setIsProductModalOpen(false);
    refreshData();
  };

  // Delete product action
  const handleConfirmDeleteProduct = () => {
    if (!productToDelete) return;
    const success = DatabaseService.deleteProduct(productToDelete.id);
    if (success) {
      showToast(`Deleted "${productToDelete.name}" from database.`);
    }
    setProductToDelete(null);
    refreshData();
  };

  // Toggle dietary tag in form
  const toggleDietaryTagInForm = (tag: DietaryTag) => {
    setFormDietaryTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Update order status
  const handleOrderStatusChange = (orderId: string, newStatus: AdminOrder['orderStatus']) => {
    DatabaseService.updateOrderStatus(orderId, newStatus);
    showToast(`Order #${orderId} status changed to "${newStatus}".`);
    refreshData();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FFF9F0] text-orange-950 overflow-y-auto animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-orange-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl border-2 border-orange-500 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="text-xs font-bold font-['Outfit']">{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b-4 border-orange-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Brand / Admin Portal Header */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white font-black flex items-center justify-center text-xl shadow-md shadow-orange-200">
                A
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black font-['Outfit'] text-orange-950">
                    Admin Portal
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-500 text-white text-[10px] font-black uppercase tracking-wider">
                    Database Connected
                  </span>
                </div>
                <p className="text-xs text-orange-900/70 font-medium">
                  Chennai Bakery Master Management & Order Tracking
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 flex-wrap justify-end">
              {/* Admin identity badge */}
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-100/70 border border-orange-200 text-orange-950 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span className="font-bold text-orange-900">{ADMIN_SECURITY_CREDENTIALS.email}</span>
              </div>

              <button
                id="admin-switch-to-storefront-btn"
                onClick={onNavigateToStorefront}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 border-orange-200 bg-orange-50/60 hover:bg-orange-100 text-orange-950 text-xs font-black transition cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-orange-600" />
                <span>View Customer Store</span>
              </button>

              <button
                id="admin-logout-btn"
                onClick={() => {
                  DatabaseService.logoutAdmin();
                  if (onLogout) {
                    onLogout();
                  } else {
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border-2 border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-black transition cursor-pointer"
                title="Log out from secure admin session"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span className="hidden sm:inline">Log Out</span>
              </button>

              <button
                id="admin-close-portal-btn"
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black transition cursor-pointer shadow-md shadow-orange-500/20 flex items-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>Exit Admin</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* ========================================================================= */}
        {/* TODAY'S PERFORMANCE SUMMARY DASHBOARD CARD */}
        {/* ========================================================================= */}
        <div 
          id="admin-today-summary-card"
          className="bg-gradient-to-r from-orange-950 via-orange-900 to-amber-950 rounded-[2.5rem] p-6 sm:p-7 text-white shadow-xl border-4 border-orange-200/20 relative overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Left Title & Live Indicator */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/30 text-amber-200 border border-amber-400/30 text-[10px] font-black uppercase tracking-widest font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Today's Live Store Metrics
                </span>
                <span className="text-orange-200/60 text-xs">• 22 Aug 2026</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
                Today's Bakery Performance
              </h2>
              <p className="text-xs text-orange-200/80 max-w-md font-medium leading-relaxed">
                Real-time tracking of fresh orders received and total billing generated today across all Chennai delivery zones.
              </p>
            </div>

            {/* Right Summary Metrics Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Metric 1: Total Revenue Received Today */}
              <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-white/15 transition shadow-inner flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-400/20">
                  <DollarSign className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-200/80 block">
                    Today's Total Revenue
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
                      ₹{todayRevenue.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] font-bold text-amber-300">INR</span>
                  </div>
                  <span className="text-[10px] text-orange-200/70 font-medium block mt-0.5">
                    Avg Order: ₹{todayAverageOrderValue}
                  </span>
                </div>
              </div>

              {/* Metric 2: Count of Orders Received Today */}
              <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-white/15 transition shadow-inner flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-400 text-teal-950 flex items-center justify-center shrink-0 shadow-lg shadow-teal-400/20">
                  <ShoppingBag className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-200/80 block">
                    Orders Received Today
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
                      {todayOrdersCount}
                    </span>
                    <span className="text-[10px] font-bold text-teal-300">Orders</span>
                  </div>
                  <span className="text-[10px] text-teal-200/70 font-medium block mt-0.5">
                    {orders.filter(o => o.orderStatus === 'Baking Fresh' || o.orderStatus === 'Confirmed').length} in active baking queue
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>
        
        {/* All-Time KPI Metrics Dashboard Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white rounded-3xl p-5 border-2 border-orange-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-orange-900/70 uppercase tracking-wider block">Total Products</span>
              <span className="text-2xl font-black font-['Outfit'] text-orange-950">{totalProductsCount}</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border-2 border-orange-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-teal-900/70 uppercase tracking-wider block">Total Received Orders</span>
              <span className="text-2xl font-black font-['Outfit'] text-teal-950">{orders.length}</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border-2 border-orange-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-900/70 uppercase tracking-wider block">Total Order Revenue</span>
              <span className="text-2xl font-black font-['Outfit'] text-orange-950">₹{totalRevenue.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border-2 border-orange-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-rose-900/70 uppercase tracking-wider block">Active / Baking Slots</span>
              <span className="text-2xl font-black font-['Outfit'] text-rose-950">{pendingOrdersCount}</span>
            </div>
          </div>

        </div>

        {/* Tab Switcher & Action Controls */}
        <div className="bg-white rounded-3xl p-3 border-2 border-orange-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Tabs */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="admin-tab-products-btn"
              onClick={() => setActiveTab('products')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-orange-50/50 hover:bg-orange-100 text-orange-950'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products Management ({products.length})</span>
            </button>

            <button
              id="admin-tab-orders-btn"
              onClick={() => setActiveTab('orders')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-orange-50/50 hover:bg-orange-100 text-orange-950'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Customer Orders ({orders.length})</span>
            </button>
          </div>

          {/* Right Action Button for Active Tab */}
          {activeTab === 'products' && (
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                id="admin-add-product-btn"
                onClick={handleOpenAddModal}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-black transition cursor-pointer shadow-md shadow-teal-500/20 active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add New Product</span>
              </button>
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* 1. PRODUCTS TAB (CRUD: Add, Edit, Delete) */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Search & Category Filter Bar */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-orange-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="relative w-full sm:max-w-md">
                <input
                  id="admin-product-search-input"
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products by name, description, category..."
                  className="w-full pl-11 pr-4 py-2.5 bg-orange-50/60 border-2 border-orange-100 rounded-2xl text-xs font-medium text-orange-950 focus:outline-none focus:border-orange-500"
                />
                <Search className="w-4 h-4 text-orange-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs font-bold text-orange-900/70 shrink-0">Category:</span>
                {['all', 'cakes', 'cookies', 'breads', 'eggless', 'healthy'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition cursor-pointer shrink-0 ${
                      selectedCategoryFilter === cat
                        ? 'bg-orange-500 text-white'
                        : 'bg-orange-50 text-orange-950 hover:bg-orange-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

            </div>

            {/* Product Table / Cards */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border-2 border-orange-100 space-y-3">
                <Package className="w-12 h-12 text-orange-300 mx-auto" />
                <h3 className="text-lg font-black font-['Outfit'] text-orange-950">No Products Found</h3>
                <p className="text-xs text-orange-900/70">Try adjusting your search criteria or add a new bakery product.</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border-2 border-orange-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-orange-950">
                    <thead className="bg-orange-50/80 border-b-2 border-orange-100 text-orange-900 font-black uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-4 px-5">Product Picture</th>
                        <th className="py-4 px-4">Product Name & Tamil Name</th>
                        <th className="py-4 px-4">Category</th>
                        <th className="py-4 px-4">Base Price (INR)</th>
                        <th className="py-4 px-4">Dietary Tags</th>
                        <th className="py-4 px-4">Description Snippet</th>
                        <th className="py-4 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-orange-100 font-medium">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-orange-50/40 transition">
                          
                          {/* 1. Picture */}
                          <td className="py-3.5 px-5">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-orange-200 bg-orange-100 shrink-0 shadow-xs">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = PRESET_BAKERY_IMAGES[0].url;
                                }}
                              />
                            </div>
                          </td>

                          {/* 2. Name */}
                          <td className="py-3.5 px-4 min-w-[200px]">
                            <p className="font-black text-sm text-orange-950 font-['Outfit']">{product.name}</p>
                            {product.tamilName && (
                              <p className="text-[11px] text-orange-600 font-semibold">{product.tamilName}</p>
                            )}
                            <span className="text-[9px] font-mono text-orange-400">ID: {product.id}</span>
                          </td>

                          {/* 3. Category */}
                          <td className="py-3.5 px-4">
                            <span className="inline-block px-2.5 py-1 rounded-xl bg-orange-100 text-orange-900 font-black text-[10px] uppercase">
                              {product.category}
                            </span>
                          </td>

                          {/* 4. Base Price */}
                          <td className="py-3.5 px-4">
                            <span className="text-base font-black text-orange-600 font-['Outfit']">
                              ₹{product.basePrice}
                            </span>
                          </td>

                          {/* 5. Dietary Tags */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1 max-w-[180px]">
                              {product.dietaryTags.map(t => (
                                <span key={t} className="px-2 py-0.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-[9px] font-bold uppercase">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* 6. Description */}
                          <td className="py-3.5 px-4 max-w-[240px]">
                            <p className="text-xs text-orange-900/80 line-clamp-2 leading-relaxed">
                              {product.shortDescription || product.description}
                            </p>
                          </td>

                          {/* 7. Actions */}
                          <td className="py-3.5 px-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                id={`admin-edit-product-${product.id}`}
                                onClick={() => handleOpenEditModal(product)}
                                title="Edit Product"
                                className="p-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-950 transition cursor-pointer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                id={`admin-delete-product-${product.id}`}
                                onClick={() => setProductToDelete(product)}
                                title="Delete Product"
                                className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 transition cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. ORDERS TAB (View all received orders with specified columns) */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Orders Search & Status Filter Bar */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-orange-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="relative w-full sm:max-w-md">
                <input
                  id="admin-order-search-input"
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by Order ID, Customer Name, Phone, Locality..."
                  className="w-full pl-11 pr-4 py-2.5 bg-orange-50/60 border-2 border-orange-100 rounded-2xl text-xs font-medium text-orange-950 focus:outline-none focus:border-orange-500"
                />
                <Search className="w-4 h-4 text-orange-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs font-bold text-orange-900/70 shrink-0">Status:</span>
                {['all', 'Confirmed', 'Baking Fresh', 'Dispatched', 'Delivered'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition cursor-pointer shrink-0 ${
                      orderStatusFilter === st
                        ? 'bg-orange-500 text-white'
                        : 'bg-orange-50 text-orange-950 hover:bg-orange-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

            </div>

            {/* Orders Table Display */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border-2 border-orange-100 space-y-3">
                <ShoppingBag className="w-12 h-12 text-orange-300 mx-auto" />
                <h3 className="text-lg font-black font-['Outfit'] text-orange-950">No Orders Found</h3>
                <p className="text-xs text-orange-900/70">There are no orders matching the filter. Place an order in the store to see it appear here live!</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border-2 border-orange-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-orange-950">
                    <thead className="bg-orange-50/80 border-b-2 border-orange-100 text-orange-900 font-black uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-4 px-4">Order ID & Date</th>
                        <th className="py-4 px-4">Customer ID & Name</th>
                        <th className="py-4 px-4">Shipping Address (Chennai)</th>
                        <th className="py-4 px-4 min-w-[280px]">Products Ordered (Price, Qty, Value)</th>
                        <th className="py-4 px-4">Total Order Value</th>
                        <th className="py-4 px-4">Payment Info</th>
                        <th className="py-4 px-4">Status & Update</th>
                        <th className="py-4 px-4 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-orange-100 font-medium">
                      {filteredOrders.map((order) => (
                        <tr key={order.orderId} className="hover:bg-orange-50/30 transition align-top">
                          
                          {/* 1. Order Id & Date */}
                          <td className="py-4 px-4 min-w-[140px]">
                            <p className="font-black text-sm text-orange-950 font-mono">{order.orderId}</p>
                            <p className="text-[11px] text-orange-900/70 font-semibold mt-0.5 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-orange-500 shrink-0" />
                              <span>{order.date}</span>
                            </p>
                            <span className="inline-block mt-1 text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md font-bold">
                              Slot: {order.deliverySlot?.dateLabel || 'Standard'}
                            </span>
                          </td>

                          {/* 2. Customer Id & Customer Name */}
                          <td className="py-4 px-4 min-w-[160px]">
                            <p className="font-black text-orange-950 text-sm">{order.customerName}</p>
                            <p className="text-[10px] font-mono text-orange-600 font-bold">ID: {order.customerId}</p>
                            <p className="text-[11px] text-orange-900/70 mt-0.5">{order.customerPhone}</p>
                          </td>

                          {/* 3. Shipping Address */}
                          <td className="py-4 px-4 min-w-[200px]">
                            <div className="space-y-0.5">
                              <p className="font-bold text-orange-950 text-xs">{order.shippingAddress.addressLine1}</p>
                              <p className="text-orange-900/80 text-[11px] flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                                <span>{order.shippingAddress.locality}, PIN {order.shippingAddress.pincode}</span>
                              </p>
                              {order.shippingAddress.deliveryNotes && (
                                <p className="text-[10px] text-orange-700 italic bg-orange-50 p-1 rounded">
                                  Note: {order.shippingAddress.deliveryNotes}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* 4. Products Ordered: Price of Product, Quantity, Value of Product Purchases */}
                          <td className="py-4 px-4">
                            <div className="space-y-2">
                              {order.productsOrdered.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between gap-3 bg-orange-50/60 p-2 rounded-xl border border-orange-100">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <img
                                      src={item.productImage}
                                      alt={item.productName}
                                      className="w-8 h-8 rounded-lg object-cover border border-orange-200 shrink-0"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = PRESET_BAKERY_IMAGES[0].url;
                                      }}
                                    />
                                    <div className="min-w-0">
                                      <p className="font-black text-xs text-orange-950 truncate max-w-[140px]" title={item.productName}>
                                        {item.productName}
                                      </p>
                                      <span className="text-[10px] text-orange-800/70 font-semibold block">
                                        ₹{item.pricePerUnit} × {item.quantity} ({item.selectedSizeName})
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="text-xs font-black text-orange-950">₹{item.purchaseValue}</span>
                                    <span className="text-[9px] text-orange-500 block font-bold">Val</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* 5. Total Order Value */}
                          <td className="py-4 px-4 min-w-[120px]">
                            <p className="text-base font-black text-orange-600 font-['Outfit']">
                              ₹{order.totalOrderValue}
                            </p>
                            <span className="text-[10px] text-teal-700 font-bold block">
                              {order.deliveryFee === 0 ? 'Free Chennai Delivery' : `+₹${order.deliveryFee} Del`}
                            </span>
                          </td>

                          {/* 6. Payment Method & Status */}
                          <td className="py-4 px-4 min-w-[130px]">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                              order.paymentStatus === 'PAID'
                                ? 'bg-teal-100 text-teal-900 border border-teal-200'
                                : 'bg-rose-100 text-rose-900 border border-rose-200'
                            }`}>
                              {order.paymentStatus}
                            </span>
                            <p className="text-[11px] text-orange-900 font-bold mt-1">{order.paymentMethod}</p>
                            <p className="text-[9px] font-mono text-orange-400 truncate max-w-[110px]" title={order.transactionId}>
                              {order.transactionId}
                            </p>
                          </td>

                          {/* 7. Order Status Dropdown */}
                          <td className="py-4 px-4 min-w-[140px]">
                            <select
                              value={order.orderStatus}
                              onChange={(e) => handleOrderStatusChange(order.orderId, e.target.value as any)}
                              className={`w-full py-1.5 px-2.5 rounded-xl text-xs font-black border-2 focus:outline-none cursor-pointer ${
                                order.orderStatus === 'Delivered'
                                  ? 'bg-teal-50 border-teal-200 text-teal-950'
                                  : order.orderStatus === 'Baking Fresh'
                                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                                  : order.orderStatus === 'Dispatched'
                                  ? 'bg-blue-50 border-blue-200 text-blue-950'
                                  : 'bg-orange-50 border-orange-200 text-orange-950'
                              }`}
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="Baking Fresh">Baking Fresh</option>
                              <option value="Dispatched">Dispatched</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>

                          {/* 8. Action Details */}
                          <td className="py-4 px-4 text-right">
                            <button
                              id={`admin-view-order-${order.orderId}`}
                              onClick={() => setSelectedOrderDetails(order)}
                              className="p-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-950 transition cursor-pointer"
                              title="View Full Invoice Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* ADD / EDIT PRODUCT MODAL */}
      {/* ========================================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-orange-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden border-4 border-orange-100 flex flex-col animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black font-['Outfit']">
                    {editingProductId ? 'Edit Bakery Product' : 'Add New Bakery Product'}
                  </h2>
                  <p className="text-xs text-orange-100 font-medium">
                    Store product details, pricing, and picture directly in the database
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-5 flex-1">
              
              {formError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-950 text-xs flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* 1. Product Name & Tamil Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-orange-950 uppercase mb-1.5">
                    Product Name *
                  </label>
                  <input
                    id="admin-form-product-name"
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Kumbakonam Degree Coffee Cake"
                    className="w-full px-4 py-3 bg-orange-50/50 border-2 border-orange-100 rounded-2xl text-xs font-bold text-orange-950 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-orange-950 uppercase mb-1.5">
                    Tamil Name (Optional)
                  </label>
                  <input
                    id="admin-form-tamil-name"
                    type="text"
                    value={formTamilName}
                    onChange={(e) => setFormTamilName(e.target.value)}
                    placeholder="e.g. கும்பகோணம் டிகிரி காபி கேக்"
                    className="w-full px-4 py-3 bg-orange-50/50 border-2 border-orange-100 rounded-2xl text-xs font-bold text-orange-950 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* 2. Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-orange-950 uppercase mb-1.5">
                    Category *
                  </label>
                  <select
                    id="admin-form-category"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as CategoryId)}
                    className="w-full px-4 py-3 bg-orange-50/50 border-2 border-orange-100 rounded-2xl text-xs font-black text-orange-950 focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="cakes">Artisan Cakes</option>
                    <option value="cookies">Cookies & Biscuits</option>
                    <option value="breads">Sourdough & Breads</option>
                    <option value="eggless">100% Eggless</option>
                    <option value="healthy">Diabetic & Healthy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-orange-950 uppercase mb-1.5">
                    Base Price in INR (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-orange-500 text-sm">₹</span>
                    <input
                      id="admin-form-price"
                      type="number"
                      min="1"
                      required
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 650"
                      className="w-full pl-8 pr-4 py-3 bg-orange-50/50 border-2 border-orange-100 rounded-2xl text-xs font-black text-orange-950 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Product Description */}
              <div>
                <label className="block text-xs font-black text-orange-950 uppercase mb-1.5">
                  Product Description *
                </label>
                <textarea
                  id="admin-form-description"
                  rows={3}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe ingredients, baking style, Chennai flavours, and freshness..."
                  className="w-full px-4 py-3 bg-orange-50/50 border-2 border-orange-100 rounded-2xl text-xs font-medium text-orange-950 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* 4. Picture of the Product (Upload / URL / Presets) */}
              <div className="space-y-3 bg-orange-50/60 p-4 rounded-3xl border-2 border-orange-100">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-orange-950 uppercase">
                    Product Picture (Story 2: Save One Picture) *
                  </label>
                  <span className="text-[10px] text-teal-800 font-black">Upload File or Pick Preset</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {/* Live Preview */}
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-orange-300 bg-white shrink-0 shadow-md">
                    <img
                      src={formImage}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = PRESET_BAKERY_IMAGES[0].url;
                      }}
                    />
                  </div>

                  {/* Upload Actions */}
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 px-4 rounded-2xl bg-white border-2 border-orange-200 hover:bg-orange-100 text-orange-950 text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                    >
                      <Upload className="w-4 h-4 text-orange-600" />
                      <span>Upload Picture from Computer</span>
                    </button>

                    <div className="relative">
                      <input
                        type="url"
                        value={formImage}
                        onChange={(e) => setFormImage(e.target.value)}
                        placeholder="Or paste image URL (https://...)"
                        className="w-full px-3.5 py-2 bg-white border-2 border-orange-100 rounded-xl text-[11px] font-mono text-orange-950 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Preset Photo Picker */}
                <div>
                  <span className="text-[10px] font-black text-orange-900/70 uppercase block mb-1.5">
                    Or select from curated bakery photo presets:
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {PRESET_BAKERY_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormImage(preset.url)}
                        className={`w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                          formImage === preset.url ? 'border-orange-600 ring-2 ring-orange-500/30 scale-105' : 'border-orange-200 opacity-70 hover:opacity-100'
                        }`}
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5. Dietary Tags */}
              <div>
                <label className="block text-xs font-black text-orange-950 uppercase mb-2">
                  Dietary & Health Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['eggless', 'diabetic-friendly', 'low-sugar', 'low-calorie', 'vegan', 'gluten-free'] as DietaryTag[]).map((tag) => {
                    const isSelected = formDietaryTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleDietaryTagInForm(tag)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition cursor-pointer border-2 ${
                          isSelected
                            ? 'bg-teal-500 border-teal-500 text-white shadow-xs'
                            : 'bg-white border-orange-100 text-orange-950 hover:border-orange-200'
                        }`}
                      >
                        {tag.replace('-', ' ')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. Ingredients */}
              <div>
                <label className="block text-xs font-black text-orange-950 uppercase mb-1.5">
                  Ingredients (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formIngredients}
                  onChange={(e) => setFormIngredients(e.target.value)}
                  placeholder="e.g. Kumbakonam Filter Coffee, Pure Butter, Wheat Flour, Caramel"
                  className="w-full px-4 py-3 bg-orange-50/50 border-2 border-orange-100 rounded-2xl text-xs font-medium text-orange-950 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t-2 border-orange-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-3 rounded-2xl border-2 border-orange-200 text-orange-950 text-xs font-black hover:bg-orange-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="admin-save-product-submit-btn"
                  type="submit"
                  className="px-7 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black transition cursor-pointer shadow-md shadow-orange-500/20 active:scale-95"
                >
                  {editingProductId ? 'Update in Database' : 'Save to Database'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-orange-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-6 sm:p-7 border-4 border-rose-200 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black font-['Outfit'] text-orange-950">Delete Product from Database?</h3>
              <p className="text-xs text-orange-900/80 mt-1 font-medium">
                Are you sure you want to delete <strong>"{productToDelete.name}"</strong>? This will remove it permanently from the Chennai Bakery catalog.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-3 rounded-2xl border-2 border-orange-200 text-orange-950 text-xs font-black hover:bg-orange-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="admin-confirm-delete-btn"
                onClick={handleConfirmDeleteProduct}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition cursor-pointer shadow-md shadow-rose-600/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ORDER DETAILS MODAL */}
      {/* ========================================================================= */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-orange-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden border-4 border-orange-100 flex flex-col animate-in zoom-in-95">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-widest text-teal-100">Order Invoice & Dispatch</span>
                  <h2 className="text-xl font-black font-['Outfit']">Order #{selectedOrderDetails.orderId}</h2>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Meta Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-orange-50/60 p-4 rounded-3xl border-2 border-orange-100 text-xs">
                <div>
                  <span className="text-orange-900/60 font-bold block text-[10px] uppercase">Customer ID</span>
                  <span className="font-mono font-black text-orange-950">{selectedOrderDetails.customerId}</span>
                </div>
                <div>
                  <span className="text-orange-900/60 font-bold block text-[10px] uppercase">Order Date</span>
                  <span className="font-bold text-orange-950">{selectedOrderDetails.date}</span>
                </div>
                <div>
                  <span className="text-orange-900/60 font-bold block text-[10px] uppercase">Payment Status</span>
                  <span className="font-black text-teal-800 uppercase">{selectedOrderDetails.paymentStatus} ({selectedOrderDetails.paymentMethod})</span>
                </div>
              </div>

              {/* Customer & Shipping Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-3xl bg-white border-2 border-orange-100 space-y-1 text-xs">
                  <span className="text-[10px] font-black uppercase text-orange-500">Customer Details</span>
                  <p className="font-black text-sm text-orange-950">{selectedOrderDetails.customerName}</p>
                  <p className="text-orange-900/70 font-medium">Phone: {selectedOrderDetails.customerPhone}</p>
                  <p className="text-orange-900/70 font-medium">Email: {selectedOrderDetails.customerEmail}</p>
                </div>

                <div className="p-4 rounded-3xl bg-white border-2 border-orange-100 space-y-1 text-xs">
                  <span className="text-[10px] font-black uppercase text-orange-500">Shipping Address</span>
                  <p className="font-bold text-orange-950">{selectedOrderDetails.shippingAddress.addressLine1}</p>
                  <p className="text-orange-900/80 font-medium">Locality: {selectedOrderDetails.shippingAddress.locality}</p>
                  <p className="text-orange-900/80 font-medium">Chennai PIN: {selectedOrderDetails.shippingAddress.pincode}</p>
                </div>
              </div>

              {/* Products Breakdown Table */}
              <div className="border-2 border-orange-100 rounded-3xl overflow-hidden">
                <div className="bg-orange-50 px-4 py-3 border-b-2 border-orange-100 text-xs font-black uppercase text-orange-950">
                  Products Ordered ({selectedOrderDetails.productsOrdered.length} items)
                </div>
                <div className="divide-y divide-orange-100 p-2">
                  {selectedOrderDetails.productsOrdered.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs font-medium">
                      <div className="flex items-center gap-3">
                        <img src={item.productImage} alt={item.productName} className="w-10 h-10 rounded-xl object-cover border border-orange-200" />
                        <div>
                          <p className="font-black text-orange-950">{item.productName}</p>
                          <p className="text-[11px] text-orange-900/70">{item.selectedSizeName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-orange-950">₹{item.pricePerUnit} × {item.quantity} = ₹{item.purchaseValue}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-orange-50/70 p-4 border-t-2 border-orange-100 space-y-1 text-xs font-medium">
                  <div className="flex justify-between text-orange-900">
                    <span>Subtotal:</span>
                    <span className="font-bold text-orange-950">₹{selectedOrderDetails.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-orange-900">
                    <span>Delivery Charge (Chennai):</span>
                    <span className="font-bold text-teal-800">{selectedOrderDetails.deliveryFee === 0 ? 'FREE' : `₹${selectedOrderDetails.deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-orange-950 pt-2 border-t border-orange-200">
                    <span>Total Order Value:</span>
                    <span className="text-orange-600 text-base font-['Outfit']">₹{selectedOrderDetails.totalOrderValue} INR</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-orange-50 border-t-2 border-orange-100 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-2xl bg-white border-2 border-orange-200 text-orange-950 text-xs font-black flex items-center gap-2 hover:bg-orange-100 transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-6 py-2.5 rounded-2xl bg-orange-500 text-white text-xs font-black hover:bg-orange-600 transition cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
