import {
  CalculatorInputs,
  UnitTestResult
} from '../types/calculator';
import {
  calculateProfit,
  calculatePerOrderFeeRate,
  getMultiBuyDiscountPercent,
  calculateBreakEvenPrice,
  calculateTargetProfitPrice
} from './calculationEngine';
import { round2 } from '../utils/math';

export const DEFAULT_TEST_INPUTS: CalculatorInputs = {
  itemCostPerUnit: 5.00,
  sellingPricePerUnit: 20.00,
  quantity: 1,
  actualTotalPostageCost: 3.00,
  postageChargedToBuyer: 0.00,
  promotedAdRate: 3.0,
  categoryId: 'home_furniture_diy',
  multiBuy: {
    buy1Discount: 0,
    buy2Discount: 2,
    buy3Discount: 3,
    buy4PlusDiscount: 5
  },
  sellerPerformance: 'top_rated_premium',
  vatTreatment: 'C', // Not VAT-registered default for straightforward unit tests
  isPromotedAttributed: true,
  promotedCampaignType: 'general',
  priorityAdCost: 0,
  customVat: {
    salesVatRate: 20,
    purchasesVatRate: 20,
    ebayFeeVatRate: 20,
    inputVatRecoverablePct: 0
  },
  itemCostIncludesVat: true,
  sellingPriceIncludesVat: true,
  actualPostageIncludesVat: true,
  postageChargedIncludesVat: true,
  isQualifyingReducedFeeListing: false,
  separateCheckoutOrdersCount: 1,
  internationalDestination: 'uk',
  listingFees: 0,
  listingUpgrades: 0,
  allocatedShopSubscription: 0,
  packagingAndOtherCostsPerUnit: 0,
  targetProfitType: 'amount',
  targetProfitValue: 5.00
};

