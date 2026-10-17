import React, { useState } from 'react';
import { OFFICIAL_EBAY_UK_FEE_RULES } from '../data/feeRules';
import { X, ExternalLink, Search, ShieldCheck, AlertTriangle, BookOpen } from 'lucide-react';

interface FeeRulesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (categoryId: string) => void;
  selectedCategoryId: string;
}

export const FeeRulesDrawer: React.FC<FeeRulesDrawerProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  selectedCategoryId
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredRules = OFFICIAL_EBAY_UK_FEE_RULES.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.subcategoryNotes && r.subcategoryNotes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Official eBay UK Business Seller Fee Schedule Table
              </h2>
              <p className="text-xs text-slate-500">
                Maintained Category Fee Rules, Tiers, Effective Dates and Verified Source URLs
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

        {/* Search bar */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search category name or notes (e.g. Computers, Watches, DIY)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Table */}
        <div className="p-6 overflow-y-auto">
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-700 tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3.5">Category Name</th>
                  <th className="py-3 px-3">eBay ID</th>
                  <th className="py-3 px-3">Variable Rate</th>
                  <th className="py-3 px-3">Tiers & Thresholds</th>
                  <th className="py-3 px-3">£0.10 Reduced Order Fee</th>
                  <th className="py-3 px-3">Effective Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Source</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRules.map((rule) => {
                  const isSelected = rule.id === selectedCategoryId;
                  return (
                    <tr
                      key={rule.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-blue-50/40 font-medium' : ''
                      }`}
                    >
                      <td className="py-3 px-3.5 font-bold text-slate-900">
                        {rule.name}
                        {rule.subcategoryNotes && (
                          <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                            {rule.subcategoryNotes}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500">
                        {rule.ebayCategoryId || '—'}
                      </td>
                      <td className="py-3 px-3 font-bold text-blue-700">
                        {rule.variableRate}%
                      </td>
                      <td className="py-3 px-3 text-[11px]">
                        {rule.tiers && rule.tiers.length > 0 ? (
                          rule.tiers.map((t, idx) => (
                            <span key={idx} className="block">
                              &gt; £{t.threshold}: {t.rateAbove}% ({t.appliesTo})
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400">Flat rate</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {rule.qualifiesForReducedOrderFee ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            Eligible (£0.10)
                          </span>
                        ) : (
                          <span className="text-slate-400">Standard (£0.30/£0.40)</span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">
                        {rule.effectiveFrom}
                      </td>
                      <td className="py-3 px-3">
                        {rule.verificationStatus === 'verified' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <a
                          href={rule.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 underline gap-0.5"
                        >
                          Official
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectCategory(rule.id);
                            onClose();
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Use'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between rounded-b-2xl">
          <div className="text-[11px] text-slate-500">
            Rates updated for the eBay UK February 2026 rate card revision.
          </div>
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition cursor-pointer"
          >
            Close Table
          </button>
        </div>
      </div>
    </div>
  );
};
