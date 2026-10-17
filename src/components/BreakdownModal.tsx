import React from 'react';
import { CalculatorInputs, CalculationBreakdown } from '../types/calculator';
import { formatGBP, formatPercent } from '../utils/math';
import { X, CheckCircle, HelpCircle, FileSpreadsheet, ArrowDownRight, Scale, TrendingUp } from 'lucide-react';

interface BreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: CalculatorInputs;
  breakdown: CalculationBreakdown;
}

export const BreakdownModal: React.FC<BreakdownModalProps> = ({
  isOpen,
  onClose,
  inputs,
  breakdown
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Full 23-Point Calculation Breakdown
              </h2>
              <p className="text-xs text-slate-500">
                Official eBay UK Business Seller Fee Schedule & HMRC Tax Rules
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Revenue & Multi-Buy Section (1-5) */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Part 1: Merchandise & Customer Payment (1 – 5)
            </h3>
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white overflow-hidden text-xs">
              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">1. Original Merchandise Subtotal</span>
                  <p className="text-[11px] text-slate-500">
                    £{inputs.sellingPricePerUnit.toFixed(2)} × {inputs.quantity} unit{inputs.quantity > 1 ? 's' : ''}
                  </p>
                </div>
                <span className="font-bold font-['JetBrains_Mono',monospace] text-slate-900">
                  {formatGBP(breakdown.originalMerchandiseSubtotal)}
                </span>
              </div>

              <div className="p-3 flex items-center justify-between bg-slate-50/50">
                <div>
                  <span className="font-bold text-slate-800">2. Multi-Buy Discount</span>
                  <p className="text-[11px] text-slate-500">
                    {breakdown.multiBuyDiscountPercent > 0
                      ? `${breakdown.multiBuyDiscountPercent}% applied to quantity ${inputs.quantity}`
                      : '0% (single unit or no discount)'}
                  </p>
                </div>
                <span className="font-bold font-['JetBrains_Mono',monospace] text-rose-600">
                  {breakdown.multiBuyDiscountAmount > 0
                    ? `-${formatGBP(breakdown.multiBuyDiscountAmount)}`
                    : '£0.00'}
                </span>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">3. Discounted Merchandise Revenue</span>
                  <p className="text-[11px] text-slate-500">Original subtotal minus multi-buy discount</p>
                </div>
                <span className="font-bold font-['JetBrains_Mono',monospace] text-slate-900">
                  {formatGBP(breakdown.discountedMerchandiseRevenue)}
                </span>
              </div>

              <div className="p-3 flex items-center justify-between bg-slate-50/50">
                <div>
                  <span className="font-bold text-slate-800">4. Postage Charged to Buyer</span>
                  <p className="text-[11px] text-slate-500">
                    {inputs.postageChargedToBuyer === 0 ? 'Free delivery offered' : 'Paid by customer'}
                  </p>
                </div>
                <span className="font-bold font-['JetBrains_Mono',monospace] text-slate-900">
                  {formatGBP(breakdown.postageChargedToBuyer)}
                </span>
              </div>

              <div className="p-3.5 flex items-center justify-between bg-blue-50/60 font-medium">
                <div>
                  <span className="font-extrabold text-blue-950 text-sm">5. Total Customer Payment</span>
                  <p className="text-[11px] text-blue-800">
                    Gross order total received from buyer (merchandise + shipping)
                  </p>
                </div>
                <span className="text-sm font-black font-['JetBrains_Mono',monospace] text-blue-900">
                  {formatGBP(breakdown.totalCustomerPayment)}
                </span>
              </div>
            </div>
          </div>

          {/* Direct Costs Section (6-7) */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Part 2: Direct Fulfillment Costs (6 – 7)
            </h3>
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white overflow-hidden text-xs">
              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">6. Total Product Cost</span>
                  <p className="text-[11px] text-slate-500">
                    £{inputs.itemCostPerUnit.toFixed(2)} × {inputs.quantity} unit{inputs.quantity > 1 ? 's' : ''}
                  </p>
                </div>
                <span className="font-bold font-['JetBrains_Mono',monospace] text-slate-900">
                  {formatGBP(breakdown.totalProductCost)}
                </span>
              </div>

              <div className="p-3 flex items-center justify-between bg-slate-50/50">
                <div>
                  <span className="font-bold text-slate-800">7. Actual Postage Cost</span>
                  <p className="text-[11px] text-slate-500">Total courier / shipping cost paid by seller</p>
                </div>
                <span className="font-bold font-['JetBrains_Mono',monospace] text-slate-900">
                  {formatGBP(breakdown.actualTotalPostageCost)}
                </span>
              </div>
            </div>
          </div>

          {/* eBay Transaction Fees (8-16) */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Part 3: Official eBay UK Fees & Operating Overheads (8 – 16)
            </h3>
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white overflow-hidden text-xs">
              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">8. Variable Final Value Fee</span>
                  <p className="text-[11px] text-slate-500">
                    Category rate applied to total sale amount.
                    {breakdown.topRatedDiscountAmount > 0 &&
                      ` Includes 10% Top Rated discount (-${formatGBP(breakdown.topRatedDiscountAmount)}).`}
                    {breakdown.performanceSurchargeAmount > 0 &&
                      ` Includes performance surcharge (+${formatGBP(breakdown.performanceSurchargeAmount)}).`}
                  </p>
                </div>
                <span className="font-bold font-['JetBrains_Mono',monospace] text-slate-900">
                  {formatGBP(breakdown.variableFinalValueFeeEffective)}
                </span>
              </div>

              <div className="p-3 flex items-center justify-between bg-slate-50/50">
                <div>
                  <span className="font-bold text-slate-800">9. Per-Order Final Value Fee</span>
                  <p className="text-[11px] text-slate-500">
                    {breakdown.totalCustomerPayment <= 10.0
                      ? '£0.30 standard rate (order total ≤ £10.00)'
                      : '£0.40 standard rate (order total > £10.00)'}
                    {breakdown.perOrderFeeRatePerOrder === 0.10 && ' (Reduced £0.10 exception applied)'}
                  </p>
                </div>
                <span className="font-bold font-['JetBrains_Mono',monospace] text-slate-900">
                  {formatGBP(breakdown.perOrderFinalValueFee)}
                </span>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">10. Regulatory Operating Fee</span>
                  <p className="text-[11px] text-slate-500">0.35% on total customer payment ({formatGBP(breakdown.totalCustomerPayment)})</p>
                </div>
                <span className="font-bold font-['JetBrains_Mono',monospace] text-slate-900">
                  {formatGBP(breakdown.regulatoryOperatingFee)}
                </span>
              </div>

              <div className="p-3 flex items-center justify-between bg-slate-50/50">
                <div>
                  <span className="font-bold text-slate-800">11. International Fee</span>
                  <p className="text-[11px] text-slate-500">
                    {inputs.internationalDestination === 'uk'
                      ? 'Domestic UK delivery (0.00%)'
                      : `International cross-border delivery fee`}
                  </p>
                </div>
                <span className="font-bold font-['JetBrains_Mono',monospace] text-slate-900">
                  {formatGBP(breakdown.internationalFee)}
                </span>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">12. Promoted Listings Fee</span>
                  <p className="text-[11px] text-slate-500">
                    {inputs.isPromotedAttributed
                      ? `${inputs.promotedAdRate}% on total order (£${breakdown.totalCustomerPayment.toFixed(2)})`
                      : 'Sale not attributed to ad campaign (£0.00)'}
                  </p>
                </div>
                <span className="font-bold font-['JetBrains_Mono',monospace] text-slate-900">
                  {formatGBP(breakdown.promotedListingsFee)}
                </span>
              </div>

              <div className="p-3 flex items-center justify-between bg-slate-50/50">
                <div>
                  <span className="font-bold text-slate-800">13. VAT on eBay Fees</span>
                  <p className="text-[11px] text-slate-500">
                    {inputs.vatTreatment === 'C'
                      ? '20% VAT charged on fees to non-VAT registered UK sellers (unrecoverable)'
                      : '£0.00 net cost (invoiced net or 100% recoverable as input VAT)'}
                  </p>
                </div>
                <span className="font-bold font-['JetBrains_Mono',monospace] text-slate-900">
                  {formatGBP(breakdown.vatOnEbayFees)}
                </span>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">14. Other Applicable eBay Fees</span>
                  <p className="text-[11px] text-slate-500">Listing insertion fees and listing upgrades</p>
                </div>
                <span className="font-bold font-['JetBrains_Mono',monospace] text-slate-900">
                  {formatGBP(breakdown.otherEbayFees)}
                </span>
              </div>

              <div className="p-3 flex items-center justify-between bg-slate-50/50">
                <div>
                  <span className="font-bold text-slate-800">15. Allocated Shop Subscription</span>
                  <p className="text-[11px] text-slate-500">Pro-rated shop subscription cost allocation</p>
                </div>
                <span className="font-bold font-['JetBrains_Mono',monospace] text-slate-900">
                  {formatGBP(breakdown.allocatedShopSubscription)}
                </span>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">16. Other Seller Costs</span>
                  <p className="text-[11px] text-slate-500">Packaging, labels and order preparation</p>
                </div>
                <span className="font-bold font-['JetBrains_Mono',monospace] text-slate-900">
                  {formatGBP(breakdown.otherSellerCosts)}
                </span>
              </div>
            </div>
          </div>

          {/* Tax & Net Profit Metrics (17-23) */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Part 4: Tax Accounting, Profit Margins & Targets (17 – 23)
            </h3>
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white overflow-hidden text-xs">
              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">17. Net VAT Payable to HMRC</span>
                  <p className="text-[11px] text-slate-500">
                    Output VAT (£{breakdown.outputVatPayable.toFixed(2)}) minus Recoverable Input VAT (£{breakdown.recoverableInputVat.toFixed(2)})
                  </p>
                </div>
                <span className="font-bold font-['JetBrains_Mono',monospace] text-slate-900">
                  {formatGBP(breakdown.netVatPayableToHmrc)}
                </span>
              </div>

              <div className="p-4 flex items-center justify-between bg-emerald-50/70 border-t border-b border-emerald-100">
                <div>
                  <span className="font-black text-emerald-950 text-sm">18. Final Net Profit</span>
                  <p className="text-[11px] text-emerald-800 font-medium">
                    Actual profit after all costs, fees, taxes and fulfillment
                  </p>
                </div>
                <span className="text-lg font-black font-['JetBrains_Mono',monospace] text-emerald-700">
                  {formatGBP(breakdown.netProfit)}
                </span>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">19. Profit Margin Percentage</span>
                  <p className="text-[11px] text-slate-500">
                    Net profit divided by {breakdown.revenueMeasureUsed}
                  </p>
                </div>
                <span className="font-bold font-['JetBrains_Mono',monospace] text-slate-900">
                  {formatPercent(breakdown.profitMarginPercent)}
                </span>
              </div>

              <div className="p-3 flex items-center justify-between bg-slate-50/50">
                <div>
                  <span className="font-bold text-slate-800">20. Profit Per Unit</span>
                  <p className="text-[11px] text-slate-500">Net profit divided by {inputs.quantity} unit(s)</p>
                </div>
                <span className="font-bold font-['JetBrains_Mono',monospace] text-slate-900">
                  {formatGBP(breakdown.profitPerUnit)}
                </span>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">21. Break-Even Selling Price Per Unit</span>
                  <p className="text-[11px] text-slate-500">Minimum price per unit where net profit = £0.00</p>
                </div>
                <span className="font-bold font-['JetBrains_Mono',monospace] text-blue-700">
                  {formatGBP(breakdown.breakEvenSellingPricePerUnit)}
                </span>
              </div>

              <div className="p-3 flex items-center justify-between bg-slate-50/50">
                <div>
                  <span className="font-bold text-slate-800">22. Minimum Selling Price for Target Profit</span>
                  <p className="text-[11px] text-slate-500">
                    Required price to achieve {inputs.targetProfitType === 'amount' ? `£${inputs.targetProfitValue.toFixed(2)} profit` : `${inputs.targetProfitValue}% margin`}
                  </p>
                </div>
                <span className="font-bold font-['JetBrains_Mono',monospace] text-purple-700">
                  {formatGBP(breakdown.minimumSellingPriceForTarget)}
                </span>
              </div>

              <div className="p-3.5 flex items-center justify-between bg-slate-100">
                <div>
                  <span className="font-bold text-slate-900">23. Total Profit for Complete Order</span>
                  <p className="text-[11px] text-slate-500">Complete transaction net gain</p>
                </div>
                <span className="font-extrabold font-['JetBrains_Mono',monospace] text-slate-900 text-sm">
                  {formatGBP(breakdown.totalProfitCompleteOrder)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between rounded-b-2xl">
          <div className="text-[11px] text-slate-500">
            Source: Official eBay UK Fee Schedule & Seller Centre Announcement (Feb 2026)
          </div>
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition cursor-pointer"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};
