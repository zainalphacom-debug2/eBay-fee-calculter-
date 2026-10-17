import React, { useState } from 'react';
import {
  CalculatorInputs,
  InternationalRegion
} from '../types/calculator';
import { OFFICIAL_EBAY_UK_FEE_RULES, INTERNATIONAL_RATES } from '../data/feeRules';
import { formatGBP } from '../utils/math';
import {
  ChevronDown,
  ChevronUp,
  Settings2,
  Globe,
  Sliders,
  Store,
  DollarSign,
  FileCheck,
  ShoppingBag,
  Sparkles,
  Info
} from 'lucide-react';

interface AdvancedSettingsProps {
  inputs: CalculatorInputs;
  onChange: (updates: Partial<CalculatorInputs>) => void;
  sellerHubFeeDifference?: number | null;
  minimumSellingPriceForTarget: number;
}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  inputs,
  onChange,
  sellerHubFeeDifference,
  minimumSellingPriceForTarget
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentCategory =
    OFFICIAL_EBAY_UK_FEE_RULES.find((c) => c.id === inputs.categoryId) ||
    OFFICIAL_EBAY_UK_FEE_RULES[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden mb-6">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 transition-colors text-left cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <Settings2 className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-bold text-slate-900 tracking-tight">
            Advanced Settings
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
            VAT, International, Shop & Target Profit
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
          <span>{isOpen ? 'Collapse' : 'Expand'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-6 space-y-6 border-t border-slate-200 divide-y divide-slate-100">
          {/* Section 1: Target Profit & Pricing Solver */}
          <div className="pt-2 first:pt-0">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Target Profit Solver (Automatic Selling Price Calculator)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-purple-50/50 border border-purple-100">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Target Mode
                </label>
                <select
                  value={inputs.targetProfitType}
                  onChange={(e) => onChange({ targetProfitType: e.target.value as 'amount' | 'margin' })}
                  className="w-full rounded-lg border border-purple-200 bg-white py-1.5 px-2.5 text-xs font-semibold text-slate-800"
                >
                  <option value="amount">Fixed Profit Amount (£)</option>
                  <option value="margin">Target Margin (%)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Target Value {inputs.targetProfitType === 'amount' ? '(£)' : '(%)'}
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={inputs.targetProfitValue}
                  onChange={(e) => onChange({ targetProfitValue: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-purple-200 bg-white py-1.5 px-2.5 text-xs font-bold font-['JetBrains_Mono',monospace] text-purple-900"
                />
              </div>

              <div className="flex flex-col justify-center">
                <span className="text-[11px] font-medium text-slate-500">Required Selling Price</span>
                <span className="text-base font-extrabold font-['JetBrains_Mono',monospace] text-purple-700">
                  {formatGBP(minimumSellingPriceForTarget)}
                </span>
                <span className="text-[10px] text-slate-400">
                  Accounts for percentage fees & £10 order fee tier
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Order Fee Reduction & Checkout Orders */}
          <div className="pt-5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-blue-600" />
              Order Fee Exceptions & Checkout Structure
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inputs.isQualifyingReducedFeeListing}
                    onChange={(e) => onChange({ isQualifyingReducedFeeListing: e.target.checked })}
                    disabled={!currentCategory.qualifiesForReducedOrderFee}
                    className="mt-0.5 rounded-xs text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <div>
                    <span className="block text-xs font-bold text-slate-800">
                      Eligible for £0.10 Reduced Per-Order Fee
                    </span>
                    <span className="block text-[11px] text-slate-500 mt-0.5">
                      {currentCategory.qualifiesForReducedOrderFee
                        ? 'Applies to qualifying listings in Home, Furniture & DIY or Collectables under February 2026 rules.'
                        : `Category "${currentCategory.name}" is not eligible for the reduced £0.10 fee.`}
                    </span>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Separate Checkout Orders
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={inputs.separateCheckoutOrdersCount}
                    onChange={(e) => onChange({ separateCheckoutOrdersCount: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-24 rounded-lg border border-slate-300 py-1.5 px-3 text-xs font-semibold font-['JetBrains_Mono',monospace]"
                  />
                  <span className="text-xs text-slate-500">
                    {inputs.separateCheckoutOrdersCount === 1
                      ? '1 checkout (order fee charged once)'
                      : `${inputs.separateCheckoutOrdersCount} separate checkouts (order fee charged ${inputs.separateCheckoutOrdersCount}x)`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Promoted Listings Campaign Type & Priority Click Fees */}
          <div className="pt-5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-500" />
              Promoted Listings Strategy & Ad Spend
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Campaign Strategy
                </label>
                <select
                  value={inputs.promotedCampaignType}
                  onChange={(e) => onChange({ promotedCampaignType: e.target.value as 'general' | 'priority' })}
                  className="w-full rounded-lg border border-slate-300 bg-white py-1.5 px-2.5 text-xs font-semibold"
                >
                  <option value="general">Promoted Listings General (% fee on sale)</option>
                  <option value="priority">Promoted Listings Priority (CPC / Click-based)</option>
                </select>
              </div>

              {inputs.promotedCampaignType === 'priority' ? (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Priority Ad Click Spend (£)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={inputs.priorityAdCost}
                    onChange={(e) => onChange({ priorityAdCost: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    className="w-full rounded-lg border border-slate-300 py-1.5 px-2.5 text-xs font-semibold font-['JetBrains_Mono',monospace]"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Manual Multi-Buy Override (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={inputs.multiBuy.manualDiscountOverride ?? ''}
                    onChange={(e) =>
                      onChange({
                        multiBuy: {
                          ...inputs.multiBuy,
                          manualDiscountOverride: e.target.value === '' ? null : parseFloat(e.target.value) || 0
                        }
                      })
                    }
                    placeholder="Optional override %"
                    className="w-full rounded-lg border border-slate-300 py-1.5 px-2.5 text-xs font-semibold font-['JetBrains_Mono',monospace]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 4: International Fee */}
          <div className="pt-5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              Delivery Destination & International Fee
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Buyer Delivery Destination
                </label>
                <select
                  value={inputs.internationalDestination}
                  onChange={(e) => onChange({ internationalDestination: e.target.value as InternationalRegion })}
                  className="w-full rounded-lg border border-slate-300 bg-white py-1.5 px-2.5 text-xs font-semibold"
                >
                  <option value="uk">United Kingdom (Domestic — 0.00% fee)</option>
                  <option value="eurozone">Eurozone & Northern Europe (+1.05%)</option>
                  <option value="us_canada">United States & Canada (+1.80%)</option>
                  <option value="rest_of_world">Rest of World (+2.00%)</option>
                </select>
              </div>
              <div className="flex items-center text-xs text-slate-500">
                Rate applied: {INTERNATIONAL_RATES[inputs.internationalDestination]}% on total order amount.
              </div>
            </div>
          </div>

          {/* Section 5: Detailed VAT & Inclusivity Options */}
          <div className="pt-5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              VAT Inclusivity & Custom Configuration
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.sellingPriceIncludesVat}
                  onChange={(e) => onChange({ sellingPriceIncludesVat: e.target.checked })}
                  className="rounded-xs text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                />
                <span className="text-slate-700">Selling Price inc. VAT</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.itemCostIncludesVat}
                  onChange={(e) => onChange({ itemCostIncludesVat: e.target.checked })}
                  className="rounded-xs text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                />
                <span className="text-slate-700">Supplier Cost inc. VAT</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.postageChargedIncludesVat}
                  onChange={(e) => onChange({ postageChargedIncludesVat: e.target.checked })}
                  className="rounded-xs text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                />
                <span className="text-slate-700">Postage Charged inc. VAT</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.actualPostageIncludesVat}
                  onChange={(e) => onChange({ actualPostageIncludesVat: e.target.checked })}
                  className="rounded-xs text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                />
                <span className="text-slate-700">Courier Cost inc. VAT</span>
              </label>
            </div>

            {inputs.vatTreatment === 'D' && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Sales VAT Rate (%)
                  </label>
                  <input
                    type="number"
                    value={inputs.customVat.salesVatRate}
                    onChange={(e) =>
                      onChange({
                        customVat: {
                          ...inputs.customVat,
                          salesVatRate: parseFloat(e.target.value) || 0
                        }
                      })
                    }
                    className="w-full rounded-md border border-slate-300 py-1 px-2 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Purchases VAT Rate (%)
                  </label>
                  <input
                    type="number"
                    value={inputs.customVat.purchasesVatRate}
                    onChange={(e) =>
                      onChange({
                        customVat: {
                          ...inputs.customVat,
                          purchasesVatRate: parseFloat(e.target.value) || 0
                        }
                      })
                    }
                    className="w-full rounded-md border border-slate-300 py-1 px-2 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Fee VAT Rate (%)
                  </label>
                  <input
                    type="number"
                    value={inputs.customVat.ebayFeeVatRate}
                    onChange={(e) =>
                      onChange({
                        customVat: {
                          ...inputs.customVat,
                          ebayFeeVatRate: parseFloat(e.target.value) || 0
                        }
                      })
                    }
                    className="w-full rounded-md border border-slate-300 py-1 px-2 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Input VAT Recoverable (%)
                  </label>
                  <input
                    type="number"
                    value={inputs.customVat.inputVatRecoverablePct}
                    onChange={(e) =>
                      onChange({
                        customVat: {
                          ...inputs.customVat,
                          inputVatRecoverablePct: parseFloat(e.target.value) || 0
                        }
                      })
                    }
                    className="w-full rounded-md border border-slate-300 py-1 px-2 text-xs font-semibold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 6: Additional Listing & Operational Fees */}
          <div className="pt-5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-blue-600" />
              Listing Upgrades, Shop Subscription & Prep Costs
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Listing Fee (£)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  value={inputs.listingFees || ''}
                  onChange={(e) => onChange({ listingFees: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-slate-300 py-1.5 px-2.5 text-xs font-semibold font-['JetBrains_Mono',monospace]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Listing Upgrades (£)
                </label>
                <input
                  type="number"
                  step="0.10"
                  min="0"
                  value={inputs.listingUpgrades || ''}
                  onChange={(e) => onChange({ listingUpgrades: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-slate-300 py-1.5 px-2.5 text-xs font-semibold font-['JetBrains_Mono',monospace]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Shop Subscription (£)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  value={inputs.allocatedShopSubscription || ''}
                  onChange={(e) => onChange({ allocatedShopSubscription: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-slate-300 py-1.5 px-2.5 text-xs font-semibold font-['JetBrains_Mono',monospace]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Packaging/Unit (£)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  value={inputs.packagingAndOtherCostsPerUnit || ''}
                  onChange={(e) => onChange({ packagingAndOtherCostsPerUnit: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-slate-300 py-1.5 px-2.5 text-xs font-semibold font-['JetBrains_Mono',monospace]"
                />
              </div>
            </div>
          </div>

          {/* Section 7: eBay Seller Hub Actual Fee Validation */}
          <div className="pt-5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
              eBay Seller Hub Actual Fee Comparison
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Actual Fee Shown in Seller Hub (£)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={inputs.sellerHubActualFee ?? ''}
                  onChange={(e) =>
                    onChange({
                      sellerHubActualFee: e.target.value === '' ? null : parseFloat(e.target.value) || 0
                    })
                  }
                  placeholder="Enter actual fee from invoice"
                  className="w-full rounded-lg border border-slate-300 py-1.5 px-3 text-xs font-semibold font-['JetBrains_Mono',monospace]"
                />
              </div>

              {sellerHubFeeDifference !== null && sellerHubFeeDifference !== undefined && (
                <div
                  className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between ${
                    Math.abs(sellerHubFeeDifference) < 0.02
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-amber-50 border-amber-200 text-amber-800'
                  }`}
                >
                  <div>
                    <span className="font-bold">Variance: </span>
                    <span>
                      {sellerHubFeeDifference > 0
                        ? `+£${sellerHubFeeDifference.toFixed(2)} (Calc > Hub)`
                        : sellerHubFeeDifference < 0
                        ? `-£${Math.abs(sellerHubFeeDifference).toFixed(2)} (Calc < Hub)`
                        : '£0.00 (Exact 100% Match)'}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/70">
                    {Math.abs(sellerHubFeeDifference) < 0.02 ? 'Matches Invoice' : 'Variance Detected'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
