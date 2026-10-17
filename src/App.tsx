/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { CalculatorInputs } from './types/calculator';
import { calculateProfit } from './services/calculationEngine';
import { copyResultsToClipboard, exportCalculationToCSV } from './utils/export';
import { Header } from './components/Header';
import { ProfitBanner } from './components/ProfitBanner';
import { MainInputs } from './components/MainInputs';
import { AdvancedSettings } from './components/AdvancedSettings';
import { BreakdownModal } from './components/BreakdownModal';
import { TestRunnerModal } from './components/TestRunnerModal';
import { FeeRulesDrawer } from './components/FeeRulesDrawer';
import {
  Sparkles,
  BookmarkCheck,
  BookmarkPlus,
  HelpCircle,
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

const STORAGE_KEY = 'ebay_uk_profit_calc_settings_v1';

const DEFAULT_INPUTS: CalculatorInputs = {
  itemCostPerUnit: 5.00,
  sellingPricePerUnit: 20.00,
  quantity: 1,
  actualTotalPostageCost: 2.70,
  postageChargedToBuyer: 0.00,
  promotedAdRate: 3.0,
  categoryId: 'home_furniture_diy',
  multiBuy: {
    buy1Discount: 0,
    buy2Discount: 2,
    buy3Discount: 3,
    buy4PlusDiscount: 5,
    manualDiscountOverride: null
  },
  sellerPerformance: 'top_rated_premium', // Default Top Rated Seller
  vatTreatment: 'C', // Not VAT-registered default (or option A for VAT-registered)

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
  internationalDestination: 'uk', // Default UK

  listingFees: 0,
  listingUpgrades: 0,
  allocatedShopSubscription: 0,
  packagingAndOtherCostsPerUnit: 0.30,

  sellerHubActualFee: null,
  targetProfitType: 'amount',
  targetProfitValue: 5.00
};

export default function App() {
  const [inputs, setInputs] = useState<CalculatorInputs>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_INPUTS, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_INPUTS;
  });

  const [isCopied, setIsCopied] = useState(false);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const [isTestRunnerOpen, setIsTestRunnerOpen] = useState(false);
  const [isFeeRulesOpen, setIsFeeRulesOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Recalculate instantaneously on every change
  const breakdown = useMemo(() => calculateProfit(inputs), [inputs]);

  const handleInputChange = (updates: Partial<CalculatorInputs>) => {
    setInputs((prev) => ({ ...prev, ...updates }));
  };

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
    localStorage.removeItem(STORAGE_KEY);
    setSaveStatus('Reset to defaults');
    setTimeout(() => setSaveStatus(null), 2500);
  };

  const handleSaveSettings = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
      setSaveStatus('Settings saved locally');
      setTimeout(() => setSaveStatus(null), 2500);
    } catch {
      setSaveStatus('Failed to save');
    }
  };

  const handleCopyResults = async () => {
    const success = await copyResultsToClipboard(inputs, breakdown);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleExportCSV = () => {
    exportCalculationToCSV(inputs, breakdown);
  };

  // Quick preset loader
  const applyPreset = (presetName: string) => {
    if (presetName === 'under_10') {
      handleInputChange({
        sellingPricePerUnit: 9.99,
        itemCostPerUnit: 2.50,
        actualTotalPostageCost: 1.55,
        postageChargedToBuyer: 0,
        quantity: 1
      });
    } else if (presetName === 'multibuy_3') {
      handleInputChange({
        sellingPricePerUnit: 20.00,
        itemCostPerUnit: 6.00,
        quantity: 3,
        actualTotalPostageCost: 3.50,
        postageChargedToBuyer: 0,
        multiBuy: { ...inputs.multiBuy, buy3Discount: 3 }
      });
    } else if (presetName === 'electronics') {
      handleInputChange({
        categoryId: 'computers_tablets_networking',
        sellingPricePerUnit: 149.99,
        itemCostPerUnit: 95.00,
        actualTotalPostageCost: 5.50,
        quantity: 1,
        promotedAdRate: 4.0
      });
    } else if (presetName === 'vat_registered') {
      handleInputChange({
        vatTreatment: 'A',
        sellingPriceIncludesVat: true,
        itemCostIncludesVat: true
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-slate-900">
      {/* Top Header */}
      <Header
        onReset={handleReset}
        onCopyResults={handleCopyResults}
        onExportCSV={handleExportCSV}
        onOpenFeeRules={() => setIsFeeRulesOpen(true)}
        onOpenTestRunner={() => setIsTestRunnerOpen(true)}
        isCopied={isCopied}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Quick Scenario Preset Chips */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Quick Scenarios:
            </span>
            <button
              type="button"
              onClick={() => applyPreset('under_10')}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 font-medium transition cursor-pointer shadow-2xs"
            >
              Order ≤ £10 (£0.30 Fee)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('multibuy_3')}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 font-medium transition cursor-pointer shadow-2xs"
            >
              Multi-Buy 3 Units (3% Off)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('electronics')}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 font-medium transition cursor-pointer shadow-2xs"
            >
              Electronics (6.9% Rate)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('vat_registered')}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 font-medium transition cursor-pointer shadow-2xs"
            >
              VAT-Registered Business
            </button>
          </div>

          <div className="flex items-center gap-2">
            {saveStatus && (
              <span className="text-emerald-600 font-semibold text-xs animate-in fade-in">
                {saveStatus}
              </span>
            )}
            <button
              type="button"
              onClick={handleSaveSettings}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition cursor-pointer shadow-2xs"
              title="Save current calculation settings in your browser"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-slate-500" />
              <span>Save Preset</span>
            </button>
          </div>
        </div>

        {/* Primary NET PROFIT Display & Core Metrics Strip */}
        <ProfitBanner
          breakdown={breakdown}
          onShowBreakdown={() => setIsBreakdownOpen(true)}
        />

        {/* 10 Essential Input Fields */}
        <MainInputs
          inputs={inputs}
          onChange={handleInputChange}
          onOpenFeeRules={() => setIsFeeRulesOpen(true)}
        />

        <div className="h-6"></div>

        {/* Collapsible Advanced Settings */}
        <AdvancedSettings
          inputs={inputs}
          onChange={handleInputChange}
          sellerHubFeeDifference={breakdown.sellerHubFeeDifference}
          minimumSellingPriceForTarget={breakdown.minimumSellingPriceForTarget}
        />

        {/* Informational Guidance & Safeguards Notice */}
        <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>eBay UK Business Seller Fee Policy & Accuracy Safeguards</span>
          </div>
          <p>
            This calculator implements the official eBay.co.uk Business Seller fee schedule and February 2026 rate card revision.
            Orders of £10.00 or less incur the standard £0.30 per-order fee; orders above £10.00 incur £0.40 (or £0.10 for eligible Collectables and Home, Furniture & DIY listings).
            Top Rated Seller status applies a 10% discount specifically to the variable final value fee. Regulatory operating fee of 0.35% is applied to total customer payments.
          </p>
        </div>
      </main>

      {/* Full 23-Point Breakdown Modal */}
      <BreakdownModal
        isOpen={isBreakdownOpen}
        onClose={() => setIsBreakdownOpen(false)}
        inputs={inputs}
        breakdown={breakdown}
      />

      {/* 24 Automated Unit Tests Modal */}
      <TestRunnerModal
        isOpen={isTestRunnerOpen}
        onClose={() => setIsTestRunnerOpen(false)}
      />

      {/* Fee Rules Drawer */}
      <FeeRulesDrawer
        isOpen={isFeeRulesOpen}
        onClose={() => setIsFeeRulesOpen(false)}
        onSelectCategory={(catId) => handleInputChange({ categoryId: catId })}
        selectedCategoryId={inputs.categoryId}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            eBay UK Business Seller Profit Calculator &bull; Updated for February 2026 Rate Schedule
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsTestRunnerOpen(true)}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Run 24 Unit Tests
            </button>
            <button
              onClick={() => setIsFeeRulesOpen(true)}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Fee Rate Card
            </button>
            <a
              href="https://www.ebay.co.uk/help/selling/fees-credits-invoices/selling-fees?id=4809"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"
            >
              <span>eBay UK Help</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
