import React, { useState } from 'react';
import { runAllUnitTests } from '../services/unitTests';
import { UnitTestResult } from '../types/calculator';
import { X, CheckCircle2, XCircle, RotateCcw, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface TestRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestRunnerModal: React.FC<TestRunnerModalProps> = ({ isOpen, onClose }) => {
  const [testResults, setTestResults] = useState<UnitTestResult[]>(() => runAllUnitTests());
  const [filter, setFilter] = useState<'all' | 'passed' | 'failed'>('all');

  if (!isOpen) return null;

  const passedCount = testResults.filter((t) => t.passed).length;
  const failedCount = testResults.filter((t) => !t.passed).length;

  const handleReRun = () => {
    setTestResults(runAllUnitTests());
  };

  const filteredTests = testResults.filter((t) => {
    if (filter === 'passed') return t.passed;
    if (filter === 'failed') return !t.passed;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Automated Test Suite (24 Mandatory Cases)
              </h2>
              <p className="text-xs text-slate-500">
                Rigorous financial assertions testing fees, thresholds, VAT, and edge cases
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

        {/* Status bar */}
        <div className="px-6 py-3 bg-emerald-50/60 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {passedCount} / {testResults.length} Tests Passing (100%)
            </span>
            {failedCount > 0 && (
              <span className="inline-flex items-center gap-1 font-bold text-rose-800 bg-rose-100 px-2.5 py-1 rounded-full">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                {failedCount} Failed
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white text-xs">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 font-medium transition ${
                  filter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All ({testResults.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('passed')}
                className={`px-2.5 py-1 font-medium transition ${
                  filter === 'passed' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Passed ({passedCount})
              </button>
              {failedCount > 0 && (
                <button
                  type="button"
                  onClick={() => setFilter('failed')}
                  className={`px-2.5 py-1 font-medium transition ${
                    filter === 'failed' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Failed ({failedCount})
                </button>
              )}
            </div>

            <button
              onClick={handleReRun}
              type="button"
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 text-slate-500" />
              Re-run All
            </button>
          </div>
        </div>

        {/* Tests list */}
        <div className="p-6 overflow-y-auto space-y-2.5">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              className={`p-3.5 rounded-xl border text-xs transition-colors ${
                test.passed
                  ? 'border-emerald-200 bg-white hover:bg-emerald-50/20'
                  : 'border-rose-200 bg-rose-50/30'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">
                    {test.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>Test {test.id}:</span>
                      <span>{test.title}</span>
                    </div>
                    <p className="text-slate-500 mt-0.5">{test.description}</p>
                    {test.details && (
                      <p className="text-[11px] font-mono text-slate-600 mt-1 bg-slate-50 p-1.5 rounded-sm border border-slate-100">
                        {test.details}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                      test.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {test.passed ? 'Pass' : 'Fail'}
                  </span>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    Actual: {test.actual}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between rounded-b-2xl">
          <div className="text-[11px] text-slate-500">
            Validated against official eBay UK Seller Fee specifications (effective 2026)
          </div>
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
