import { Product, Order, ProductReview, LoyaltyUser } from '../types';
import { PRODUCTS } from './products';

const PRODUCTS_STORAGE_KEY = 'chennai_bakery_db_products_v1';
const ORDERS_STORAGE_KEY = 'chennai_bakery_db_orders_v1';
const REVIEWS_STORAGE_KEY = 'chennai_bakery_db_reviews_v1';
const LOYALTY_STORAGE_KEY = 'chennai_bakery_db_loyalty_user_v1';
const ADMIN_AUTH_STORAGE_KEY = 'chennai_bakery_admin_session_auth_v1';

// Strict Admin Security Credentials
export const ADMIN_SECURITY_CREDENTIALS = {
  email: 'sreerammuthoju86@gmail.com',
  password: '123456'
};

// Initial Seed Reviews for Chennai Bakery special products
const INITIAL_SEED_REVIEWS: ProductReview[] = [
  {
    id: 'rev-coffee-1',
    productId: 'prod-filter-coffee-cake',
    userName: 'Kavitha Rangarajan',
    locality: 'Mylapore, Chennai',
    rating: 5,
    comment: 'Captures the real degree decoction aroma! The salted caramel and mocha layers are balanced perfectly and not too sweet. Everyone at home loved it.',
    createdAt: '21 Aug 2026',
    isVerifiedBuyer: true
  },
  {
    id: 'rev-coffee-2',
    productId: 'prod-filter-coffee-cake',
    userName: 'Vigneshwaran M.',
    locality: 'Besant Nagar, Chennai',
    rating: 5,
    comment: 'Best birthday cake in Chennai. Fresh delivery right on time in the morning slot. Eggless texture was so moist!',
    createdAt: '19 Aug 2026',
    isVerifiedBuyer: true
  },
  {
    id: 'rev-ragi-1',
    productId: 'prod-diabetic-ragi-walnut',
    userName: 'Dr. S. Sundararajan',
    locality: 'Anna Nagar, Chennai',
    rating: 5,
    comment: 'Ordered for my father who has high diabetes. Zero glycemic spike, great ragi crunch and genuine stevia taste without bitter aftertaste.',
    createdAt: '20 Aug 2026',
    isVerifiedBuyer: true
  },
  {
    id: 'rev-bun-1',
    productId: 'prod-masala-bun',
    userName: 'Meenakshi Sundaresan',
    locality: 'T. Nagar, Chennai',
    rating: 5,
    comment: 'Brings back nostalgic Iyengar bakery memories with hot tea. Real curry leaves and green chilli burst!',
    createdAt: '22 Aug 2026',
    isVerifiedBuyer: true
  },
  {
    id: 'rev-sourdough-1',
    productId: 'prod-sourdough-loaf',
    userName: 'Aditya S.',
    locality: 'Adyar, Chennai',
    rating: 5,
    comment: 'Outstanding crust and airy crumb. The Chennai wild fermentation gives it a distinct tangy depth.',
    createdAt: '18 Aug 2026',
    isVerifiedBuyer: true
  },
  {
    id: 'rev-cheddar-1',
    productId: 'prod-cheddar-chilli-bread',
    userName: 'Deepa Krishnan',
    locality: 'Alwarpet, Chennai',
    rating: 4,
    comment: 'Generous aged cheddar cubes and mild spice. Makes the most amazing morning toast with butter.',
    createdAt: '17 Aug 2026',
    isVerifiedBuyer: true
  }
];

// Initial default logged-in customer loyalty profile
const INITIAL_DEFAULT_LOYALTY_USER: LoyaltyUser = {
  id: 'CUST-LOYALTY-98401',
  name: 'Priya Sundaram',
  phone: '9840123456',
  email: 'priya.sundaram@gmail.com',
  locality: 'Mylapore',
  pointsBalance: 320, // 320 Points = ₹32 discount value
  tier: 'Silver',
  lifetimeEarned: 740,
  isLoggedIn: true
};

export interface AdminOrderItem {
  productId: string;
  productName: string;
  productImage: string;
  selectedSizeName: string;
  pricePerUnit: number;
  quantity: number;
  purchaseValue: number; // Price of Product * Quantity
}

