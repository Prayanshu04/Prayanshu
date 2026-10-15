import React, { useState } from 'react';
import { HelpCircle, Sparkles, ArrowRight, RefreshCw, Zap, TrendingUp, CheckCircle2 } from 'lucide-react';
import { DecisionAnalysis, WhatIfResponse } from '../types/decision';

interface WhatIfSandboxProps {
  analysis: DecisionAnalysis;
}

export const WhatIfSandbox: React.FC<WhatIfSandboxProps> = ({ analysis }) => {
  const [scenario, setScenario] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ scenario: string; result: WhatIfResponse }>>([]);

  const SAMPLE_SCENARIOS = [
    'What if compensation is increased by $25,000 for the weaker option?',
    'What if I am permitted 3 days permanent remote work?',
    'What if the timeline is pushed back by 6 months?',
    'What if my partner gets a job offer in the other city?'
  ];

  const handleRunSimulation = async (textToRun?: string) => {
    const promptText = (textToRun || scenario).trim();
    if (!promptText || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/what-if', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decisionTitle: analysis.title,
          options: analysis.options,
          currentVerdict: analysis.verdict,
          whatIfScenario: promptText
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to simulate what-if scenario.');
      }

      const data: WhatIfResponse = await res.json();
      setHistory((prev) => [{ scenario: promptText, result: data }, ...prev]);
      setScenario('');
    } catch (err: any) {
      console.error('What-if error:', err);
      setError(err?.message || 'Something went wrong running simulation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-base sm:text-lg font-bold text-white">
            What-If Scenario Sandbox
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mb-5 leading-relaxed">
          Stress-test hypothetical changes, renegotiated terms, or future variables to see exactly when and why the balance tilts in favor of a different option.
        </p>

        {/* Input box */}
        <div className="space-y-3">
          <div className="relative">
            <textarea
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              placeholder="e.g. What if I can negotiate 3 days remote work? What if my equity vests in 2 years instead of 4? What if mortgage rates drop to 5%?"
              rows={2}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none resize-none transition-all"
            />
          </div>

          {/* Quick Scenario Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Try a scenario:</span>
            </span>
            {SAMPLE_SCENARIOS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setScenario(s);
                  handleRunSimulation(s);
                }}
                disabled={isLoading}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors text-left"
              >
                {s}
              </button>
            ))}
          </div>

          {error && (
            <p className="text-xs text-rose-400 bg-rose-950/30 border border-rose-900/40 p-2.5 rounded-lg">
              {error}
            </p>
          )}

          {/* Run button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => handleRunSimulation()}
              disabled={isLoading || !scenario.trim()}
              className="px-5 py-2.5 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 transition-all flex items-center gap-2 text-xs sm:text-sm shadow-md shadow-amber-400/20 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Simulating scenario impact...</span>
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" />
                  <span>Simulate What-If Impact</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Simulation Results Feed */}
      {history.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Simulation Results ({history.length})
          </h4>

          {history.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
            >
              {/* Question header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Hypothetical Condition:
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    "{item.scenario}"
                  </h4>
                </div>

                <div className="px-3 py-1 rounded-full bg-slate-950 border border-amber-500/30 text-xs font-bold text-amber-300 shrink-0">
                  Favors: {item.result.updatedVerdictWinnerName}
                </div>
              </div>

              {/* Impact summary */}
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  How The Balance Shifts:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {item.result.impactSummary}
                </p>
              </div>

              {/* Key Changes */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Key Parameter Changes:
                </span>
                <ul className="space-y-1.5">
                  {item.result.keyChanges.map((change, cIdx) => (
                    <li
                      key={cIdx}
                      className="text-xs text-slate-300 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendation Shift */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
                <strong>Directive:</strong> {item.result.recommendationShift}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
