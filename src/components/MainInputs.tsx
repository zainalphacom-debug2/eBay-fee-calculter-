import React from 'react';
import {
  CalculatorInputs,
  SellerPerformanceLevel,
  VATTreatmentType
} from '../types/calculator';
import { OFFICIAL_EBAY_UK_FEE_RULES } from '../data/feeRules';
import {
  Package,
  Tag,
  Hash,
  Truck,
  Send,
  Flame,
  FolderTree,
  Percent,
  Award,
  Receipt,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

interface MainInputsProps {
  inputs: CalculatorInputs;
  onChange: (updates: Partial<CalculatorInputs>) => void;
  onOpenFeeRules: () => void;
}

export const MainInputs: React.FC<MainInputsProps> = ({
  inputs,
  onChange,
  onOpenFeeRules
}) => {
  const currentCategory =
    OFFICIAL_EBAY_UK_FEE_RULES.find((c) => c.id === inputs.categoryId) ||
    OFFICIAL_EBAY_UK_FEE_RULES[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-7 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          Essential Transaction Inputs
        </h2>
        <span className="text-xs text-slate-500 font-medium">
          Instant calculation on change
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        {/* 1. Item cost per unit (£) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-slate-500" />
              1. Item Cost per Unit
            </span>
            <span className="text-[11px] font-normal text-slate-400 lowercase">Supplier unit cost</span>
          </label>
          <div className="relative rounded-xl shadow-2xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 font-bold font-['JetBrains_Mono',monospace]">
              £
            </div>
            <input
              type="number"
              step="0.01"
              min="0"
              value={inputs.itemCostPerUnit || ''}
              onChange={(e) => onChange({ itemCostPerUnit: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              className="block w-full rounded-xl border border-slate-300 py-2.5 pl-8 pr-3 text-sm font-semibold font-['JetBrains_Mono',monospace] text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-hidden transition"
            />
          </div>
        </div>

        {/* 2. Selling price per unit (£) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-600" />
              2. Selling Price per Unit
            </span>
            <span className="text-[11px] font-normal text-slate-400 lowercase">Listed eBay price</span>
          </label>
          <div className="relative rounded-xl shadow-2xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-blue-600 font-bold font-['JetBrains_Mono',monospace]">
              £
            </div>
            <input
              type="number"
              step="0.01"
              min="0"
              value={inputs.sellingPricePerUnit || ''}
              onChange={(e) => onChange({ sellingPricePerUnit: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              className="block w-full rounded-xl border border-slate-300 py-2.5 pl-8 pr-3 text-sm font-bold font-['JetBrains_Mono',monospace] text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-hidden transition"
            />
          </div>
        </div>

        {/* 3. Quantity purchased by buyer */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-slate-500" />
              3. Quantity Purchased
            </span>
            <span className="text-[11px] font-normal text-slate-400 lowercase">Units in single order</span>
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 rounded-xl shadow-2xs">
              <input
                type="number"
                min="1"
                step="1"
                value={inputs.quantity || 1}
                onChange={(e) => onChange({ quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                className="block w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm font-semibold font-['JetBrains_Mono',monospace] text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-hidden transition"
              />
            </div>
            <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
              <button
                type="button"
                onClick={() => onChange({ quantity: Math.max(1, (inputs.quantity || 1) - 1) })}
                className="px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 active:bg-slate-300 transition"
                title="Decrease quantity"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => onChange({ quantity: (inputs.quantity || 1) + 1 })}
                className="px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 active:bg-slate-300 transition"
                title="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 4. Actual total postage cost (£) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-slate-500" />
              4. Actual Total Postage Cost
            </span>
            <span className="text-[11px] font-normal text-slate-400 lowercase">What you pay courier</span>
          </label>
          <div className="relative rounded-xl shadow-2xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 font-bold font-['JetBrains_Mono',monospace]">
              £
            </div>
            <input
              type="number"
              step="0.01"
              min="0"
              value={inputs.actualTotalPostageCost || ''}
              onChange={(e) => onChange({ actualTotalPostageCost: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              className="block w-full rounded-xl border border-slate-300 py-2.5 pl-8 pr-3 text-sm font-semibold font-['JetBrains_Mono',monospace] text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-hidden transition"
            />
          </div>
        </div>

        {/* 5. Postage charged to the buyer (£) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-slate-500" />
              5. Postage Charged to Buyer
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onChange({ postageChargedToBuyer: 0 })}
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium border transition ${
                  inputs.postageChargedToBuyer === 0
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                }`}
              >
                Free Delivery
              </button>
            </div>
          </label>
          <div className="relative rounded-xl shadow-2xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 font-bold font-['JetBrains_Mono',monospace]">
              £
            </div>
            <input
              type="number"
              step="0.01"
              min="0"
              value={inputs.postageChargedToBuyer === 0 ? '0.00' : inputs.postageChargedToBuyer || ''}
              onChange={(e) => onChange({ postageChargedToBuyer: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              className="block w-full rounded-xl border border-slate-300 py-2.5 pl-8 pr-3 text-sm font-semibold font-['JetBrains_Mono',monospace] text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-hidden transition"
            />
          </div>
        </div>

        {/* 6. Promoted Listings Ad Rate (%) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              6. Promoted Listings Ad Rate
            </span>
            <label className="inline-flex items-center gap-1 text-[11px] font-normal text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={inputs.isPromotedAttributed}
                onChange={(e) => onChange({ isPromotedAttributed: e.target.checked })}
                className="rounded-xs text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
              />
              <span>Attributed sale</span>
            </label>
          </label>
          <div className="relative rounded-xl shadow-2xs">
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              disabled={!inputs.isPromotedAttributed}
              value={inputs.promotedAdRate || ''}
              onChange={(e) => onChange({ promotedAdRate: parseFloat(e.target.value) || 0 })}
              placeholder="3.0"
              className={`block w-full rounded-xl border py-2.5 pl-3.5 pr-8 text-sm font-semibold font-['JetBrains_Mono',monospace] focus:outline-hidden transition ${
                inputs.isPromotedAttributed
                  ? 'border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                  : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
              }`}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 font-bold">
              %
            </div>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {inputs.isPromotedAttributed
              ? 'General campaign: % applied to total order including postage.'
              : 'Unchecked: no advertising fee charged on this sale.'}
          </p>
        </div>

        {/* 7. Product Category */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-slate-500" />
              7. Product Category
            </span>
            <button
              type="button"
              onClick={onOpenFeeRules}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-medium underline"
            >
              View all category fee tiers
            </button>
          </label>
          <div className="space-y-2">
            <select
              value={inputs.categoryId}
              onChange={(e) => onChange({ categoryId: e.target.value })}
              className="block w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm font-semibold text-slate-900 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-hidden transition cursor-pointer"
            >
              {OFFICIAL_EBAY_UK_FEE_RULES.map((rule) => (
                <option key={rule.id} value={rule.id}>
                  {rule.name} — {rule.variableRate}% base rate
                </option>
              ))}
            </select>

            {/* Category info pill */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div className="text-slate-600">
                <span className="font-semibold text-slate-800">Fee rate: </span>
                <span>{currentCategory.subcategoryNotes || `${currentCategory.variableRate}% standard rate`}</span>
              </div>
              <div className="flex items-center gap-2">
                {currentCategory.qualifiesForReducedOrderFee && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    Eligible for £0.10 order fee
                  </span>
                )}
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {currentCategory.verificationStatus === 'verified' ? 'Verified Official Rate' : 'Needs Verification'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 8. Multi-buy Discount */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-slate-500" />
              8. Multi-buy Discount
            </span>
            <span className="text-[11px] font-normal text-slate-400 lowercase">
              Current: {inputs.quantity === 1 ? '0%' : inputs.quantity === 2 ? `${inputs.multiBuy.buy2Discount}%` : inputs.quantity === 3 ? `${inputs.multiBuy.buy3Discount}%` : `${inputs.multiBuy.buy4PlusDiscount}%`}
            </span>
          </label>
          <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
            {/* Buy 1 */}
            <div className="text-center p-1.5 rounded-lg bg-white/70">
              <div className="text-[10px] font-semibold text-slate-500">Buy 1</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">0%</div>
            </div>
            {/* Buy 2 */}
            <div className="text-center p-1.5 rounded-lg bg-white shadow-2xs">
              <div className="text-[10px] font-semibold text-slate-500">Buy 2</div>
              <input
                type="number"
                min="0"
                max="100"
                value={inputs.multiBuy.buy2Discount}
                onChange={(e) =>
                  onChange({
                    multiBuy: {
                      ...inputs.multiBuy,
                      buy2Discount: parseFloat(e.target.value) || 0
                    }
                  })
                }
                className="w-full text-center text-xs font-bold font-['JetBrains_Mono',monospace] text-blue-700 focus:outline-hidden"
              />
            </div>
            {/* Buy 3 */}
            <div className="text-center p-1.5 rounded-lg bg-white shadow-2xs">
              <div className="text-[10px] font-semibold text-slate-500">Buy 3</div>
              <input
                type="number"
                min="0"
                max="100"
                value={inputs.multiBuy.buy3Discount}
                onChange={(e) =>
                  onChange({
                    multiBuy: {
                      ...inputs.multiBuy,
                      buy3Discount: parseFloat(e.target.value) || 0
                    }
                  })
                }
                className="w-full text-center text-xs font-bold font-['JetBrains_Mono',monospace] text-blue-700 focus:outline-hidden"
              />
            </div>
            {/* Buy 4+ */}
            <div className="text-center p-1.5 rounded-lg bg-white shadow-2xs">
              <div className="text-[10px] font-semibold text-slate-500">Buy 4+</div>
              <input
                type="number"
                min="0"
                max="100"
                value={inputs.multiBuy.buy4PlusDiscount}
                onChange={(e) =>
                  onChange({
                    multiBuy: {
                      ...inputs.multiBuy,
                      buy4PlusDiscount: parseFloat(e.target.value) || 0
                    }
                  })
                }
                className="w-full text-center text-xs font-bold font-['JetBrains_Mono',monospace] text-blue-700 focus:outline-hidden"
              />
            </div>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
            <span>Mutually exclusive discount tiers</span>
            {inputs.multiBuy.manualDiscountOverride !== null && inputs.multiBuy.manualDiscountOverride !== undefined ? (
              <button
                type="button"
                onClick={() => onChange({ multiBuy: { ...inputs.multiBuy, manualDiscountOverride: null } })}
                className="text-rose-500 hover:underline"
              >
                Clear manual override ({inputs.multiBuy.manualDiscountOverride}%)
              </button>
            ) : null}
          </div>
        </div>

        {/* 9. Seller Performance Level */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-slate-500" />
              9. Seller Performance Level
            </span>
            <span className="text-[11px] font-normal text-slate-400">Official standard</span>
          </label>
          <select
            value={inputs.sellerPerformance}
            onChange={(e) => onChange({ sellerPerformance: e.target.value as SellerPerformanceLevel })}
            className="block w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm font-semibold text-slate-900 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-hidden transition cursor-pointer"
          >
            <option value="top_rated_premium">
              Top Rated Seller — Premium Service (10% FVF discount)
            </option>
            <option value="top_rated_standard">
              Top Rated Seller — Standard listing (no discount)
            </option>
            <option value="above_standard">
              Above Standard (standard rates)
            </option>
            <option value="below_standard">
              Below Standard (+4.0% performance surcharge)
            </option>
            <option value="very_high_inad">
              Very High "Item Not as Described" (+5.0% surcharge)
            </option>
          </select>
          <p className="mt-1 text-[11px] text-slate-400">
            {inputs.sellerPerformance === 'top_rated_premium'
              ? 'Applies 10% discount on variable final value fee.'
              : inputs.sellerPerformance === 'below_standard'
              ? 'Adds official +4.0% fee surcharge on the order.'
              : 'Standard benchmark performance.'}
          </p>
        </div>

        {/* 10. VAT Treatment */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-slate-500" />
              10. VAT Treatment
            </span>
            <span className="text-[11px] font-normal text-slate-400">HMRC tax & fee recovery</span>
          </label>
          <select
            value={inputs.vatTreatment}
            onChange={(e) => onChange({ vatTreatment: e.target.value as VATTreatmentType })}
            className="block w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm font-semibold text-slate-900 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-hidden transition cursor-pointer"
          >
            <option value="A">
              Option A: VAT-registered business, eligible to recover input VAT
            </option>
            <option value="B">
              Option B: VAT-registered business, VAT recovery not applicable
            </option>
            <option value="C">
              Option C: Not VAT-registered (eBay UK charges 20% VAT on seller fees)
            </option>
            <option value="D">
              Option D: Custom VAT treatment (custom rates & recovery %)
            </option>
          </select>
          <div className="mt-1.5 text-xs text-slate-500 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              {inputs.vatTreatment === 'A'
                ? 'Output VAT accounted on sales, input VAT recovered on purchases. eBay fees invoiced net or reverse-charged.'
                : inputs.vatTreatment === 'C'
                ? 'Non-registered sellers pay 20% UK VAT on all eBay seller fees which is a non-recoverable business expense.'
                : inputs.vatTreatment === 'B'
                ? 'VAT collected on sales without input VAT credit applied in this calculation.'
                : 'Custom configuration configured in Advanced Settings.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
