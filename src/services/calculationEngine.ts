import {
  CalculatorInputs,
  CalculationBreakdown,
  CategoryFeeRule
} from '../types/calculator';
import {
  OFFICIAL_EBAY_UK_FEE_RULES,
  REGULATORY_OPERATING_FEE_RATE,
  STANDARD_PER_ORDER_FEE_LOW,
  STANDARD_PER_ORDER_FEE_HIGH,
  REDUCED_PER_ORDER_FEE,
  TOP_RATED_PREMIUM_DISCOUNT,
  BELOW_STANDARD_SURCHARGE,
  VERY_HIGH_INAD_SURCHARGE,
  INTERNATIONAL_RATES
} from '../data/feeRules';
import { round2, clamp } from '../utils/math';

/**
 * Resolve Category Fee Rule by ID
 */
export function getCategoryRule(categoryId: string): CategoryFeeRule {
  const rule = OFFICIAL_EBAY_UK_FEE_RULES.find((c) => c.id === categoryId);
  if (rule) return rule;
  return OFFICIAL_EBAY_UK_FEE_RULES[OFFICIAL_EBAY_UK_FEE_RULES.length - 1]; // Fallback to custom/other
}

/**
 * Determine multi-buy discount percentage for a given quantity
 */
export function getMultiBuyDiscountPercent(inputs: CalculatorInputs): number {
  if (inputs.multiBuy.manualDiscountOverride !== undefined && inputs.multiBuy.manualDiscountOverride !== null) {
    return clamp(inputs.multiBuy.manualDiscountOverride, 0, 100);
  }

  const qty = Math.max(1, Math.floor(inputs.quantity || 1));
  if (qty === 1) {
    return clamp(inputs.multiBuy.buy1Discount ?? 0, 0, 100);
  } else if (qty === 2) {
    return clamp(inputs.multiBuy.buy2Discount ?? 2, 0, 100);
  } else if (qty === 3) {
    return clamp(inputs.multiBuy.buy3Discount ?? 3, 0, 100);
  } else {
    // 4 or more
    return clamp(inputs.multiBuy.buy4PlusDiscount ?? 5, 0, 100);
  }
}

/**
 * Calculate per-order fee rate for a given order total
 * - Order total <= £10.00 -> £0.30 standard
 * - Order total > £10.00 -> £0.40 standard
 * - Qualifying reduced fee -> £0.10
 */
export function calculatePerOrderFeeRate(
  orderTotal: number,
  isQualifyingReducedFee: boolean
): number {
  if (isQualifyingReducedFee) {
    return REDUCED_PER_ORDER_FEE; // £0.10
  }
  const roundedOrderTotal = round2(orderTotal);
  if (roundedOrderTotal <= 10.00) {
    return STANDARD_PER_ORDER_FEE_LOW; // £0.30
  } else {
    return STANDARD_PER_ORDER_FEE_HIGH; // £0.40
  }
}

/**
 * Calculate variable final value fee according to category tiers
 */
export function calculateCategoryVariableFVF(
  categoryRule: CategoryFeeRule,
  discountedMerchandiseTotal: number,
  postageCharged: number,
  quantity: number
): number {
  const totalSaleAmount = discountedMerchandiseTotal + postageCharged;
  const tiers = categoryRule.tiers;

  if (!tiers || tiers.length === 0) {
    return (totalSaleAmount * categoryRule.variableRate) / 100;
  }

  const isPerItemTier = tiers.some((t) => t.appliesTo === 'item');

  if (isPerItemTier) {
    const qty = Math.max(1, quantity);
    const salePerItem = totalSaleAmount / qty;

    let feePerItem = 0;
    const tier1 = tiers.find((t) => t.threshold === 450);
    const tier2 = tiers.find((t) => t.threshold === 4000);

    if (tier1 && tier2) {
      const p1 = Math.min(salePerItem, 450);
      feePerItem += (p1 * categoryRule.variableRate) / 100;

      if (salePerItem > 450) {
        const p2 = Math.min(salePerItem, 4000) - 450;
        feePerItem += (p2 * tier1.rateAbove) / 100;
      }
      if (salePerItem > 4000) {
        const p3 = salePerItem - 4000;
        feePerItem += (p3 * tier2.rateAbove) / 100;
      }
    } else {
      const t = tiers[0];
      const p1 = Math.min(salePerItem, t.threshold);
      const p2 = Math.max(0, salePerItem - t.threshold);
      feePerItem = (p1 * categoryRule.variableRate) / 100 + (p2 * t.rateAbove) / 100;
    }

    return feePerItem * qty;
  } else {
    const t = tiers[0];
    const threshold = t.threshold;
    const rateAbove = t.rateAbove;

    const lowerPortion = Math.min(totalSaleAmount, threshold);
    const upperPortion = Math.max(0, totalSaleAmount - threshold);

    return (
      (lowerPortion * categoryRule.variableRate) / 100 +
      (upperPortion * rateAbove) / 100
    );
  }
}