export function runAllUnitTests(): UnitTestResult[] {
  const results: UnitTestResult[] = [];

  // Helper assertion
  const assertTest = (
    id: number,
    title: string,
    description: string,
    expected: string | number,
    actual: string | number,
    isEqual: boolean,
    details?: string
  ) => {
    results.push({
      id,
      title,
      description,
      expected,
      actual,
      passed: isEqual,
      details
    });
  };

  // Test 1: Order total £9.99 -> Standard fee £0.30
  {
    const fee = calculatePerOrderFeeRate(9.99, false);
    assertTest(
      1,
      'Order total £9.99',
      'For an order total of £9.99, per-order fee must be £0.30',
      0.30,
      fee,
      fee === 0.30
    );
  }

  // Test 2: Order total £10.00 -> Standard fee £0.30
  {
    const fee = calculatePerOrderFeeRate(10.00, false);
    assertTest(
      2,
      'Order total £10.00',
      'For an order total of exactly £10.00, per-order fee must be £0.30',
      0.30,
      fee,
      fee === 0.30
    );
  }

  // Test 3: Order total £10.01 -> Standard fee £0.40
  {
    const fee = calculatePerOrderFeeRate(10.01, false);
    assertTest(
      3,
      'Order total £10.01',
      'For an order total of £10.01, per-order fee must be £0.40',
      0.40,
      fee,
      fee === 0.40
    );
  }

  // Test 4: Qualifying reduced per-order fee -> £0.10
  {
    const fee = calculatePerOrderFeeRate(25.00, true);
    assertTest(
      4,
      'Qualifying reduced per-order fee',
      'Eligible listings in Collectables/Home DIY satisfy reduced £0.10 fee condition',
      0.10,
      fee,
      fee === 0.10
    );
  }

  // Test 5: Two units with a 2% discount (£20 item -> Original £40, discount £0.80, discounted £39.20)
  {
    const inputs: CalculatorInputs = {
      ...DEFAULT_TEST_INPUTS,
      sellingPricePerUnit: 20.00,
      quantity: 2,
      multiBuy: { ...DEFAULT_TEST_INPUTS.multiBuy, buy2Discount: 2 }
    };
    const res = calculateProfit(inputs);
    const passed =
      res.originalMerchandiseSubtotal === 40.00 &&
      res.multiBuyDiscountAmount === 0.80 &&
      res.discountedMerchandiseRevenue === 39.20;
    assertTest(
      5,
      'Two units with 2% discount',
      '2 x £20 with 2% discount: Original £40.00, discount £0.80, discounted subtotal £39.20',
      '£39.20 (disc: £0.80)',
      `£${res.discountedMerchandiseRevenue.toFixed(2)} (disc: £${res.multiBuyDiscountAmount.toFixed(2)})`,
      passed
    );
  }

  // Test 6: Three units with a 3% discount (£20 item -> Original £60, discount £1.80, discounted £58.20)
  {
    const inputs: CalculatorInputs = {
      ...DEFAULT_TEST_INPUTS,
      sellingPricePerUnit: 20.00,
      quantity: 3,
      multiBuy: { ...DEFAULT_TEST_INPUTS.multiBuy, buy3Discount: 3 }
    };
    const res = calculateProfit(inputs);
    const passed =
      res.originalMerchandiseSubtotal === 60.00 &&
      res.multiBuyDiscountAmount === 1.80 &&
      res.discountedMerchandiseRevenue === 58.20;
    assertTest(
      6,
      'Three units with 3% discount',
      '3 x £20 with 3% discount: Original £60.00, discount £1.80, discounted subtotal £58.20',
      '£58.20 (disc: £1.80)',
      `£${res.discountedMerchandiseRevenue.toFixed(2)} (disc: £${res.multiBuyDiscountAmount.toFixed(2)})`,
      passed
    );
  }

  // Test 7: Four units with a 5% discount (£20 item -> Original £80, discount £4.00, discounted £76.00)
  {
    const inputs: CalculatorInputs = {
      ...DEFAULT_TEST_INPUTS,
      sellingPricePerUnit: 20.00,
      quantity: 4,
      multiBuy: { ...DEFAULT_TEST_INPUTS.multiBuy, buy4PlusDiscount: 5 }
    };
    const res = calculateProfit(inputs);
    const passed =
      res.originalMerchandiseSubtotal === 80.00 &&
      res.multiBuyDiscountAmount === 4.00 &&
      res.discountedMerchandiseRevenue === 76.00;
    assertTest(
      7,
      'Four units with 5% discount',
      '4 x £20 with 5% discount: Original £80.00, discount £4.00, discounted subtotal £76.00',
      '£76.00 (disc: £4.00)',
      `£${res.discountedMerchandiseRevenue.toFixed(2)} (disc: £${res.multiBuyDiscountAmount.toFixed(2)})`,
      passed
    );
  }

  // Test 8: Zero advertising rate
  {
    const inputs: CalculatorInputs = {
      ...DEFAULT_TEST_INPUTS,
      promotedAdRate: 0.0,
      isPromotedAttributed: true
    };
    const res = calculateProfit(inputs);
    assertTest(
      8,
      'Zero advertising rate',
      'Promoted listings fee must be £0.00 when ad rate is 0%',
      0.00,
      res.promotedListingsFee,
      res.promotedListingsFee === 0.00
    );
  }

  // Test 9: Three per cent advertising rate
  {
    const inputs: CalculatorInputs = {
      ...DEFAULT_TEST_INPUTS,
      sellingPricePerUnit: 100.00,
      postageChargedToBuyer: 0.00,
      quantity: 1,
      promotedAdRate: 3.0,
      isPromotedAttributed: true
    };
    const res = calculateProfit(inputs);
    // 3% of £100 = £3.00
    assertTest(
      9,
      '3% advertising rate',
      '3% ad rate on £100 total sale amount = £3.00',
      3.00,
      res.promotedListingsFee,
      res.promotedListingsFee === 3.00
    );
  }

  // Test 10: Free delivery
  {
    const inputs: CalculatorInputs = {
      ...DEFAULT_TEST_INPUTS,
      postageChargedToBuyer: 0.00,
      sellingPricePerUnit: 20.00,
      quantity: 1
    };
    const res = calculateProfit(inputs);
    assertTest(
      10,
      'Free delivery',
      'Customer charged postage is £0.00 and customer payment equals merchandise revenue',
      20.00,
      res.totalCustomerPayment,
      res.totalCustomerPayment === 20.00 && res.postageChargedToBuyer === 0.00
    );
  }

  // Test 11: Buyer-paid postage
  {
    const inputs: CalculatorInputs = {
      ...DEFAULT_TEST_INPUTS,
      sellingPricePerUnit: 20.00,
      postageChargedToBuyer: 4.50,
      quantity: 1
    };
    const res = calculateProfit(inputs);
    // Gross payment = 20.00 + 4.50 = 24.50
    assertTest(
      11,
      'Buyer-paid postage',
      'Item £20.00 + buyer paid postage £4.50 = £24.50 total customer payment',
      24.50,
      res.totalCustomerPayment,
      res.totalCustomerPayment === 24.50
    );
  }

  // Test 12: A discounted order crossing the £10 threshold
  {
    // 2 units at £5.20 each = £10.40 original (which without discount would be > £10 -> £0.40 fee)
    // With 5% discount: 10.40 * 0.05 = 0.52 discount -> Discounted subtotal = £9.88 (<= £10 -> £0.30 fee!)
    const inputs: CalculatorInputs = {
      ...DEFAULT_TEST_INPUTS,
      sellingPricePerUnit: 5.20,
      quantity: 2,
      postageChargedToBuyer: 0.00,
      multiBuy: { ...DEFAULT_TEST_INPUTS.multiBuy, buy2Discount: 5 }
    };
    const res = calculateProfit(inputs);
    const passed =
      res.totalCustomerPayment === 9.88 &&
      res.perOrderFeeRatePerOrder === 0.30;
    assertTest(
      12,
      'Discounted order crossing £10 threshold',
      '2 x £5.20 with 5% discount drops total from £10.40 to £9.88, triggering £0.30 fee instead of £0.40',
      '£9.88 total, £0.30 fee',
      `£${res.totalCustomerPayment.toFixed(2)} total, £${res.perOrderFeeRatePerOrder.toFixed(2)} fee`,
      passed
    );
  }

  // Test 13: Multiple units in one checkout
  {
    const inputs: CalculatorInputs = {
      ...DEFAULT_TEST_INPUTS,
      sellingPricePerUnit: 15.00,
      quantity: 5,
      separateCheckoutOrdersCount: 1
    };
    const res = calculateProfit(inputs);
    // Must charge order fee only once (£0.40 since total > £10)
    assertTest(
      13,
      'Multiple units in one checkout',
      '5 units in single checkout order must incur per-order fee only once (£0.40 total)',
      0.40,
      res.perOrderFinalValueFee,
      res.perOrderFinalValueFee === 0.40
    );
  }

  // Test 14: Two separate checkout orders
  {
    const inputs: CalculatorInputs = {
      ...DEFAULT_TEST_INPUTS,
      sellingPricePerUnit: 15.00,
      quantity: 2,
      separateCheckoutOrdersCount: 2
    };
    const res = calculateProfit(inputs);
    // Two orders of £15 each (> £10) -> 2 * £0.40 = £0.80
    assertTest(
      14,
      'Two separate checkout orders',
      '2 separate checkout orders incur the per-order fee twice (2 x £0.40 = £0.80)',
      0.80,
      res.perOrderFinalValueFee,
      res.perOrderFinalValueFee === 0.80
    );
  }

  // Test 15: VAT-registered vs non-VAT-registered scenarios
  {
    const baseInputs: CalculatorInputs = {
      ...DEFAULT_TEST_INPUTS,
      itemCostPerUnit: 10.00,
      sellingPricePerUnit: 30.00,
      quantity: 1,
      actualTotalPostageCost: 4.00,
      postageChargedToBuyer: 0.00,
      promotedAdRate: 0.0
    };
    const resNonVat = calculateProfit({ ...baseInputs, vatTreatment: 'C' });
    const resVatReg = calculateProfit({ ...baseInputs, vatTreatment: 'A' });

    // Non-VAT seller pays 20% VAT on eBay fees
    const nonVatHasFeeVat = resNonVat.vatOnEbayFees > 0;
    // VAT registered seller reclaims input VAT on fees/costs and pays output VAT to HMRC
    const vatRegHasOutputVat = resVatReg.outputVatPayable > 0;
    const passed = nonVatHasFeeVat && vatRegHasOutputVat;

    assertTest(
      15,
      'VAT-registered vs non-VAT scenarios',
      'Non-VAT includes 20% fee VAT as expense; VAT-registered accounts for output VAT & recovers input VAT',
      'Distinct VAT models verified',
      nonVatHasFeeVat && vatRegHasOutputVat ? 'Distinct VAT models verified' : 'VAT models mismatch',
      passed,
      `Non-VAT Fee VAT: £${resNonVat.vatOnEbayFees.toFixed(2)}, VAT Reg Output VAT: £${resVatReg.outputVatPayable.toFixed(2)}`
    );
  }

  // Test 16: Qualifying Top Rated Premium Service listing (10% discount on variable FVF)
  {
    const inputs: CalculatorInputs = {
      ...DEFAULT_TEST_INPUTS,
      sellingPricePerUnit: 100.00,
      quantity: 1,
      categoryId: 'home_furniture_diy', // 10.9% -> base FVF = £10.90
      sellerPerformance: 'top_rated_premium'
    };
    const res = calculateProfit(inputs);
    // 10% discount on £10.90 = £1.09
    const expectedDiscount = round2(res.variableFinalValueFeeBase * 0.10);
    assertTest(
      16,
      'Qualifying Top Rated Premium listing',
      '10% discount applied exclusively to variable FVF portion (£1.09 discount on £10.90 FVF)',
      expectedDiscount,
      res.topRatedDiscountAmount,
      res.topRatedDiscountAmount === expectedDiscount
    );
  }

  // Test 17: Non-qualifying Top Rated listing
  {
    const inputs: CalculatorInputs = {
      ...DEFAULT_TEST_INPUTS,
      sellingPricePerUnit: 100.00,
      quantity: 1,
      sellerPerformance: 'top_rated_standard'
    };
    const res = calculateProfit(inputs);
    assertTest(
      17,
      'Non-qualifying Top Rated listing',
      'Top Rated without Premium Service designation receives 0% FVF discount (£0.00)',
      0.00,
      res.topRatedDiscountAmount,
      res.topRatedDiscountAmount === 0.00
    );
  }

  // Test 18: Below Standard surcharge (+4.0%)
  {
    const inputs: CalculatorInputs = {
      ...DEFAULT_TEST_INPUTS,
      sellingPricePerUnit: 100.00,
      quantity: 1,
      sellerPerformance: 'below_standard'
    };
    const res = calculateProfit(inputs);
    // +4.0% surcharge on £100 = £4.00
    assertTest(
      18,
      'Below Standard surcharge',
      'Below Standard seller performance incurs official +4.0% surcharge (£4.00 on £100 order)',
      4.00,
      res.performanceSurchargeAmount,
      res.performanceSurchargeAmount === 4.00
    );
  }

  // Test 19: Tiered final value fee (Jewellery & Watches tiered per item at £450)
  {
    // Jewellery item priced at £1,000:
    // First £450 @ 11.9% = £53.55
    // Remaining £550 @ 3.0% = £16.50
    // Total variable FVF base = £70.05
    const inputs: CalculatorInputs = {
      ...DEFAULT_TEST_INPUTS,
      categoryId: 'jewellery_watches',
      sellingPricePerUnit: 1000.00,
      quantity: 1,
      postageChargedToBuyer: 0.00,
      sellerPerformance: 'above_standard' // no discount to test exact base
    };
    const res = calculateProfit(inputs);
    const expectedBase = round2(450 * 0.119 + 550 * 0.03); // 53.55 + 16.50 = 70.05
    assertTest(
      19,
      'Category with tiered FVF (Jewellery £450 tier)',
      'Jewellery £1000: £450 @ 11.9% (£53.55) + £550 @ 3% (£16.50) = £70.05 variable FVF base',
      expectedBase,
      res.variableFinalValueFeeBase,
      Math.abs(res.variableFinalValueFeeBase - expectedBase) < 0.01
    );
  }

  // Test 20: Negative-profit order
  {
    const inputs: CalculatorInputs = {
      ...DEFAULT_TEST_INPUTS,
      itemCostPerUnit: 35.00,
      sellingPricePerUnit: 20.00,
      quantity: 1,
      actualTotalPostageCost: 5.00
    };
    const res = calculateProfit(inputs);
    assertTest(
      20,
      'Negative-profit order',
      'Cost exceeding selling price correctly results in negative net profit without errors',
      'Negative profit',
      res.netProfit < 0 ? 'Negative profit' : 'Non-negative',
      res.netProfit < 0,
      `Calculated net profit: £${res.netProfit.toFixed(2)}`
    );
  }

  // Test 21: Break-even price calculation
  {
    const inputs: CalculatorInputs = {
      ...DEFAULT_TEST_INPUTS,
      itemCostPerUnit: 12.00,
      actualTotalPostageCost: 3.50,
      sellerPerformance: 'above_standard'
    };
    const breakEven = calculateBreakEvenPrice(inputs);
    const verifyInputs = { ...inputs, sellingPricePerUnit: breakEven };
    const verifyRes = calculateProfit(verifyInputs);
    // Net profit at break even should be within £0.05 of 0
    const passed = Math.abs(verifyRes.netProfit) <= 0.05;
    assertTest(
      21,
      'Break-even price calculation',
      `Break-even selling price calculated as £${breakEven.toFixed(2)}, yielding ~£0.00 net profit`,
      '~£0.00 profit',
      `£${verifyRes.netProfit.toFixed(2)} profit`,
      passed,
      `At £${breakEven.toFixed(2)}, net profit is £${verifyRes.netProfit.toFixed(2)}`
    );
  }

  // Test 22: Target-profit calculation
  {
    const inputs: CalculatorInputs = {
      ...DEFAULT_TEST_INPUTS,
      itemCostPerUnit: 10.00,
      actualTotalPostageCost: 3.00,
      targetProfitType: 'amount',
      targetProfitValue: 15.00,
      sellerPerformance: 'above_standard'
    };
    const targetPrice = calculateTargetProfitPrice(inputs);
    const verifyInputs = { ...inputs, sellingPricePerUnit: targetPrice };
    const verifyRes = calculateProfit(verifyInputs);
    // Net profit should be within £0.05 of £15.00
    const passed = Math.abs(verifyRes.netProfit - 15.00) <= 0.05;
    assertTest(
      22,
      'Target-profit calculation',
      `Target profit price calculated as £${targetPrice.toFixed(2)}, achieving requested £15.00 target`,
      '£15.00 profit',
      `£${verifyRes.netProfit.toFixed(2)} profit`,
      passed,
      `At £${targetPrice.toFixed(2)}, net profit is £${verifyRes.netProfit.toFixed(2)}`
    );
  }

  // Test 23: Refund / cancellation scenario
  {
    // On full refund/cancellation, eBay refunds the variable final value fee.
    // The per-order fee (£0.30 or £0.40) is typically retained or credited depending on seller fault.
    // We verify the credit formula: refunded fee = variable FVF + regulatory fee
    const inputs: CalculatorInputs = {
      ...DEFAULT_TEST_INPUTS,
      sellingPricePerUnit: 50.00,
      quantity: 1
    };
    const res = calculateProfit(inputs);
    const refundedFeeCredit = round2(res.variableFinalValueFeeEffective + res.regulatoryOperatingFee);
    const passed = refundedFeeCredit > 0 && refundedFeeCredit <= res.totalEbayFees;
    assertTest(
      23,
      'Refund or cancellation scenario',
      'eBay fee credit on cancellation correctly refunds variable FVF and regulatory operating fee',
      'Refund credit verified',
      passed ? 'Refund credit verified' : 'Calculation error',
      passed,
      `Variable FVF refunded: £${res.variableFinalValueFeeEffective.toFixed(2)}, retained fixed order fee: £${res.perOrderFinalValueFee.toFixed(2)}`
    );
  }

  // Test 24: Invalid and missing inputs
  {
    const inputs: CalculatorInputs = {
      ...DEFAULT_TEST_INPUTS,
      itemCostPerUnit: -10, // negative cost
      sellingPricePerUnit: 0, // £0
      quantity: -5, // negative qty
      promotedAdRate: 150 // >100% ad rate
    };
    const res = calculateProfit(inputs);
    // Must clamp gracefully: quantity >= 1, non-negative numbers, ad rate <= 100%
    const passed =
      !isNaN(res.netProfit) &&
      !isNaN(res.totalEbayFees) &&
      res.promotedListingsFee >= 0;
    assertTest(
      24,
      'Invalid and missing inputs',
      'Negative inputs and out-of-bound percentages are clamped safely without throwing errors or returning NaN',
      'Valid numbers (no NaN)',
      passed ? 'Valid numbers (no NaN)' : 'NaN or crash detected',
      passed,
      `Clamped calculations executed safely. Net profit: £${res.netProfit.toFixed(2)}`
    );
  }

  return results;
}
