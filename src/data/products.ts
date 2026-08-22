import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'prod-filter-coffee-cake',
    name: 'Mylapore Filter Coffee Caramel Cake',
    tamilName: 'மயிலாப்பூர் பில்டர் காபி கேக்',
    category: 'cakes',
    basePrice: 650,
    shortDescription: 'Signature sponge infused with Kumbakonam degree decoction, salted caramel & mocha mousse.',
    description: 'Our pride of Chennai! A light, moist sponge slow-infused with freshly brewed Kumbakonam Arabica-Peaberry coffee decoction, layered with silky caramel buttercream and topped with coffee bean crisp pearls. The aroma captures a classic morning in Chennai.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isChennaiSpecial: true,
    dietaryTags: ['eggless'],
    ingredients: [
      'Fresh Brewed Filter Coffee Decoction',
      'Refined Wheat Flour',
      'Brown Butter',
      'Salted Caramel Cream',
      'Raw Cane Sugar',
      'Dark Cocoa Dust'
    ],
    allergens: {
      egg: 'No',
      dairy: 'Yes',
      gluten: 'Yes',
      nuts: 'May Contain'
    },
    nutrition: {
      servingSize: '1 Slice (100g)',
      calories: 285,
      sugar: 18,
      carbohydrates: 36,
      protein: 4.8,
      fat: 13.2
    },
    sizes: [
      { id: 'size-500g', name: '500g (Serves 4-6)', priceMultiplier: 1, weightInGrams: 500 },
      { id: 'size-1kg', name: '1 kg (Serves 8-10)', priceMultiplier: 1.85, weightInGrams: 1000 },
      { id: 'size-1-5kg', name: '1.5 kg (Serves 12-14)', priceMultiplier: 2.7, weightInGrams: 1500 },
      { id: 'size-2kg', name: '2 kg (Serves 16-20)', priceMultiplier: 3.5, weightInGrams: 2000 }
    ],
    defaultSizeId: 'size-500g',
    storageInfo: 'Store in refrigerator at 4°C - 8°C. Best consumed within 3 days.',
    shelfLife: '3 Days refrigerated'
  },
  {
    id: 'prod-diabetic-ragi-walnut',
    name: 'Diabetic-Friendly Ragi & Walnut Cake',
    tamilName: 'கேழ்வரகு வால்நட் கேக் (சர்க்கரை இல்லாதது)',
    category: 'healthy',
    basePrice: 580,
    shortDescription: 'Zero refined sugar cake with native Finger Millet (Ragi), Californian walnuts & organic Stevia.',
    description: 'Crafted specifically for diabetic and health-focused customers in Chennai. Formulated using low glycemic index (GI) native Ragi (Finger millet) flour, crushed premium walnuts, cold-pressed olive oil, and naturally sweetened with pure organic stevia leaf extract. High fiber and rich in calcium.',
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isChennaiSpecial: true,
    dietaryTags: ['diabetic-friendly', 'low-sugar', 'low-calorie', 'eggless'],
    ingredients: [
      'Organic Ragi (Finger Millet) Flour',
      'Whole Wheat Flour',
      'Californian Walnuts',
      'Pure Stevia Leaf Extract',
      'Cold-Pressed Olive Oil',
      'Cinnamon Powder',
      'Fresh Almond Milk'
    ],
    allergens: {
      egg: 'No',
      dairy: 'No',
      gluten: 'Yes',
      nuts: 'Yes'
    },
    nutrition: {
      servingSize: '1 Slice (80g)',
      calories: 145,
      sugar: 1.8,
      carbohydrates: 19.5,
      protein: 5.2,
      fat: 6.1,
      fiber: 4.8
    },
    sizes: [
      { id: 'size-500g', name: '500g (Diabetic Pack)', priceMultiplier: 1, weightInGrams: 500 },
      { id: 'size-1kg', name: '1 kg Family Pack', priceMultiplier: 1.8, weightInGrams: 1000 }
    ],
    defaultSizeId: 'size-500g',
    storageInfo: 'Store in airtight container in a cool dry place or refrigerate.',
    shelfLife: '4 Days'
  },
  {
    id: 'prod-karupatti-millet-cake',
    name: 'Chettinad Karupatti (Palm Jaggery) Millet Cake',
    tamilName: 'செட்டிநாடு கருப்பட்டி தினை கேக்',
    category: 'healthy',
    basePrice: 520,
    shortDescription: 'Ancient Foxtail Millet cake sweetened with authentic Tuticorin organic Palm Jaggery.',
    description: 'A traditional Tamil Nadu heritage delicacy. Made from unpolished Foxtail Millet (Thinai) flour, pure organic Karupatti (Palm Jaggery from Tirunelveli), fresh grated coconut, and fragrant green cardamom. Rich in iron, zinc, and minerals with zero refined white sugar.',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isChennaiSpecial: true,
    dietaryTags: ['diabetic-friendly', 'low-calorie', 'eggless', 'low-sugar'],
    ingredients: [
      'Foxtail Millet (Thinai) Flour',
      'Pure Palm Jaggery (Karupatti)',
      'Grated Fresh Coconut',
      'Cardamom & Dry Ginger Powder',
      'Pure Desi Ghee',
      'Cashew slivers'
    ],
    allergens: {
      egg: 'No',
      dairy: 'Yes',
      gluten: 'No',
      nuts: 'Yes'
    },
    nutrition: {
      servingSize: '1 Slice (80g)',
      calories: 160,
      sugar: 5.5,
      carbohydrates: 24,
      protein: 4.1,
      fat: 5.4,
      fiber: 3.8
    },
    sizes: [
      { id: 'size-500g', name: '500g Box', priceMultiplier: 1, weightInGrams: 500 },
      { id: 'size-1kg', name: '1 kg Grand Box', priceMultiplier: 1.85, weightInGrams: 1000 }
    ],
    defaultSizeId: 'size-500g',
    storageInfo: 'Keep at room temperature for 2 days or refrigerate for 5 days.',
    shelfLife: '5 Days'
  },
  {
    id: 'prod-mysore-pak-cheesecake',
    name: 'Royal Mysore Pak Fusion Baked Cheesecake',
    tamilName: 'மைசூர் பாக் சீஸ்கேக்',
    category: 'cakes',
    basePrice: 790,
    shortDescription: 'Creamy New York style baked cheesecake layered over crumbly ghee-soaked Mysore Pak base.',
    description: 'An East-meets-West showstopper. Creamy Philadelphia cream cheese blended with subtle hints of saffron and cardamom, resting upon a velvety crust of traditional soft ghee Mysore Pak. Garnished with 24k edible gold dust and crushed pistachios.',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isChennaiSpecial: true,
    dietaryTags: ['eggless'],
    ingredients: [
      'Artisan Cream Cheese',
      'Gram Flour (Besan) Mysore Pak',
      'Pure Cow Ghee',
      'Kashmir Saffron',
      'Green Cardamom',
      'Pistachio Crumbs'
    ],
    allergens: {
      egg: 'No',
      dairy: 'Yes',
      gluten: 'No',
      nuts: 'Yes'
    },
    nutrition: {
      servingSize: '1 Slice (100g)',
      calories: 320,
      sugar: 22,
      carbohydrates: 31,
      protein: 6.5,
      fat: 19.2
    },
    sizes: [
      { id: 'size-500g', name: '500g (Serves 4)', priceMultiplier: 1, weightInGrams: 500 },
      { id: 'size-1kg', name: '1 kg (Serves 8-10)', priceMultiplier: 1.9, weightInGrams: 1000 }
    ],
    defaultSizeId: 'size-500g',
    storageInfo: 'Keep strictly refrigerated at 2°C - 5°C.',
    shelfLife: '4 Days'
  },
  {
    id: 'prod-belgian-dark-truffle',
    name: 'Belgian 70% Dark Chocolate Truffle Cake',
    tamilName: 'பெல்ஜியன் டார்க் சாக்லேட் கேக்',
    category: 'cakes',
    basePrice: 720,
    shortDescription: 'Intense single-origin 70% dark cocoa ganache layered over ultra-soft chocolate chiffon.',
    description: 'For genuine chocolate connoisseurs. Baked using single-origin 70% Belgian dark chocolate, enveloped in a glossy mirror glaze with dark chocolate curls. Deep, rich, and decadent without being overly sweet.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    dietaryTags: ['eggless'],
    ingredients: [
      '70% Belgian Dark Chocolate',
      'Dutch Process Cocoa',
      'Fresh Dairy Cream',
      'Wheat Flour',
      'Organic Cane Sugar',
      'Espresso Extract'
    ],
    allergens: {
      egg: 'No',
      dairy: 'Yes',
      gluten: 'Yes',
      nuts: 'May Contain'
    },
    nutrition: {
      servingSize: '1 Slice (100g)',
      calories: 310,
      sugar: 19,
      carbohydrates: 34,
      protein: 5.5,
      fat: 17.0
    },
    sizes: [
      { id: 'size-500g', name: '500g', priceMultiplier: 1, weightInGrams: 500 },
      { id: 'size-1kg', name: '1 kg', priceMultiplier: 1.85, weightInGrams: 1000 },
      { id: 'size-1-5kg', name: '1.5 kg', priceMultiplier: 2.7, weightInGrams: 1500 }
    ],
    defaultSizeId: 'size-500g',
    storageInfo: 'Refrigerate immediately. Serve at room temperature.',
    shelfLife: '3 Days'
  },
  {
    id: 'prod-chennai-coconut-dilpasand',
    name: 'Old Madras Bakery Coconut Bun (Dilpasand)',
    tamilName: 'சென்னை பாரம்பரிய தேங்காய் தில்பசந்த்',
    category: 'breads',
    basePrice: 180,
    shortDescription: 'Iconic puff pastry stuffed with sweet coconut, tutti-frutti, cherry bits and cardamom.',
    description: 'The beloved nostalgic classic from legendary Chennai tea stalls! Flaky, multi-layered golden puff pastry shell packed to the brim with sweet desiccated coconut, colorful tutti-frutti, cashew bits, and aromatic cardamom. Freshly baked every morning.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isChennaiSpecial: true,
    dietaryTags: ['eggless', 'low-calorie'],
    ingredients: [
      'Layered Puff Flour',
      'Fresh Desiccated Coconut',
      'Papaya Tutti-Frutti',
      'Glazed Red Cherries',
      'Cardamom Powder',
      'Pure Butter'
    ],
    allergens: {
      egg: 'No',
      dairy: 'Yes',
      gluten: 'Yes',
      nuts: 'Yes'
    },
    nutrition: {
      servingSize: '1 Bun (120g)',
      calories: 195,
      sugar: 11,
      carbohydrates: 28,
      protein: 3.5,
      fat: 7.8
    },
    sizes: [
      { id: 'size-single', name: '1 Jumbo Bun (250g)', priceMultiplier: 1, weightInGrams: 250 },
      { id: 'size-pack-2', name: 'Pack of 2 Jumbo Buns', priceMultiplier: 1.9, weightInGrams: 500 }
    ],
    defaultSizeId: 'size-single',
    storageInfo: 'Store in an airtight container at room temperature.',
    shelfLife: '3 Days'
  },
  {
    id: 'prod-curry-leaf-garlic-sourdough',
    name: 'Curry Leaf & Roasted Garlic Artisan Sourdough',
    tamilName: 'கருவேப்பிலை பூண்டு புளிப்பு ரொட்டி',
    category: 'breads',
    basePrice: 240,
    shortDescription: '36-hour naturally fermented sourdough boule with temper of fresh curry leaves & roasted garlic.',
    description: 'An artisanal loaf combining French sourdough craft with South Indian tempering. Naturally wild-fermented over 36 hours for easy digestion and low GI, folded with crisped organic curry leaves, slow-roasted garlic cloves, and a hint of crushed black pepper.',
    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isChennaiSpecial: true,
    dietaryTags: ['vegan', 'low-sugar', 'low-calorie', 'eggless'],
    ingredients: [
      'Stoneground Whole Wheat Flour',
      'Organic Rye Starter',
      'Roasted Whole Garlic Cloves',
      'Fresh Organic Curry Leaves',
      'Cold-Pressed Gingelly Oil',
      'Himalayan Pink Salt',
      'Spring Water'
    ],
    allergens: {
      egg: 'No',
      dairy: 'No',
      gluten: 'Yes',
      nuts: 'No'
    },
    nutrition: {
      servingSize: '2 Slices (70g)',
      calories: 130,
      sugar: 0.8,
      carbohydrates: 24,
      protein: 5.1,
      fat: 1.8,
      fiber: 4.2
    },
    sizes: [
      { id: 'size-loaf', name: '1 Artisan Boule (500g)', priceMultiplier: 1, weightInGrams: 500 }
    ],
    defaultSizeId: 'size-loaf',
    storageInfo: 'Keep wrapped in linen cloth or bread box. Can be toasted.',
    shelfLife: '4 Days'
  },
  {
    id: 'prod-multigrain-loaf',
    name: '100% Whole Wheat 7-Seed High Fiber Loaf',
    tamilName: 'முழு கோதுமை 7-தானிய பிரெட்',
    category: 'breads',
    basePrice: 130,
    shortDescription: 'Zero Maida, zero added refined sugar loaf packed with flax, pumpkin, sunflower & chia seeds.',
    description: 'Our staple wholesome table loaf. 100% whole grain wheat flour loaded with roasted flaxseeds, pumpkin seeds, sunflower seeds, chia, sesame, and watermelon seeds. Ideal for diabetic diets, weight management, and everyday healthy toast.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    dietaryTags: ['vegan', 'diabetic-friendly', 'low-calorie', 'low-sugar', 'eggless'],
    ingredients: [
      '100% Stoneground Whole Wheat',
      'Flaxseeds',
      'Pumpkin Seeds',
      'Chia Seeds',
      'White & Black Sesame',
      'Extra Virgin Olive Oil',
      'Rock Salt',
      'Active Yeast'
    ],
    allergens: {
      egg: 'No',
      dairy: 'No',
      gluten: 'Yes',
      nuts: 'No'
    },
    nutrition: {
      servingSize: '2 Slices (60g)',
      calories: 120,
      sugar: 0.5,
      carbohydrates: 20,
      protein: 5.8,
      fat: 2.2,
      fiber: 4.6
    },
    sizes: [
      { id: 'size-loaf-400', name: '400g Sliced Loaf', priceMultiplier: 1, weightInGrams: 400 }
    ],
    defaultSizeId: 'size-loaf-400',
    storageInfo: 'Store in bread bag at room temperature.',
    shelfLife: '4 Days'
  },
  {
    id: 'prod-ragi-almond-cookies',
    name: 'Ragi Almond & Palm Sugar Crunch Cookies',
    tamilName: 'கேழ்வரகு பாதாம் பிஸ்கட்',
    category: 'cookies',
    basePrice: 220,
    shortDescription: 'Crunchy bite-sized cookies crafted from native finger millet, roasted almonds & palm candy.',
    description: 'Guilt-free teatime munching. Baked with organic finger millet (Ragi), crunchy roasted almond slivers, and sweetened lightly with unrefined Palm Jaggery sugar (Nattu Sakkarai). Packed with natural calcium and fiber.',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isChennaiSpecial: true,
    dietaryTags: ['diabetic-friendly', 'low-sugar', 'low-calorie', 'eggless'],
    ingredients: [
      'Sprouted Ragi Flour',
      'Californian Almond Chunks',
      'Organic Country Palm Sugar (Nattu Sakkarai)',
      'Pure Butter',
      'Cardamom Essence'
    ],
    allergens: {
      egg: 'No',
      dairy: 'Yes',
      gluten: 'No',
      nuts: 'Yes'
    },
    nutrition: {
      servingSize: '2 Cookies (30g)',
      calories: 98,
      sugar: 2.8,
      carbohydrates: 14,
      protein: 2.9,
      fat: 3.6,
      fiber: 2.5
    },
    sizes: [
      { id: 'size-box-250g', name: '250g Box (approx. 14 pcs)', priceMultiplier: 1, weightInGrams: 250 },
      { id: 'size-box-500g', name: '500g Value Pack (approx. 28 pcs)', priceMultiplier: 1.85, weightInGrams: 500 }
    ],
    defaultSizeId: 'size-box-250g',
    storageInfo: 'Keep in an airtight jar at room temperature.',
    shelfLife: '30 Days'
  },
  {
    id: 'prod-cashew-butter-biscuits',
    name: 'Mount Road Cashew Butter Biscuits',
    tamilName: 'மவுண்ட் ரோடு முந்திரி வெண்ணெய் பிஸ்கட்',
    category: 'cookies',
    basePrice: 240,
    shortDescription: 'Melt-in-mouth golden butter cookies studded with whole roasted cashew halves.',
    description: 'A tribute to the iconic tea-room bakeries of Mount Road and Triplicane. Creamed rich European butter, crushed cashews, and a golden crumbly texture that dissolves the moment you dip it into hot filter coffee.',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isChennaiSpecial: true,
    dietaryTags: ['eggless'],
    ingredients: [
      'Slow-Churned Cream Butter',
      'Whole Roasted Cashews',
      'Wheat Flour',
      'Unrefined Sugar',
      'Pure Madagascar Vanilla'
    ],
    allergens: {
      egg: 'No',
      dairy: 'Yes',
      gluten: 'Yes',
      nuts: 'Yes'
    },
    nutrition: {
      servingSize: '2 Biscuits (35g)',
      calories: 165,
      sugar: 7.2,
      carbohydrates: 18.5,
      protein: 3.1,
      fat: 9.4
    },
    sizes: [
      { id: 'size-box-250g', name: '250g Tin Box', priceMultiplier: 1, weightInGrams: 250 },
      { id: 'size-box-500g', name: '500g Royal Tin', priceMultiplier: 1.9, weightInGrams: 500 }
    ],
    defaultSizeId: 'size-box-250g',
    storageInfo: 'Store in airtight tin away from moisture.',
    shelfLife: '45 Days'
  },
  {
    id: 'prod-eggless-alphonso-mango',
    name: 'Ratnagiri Alphonso Mango Delight Cake',
    tamilName: 'அல்போன்சோ மாம்பழ கேக்',
    category: 'eggless',
    basePrice: 680,
    shortDescription: '100% Eggless vanilla sponge layered with real Alphonso mango compote & mango glaze.',
    description: 'Sunshine in every bite! Pure vegetarian 100% eggless fluffy sponge layered with fresh Alphonso mango pulp, light whipped white chocolate mousse, and crowned with mango cubes and mint sprigs.',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    dietaryTags: ['eggless'],
    ingredients: [
      '100% Pure Alphonso Mango Pulp',
      'Eggless Vanilla Sponge Base',
      'Fresh Dairy Cream',
      'White Chocolate Flakes',
      'Organic Sugar'
    ],
    allergens: {
      egg: 'No',
      dairy: 'Yes',
      gluten: 'Yes',
      nuts: 'No'
    },
    nutrition: {
      servingSize: '1 Slice (100g)',
      calories: 240,
      sugar: 21,
      carbohydrates: 38,
      protein: 3.8,
      fat: 9.5
    },
    sizes: [
      { id: 'size-500g', name: '500g (Serves 4-6)', priceMultiplier: 1, weightInGrams: 500 },
      { id: 'size-1kg', name: '1 kg (Serves 8-10)', priceMultiplier: 1.85, weightInGrams: 1000 }
    ],
    defaultSizeId: 'size-500g',
    storageInfo: 'Keep refrigerated between 3°C - 7°C.',
    shelfLife: '3 Days'
  },
  {
    id: 'prod-low-cal-cacao-brownie',
    name: 'Guilt-Free Low-Calorie Dark Cacao Brownie',
    tamilName: 'குறைந்த கலோரி டார்க் பிரவுனி',
    category: 'healthy',
    basePrice: 190,
    shortDescription: 'Fudgy dark brownie with 0g refined sugar, Greek yogurt, apple purée & single-origin cacao.',
    description: 'Enjoy intense chocolate richness with just 110 calories! Made by replacing heavy butter with Greek yogurt and natural unsweetened apple purée, sweetened with natural birch xylitol and organic stevia.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    dietaryTags: ['low-calorie', 'diabetic-friendly', 'low-sugar', 'eggless'],
    ingredients: [
      'Organic Raw Cacao Powder',
      'Greek Yogurt',
      'Unsweetened Apple Purée',
      'Almond Flour',
      'Stevia & Plant Sweeteners',
      'Walnut nibs'
    ],
    allergens: {
      egg: 'No',
      dairy: 'Yes',
      gluten: 'No',
      nuts: 'Yes'
    },
    nutrition: {
      servingSize: '1 Piece (65g)',
      calories: 110,
      sugar: 1.2,
      carbohydrates: 12,
      protein: 4.8,
      fat: 4.5,
      fiber: 3.5
    },
    sizes: [
      { id: 'size-box-2', name: 'Box of 2 Brownies (130g)', priceMultiplier: 1, weightInGrams: 130 },
      { id: 'size-box-4', name: 'Box of 4 Brownies (260g)', priceMultiplier: 1.85, weightInGrams: 260 }
    ],
    defaultSizeId: 'size-box-2',
    storageInfo: 'Keep refrigerated. Microwave for 10 seconds for warm gooey texture.',
    shelfLife: '5 Days'
  },
  {
    id: 'prod-eggless-black-forest',
    name: 'Classic Eggless Black Forest Gateau',
    tamilName: 'எக்லெஸ் பிளாக் ஃபாரஸ்ட் கேக்',
    category: 'eggless',
    basePrice: 590,
    shortDescription: 'Traditional chocolate sponge with sour cherry compote, whipped cream & Belgian chocolate shavings.',
    description: 'The beloved celebration cake made 100% vegetarian without eggs. Moist chocolate sponge soaked with cherry syrup, layered with luscious vanilla cream, dark pitted cherries, and blanketed with dark chocolate curls.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    dietaryTags: ['eggless'],
    ingredients: [
      'Eggless Cocoa Sponge',
      'Glace & Dark Morello Cherries',
      'Fresh Whipped Cream',
      'Belgian Dark Chocolate Shavings',
      'Organic Sugar'
    ],
    allergens: {
      egg: 'No',
      dairy: 'Yes',
      gluten: 'Yes',
      nuts: 'No'
    },
    nutrition: {
      servingSize: '1 Slice (100g)',
      calories: 270,
      sugar: 20,
      carbohydrates: 35,
      protein: 4.2,
      fat: 12.0
    },
    sizes: [
      { id: 'size-500g', name: '500g (Serves 4-6)', priceMultiplier: 1, weightInGrams: 500 },
      { id: 'size-1kg', name: '1 kg (Serves 8-10)', priceMultiplier: 1.85, weightInGrams: 1000 }
    ],
    defaultSizeId: 'size-500g',
    storageInfo: 'Store in refrigerator at 4°C.',
    shelfLife: '3 Days'
  },
  {
    id: 'prod-gluten-free-berry-slice',
    name: 'Gluten-Free Almond Berry Keto Slice',
    tamilName: 'குளூட்டன் இல்லாத பாதாம் பெர்ரி கேக்',
    category: 'healthy',
    basePrice: 620,
    shortDescription: 'Zero flour keto cake crafted from 100% Californian almond meal, fresh raspberries & monk fruit.',
    description: 'Specifically engineered for keto, gluten-intolerant, and diabetic customers. Zero wheat flour, ultra-low carbohydrates (only 3g net carbs per slice), enriched with antioxidant-rich berries and monk fruit sweetness.',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    dietaryTags: ['gluten-free', 'diabetic-friendly', 'low-sugar', 'low-calorie', 'eggless'],
    ingredients: [
      '100% Blanched Almond Flour',
      'Freeze-Dried Raspberry & Blueberry',
      'Monk Fruit Sweetener',
      'Organic Virgin Coconut Oil',
      'Flaxseed Meal',
      'Vanilla Bean Pods'
    ],
    allergens: {
      egg: 'No',
      dairy: 'No',
      gluten: 'No',
      nuts: 'Yes'
    },
    nutrition: {
      servingSize: '1 Slice (80g)',
      calories: 155,
      sugar: 1.5,
      carbohydrates: 6.5,
      protein: 6.2,
      fat: 12.5,
      fiber: 4.0
    },
    sizes: [
      { id: 'size-400g', name: '400g Keto Loaf', priceMultiplier: 1, weightInGrams: 400 },
      { id: 'size-800g', name: '800g Family Pack', priceMultiplier: 1.85, weightInGrams: 800 }
    ],
    defaultSizeId: 'size-400g',
    storageInfo: 'Store in refrigerator. Sealed container recommended.',
    shelfLife: '6 Days'
  },
  {
    id: 'prod-traditional-tea-rusk',
    name: 'Madras Elaichi Twice-Baked Butter Rusk',
    tamilName: 'சென்னை ஏலக்காய் வெண்ணெய் ரஸ்க்',
    category: 'cookies',
    basePrice: 150,
    shortDescription: 'Crisp twice-baked cardamom milk toasts, the quintessential accompaniment to Madras filter tea.',
    description: 'Crispy, crumbly, and golden. Twice-baked in our stone deck ovens with fresh country milk, churned butter, and fragrant crushed Idukki green cardamom. Designed to absorb your tea or coffee perfectly without collapsing.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isChennaiSpecial: true,
    dietaryTags: ['eggless', 'low-calorie'],
    ingredients: [
      'Wheat Flour',
      'Fresh Farm Milk',
      'Pure Butter',
      'Green Cardamom Powder',
      'Sugar',
      'Yeast'
    ],
    allergens: {
      egg: 'No',
      dairy: 'Yes',
      gluten: 'Yes',
      nuts: 'No'
    },
    nutrition: {
      servingSize: '2 Rusks (30g)',
      calories: 115,
      sugar: 4.0,
      carbohydrates: 22,
      protein: 3.1,
      fat: 2.1
    },
    sizes: [
      { id: 'size-300g', name: '300g Pack', priceMultiplier: 1, weightInGrams: 300 },
      { id: 'size-600g', name: '600g Twin Pack', priceMultiplier: 1.9, weightInGrams: 600 }
    ],
    defaultSizeId: 'size-300g',
    storageInfo: 'Store in an airtight jar to retain crispness.',
    shelfLife: '60 Days'
  },
  {
    id: 'prod-seasonal-strawberry-tart',
    name: 'Ooty Fresh Strawberry Tart (Seasonal Batch)',
    tamilName: 'ஊட்டி ஸ்ட்ராபெரி டார்ட்',
    category: 'cakes',
    basePrice: 450,
    shortDescription: 'Buttery shortcrust pastry filled with vanilla bean pastry cream & fresh Nilgiri mountain strawberries.',
    description: 'Seasonal batch from Nilgiri hill strawberries. Handcrafted almond shortcrust pastry shell layered with silky eggless custard cream and glazed fresh strawberries.',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
    isAvailable: false, // Intentionally unavailable to demonstrate out-of-stock badge / disabling as per Story 8
    isChennaiSpecial: true,
    dietaryTags: ['eggless'],
    ingredients: [
      'Fresh Ooty Strawberries',
      'Almond Shortcrust Flour',
      'Vanilla Bean Custard',
      'Fruit Glaze',
      'Pure Butter'
    ],
    allergens: {
      egg: 'No',
      dairy: 'Yes',
      gluten: 'Yes',
      nuts: 'Yes'
    },
    nutrition: {
      servingSize: '1 Tart (120g)',
      calories: 220,
      sugar: 15,
      carbohydrates: 29,
      protein: 3.4,
      fat: 9.8
    },
    sizes: [
      { id: 'size-pack-2', name: 'Box of 2 Tarts', priceMultiplier: 1, weightInGrams: 240 }
    ],
    defaultSizeId: 'size-pack-2',
    storageInfo: 'Refrigerate immediately.',
    shelfLife: '2 Days'
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'All Treats', count: PRODUCTS.length, icon: 'Sparkles' },
  { id: 'cakes', name: 'Cakes', count: PRODUCTS.filter(p => p.category === 'cakes').length, icon: 'Cake' },
  { id: 'cookies', name: 'Cookies & Biscuits', count: PRODUCTS.filter(p => p.category === 'cookies').length, icon: 'Cookie' },
  { id: 'breads', name: 'Breads & Buns', count: PRODUCTS.filter(p => p.category === 'breads').length, icon: 'Wheat' },
  { id: 'eggless', name: '100% Eggless', count: PRODUCTS.filter(p => p.category === 'eggless' || p.dietaryTags.includes('eggless')).length, icon: 'Leaf' },
  { id: 'healthy', name: 'Healthy & Diabetic', count: PRODUCTS.filter(p => p.category === 'healthy' || p.dietaryTags.includes('diabetic-friendly') || p.dietaryTags.includes('low-calorie')).length, icon: 'HeartPulse' }
];

export const DIETARY_FILTERS = [
  { id: 'low-calorie', label: 'Low-Calorie', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100', activeColor: 'bg-emerald-600 text-white border-emerald-600', description: 'Under 160 kcal/serving' },
  { id: 'diabetic-friendly', label: 'Diabetic-Friendly', color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100', activeColor: 'bg-blue-600 text-white border-blue-600', description: 'Zero refined sugar / Low GI' },
  { id: 'low-sugar', label: 'Low-Sugar', color: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100', activeColor: 'bg-teal-600 text-white border-teal-600', description: 'Under 3g sugar per serving' },
  { id: 'eggless', label: '100% Eggless', color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100', activeColor: 'bg-amber-600 text-white border-amber-600', description: 'Pure vegetarian recipes' },
  { id: 'vegan', label: 'Vegan', color: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100', activeColor: 'bg-green-600 text-white border-green-600', description: '100% Plant-based & dairy-free' },
  { id: 'gluten-free', label: 'Gluten-Free', color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100', activeColor: 'bg-purple-600 text-white border-purple-600', description: 'Almond / Millet base' }
];