export interface AdminOrder {
  orderId: string;
  date: string; // e.g. "2026-08-22 10:30 AM"
  isoDate: string;
  customerId: string; // e.g. "CUST-9840123"
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: {
    addressLine1: string;
    locality: string;
    pincode: string;
    fullFormattedAddress: string;
    deliveryNotes?: string;
  };
  deliverySlot: {
    dateLabel: string;
    timeSlot: string;
  };
  productsOrdered: AdminOrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalOrderValue: number;
  paymentMethod: string;
  paymentStatus: 'PAID' | 'FAILED' | 'PENDING';
  transactionId: string;
  orderStatus: 'Confirmed' | 'Baking Fresh' | 'Dispatched' | 'Delivered' | 'Cancelled';
}

// Initial realistic seed orders for Chennai Bakery
const INITIAL_SEED_ORDERS: AdminOrder[] = [
  {
    orderId: 'CHN-2026-88102',
    date: '22 Aug 2026, 09:15 AM',
    isoDate: '2026-08-22T09:15:00.000Z',
    customerId: 'CUST-CHN-98401',
    customerName: 'Ananya Sundaram',
    customerPhone: '9840123987',
    customerEmail: 'ananya.sundaram@gmail.com',
    shippingAddress: {
      addressLine1: 'Flat 4B, Ceebros Heritage, North Boag Road',
      locality: 'T. Nagar',
      pincode: '600017',
      fullFormattedAddress: 'Flat 4B, Ceebros Heritage, North Boag Road, T. Nagar, Chennai - 600017',
      deliveryNotes: 'Please ring the bell twice. Hand over at main door.'
    },
    deliverySlot: {
      dateLabel: 'Today (22 Aug)',
      timeSlot: 'Morning Slot (07:00 AM - 10:00 AM)'
    },
    productsOrdered: [
      {
        productId: 'prod-filter-coffee-cake',
        productName: 'Mylapore Filter Coffee Caramel Cake',
        productImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
        selectedSizeName: '1 kg (Serves 8-10)',
        pricePerUnit: 1200,
        quantity: 1,
        purchaseValue: 1200
      },
      {
        productId: 'prod-masala-bun',
        productName: 'Chennai Iyengar Style Spicy Kara Masala Buns',
        productImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
        selectedSizeName: 'Box of 6 Buns',
        pricePerUnit: 220,
        quantity: 2,
        purchaseValue: 440
      }
    ],
    subtotal: 1640,
    deliveryFee: 0, // Free delivery for orders >= ₹499
    totalOrderValue: 1640,
    paymentMethod: 'UPI (Google Pay)',
    paymentStatus: 'PAID',
    transactionId: 'TXN-UPI-98248102',
    orderStatus: 'Baking Fresh'
  },
  {
    orderId: 'CHN-2026-88099',
    date: '22 Aug 2026, 08:30 AM',
    isoDate: '2026-08-22T08:30:00.000Z',
    customerId: 'CUST-CHN-97890',
    customerName: 'Karthik Subramanian',
    customerPhone: '9789012345',
    customerEmail: 'karthik.subramanian@tcs.com',
    shippingAddress: {
      addressLine1: 'Door No. 18, 4th Cross Street, Karpagam Gardens',
      locality: 'Adyar',
      pincode: '600020',
      fullFormattedAddress: 'Door No. 18, 4th Cross Street, Karpagam Gardens, Adyar, Chennai - 600020',
      deliveryNotes: 'Diabetic order for parents. Please ensure fresh morning batch.'
    },
    deliverySlot: {
      dateLabel: 'Today (22 Aug)',
      timeSlot: 'Afternoon Slot (12:00 PM - 03:00 PM)'
    },
    productsOrdered: [
      {
        productId: 'prod-diabetic-ragi-walnut',
        productName: 'Diabetic-Friendly Ragi & Walnut Cake',
        productImage: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80',
        selectedSizeName: '500g (Diabetic Pack)',
        pricePerUnit: 580,
        quantity: 1,
        purchaseValue: 580
      },
      {
        productId: 'prod-sourdough-loaf',
        productName: 'Artisan Sourdough Boule (Chennai Wild Yeast)',
        productImage: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80',
        selectedSizeName: 'Regular Loaf (600g)',
        pricePerUnit: 240,
        quantity: 1,
        purchaseValue: 240
      }
    ],
    subtotal: 820,
    deliveryFee: 0,
    totalOrderValue: 820,
    paymentMethod: 'Credit Card (Visa)',
    paymentStatus: 'PAID',
    transactionId: 'TXN-CARD-4412099',
    orderStatus: 'Confirmed'
  },
  {
    orderId: 'CHN-2026-88065',
    date: '21 Aug 2026, 04:45 PM',
    isoDate: '2026-08-21T16:45:00.000Z',
    customerId: 'CUST-CHN-98840',
    customerName: 'Dr. Meenakshi Ramachandran',
    customerPhone: '9884054321',
    customerEmail: 'dr.meenakshi@apollohospitals.com',
    shippingAddress: {
      addressLine1: 'Villa 12, Golden Beach Road, Injambakkam',
      locality: 'ECR / Injambakkam',
      pincode: '600115',
      fullFormattedAddress: 'Villa 12, Golden Beach Road, Injambakkam, ECR, Chennai - 600115',
      deliveryNotes: 'Keep in temperature controlled box.'
    },
    deliverySlot: {
      dateLabel: '21 Aug 2026',
      timeSlot: 'Evening Slot (04:00 PM - 07:00 PM)'
    },
    productsOrdered: [
      {
        productId: 'prod-karupatti-millet-cake',
        productName: 'Chettinad Karupatti (Palm Jaggery) Millet Cake',
        productImage: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
        selectedSizeName: '1 kg Family Pack',
        pricePerUnit: 950,
        quantity: 2,
        purchaseValue: 1900
      },
      {
        productId: 'prod-butter-biscuits',
        productName: 'Traditional Chennai Bakery Butter Biscuits (Osmania Style)',
        productImage: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80',
        selectedSizeName: 'Gift Tin (500g)',
        pricePerUnit: 340,
        quantity: 2,
        purchaseValue: 680
      }
    ],
    subtotal: 2580,
    deliveryFee: 0,
    totalOrderValue: 2580,
    paymentMethod: 'UPI (PhonePe)',
    paymentStatus: 'PAID',
    transactionId: 'TXN-UPI-7740912',
    orderStatus: 'Delivered'
  }
];

