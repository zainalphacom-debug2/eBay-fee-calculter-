import { CalculatorInputs, CalculationBreakdown } from '../types/calculator';
import { formatGBP, formatPercent } from './math';

export function copyResultsToClipboard(inputs: CalculatorInputs, breakdown: CalculationBreakdown): Promise<boolean> {
  const text = `--- eBay UK Business Seller Profit Summary ---
Category: ${inputs.categoryId}
Selling Price: £${inputs.sellingPricePerUnit.toFixed(2)} x Qty ${inputs.quantity}
Postage Charged: £${inputs.postageChargedToBuyer.toFixed(2)}
Total Customer Payment: £${breakdown.totalCustomerPayment.toFixed(2)}

NET PROFIT: £${breakdown.netProfit.toFixed(2)}
Profit per Unit: £${breakdown.profitPerUnit.toFixed(2)}
Profit Margin: ${formatPercent(breakdown.profitMarginPercent)} (${breakdown.revenueMeasureUsed})

FEES & COSTS BREAKDOWN:
- Product Cost: £${breakdown.totalProductCost.toFixed(2)}
- Actual Postage: £${breakdown.actualTotalPostageCost.toFixed(2)}
- Variable Final Value Fee: £${breakdown.variableFinalValueFeeEffective.toFixed(2)}
- Per-Order Fee: £${breakdown.perOrderFinalValueFee.toFixed(2)} (${inputs.separateCheckoutOrdersCount > 1 ? inputs.separateCheckoutOrdersCount + ' orders' : '1 order @ £' + breakdown.perOrderFeeRatePerOrder.toFixed(2)})
- Regulatory Operating Fee (0.35%): £${breakdown.regulatoryOperatingFee.toFixed(2)}
- Promoted Listings Ad Fee: £${breakdown.promotedListingsFee.toFixed(2)}
- VAT on Fees (Non-recoverable): £${breakdown.vatOnEbayFees.toFixed(2)}
- Total eBay Fees: £${breakdown.totalEbayFees.toFixed(2)}
- Total Order Costs: £${breakdown.totalOrderCosts.toFixed(2)}

BREAK-EVEN & TARGETS:
- Break-Even Selling Price: £${breakdown.breakEvenSellingPricePerUnit.toFixed(2)}
- Target Profit Price (${inputs.targetProfitType === 'amount' ? '£' + inputs.targetProfitValue.toFixed(2) : inputs.targetProfitValue + '%'}): £${breakdown.minimumSellingPriceForTarget.toFixed(2)}
Calculated using eBay UK Business Seller Schedule (Effective Feb 2026)`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  } else {
    // Fallback
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return Promise.resolve(true);
    } catch {
      return Promise.resolve(false);
    }
  }
}

export function exportCalculationToCSV(inputs: CalculatorInputs, breakdown: CalculationBreakdown): void {
  const rows = [
    ['Metric / Field', 'Value', 'Unit / Notes'],
    ['Marketplace', 'eBay UK (ebay.co.uk)', 'Business Seller'],
    ['Schedule Effective Date', '15 February 2026', 'Official UK Seller Centre'],
    ['Category ID', inputs.categoryId, ''],
    ['Item Cost per Unit', inputs.itemCostPerUnit.toFixed(2), 'GBP (£)'],
    ['Selling Price per Unit', inputs.sellingPricePerUnit.toFixed(2), 'GBP (£)'],
    ['Quantity', inputs.quantity.toString(), 'Units'],
    ['Original Merchandise Subtotal', breakdown.originalMerchandiseSubtotal.toFixed(2), 'GBP (£)'],
    ['Multi-Buy Discount %', breakdown.multiBuyDiscountPercent.toFixed(2), '%'],
    ['Multi-Buy Discount Amount', breakdown.multiBuyDiscountAmount.toFixed(2), 'GBP (£)'],
    ['Discounted Merchandise Revenue', breakdown.discountedMerchandiseRevenue.toFixed(2), 'GBP (£)'],
    ['Postage Charged to Buyer', inputs.postageChargedToBuyer.toFixed(2), 'GBP (£)'],
    ['Total Customer Payment (Gross)', breakdown.totalCustomerPayment.toFixed(2), 'GBP (£)'],
    ['Total Product Cost', breakdown.totalProductCost.toFixed(2), 'GBP (£)'],
    ['Actual Postage Cost', breakdown.actualTotalPostageCost.toFixed(2), 'GBP (£)'],
    ['Variable Final Value Fee Base', breakdown.variableFinalValueFeeBase.toFixed(2), 'GBP (£)'],
    ['Top Rated 10% Discount', breakdown.topRatedDiscountAmount.toFixed(2), 'GBP (£)'],
    ['Performance Surcharge', breakdown.performanceSurchargeAmount.toFixed(2), 'GBP (£)'],
    ['Effective Variable Final Value Fee', breakdown.variableFinalValueFeeEffective.toFixed(2), 'GBP (£)'],
    ['Per-Order Final Value Fee', breakdown.perOrderFinalValueFee.toFixed(2), 'GBP (£)'],
    ['Regulatory Operating Fee (0.35%)', breakdown.regulatoryOperatingFee.toFixed(2), 'GBP (£)'],
    ['International Fee', breakdown.internationalFee.toFixed(2), 'GBP (£)'],
    ['Promoted Listings Ad Fee', breakdown.promotedListingsFee.toFixed(2), 'GBP (£)'],
    ['VAT on eBay Fees', breakdown.vatOnEbayFees.toFixed(2), 'GBP (£)'],
    ['Other eBay Fees & Upgrades', breakdown.otherEbayFees.toFixed(2), 'GBP (£)'],
    ['Allocated Shop Subscription', breakdown.allocatedShopSubscription.toFixed(2), 'GBP (£)'],
    ['Other Seller Costs (Packaging)', breakdown.otherSellerCosts.toFixed(2), 'GBP (£)'],
    ['Output VAT Payable to HMRC', breakdown.outputVatPayable.toFixed(2), 'GBP (£)'],
    ['Recoverable Input VAT', breakdown.recoverableInputVat.toFixed(2), 'GBP (£)'],
    ['Net VAT to HMRC', breakdown.netVatPayableToHmrc.toFixed(2), 'GBP (£)'],
    ['Total eBay Fees', breakdown.totalEbayFees.toFixed(2), 'GBP (£)'],
    ['Total Order Costs', breakdown.totalOrderCosts.toFixed(2), 'GBP (£)'],
    ['NET PROFIT', breakdown.netProfit.toFixed(2), 'GBP (£)'],
    ['Profit per Unit', breakdown.profitPerUnit.toFixed(2), 'GBP (£)'],
    ['Profit Margin %', breakdown.profitMarginPercent.toFixed(2), `% (${breakdown.revenueMeasureUsed})`],
    ['Break-Even Selling Price per Unit', breakdown.breakEvenSellingPricePerUnit.toFixed(2), 'GBP (£)'],
    ['Target Profit Price per Unit', breakdown.minimumSellingPriceForTarget.toFixed(2), 'GBP (£)']
  ];

  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.map((val) => `"${val.replace(/"/g, '""')}"`).join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `ebay_uk_profit_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
