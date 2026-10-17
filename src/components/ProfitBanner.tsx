import React from 'react';
import { CalculationBreakdown } from '../types/calculator';
import { formatGBP, formatPercent } from '../utils/math';
import {
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Info,
  Scale,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface ProfitBannerProps {
  breakdown: CalculationBreakdown;
  onShowBreakdown: () => void;
}

export const ProfitBanner: React.FC<ProfitBannerProps> = ({
  breakdown,
  onShowBreakdown
}) => {
  const isProfitable = breakdown.netProfit >= 0;
  const isLoss = breakdown.netProfit < 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden mb-6">
      {/* Top Banner: Prominent NET PROFIT */}
      <div
        className={`px-6 py-6 sm:px-8 sm:py-7 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors ${
          isProfitable
            ? 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white'
            : 'bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 text-white'
        }`}
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-bold text-white/80 flex items-center gap-1.5">
              {isProfitable ? (
                <TrendingUp className="w-4 h-4 text-emerald-200" />
              ) : (
                <TrendingDown className="w-4 h-4 text-rose-200" />
              )}
              Calculated Net Earnings
            </span>
            {breakdown.isCategoryVerified ? (
              <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
                Official eBay 2026 Rate
              </span>
            ) : (
              <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-400 text-amber-950">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Rate needs verification
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-3">
            <div className="text-sm font-semibold text-white/90">NET PROFIT:</div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-black font-['JetBrains_Mono',monospace] tracking-tight">
              {formatGBP(breakdown.netProfit)}
            </div>
          </div>

          <p className="text-xs text-white/80 max-w-xl">
            {isProfitable
              ? `Realized profit after product costs, shipping, category final value fees, £${breakdown.perOrderFeeRatePerOrder.toFixed(2)} order fee, and ad spend.`
              : `Order operating at a loss of ${formatGBP(Math.abs(breakdown.netProfit))}. Consider increasing selling price or reducing postage/supplier costs.`}
          </p>
        </div>

        {/* CTA: Show Full Breakdown */}
        <div className="flex items-center gap-3">
          <button
            onClick={onShowBreakdown}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm shadow-md hover:bg-slate-50 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>Show Full Breakdown</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Primary 6 Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-slate-50/60 p-4 sm:p-5">
        {/* 1. Profit per unit */}
        <div className="px-3 py-2 sm:py-0">
          <div className="text-xs font-medium text-slate-500">Profit per unit</div>
          <div className="mt-1 text-lg sm:text-xl font-bold font-['JetBrains_Mono',monospace] text-slate-900">
            {formatGBP(breakdown.profitPerUnit)}
          </div>
        </div>

        {/* 2. Profit margin */}
        <div className="px-3 py-2 sm:py-0">
          <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <span>Profit margin</span>
            <span className="text-[10px] text-slate-400 font-normal">({breakdown.revenueMeasureUsed.includes('ex-VAT') ? 'ex-VAT' : 'Gross'})</span>
          </div>
          <div
            className={`mt-1 text-lg sm:text-xl font-bold font-['JetBrains_Mono',monospace] ${
              breakdown.profitMarginPercent >= 20
                ? 'text-emerald-700'
                : breakdown.profitMarginPercent >= 0
                ? 'text-slate-800'
                : 'text-rose-600'
            }`}
          >
            {formatPercent(breakdown.profitMarginPercent)}
          </div>
        </div>

        {/* 3. Total eBay fees */}
        <div className="px-3 py-2 sm:py-0">
          <div className="text-xs font-medium text-slate-500">Total eBay fees</div>
          <div className="mt-1 text-lg sm:text-xl font-bold font-['JetBrains_Mono',monospace] text-slate-900">
            {formatGBP(breakdown.totalEbayFees)}
          </div>
          <div className="text-[10px] text-slate-400">
            FVF + £{breakdown.perOrderFeeRatePerOrder.toFixed(2)} order fee
          </div>
        </div>

        {/* 4. Advertising cost */}
        <div className="px-3 py-2 sm:py-0">
          <div className="text-xs font-medium text-slate-500">Advertising cost</div>
          <div className="mt-1 text-lg sm:text-xl font-bold font-['JetBrains_Mono',monospace] text-slate-900">
            {formatGBP(breakdown.totalAdvertisingFees)}
          </div>
          <div className="text-[10px] text-slate-400">Promoted Listings</div>
        </div>

        {/* 5. Total order costs */}
        <div className="px-3 py-2 sm:py-0">
          <div className="text-xs font-medium text-slate-500">Total order costs</div>
          <div className="mt-1 text-lg sm:text-xl font-bold font-['JetBrains_Mono',monospace] text-slate-900">
            {formatGBP(breakdown.totalOrderCosts)}
          </div>
          <div className="text-[10px] text-slate-400">Product + Post + Fees</div>
        </div>

        {/* 6. Break-even selling price */}
        <div className="px-3 py-2 sm:py-0">
          <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-blue-600" />
            <span>Break-even price</span>
          </div>
          <div className="mt-1 text-lg sm:text-xl font-bold font-['JetBrains_Mono',monospace] text-blue-700">
            {formatGBP(breakdown.breakEvenSellingPricePerUnit)}
          </div>
          <div className="text-[10px] text-slate-400">Zero-profit unit price</div>
        </div>
      </div>
    </div>
  );
};