export class DatabaseService {
  // PRODUCTS CRUD
  static getProducts(): Product[] {
    try {
      const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading products from storage:', e);
    }
    // Initialize default if empty
    this.saveProducts(PRODUCTS);
    return PRODUCTS;
  }

  static saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
      // Dispatch custom event so all open views update in real time
      window.dispatchEvent(new CustomEvent('chennai_bakery_products_updated', { detail: products }));
    } catch (e) {
      console.error('Error writing products to storage:', e);
    }
  }

  static addProduct(newProductData: {
    name: string;
    description: string;
    shortDescription?: string;
    basePrice: number;
    image: string;
    category?: string;
    dietaryTags?: string[];
    tamilName?: string;
    ingredients?: string[];
  }): Product {
    const products = this.getProducts();
    const id = `prod-custom-${Date.now()}`;
    const category = (newProductData.category || 'cakes') as any;
    const dietaryTags = (newProductData.dietaryTags || ['eggless']) as any;
    
    const newProduct: Product = {
      id,
      name: newProductData.name.trim(),
      tamilName: newProductData.tamilName?.trim() || '',
      category,
      basePrice: Number(newProductData.basePrice) || 500,
      shortDescription: newProductData.shortDescription?.trim() || newProductData.description.slice(0, 100) + '...',
      description: newProductData.description.trim(),
      image: newProductData.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      isChennaiSpecial: true,
      dietaryTags,
      ingredients: newProductData.ingredients && newProductData.ingredients.length > 0
        ? newProductData.ingredients
        : ['Pure Cow Butter', 'Wheat Flour', 'Cane Sugar', 'Cardamom'],
      allergens: {
        egg: dietaryTags.includes('eggless') ? 'No' : 'Yes',
        dairy: 'Yes',
        gluten: dietaryTags.includes('gluten-free') ? 'No' : 'Yes',
        nuts: 'May Contain'
      },
      nutrition: {
        servingSize: '100g',
        calories: 260,
        sugar: 14,
        carbohydrates: 32,
        protein: 4.5,
        fat: 11
      },
      sizes: [
        { id: 'size-standard', name: 'Standard Pack (500g)', priceMultiplier: 1, weightInGrams: 500 },
        { id: 'size-large', name: 'Large Pack (1 kg)', priceMultiplier: 1.85, weightInGrams: 1000 }
      ],
      defaultSizeId: 'size-standard',
      storageInfo: 'Store in refrigerator. Best consumed within 3 days.',
      shelfLife: '3-4 Days'
    };

    const updated = [newProduct, ...products];
    this.saveProducts(updated);
    return newProduct;
  }

  static updateProduct(productId: string, updatedFields: Partial<Product>): Product | null {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === productId);
    if (index === -1) return null;

    const current = products[index];
    const updated: Product = {
      ...current,
      ...updatedFields,
      id: productId, // Protect ID
      basePrice: updatedFields.basePrice !== undefined ? Number(updatedFields.basePrice) : current.basePrice,
      shortDescription: updatedFields.shortDescription || (updatedFields.description ? updatedFields.description.slice(0, 100) + '...' : current.shortDescription)
    };

    products[index] = updated;
    this.saveProducts(products);
    return updated;
  }

  static deleteProduct(productId: string): boolean {
    const products = this.getProducts();
    const filtered = products.filter(p => p.id !== productId);
    if (filtered.length === products.length) return false;
    this.saveProducts(filtered);
    return true;
  }

  static resetProductsToDefault(): Product[] {
    this.saveProducts(PRODUCTS);
    return PRODUCTS;
  }

  // ORDERS CRUD & VIEW
  static getOrders(): AdminOrder[] {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading orders from storage:', e);
    }
    // Initialize with seed orders
    this.saveOrders(INITIAL_SEED_ORDERS);
    return INITIAL_SEED_ORDERS;
  }

  static saveOrders(orders: AdminOrder[]): void {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
      window.dispatchEvent(new CustomEvent('chennai_bakery_orders_updated', { detail: orders }));
    } catch (e) {
      console.error('Error saving orders to storage:', e);
    }
  }

  static recordNewCustomerOrder(order: Order): AdminOrder {
    const orders = this.getOrders();
    const customerId = `CUST-${order.customer.phone.slice(-5) || Math.floor(10000 + Math.random() * 90000)}`;
    
    const adminProducts: AdminOrderItem[] = order.items.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.image,
      selectedSizeName: item.selectedSize.name,
      pricePerUnit: item.unitPrice,
      quantity: item.quantity,
      purchaseValue: item.itemTotal
    }));

    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newAdminOrder: AdminOrder = {
      orderId: order.orderId,
      date: formattedDate,
      isoDate: now.toISOString(),
      customerId,
      customerName: order.customer.fullName,
      customerPhone: order.customer.phone,
      customerEmail: order.customer.email || `${order.customer.phone}@customer.chennaibakery.com`,
      shippingAddress: {
        addressLine1: order.customer.addressLine1,
        locality: order.customer.locality,
        pincode: order.customer.pincode,
        fullFormattedAddress: `${order.customer.addressLine1}, ${order.customer.locality}, Chennai - ${order.customer.pincode}`,
        deliveryNotes: order.customer.deliveryInstructions
      },
      deliverySlot: {
        dateLabel: order.deliverySlot.dateLabel,
        timeSlot: order.deliverySlot.timeSlot
      },
      productsOrdered: adminProducts,
      subtotal: order.pricing.subtotal,
      deliveryFee: order.pricing.deliveryFee,
      totalOrderValue: order.pricing.totalAmount,
      paymentMethod: order.payment.method === 'upi' ? 'UPI Instant Pay' : order.payment.method === 'card' ? 'Credit/Debit Card' : 'Online Payment',
      paymentStatus: order.payment.status,
      transactionId: order.payment.transactionId,
      orderStatus: 'Confirmed'
    };

    const updatedOrders = [newAdminOrder, ...orders];
    this.saveOrders(updatedOrders);
    return newAdminOrder;
  }

  static updateOrderStatus(orderId: string, status: AdminOrder['orderStatus']): boolean {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.orderId === orderId);
    if (index === -1) return false;
    orders[index].orderStatus = status;
    this.saveOrders(orders);
    return true;
  }

  static deleteOrder(orderId: string): boolean {
    const orders = this.getOrders();
    const filtered = orders.filter(o => o.orderId !== orderId);
    if (filtered.length === orders.length) return false;
    this.saveOrders(filtered);
    return true;
  }

  // ==========================================
  // CUSTOMER PRODUCT REVIEWS CRUD
  // ==========================================
  static getReviews(): ProductReview[] {
    try {
      const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading reviews from storage:', e);
    }
    this.saveReviews(INITIAL_SEED_REVIEWS);
    return INITIAL_SEED_REVIEWS;
  }

  static saveReviews(reviews: ProductReview[]): void {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
      window.dispatchEvent(new CustomEvent('chennai_bakery_reviews_updated', { detail: reviews }));
    } catch (e) {
      console.error('Error saving reviews:', e);
    }
  }

  static getReviewsForProduct(productId: string): ProductReview[] {
    const all = this.getReviews();
    return all.filter(r => r.productId === productId);
  }

  static addReview(review: Omit<ProductReview, 'id' | 'createdAt'>): ProductReview {
    const all = this.getReviews();
    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}`;
    const newReview: ProductReview = {
      ...review,
      id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: formattedDate,
      isVerifiedBuyer: true
    };
    const updated = [newReview, ...all];
    this.saveReviews(updated);
    return newReview;
  }

  // ==========================================
  // CUSTOMER LOYALTY PROGRAM
  // ==========================================
  static getLoyaltyUser(): LoyaltyUser {
    try {
      const stored = localStorage.getItem(LOYALTY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed.pointsBalance === 'number') {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading loyalty user:', e);
    }
    this.saveLoyaltyUser(INITIAL_DEFAULT_LOYALTY_USER);
    return INITIAL_DEFAULT_LOYALTY_USER;
  }

  static saveLoyaltyUser(user: LoyaltyUser): void {
    try {
      localStorage.setItem(LOYALTY_STORAGE_KEY, JSON.stringify(user));
      window.dispatchEvent(new CustomEvent('chennai_bakery_loyalty_updated', { detail: user }));
    } catch (e) {
      console.error('Error saving loyalty user:', e);
    }
  }

  static addLoyaltyPoints(pointsToAdd: number): LoyaltyUser {
    const user = this.getLoyaltyUser();
    const updatedBalance = user.pointsBalance + pointsToAdd;
    const updatedLifetime = user.lifetimeEarned + pointsToAdd;
    
    // Tier calculation
    let tier: LoyaltyUser['tier'] = 'Bronze';
    if (updatedLifetime >= 2000) {
      tier = 'Mylapore Club';
    } else if (updatedLifetime >= 1000) {
      tier = 'Gold';
    } else if (updatedLifetime >= 300) {
      tier = 'Silver';
    }

    const updatedUser: LoyaltyUser = {
      ...user,
      pointsBalance: updatedBalance,
      lifetimeEarned: updatedLifetime,
      tier
    };
    this.saveLoyaltyUser(updatedUser);
    return updatedUser;
  }

  static calculateEarnedPoints(totalAmount: number): number {
    // Earn 1 point for every ₹10 spent
    return Math.max(10, Math.round(totalAmount / 10));
  }

  static updateLoyaltyProfile(updates: Partial<LoyaltyUser>): LoyaltyUser {
    const user = this.getLoyaltyUser();
    const updated = { ...user, ...updates };
    this.saveLoyaltyUser(updated);
    return updated;
  }

  // ==========================================
  // ADMIN SECURITY AUTHENTICATION (Story Requirement: Login ID: sreerammuthoju86@gmail.com, Password: 123456)
  // ==========================================
  static isAdminAuthenticated(): boolean {
    try {
      const stored = sessionStorage.getItem(ADMIN_AUTH_STORAGE_KEY) || localStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
      return stored === 'true';
    } catch {
      return false;
    }
  }

  static authenticateAdmin(emailInput: string, passwordInput: string): { success: boolean; message: string } {
    const cleanEmail = (emailInput || '').trim().toLowerCase();
    const cleanPassword = (passwordInput || '').trim();

    if (
      cleanEmail === ADMIN_SECURITY_CREDENTIALS.email.toLowerCase() &&
      cleanPassword === ADMIN_SECURITY_CREDENTIALS.password
    ) {
      try {
        sessionStorage.setItem(ADMIN_AUTH_STORAGE_KEY, 'true');
        localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, 'true');
      } catch {}
      return { success: true, message: 'Admin authentication successful.' };
    }

    return { 
      success: false, 
      message: 'Access Denied. Only authorized administrator sreerammuthoju86@gmail.com with verified password can access the Admin Dashboard.' 
    };
  }

  static logoutAdmin(): void {
    try {
      sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
      localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    } catch {}
  }
}
