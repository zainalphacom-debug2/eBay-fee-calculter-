import { CategoryFeeRule } from '../types/calculator';

/**
 * Official eBay UK Business Seller Fee Schedule
 * Sources:
 * - eBay UK Selling Fees: https://www.ebay.co.uk/help/selling/fees-credits-invoices/selling-fees?id=4809
 * - eBay UK Seller Centre Rate Card Changes (effective Feb 2026): https://www.ebay.co.uk/sellercentre/news/2026-january/rate-card-change
 */
export const OFFICIAL_EBAY_UK_FEE_RULES: CategoryFeeRule[] = [
  {
    id: 'home_furniture_diy',
    name: 'Home, Furniture & DIY',
    ebayCategoryId: 11700,
    variableRate: 10.9,
    tiers: [
      { threshold: 4000, rateAbove: 2.0, appliesTo: 'order' }
    ],
    qualifiesForReducedOrderFee: true, // Eligible for £0.10 reduced fee under qualifying conditions
    effectiveFrom: '2026-02-15',
    sourceUrl: 'https://www.ebay.co.uk/sellercentre/news/2026-january/rate-card-change',
    verificationStatus: 'verified',
    subcategoryNotes: 'Standard 10.9% up to £4,000; 2% portion above. Selected eligible listings qualify for £0.10 order fee.'
  },
  {
    id: 'collectables',
    name: 'Collectables',
    ebayCategoryId: 1,
    variableRate: 10.9,
    tiers: [
      { threshold: 4000, rateAbove: 2.0, appliesTo: 'order' }
    ],
    qualifiesForReducedOrderFee: true, // Eligible for £0.10 reduced fee under qualifying conditions
    effectiveFrom: '2026-02-15',
    sourceUrl: 'https://www.ebay.co.uk/sellercentre/news/2026-january/rate-card-change',
    verificationStatus: 'verified',
    subcategoryNotes: 'Standard 10.9% up to £4,000; 2% portion above. Eligible listings qualify for £0.10 order fee.'
  },
  {
    id: 'baby',
    name: 'Baby',
    ebayCategoryId: 2984,
    variableRate: 10.9,
    tiers: [
      { threshold: 4000, rateAbove: 2.0, appliesTo: 'order' }
    ],
    qualifiesForReducedOrderFee: false,
    effectiveFrom: '2026-02-15',
    sourceUrl: 'https://www.ebay.co.uk/help/selling/fees-credits-invoices/selling-fees?id=4809',
    verificationStatus: 'verified',
    subcategoryNotes: '10.9% up to £4,000; 2% portion over £4,000.'
  },
  {
    id: 'clothes_shoes_acc',
    name: 'Clothes, Shoes & Accessories',
    ebayCategoryId: 11450,
    variableRate: 10.9,
    tiers: [
      { threshold: 4000, rateAbove: 2.0, appliesTo: 'order' }
    ],
    qualifiesForReducedOrderFee: false,
    effectiveFrom: '2026-02-15',
    sourceUrl: 'https://www.ebay.co.uk/help/selling/fees-credits-invoices/selling-fees?id=4809',
    verificationStatus: 'verified',
    subcategoryNotes: 'Standard business seller rate 10.9% up to £4,000; 2% portion over £4,000.'
  },
  {
    id: 'womens_bags_handbags',
    name: "Women's Bags & Handbags",
    ebayCategoryId: 169291,
    variableRate: 10.9,
    tiers: [
      { threshold: 4000, rateAbove: 2.0, appliesTo: 'order' }
    ],
    qualifiesForReducedOrderFee: false,
    effectiveFrom: '2026-02-15',
    sourceUrl: 'https://www.ebay.co.uk/help/selling/fees-credits-invoices/selling-fees?id=4809',
    verificationStatus: 'verified',
    subcategoryNotes: '10.9% up to £4,000; 2% on portion over £4,000.'
  },
  {
    id: 'garden_patio',
    name: 'Garden & Patio',
    ebayCategoryId: 159912,
    variableRate: 10.9,
    tiers: [
      { threshold: 4000, rateAbove: 2.0, appliesTo: 'order' }
    ],
    qualifiesForReducedOrderFee: false,
    effectiveFrom: '2026-02-15',
    sourceUrl: 'https://www.ebay.co.uk/help/selling/fees-credits-invoices/selling-fees?id=4809',
    verificationStatus: 'verified',
    subcategoryNotes: '10.9% up to £4,000; 2% on portion over £4,000.'
  },
  {
    id: 'pet_supplies',
    name: 'Pet Supplies',
    ebayCategoryId: 1281,
    variableRate: 10.9,
    tiers: [
      { threshold: 4000, rateAbove: 2.0, appliesTo: 'order' }
    ],
    qualifiesForReducedOrderFee: false,
    effectiveFrom: '2026-02-15',
    sourceUrl: 'https://www.ebay.co.uk/help/selling/fees-credits-invoices/selling-fees?id=4809',
    verificationStatus: 'verified',
    subcategoryNotes: '10.9% up to £4,000; 2% on portion over £4,000.'
  },
  {
    id: 'sporting_goods',
    name: 'Sporting Goods',
    ebayCategoryId: 888,
    variableRate: 10.9,
    tiers: [
      { threshold: 4000, rateAbove: 2.0, appliesTo: 'order' }
    ],
    qualifiesForReducedOrderFee: false,
    effectiveFrom: '2026-02-15',
    sourceUrl: 'https://www.ebay.co.uk/help/selling/fees-credits-invoices/selling-fees?id=4809',
    verificationStatus: 'verified',
    subcategoryNotes: '10.9% up to £4,000; 2% on portion over £4,000.'
  },
  {
    id: 'computers_tablets_networking',
    name: 'Computers, Tablets & Networking',
    ebayCategoryId: 58058,
    variableRate: 6.9,
    tiers: [
      { threshold: 4000, rateAbove: 2.0, appliesTo: 'order' }
    ],
    qualifiesForReducedOrderFee: false,
    effectiveFrom: '2026-02-15',
    sourceUrl: 'https://www.ebay.co.uk/help/selling/fees-credits-invoices/selling-fees?id=4809',
    verificationStatus: 'verified',
    subcategoryNotes: 'Reduced 6.9% rate for electronics & computing up to £4,000; 2% on portion over £4,000.'
  },
  {
    id: 'cameras_photography',
    name: 'Cameras & Photography',
    ebayCategoryId: 625,
    variableRate: 6.9,
    tiers: [
      { threshold: 4000, rateAbove: 2.0, appliesTo: 'order' }
    ],
    qualifiesForReducedOrderFee: false,
    effectiveFrom: '2026-02-15',
    sourceUrl: 'https://www.ebay.co.uk/help/selling/fees-credits-invoices/selling-fees?id=4809',
    verificationStatus: 'verified',
    subcategoryNotes: '6.9% up to £4,000; 2% on portion over £4,000.'
  },
  {
    id: 'sound_vision',
    name: 'Sound & Vision / Consumer Electronics',
    ebayCategoryId: 293,
    variableRate: 6.9,
    tiers: [
      { threshold: 4000, rateAbove: 2.0, appliesTo: 'order' }
    ],
    qualifiesForReducedOrderFee: false,
    effectiveFrom: '2026-02-15',
    sourceUrl: 'https://www.ebay.co.uk/help/selling/fees-credits-invoices/selling-fees?id=4809',
    verificationStatus: 'verified',
    subcategoryNotes: '6.9% up to £4,000; 2% on portion over £4,000.'
  },
  {
    id: 'books_comics_magazines',
    name: 'Books, Comics & Magazines',
    ebayCategoryId: 267,
    variableRate: 9.9,
    tiers: [
      { threshold: 4000, rateAbove: 2.0, appliesTo: 'order' }
    ],
    qualifiesForReducedOrderFee: false,
    effectiveFrom: '2026-02-15',
    sourceUrl: 'https://www.ebay.co.uk/help/selling/fees-credits-invoices/selling-fees?id=4809',
    verificationStatus: 'verified',
    subcategoryNotes: '9.9% up to £4,000; 2% on portion over £4,000.'
  },
  {
    id: 'jewellery_watches',
    name: 'Jewellery & Watches',
    ebayCategoryId: 281,
    variableRate: 11.9,
    tiers: [
      { threshold: 450, rateAbove: 3.0, appliesTo: 'item' },
      { threshold: 4000, rateAbove: 2.0, appliesTo: 'item' }
    ],
    qualifiesForReducedOrderFee: false,
    effectiveFrom: '2026-02-15',
    sourceUrl: 'https://www.ebay.co.uk/help/selling/fees-credits-invoices/selling-fees?id=4809',
    verificationStatus: 'verified',
    subcategoryNotes: 'Tiered per item: 11.9% portion up to £450, 3% portion between £450 and £4,000, 2% portion above £4,000.'
  },
  {
    id: 'business_office_industrial',
    name: 'Business, Office & Industrial',
    ebayCategoryId: 12576,
    variableRate: 10.9,
    tiers: [
      { threshold: 4000, rateAbove: 2.0, appliesTo: 'order' }
    ],
    qualifiesForReducedOrderFee: false,
    effectiveFrom: '2026-02-15',
    sourceUrl: 'https://www.ebay.co.uk/help/selling/fees-credits-invoices/selling-fees?id=4809',
    verificationStatus: 'verified',
    subcategoryNotes: 'Standard 10.9% up to £4,000; 2% over £4,000. (Heavy equipment subcategories have specific flat caps).'
  },
  {
    id: 'vehicle_parts_accessories',
    name: 'Vehicle Parts & Accessories',
    ebayCategoryId: 131090,
    variableRate: 9.9,
    tiers: [
      { threshold: 4000, rateAbove: 2.0, appliesTo: 'order' }
    ],
    qualifiesForReducedOrderFee: false,
    effectiveFrom: '2026-02-15',
    sourceUrl: 'https://www.ebay.co.uk/help/selling/fees-credits-invoices/selling-fees?id=4809',
    verificationStatus: 'verified',
    subcategoryNotes: '9.9% up to £4,000; 2% on portion over £4,000.'
  },
  {
    id: 'musical_instruments',
    name: 'Musical Instruments & DJ Equipment',
    ebayCategoryId: 619,
    variableRate: 9.9,
    tiers: [
      { threshold: 4000, rateAbove: 2.0, appliesTo: 'order' }
    ],
    qualifiesForReducedOrderFee: false,
    effectiveFrom: '2026-02-15',
    sourceUrl: 'https://www.ebay.co.uk/help/selling/fees-credits-invoices/selling-fees?id=4809',
    verificationStatus: 'verified',
    subcategoryNotes: '9.9% up to £4,000; 2% on portion over £4,000.'
  },
  {
    id: 'video_game_consoles',
    name: 'Video Games & Consoles - Consoles',
    ebayCategoryId: 139971,
    variableRate: 6.9,
    tiers: [
      { threshold: 4000, rateAbove: 2.0, appliesTo: 'order' }
    ],
    qualifiesForReducedOrderFee: false,
    effectiveFrom: '2026-02-15',
    sourceUrl: 'https://www.ebay.co.uk/help/selling/fees-credits-invoices/selling-fees?id=4809',
    verificationStatus: 'verified',
    subcategoryNotes: '6.9% for hardware consoles up to £4,000; 2% on portion over £4,000.'
  },
  {
    id: 'video_games_software',
    name: 'Video Games & Consoles - Games & Accessories',
    ebayCategoryId: 139973,
    variableRate: 8.9,
    tiers: [
      { threshold: 4000, rateAbove: 2.0, appliesTo: 'order' }
    ],
    qualifiesForReducedOrderFee: false,
    effectiveFrom: '2026-02-15',
    sourceUrl: 'https://www.ebay.co.uk/help/selling/fees-credits-invoices/selling-fees?id=4809',
    verificationStatus: 'verified',
    subcategoryNotes: '8.9% up to £4,000; 2% on portion over £4,000.'
  },
  {
    id: 'other_categories',
    name: 'Other Categories (Standard eBay UK Rate)',
    variableRate: 10.9,
    tiers: [
      { threshold: 4000, rateAbove: 2.0, appliesTo: 'order' }
    ],
    qualifiesForReducedOrderFee: false,
    effectiveFrom: '2026-02-15',
    sourceUrl: 'https://www.ebay.co.uk/help/selling/fees-credits-invoices/selling-fees?id=4809',
    verificationStatus: 'verified',
    subcategoryNotes: 'Default eBay UK business seller rate: 10.9% up to £4,000; 2% portion above £4,000.'
  },
  {
    id: 'custom_category',
    name: 'Custom / Unverified Category',
    variableRate: 10.9,
    qualifiesForReducedOrderFee: false,
    effectiveFrom: '2026-02-15',
    sourceUrl: 'https://www.ebay.co.uk/help/selling/fees-credits-invoices/selling-fees?id=4809',
    verificationStatus: 'needs_verification',
    subcategoryNotes: 'Custom fee rate entered by seller. Must be verified against official eBay schedule.'
  }
];

export const REGULATORY_OPERATING_FEE_RATE = 0.35; // 0.35%

export const STANDARD_PER_ORDER_FEE_LOW = 0.30; // £0.30 for order total <= £10.00
export const STANDARD_PER_ORDER_FEE_HIGH = 0.40; // £0.40 for order total > £10.00
export const REDUCED_PER_ORDER_FEE = 0.10; // £0.10 for eligible Collectables & Home DIY

export const TOP_RATED_PREMIUM_DISCOUNT = 0.10; // 10% discount on variable FVF
export const BELOW_STANDARD_SURCHARGE = 4.0; // +4.0%
export const VERY_HIGH_INAD_SURCHARGE = 5.0; // +5.0%

export const INTERNATIONAL_RATES: Record<string, number> = {
  uk: 0.0,
  eurozone: 1.05,
  us_canada: 1.80,
  rest_of_world: 2.00
};