/**
 * Core calculation without break-even solvers to prevent recursive loops
 */
export function calculateProfitCore(inputs: CalculatorInputs): Omit<CalculationBreakdown, 'breakEvenSellingPricePerUnit' | 'minimumSellingPriceForTarget'> {
  const notes: string[] = [];

  const unitCost = Math.max(0, inputs.itemCostPerUnit || 0);
  const unitPrice = Math.max(0, inputs.sellingPricePerUnit || 0);
  const quantity = Math.max(1, Math.floor(inputs.quantity || 1));
  const actualPostage = Math.max(0, inputs.actualTotalPostageCost || 0);
  const postageCharged = Math.max(0, inputs.postageChargedToBuyer || 0);
  const checkoutsCount = Math.max(1, Math.floor(inputs.separateCheckoutOrdersCount || 1));

  const categoryRule = getCategoryRule(inputs.categoryId);
  const isCategoryVerified = categoryRule.verificationStatus === 'verified';
  if (!isCategoryVerified) {
    notes.push('Category fee rate is custom/unverified. Verify with official eBay UK schedule.');
  }

  // 1. Original merchandise subtotal
  const originalMerchandiseSubtotal = round2(unitPrice * quantity);

  // 2. Multi-buy discount
  const discountPercent = getMultiBuyDiscountPercent(inputs);
  const multiBuyDiscountAmount = round2((originalMerchandiseSubtotal * discountPercent) / 100);

  // 3. Discounted merchandise revenue
  const discountedMerchandiseRevenue = round2(originalMerchandiseSubtotal - multiBuyDiscountAmount);

  // 4. Postage charged to the buyer
  const actualPostageCharged = postageCharged;

  // 5. Total customer payment (Gross customer payment)
  const totalCustomerPayment = round2(discountedMerchandiseRevenue + actualPostageCharged);

  // 6. Total product cost
  const totalProductCost = round2(unitCost * quantity);

  // 7. Actual postage cost
  const actualTotalPostageCost = round2(actualPostage);

  // 8. Variable final value fee
  const variableFVFBase = calculateCategoryVariableFVF(
    categoryRule,
    discountedMerchandiseRevenue,
    actualPostageCharged,
    quantity
  );

  let topRatedDiscountAmount = 0;
  let performanceSurchargeAmount = 0;

  if (inputs.sellerPerformance === 'top_rated_premium') {
    topRatedDiscountAmount = (variableFVFBase * TOP_RATED_PREMIUM_DISCOUNT);
  } else if (inputs.sellerPerformance === 'below_standard') {
    performanceSurchargeAmount = (totalCustomerPayment * BELOW_STANDARD_SURCHARGE) / 100;
  } else if (inputs.sellerPerformance === 'very_high_inad') {
    performanceSurchargeAmount = (totalCustomerPayment * VERY_HIGH_INAD_SURCHARGE) / 100;
  }

  const variableFinalValueFeeEffective = round2(
    Math.max(0, variableFVFBase - topRatedDiscountAmount + performanceSurchargeAmount)
  );

  // 9. Per-order final value fee
  const orderTotalPerCheckout = totalCustomerPayment / checkoutsCount;
  const isEligibleReduced =
    categoryRule.qualifiesForReducedOrderFee && inputs.isQualifyingReducedFeeListing;

  const perOrderFeeRate = calculatePerOrderFeeRate(orderTotalPerCheckout, isEligibleReduced);
  const totalPerOrderFee = round2(perOrderFeeRate * checkoutsCount);

  // 10. Regulatory operating fee: 0.35% on total sale amount
  const regulatoryOperatingFee = round2((totalCustomerPayment * REGULATORY_OPERATING_FEE_RATE) / 100);

  // 11. International fee
  const intlRate = INTERNATIONAL_RATES[inputs.internationalDestination] || 0;
  const internationalFee = round2((totalCustomerPayment * intlRate) / 100);

  // 12. Promoted listings fee
  let promotedListingsFee = 0;
  if (inputs.isPromotedAttributed) {
    if (inputs.promotedCampaignType === 'priority') {
      promotedListingsFee = round2(inputs.priorityAdCost || 0);
    } else {
      const adRate = clamp(inputs.promotedAdRate || 0, 0, 100);
      promotedListingsFee = round2((totalCustomerPayment * adRate) / 100);
    }
  }

  // 13. Other eBay fees & upgrades
  const listingFees = round2(inputs.listingFees || 0);
  const listingUpgrades = round2(inputs.listingUpgrades || 0);
  const otherEbayFees = round2(listingFees + listingUpgrades);

  // Base eBay fees (ex VAT)
  const baseEbayFeesExVat =
    variableFinalValueFeeEffective +
    totalPerOrderFee +
    regulatoryOperatingFee +
    internationalFee +
    otherEbayFees;

  // 14. Shop subscription & other operational costs
  const allocatedShopSubscription = round2(inputs.allocatedShopSubscription || 0);
  const otherSellerCosts = round2((inputs.packagingAndOtherCostsPerUnit || 0) * quantity);

  // 15. VAT Calculations according to VAT Treatment
  let vatOnEbayFees = 0;
  let outputVatPayable = 0;
  let recoverableInputVat = 0;
  let nonRecoverableVatCost = 0;
  let netVatPayableToHmrc = 0;
  let effectiveNetRevenue = totalCustomerPayment;
  let revenueMeasureUsed = 'Gross Customer Payment';

  const vatTreatment = inputs.vatTreatment;

  if (vatTreatment === 'A') {
    revenueMeasureUsed = 'Net Sales Revenue (ex-VAT)';

    if (inputs.sellingPriceIncludesVat) {
      const netMerchandise = discountedMerchandiseRevenue / 1.20;
      const merchandiseVat = discountedMerchandiseRevenue - netMerchandise;

      let postageVat = 0;
      let netPostageCharged = actualPostageCharged;
      if (inputs.postageChargedIncludesVat) {
        netPostageCharged = actualPostageCharged / 1.20;
        postageVat = actualPostageCharged - netPostageCharged;
      }

      outputVatPayable = round2(merchandiseVat + postageVat);
      effectiveNetRevenue = round2(netMerchandise + netPostageCharged);
    } else {
      outputVatPayable = round2(totalCustomerPayment * 0.20);
      effectiveNetRevenue = totalCustomerPayment;
    }

    let productInputVat = 0;
    let netProductCost = totalProductCost;
    if (inputs.itemCostIncludesVat) {
      netProductCost = totalProductCost / 1.20;
      productInputVat = totalProductCost - netProductCost;
    }

    let postageInputVat = 0;
    let netPostageCost = actualTotalPostageCost;
    if (inputs.actualPostageIncludesVat) {
      netPostageCost = actualTotalPostageCost / 1.20;
      postageInputVat = actualTotalPostageCost - netPostageCost;
    }

    recoverableInputVat = round2(productInputVat + postageInputVat);
    netVatPayableToHmrc = round2(outputVatPayable - recoverableInputVat);

    vatOnEbayFees = 0;
    nonRecoverableVatCost = 0;
  } else if (vatTreatment === 'B') {
    revenueMeasureUsed = 'Net Sales Revenue (ex-VAT)';
    if (inputs.sellingPriceIncludesVat) {
      outputVatPayable = round2(totalCustomerPayment - totalCustomerPayment / 1.20);
      effectiveNetRevenue = round2(totalCustomerPayment / 1.20);
    } else {
      outputVatPayable = round2(totalCustomerPayment * 0.20);
      effectiveNetRevenue = totalCustomerPayment;
    }
    recoverableInputVat = 0;
    vatOnEbayFees = 0;
    netVatPayableToHmrc = outputVatPayable;
  } else if (vatTreatment === 'C') {
    revenueMeasureUsed = 'Total Customer Payment (Non-VAT)';
    outputVatPayable = 0;
    recoverableInputVat = 0;
    netVatPayableToHmrc = 0;
    effectiveNetRevenue = totalCustomerPayment;

    const allEbayAndAdFees = baseEbayFeesExVat + promotedListingsFee;
    vatOnEbayFees = round2(allEbayAndAdFees * 0.20);
    nonRecoverableVatCost = vatOnEbayFees;
  } else {
    const custom = inputs.customVat;
    const salesVatRate = clamp(custom.salesVatRate || 20, 0, 100) / 100;
    const purchasesVatRate = clamp(custom.purchasesVatRate || 20, 0, 100) / 100;
    const feeVatRate = clamp(custom.ebayFeeVatRate || 20, 0, 100) / 100;
    const recoveryPct = clamp(custom.inputVatRecoverablePct || 0, 0, 100) / 100;

    outputVatPayable = round2(totalCustomerPayment - totalCustomerPayment / (1 + salesVatRate));
    effectiveNetRevenue = round2(totalCustomerPayment / (1 + salesVatRate));

    const grossCosts = totalProductCost + actualTotalPostageCost;
    const rawInputVat = grossCosts - grossCosts / (1 + purchasesVatRate);
    recoverableInputVat = round2(rawInputVat * recoveryPct);

    const feeVatTotal = (baseEbayFeesExVat + promotedListingsFee) * feeVatRate;
    const recoverableFeeVat = feeVatTotal * recoveryPct;
    vatOnEbayFees = round2(feeVatTotal - recoverableFeeVat);
    nonRecoverableVatCost = vatOnEbayFees;
    netVatPayableToHmrc = round2(outputVatPayable - recoverableInputVat);
  }

  const totalEbayFees = round2(baseEbayFeesExVat + (vatTreatment === 'C' ? round2(baseEbayFeesExVat * 0.20) : 0));
  const totalAdvertisingFees = round2(promotedListingsFee + (vatTreatment === 'C' ? round2(promotedListingsFee * 0.20) : 0));

  let netProductCostForProfit = totalProductCost;
  let netPostageCostForProfit = actualTotalPostageCost;

  if (vatTreatment === 'A') {
    if (inputs.itemCostIncludesVat) {
      netProductCostForProfit = round2(totalProductCost / 1.20);
    }
    if (inputs.actualPostageIncludesVat) {
      netPostageCostForProfit = round2(actualTotalPostageCost / 1.20);
    }
  }

  const totalOrderCosts = round2(
    netProductCostForProfit +
    netPostageCostForProfit +
    baseEbayFeesExVat +
    promotedListingsFee +
    vatOnEbayFees +
    allocatedShopSubscription +
    otherSellerCosts
  );

  const netProfit = round2(effectiveNetRevenue - totalOrderCosts);

  const profitMarginPercent =
    effectiveNetRevenue > 0 ? round2((netProfit / effectiveNetRevenue) * 100) : 0;

  const profitPerUnit = round2(netProfit / quantity);

  let sellerHubFeeDifference: number | null = null;
  if (inputs.sellerHubActualFee !== undefined && inputs.sellerHubActualFee !== null) {
    sellerHubFeeDifference = round2(totalEbayFees - inputs.sellerHubActualFee);
  }

  return {
    originalMerchandiseSubtotal,
    multiBuyDiscountPercent: discountPercent,
    multiBuyDiscountAmount,
    discountedMerchandiseRevenue,
    postageChargedToBuyer: actualPostageCharged,
    totalCustomerPayment,
    totalProductCost,
    actualTotalPostageCost,
    variableFinalValueFeeBase: round2(variableFVFBase),
    variableFinalValueFeeEffective,
    topRatedDiscountAmount: round2(topRatedDiscountAmount),
    performanceSurchargeAmount: round2(performanceSurchargeAmount),
    perOrderFinalValueFee: totalPerOrderFee,
    perOrderFeeRatePerOrder: perOrderFeeRate,
    regulatoryOperatingFee,
    internationalFee,
    promotedListingsFee: round2(promotedListingsFee),
    vatOnEbayFees,
    otherEbayFees,
    allocatedShopSubscription,
    otherSellerCosts,
    outputVatPayable,
    recoverableInputVat,
    netVatPayableToHmrc,
    nonRecoverableVatCost,
    netProfit,
    profitMarginPercent,
    revenueMeasureUsed,
    profitPerUnit,
    totalProfitCompleteOrder: netProfit,
    totalEbayFees,
    totalAdvertisingFees,
    totalOrderCosts,
    sellerHubFeeDifference,
    isCategoryVerified,
    notes
  };
}

