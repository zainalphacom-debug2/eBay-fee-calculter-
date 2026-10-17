/**
 * Types for eBay UK Business Seller Profit Calculator
 */

export type SellerPerformanceLevel =
  | 'top_rated_premium'    // Top Rated Seller with eBay Premium Service listing (qualifies for 10% FVF discount)
  | 'top_rated_standard'   // Top Rated Seller standard listing (no FVF discount)
  | 'above_standard'       // Standard benchmark
  | 'below_standard'       // Below Standard surcharge (+4.0%)
  | 'very_high_inad';      // Very High "Item not as described" surcharge (+5.0%)

export type VATTreatmentType =
  | 'A' // VAT-registered business, eligible to recover input VAT
  | 'B' // VAT-registered business, VAT recovery not applicable to this calculation
  | 'C' // Not VAT-registered
  | 'D'; // Custom VAT treatment

export type InternationalRegion =
  | 'uk'              // Domestic United Kingdom (0.00% fee)
  | 'eurozone'        // Eurozone & Northern Europe (1.05%)
  | 'us_canada'       // United States & Canada (1.80%)
  | 'rest_of_world';  // Rest of World (2.00%)

export interface CategoryFeeTier {
  threshold: number; // e.g. 4000 (£4,000) or 450 (£450)
  rateAbove: number; // e.g. 2.0 (%)
  appliesTo: 'order' | 'item';
}

export interface CategoryFeeRule {
  id: string;
  name: string;
  ebayCategoryId?: number;
  variableRate: number; // percentage (e.g. 10.9)
  tiers?: CategoryFeeTier[];
  qualifiesForReducedOrderFee: boolean; // eligible for £0.10 reduced fee under official rules
  effectiveFrom: string;
  effectiveTo?: string;
  sourceUrl: string;
  verificationStatus: 'verified' | 'needs_verification';
  subcategoryNotes?: string;
}

export interface MultiBuyConfig {
  buy1Discount: number; // default 0%
  buy2Discount: number; // default 2%
  buy3Discount: number; // default 3%
  buy4PlusDiscount: number; // default 5%
  manualDiscountOverride?: number | null; // e.g. specific custom discount %
}

export interface CustomVATConfig {
  salesVatRate: number; // e.g. 20%
  purchasesVatRate: number; // e.g. 20%
  ebayFeeVatRate: number; // e.g. 20%
  inputVatRecoverablePct: number; // 0 to 100%
}

export interface CalculatorInputs {
  // 10 Main Fields
  itemCostPerUnit: number; // £
  sellingPricePerUnit: number; // £
  quantity: number; // Units
  actualTotalPostageCost: number; // £
  postageChargedToBuyer: number; // £
  promotedAdRate: number; // % (default 3)
  categoryId: string; // Selected category ID
  multiBuy: MultiBuyConfig;
  sellerPerformance: SellerPerformanceLevel;
  vatTreatment: VATTreatmentType;

  // Promoted Listings settings
  isPromotedAttributed: boolean; // Default true
  promotedCampaignType: 'general' | 'priority';
  priorityAdCost: number; // £ if priority campaign used

  // Advanced VAT toggles
  customVat: CustomVATConfig;
  itemCostIncludesVat: boolean; // default true for B2C/retail purchases
  sellingPriceIncludesVat: boolean; // default true in UK
  actualPostageIncludesVat: boolean;
  postageChargedIncludesVat: boolean;

  // Reduced fee & Order options
  isQualifyingReducedFeeListing: boolean; // For Home, DIY, Collectables £0.10 fee
  separateCheckoutOrdersCount: number; // 1 for single checkout, 2+ for separate orders

  // International delivery
  internationalDestination: InternationalRegion;

  // Additional eBay & operational fees
  listingFees: number; // e.g. insertion fee (£0 if free tier)
  listingUpgrades: number; // e.g. Subtitle, Bold (£0)
  allocatedShopSubscription: number; // e.g. £0.00 allocated
  packagingAndOtherCostsPerUnit: number; // £ packaging, labels, prep

  // Target profit & Seller Hub validation
  sellerHubActualFee?: number | null;
  targetProfitType: 'amount' | 'margin';
  targetProfitValue: number; // £ or %
}

export interface CalculationBreakdown {
  // 1. Original merchandise subtotal
  originalMerchandiseSubtotal: number;
  // 2. Multi-buy discount percentage & amount
  multiBuyDiscountPercent: number;
  multiBuyDiscountAmount: number;
  // 3. Discounted merchandise revenue
  discountedMerchandiseRevenue: number;
  // 4. Postage charged to buyer
  postageChargedToBuyer: number;
  // 5. Total customer payment (Gross sale total)
  totalCustomerPayment: number;
  // 6. Total product cost
  totalProductCost: number;
  // 7. Actual postage cost
  actualTotalPostageCost: number;
  // 8. Variable final value fee (base before performance discounts/surcharges)
  variableFinalValueFeeBase: number;
  variableFinalValueFeeEffective: number;
  topRatedDiscountAmount: number;
  performanceSurchargeAmount: number;
  // 9. Per-order final value fee
  perOrderFinalValueFee: number;
  perOrderFeeRatePerOrder: number;
  // 10. Regulatory operating fee (0.35%)
  regulatoryOperatingFee: number;
  // 11. International fee
  internationalFee: number;
  // 12. Promoted listings fee
  promotedListingsFee: number;
  // 13. VAT on eBay fees (if applicable/unrecoverable)
  vatOnEbayFees: number;
  // 14. Other applicable eBay fees (listing + upgrades)
  otherEbayFees: number;
  // 15. Allocated shop subscription
  allocatedShopSubscription: number;
  // 16. Other seller costs (packaging etc)
  otherSellerCosts: number;
  // 17. Output VAT, Recoverable Input VAT, Net VAT to HMRC
  outputVatPayable: number;
  recoverableInputVat: number;
  netVatPayableToHmrc: number;
  nonRecoverableVatCost: number;
  // 18. Final net profit
  netProfit: number;
  // 19. Profit margin percentage
  profitMarginPercent: number;
  revenueMeasureUsed: string; // Clearly defined revenue measure (e.g., Net Revenue ex-VAT or Gross Customer Payment)
  // 20. Profit per unit
  profitPerUnit: number;
  // 21. Break-even selling price per unit
  breakEvenSellingPricePerUnit: number;
  // 22. Minimum selling price for target profit
  minimumSellingPriceForTarget: number;
  // 23. Total profit for complete order (same as netProfit)
  totalProfitCompleteOrder: number;
  // Additional totals & metadata
  totalEbayFees: number;
  totalAdvertisingFees: number;
  totalOrderCosts: number;
  sellerHubFeeDifference?: number | null;
  isCategoryVerified: boolean;
  notes: string[];
}

export interface UnitTestResult {
  id: number;
  title: string;
  description: string;
  passed: boolean;
  expected: string | number;
  actual: string | number;
  details?: string;
}
