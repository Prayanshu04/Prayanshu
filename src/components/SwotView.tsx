import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, TrendingUp, Skull, Layers, CheckCircle2 } from 'lucide-react';
import { DecisionAnalysis, DecisionOption } from '../types/decision';

interface SwotViewProps {
  analysis: DecisionAnalysis;
}

export const SwotView: React.FC<SwotViewProps> = ({ analysis }) => {
  const [activeOptionId, setActiveOptionId] = useState<string>(
    analysis.options[0]?.id || ''
  );

  const currentOption =
    analysis.options.find((o) => o.id === activeOptionId) || analysis.options[0];

  return (
    <div className="space-y-6">
      {/* Option Selector Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-2.5 rounded-2xl">
        <div className="flex items-center gap-2 px-2 text-xs font-semibold text-slate-400">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Select Option to Inspect:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {analysis.options.map((opt, idx) => {
            const isSelected = opt.id === (currentOption?.id);
            return (
              <button
                key={opt.id}
                onClick={() => setActiveOptionId(opt.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded text-[10px] font-black flex items-center justify-center ${
                    isSelected ? 'bg-slate-950 text-amber-400' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{opt.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Option Banner */}
      {currentOption && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">
                  SWOT Strategic Audit:
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Viability Score: {currentOption.score}/100
                </span>
              </div>
              <h3 className="text-xl font-black text-white mt-0.5">
                {currentOption.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{currentOption.tagline}</p>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Internal (S/W)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>External (O/T)</span>
              </div>
            </div>
          </div>

          {/* 2x2 SWOT Quadrant Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            {/* STRENGTHS */}
            <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-900/30">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wide">
                        Strengths (Internal)
                      </h4>
                      <span className="text-[10px] text-emerald-400/80">
                        Inherent advantages & proprietary leverage
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">
                    {currentOption.swot.strengths.length} items
                  </span>
                </div>

                <ul className="space-y-2.5">
                  {currentOption.swot.strengths.map((str, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-slate-200 leading-relaxed"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* WEAKNESSES */}
            <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-rose-900/30">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-rose-300 uppercase tracking-wide">
                        Weaknesses (Internal)
                      </h4>
                      <span className="text-[10px] text-rose-400/80">
                        Deficits, friction points & dependencies
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-rose-400">
                    {currentOption.swot.weaknesses.length} items
                  </span>
                </div>

                <ul className="space-y-2.5">
                  {currentOption.swot.weaknesses.map((weak, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-slate-200 leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                      <span>{weak}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* OPPORTUNITIES */}
            <div className="bg-cyan-950/20 border border-cyan-900/40 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-cyan-900/30">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wide">
                        Opportunities (External)
                      </h4>
                      <span className="text-[10px] text-cyan-400/80">
                        Tailwinds, future optionality & upside
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-cyan-400">
                    {currentOption.swot.opportunities.length} items
                  </span>
                </div>

                <ul className="space-y-2.5">
                  {currentOption.swot.opportunities.map((opp, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-slate-200 leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                      <span>{opp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* THREATS */}
            <div className="bg-purple-950/20 border border-purple-900/40 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-purple-900/30">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                      <Skull className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-purple-300 uppercase tracking-wide">
                        Threats (External)
                      </h4>
                      <span className="text-[10px] text-purple-400/80">
                        Macro hazards, competitor responses & traps
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-purple-400">
                    {currentOption.swot.threats.length} items
                  </span>
                </div>

                <ul className="space-y-2.5">
                  {currentOption.swot.threats.map((thr, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-slate-200 leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 mt-1.5" />
                      <span>{thr}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
