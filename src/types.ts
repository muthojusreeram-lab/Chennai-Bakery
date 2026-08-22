export type CategoryId = 'all' | 'cakes' | 'cookies' | 'breads' | 'eggless' | 'healthy';

export type DietaryTag = 
  | 'low-calorie' 
  | 'diabetic-friendly' 
  | 'low-sugar' 
  | 'eggless' 
  | 'vegan' 
  | 'gluten-free';

export interface AllergenInfo {
  egg: 'Yes' | 'No' | 'May Contain';
  nuts: 'Yes' | 'No' | 'May Contain';
  dairy: 'Yes' | 'No' | 'May Contain';
  gluten: 'Yes' | 'No' | 'May Contain';
  otherAllergens?: string[];
}

export interface NutritionInfo {
  servingSize: string; // e.g., "100g" or "1 Slice (80g)"
  calories: number; // kcal
  sugar: number; // in grams
  carbohydrates: number; // in grams
  protein: number; // in grams
  fat: number; // in grams
  fiber?: number; // in grams
}

export interface ProductSizeOption {
  id: string;
  name: string; // e.g. "500g", "1 kg", "1.5 kg", "Pack of 6", "Loaf (400g)"
  priceMultiplier: number; // base price * multiplier
  weightInGrams?: number;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  locality?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  isVerifiedBuyer?: boolean;
}

export interface LoyaltyUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  locality: string;
  pointsBalance: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Mylapore Club';
  lifetimeEarned: number;
  isLoggedIn: boolean;
}

export interface Product {
  id: string;
  name: string;
  tamilName?: string;
  category: CategoryId;
  basePrice: number; // in INR
  shortDescription: string;
  description: string;
  image: string;
  isAvailable: boolean;
  dietaryTags: DietaryTag[];
  isChennaiSpecial?: boolean;
  ingredients: string[];
  allergens: AllergenInfo;
  nutrition: NutritionInfo;
  sizes: ProductSizeOption[];
  defaultSizeId: string;
  storageInfo?: string;
  shelfLife?: string;
  rating?: number; // e.g. 4.9
  reviewCount?: number; // e.g. 24
}

export interface CartItem {
  id: string; // unique item id in cart (product.id + size.id)
  product: Product;
  selectedSize: ProductSizeOption;
  quantity: number;
  unitPrice: number;
  itemTotal: number;
}

export interface ChennaiPinLocation {
  pincode: string;
  locality: string;
  isDeliverable: boolean;
  zone: 'Central Chennai' | 'South Chennai' | 'North Chennai' | 'West Chennai' | 'OMR/ECR Corridor';
  deliveryFee: number; // in INR
  estimatedTime: string;
}

export interface DeliverySlot {
  date: string; // YYYY-MM-DD or readable
  dateLabel: string; // e.g. "Today (22 Aug)", "Tomorrow (23 Aug)"
  timeSlot: string; // e.g. "07:00 AM - 10:00 AM"
  isAvailable: boolean;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  locality: string;
  pincode: string;
  deliveryInstructions?: string;
}

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';

export interface PaymentDetails {
  method: PaymentMethod;
  upiApp?: 'gpay' | 'phonepe' | 'paytm' | 'other';
  upiId?: string;
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCvv?: string;
  bankName?: string;
  transactionReference?: string;
}

export interface Order {
  orderId: string;
  createdAt: string;
  items: CartItem[];
  customer: CustomerDetails;
  deliverySlot: {
    dateLabel: string;
    timeSlot: string;
  };
  pricing: {
    subtotal: number;
    deliveryFee: number;
    taxes: number;
    discount: number;
    totalAmount: number;
  };
  payment: {
    method: PaymentMethod;
    status: 'PAID' | 'FAILED' | 'PENDING';
    transactionId: string;
    paidAt: string;
  };
  status: 'Confirmed' | 'Baking Fresh' | 'Dispatched' | 'Delivered';
}