/**
 * Solve unit selling price to achieve an exact net profit amount (£)
 */
export function solvePriceForProfit(inputs: CalculatorInputs, targetProfit: number): number {
  let low = 0.01;
  let high = Math.max(1000, (inputs.itemCostPerUnit || 10) * 10 + 100);

  let testInputs = { ...inputs, sellingPricePerUnit: high };
  let testProfit = calculateProfitCore(testInputs).netProfit;
  while (testProfit < targetProfit && high < 100000) {
    high *= 2;
    testInputs = { ...inputs, sellingPricePerUnit: high };
    testProfit = calculateProfitCore(testInputs).netProfit;
  }

  for (let i = 0; i < 40; i++) {
    const mid = (low + high) / 2;
    const test = { ...inputs, sellingPricePerUnit: mid };
    const res = calculateProfitCore(test);
    if (res.netProfit < targetProfit) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return round2((low + high) / 2);
}

/**
 * Solve unit selling price to achieve an exact margin %
 */
export function solvePriceForMargin(inputs: CalculatorInputs, targetMarginPct: number): number {
  const targetPct = clamp(targetMarginPct, 0, 95);
  let low = 0.01;
  let high = Math.max(1000, (inputs.itemCostPerUnit || 10) * 15 + 100);

  for (let i = 0; i < 40; i++) {
    const mid = (low + high) / 2;
    const test = { ...inputs, sellingPricePerUnit: mid };
    const res = calculateProfitCore(test);
    if (res.profitMarginPercent < targetPct) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return round2((low + high) / 2);
}

/**
 * Calculate Break-Even Selling Price per unit
 */
export function calculateBreakEvenPrice(inputs: CalculatorInputs): number {
  return solvePriceForProfit(inputs, 0);
}

/**
 * Calculate Target Profit Selling Price per unit
 */
export function calculateTargetProfitPrice(inputs: CalculatorInputs): number {
  if (inputs.targetProfitType === 'amount') {
    return solvePriceForProfit(inputs, inputs.targetProfitValue || 0);
  } else {
    return solvePriceForMargin(inputs, inputs.targetProfitValue || 0);
  }
}

/**
 * Complete Calculation with Solvers
 */
export function calculateProfit(inputs: CalculatorInputs): CalculationBreakdown {
  const core = calculateProfitCore(inputs);
  const breakEvenSellingPricePerUnit = calculateBreakEvenPrice(inputs);
  const minimumSellingPriceForTarget = calculateTargetProfitPrice(inputs);

  return {
    ...core,
    breakEvenSellingPricePerUnit,
    minimumSellingPriceForTarget
  };
}
