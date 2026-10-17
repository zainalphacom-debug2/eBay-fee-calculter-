import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Copy,
  Download,
  BookOpen,
  Calendar,
  Layers
} from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onCopyResults: () => void;
  onExportCSV: () => void;
  onOpenFeeRules: () => void;
  onOpenTestRunner: () => void;
  isCopied: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onCopyResults,
  onExportCSV,
  onOpenFeeRules,
  onOpenTestRunner,
  isCopied
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Title and metadata badges */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm tracking-tight">
                £
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                  eBay UK Profit Calculator
                </h1>
              </div>
            </div>

            {/* Small selector / metadata row under title as requested */}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md font-medium bg-blue-50 text-blue-700 border border-blue-200/80">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>
                Seller: Business
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md font-medium bg-slate-100 text-slate-700 border border-slate-200">
                Marketplace: eBay.co.uk
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md font-medium bg-slate-100 text-slate-700 border border-slate-200">
                Currency: GBP (£)
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Calendar className="w-3 h-3 mr-1" />
                Fee Schedule: 15 Feb 2026
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenTestRunner}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-xs"
              title="Run 24 verified automated test cases"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>24/24 Automated Tests</span>
            </button>

            <button
              onClick={onOpenFeeRules}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>Official Fee Rules</span>
            </button>

            <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            <button
              onClick={onCopyResults}
              type="button"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                isCopied
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300'
              }`}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{isCopied ? 'Copied!' : 'Copy Results'}</span>
            </button>

            <button
              onClick={onExportCSV}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onReset}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
              title="Reset to default settings"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
