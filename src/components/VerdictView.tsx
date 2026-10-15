import React, { useState } from 'react';
import { Trophy, Compass, Lightbulb, Clock, CheckCircle2, ArrowRight, AlertOctagon, Sparkles, Check } from 'lucide-react';
import { DecisionAnalysis, TieBreakerVerdict } from '../types/decision';

interface VerdictViewProps {
  analysis: DecisionAnalysis;
  onSelectOption: (optionId: string) => void;
}

export const VerdictView: React.FC<VerdictViewProps> = ({
  analysis,
  onSelectOption,
}) => {
  const { verdict } = analysis;
  const winningOption = analysis.options.find((o) => o.id === verdict.winnerId) || analysis.options[0];
  const [committed, setCommitted] = useState<boolean>(
    analysis.selectedOptionId === verdict.winnerId
  );

  const handleCommit = (optId: string) => {
    onSelectOption(optId);
    setCommitted(true);
  };

  const getConfidenceBadge = (level: string) => {
    switch (level) {
      case 'decisive':
        return { label: 'Decisive Winner', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'moderate':
        return { label: 'Moderate Advantage', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' };
      default:
        return { label: 'Nuanced Trade-off', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    }
  };

  const badge = getConfidenceBadge(verdict.confidenceLevel);

  return (
    <div className="space-y-6">
      {/* Champion Verdict Card */}
      <div className="bg-gradient-to-b from-amber-500/15 via-slate-900 to-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>The Tie-Breaker Recommendation</span>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
              {badge.label}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
            Choose <span className="text-amber-400">{winningOption.name}</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-medium italic mb-6">
            "{winningOption.tagline}"
          </p>

          {/* Bottom Line Strategic Callout */}
          <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-5 mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>The Bottom Line Verdict</span>
            </h4>
            <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
              {verdict.bottomLine}
            </p>
          </div>

          {/* The Single Deciding Factor */}
          <div className="bg-indigo-950/30 border border-indigo-800/50 rounded-2xl p-4 sm:p-5 mb-6 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-1">
                The Single Pivot Question (Deciding Factor)
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-semibold">
                {verdict.decidingFactor}
              </p>
            </div>
          </div>

          {/* Commit Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
            <span className="text-xs text-slate-400">
              {committed ? '🎉 You have locked in this path!' : 'Ready to end analysis paralysis?'}
            </span>

            <button
              onClick={() => handleCommit(winningOption.id)}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                committed
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-500/20'
              }`}
            >
              {committed ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Choice Locked In: {winningOption.name}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Commit to This Choice</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* If / Then Conditional Rules */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h3 className="text-base sm:text-lg font-bold text-white">
            Conditional "If / Then" Decision Heuristics
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Because no decision exists in a vacuum, match your personal boundaries to these tailored rules:
        </p>

        <div className="space-y-3">
          {verdict.ifThenRules.map((rule, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-md bg-slate-800 text-amber-400 font-black text-xs flex items-center justify-center shrink-0 border border-slate-700">
                  {idx + 1}
                </span>
                <span className="text-xs sm:text-sm text-slate-200 leading-snug">
                  <strong>IF</strong> {rule.condition.replace(/^If\s+/i, '')}
                </span>
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg">
                <span className="text-[10px] font-black uppercase text-amber-400">THEN</span>
                <span className="text-xs font-bold text-amber-200">
                  {rule.recommendedOption}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column Split: Blind Spots & The 10/10/10 Rule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BLIND SPOTS */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertOctagon className="w-5 h-5 text-rose-400" />
              <h3 className="text-base font-bold text-white">
                Cognitive Blind Spots & Traps
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Hidden biases and emotional distortions people commonly fall for in this dilemma:
            </p>

            <ul className="space-y-3">
              {verdict.blindSpots.map((spot, i) => (
                <li
                  key={i}
                  className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 text-xs text-slate-200 leading-relaxed flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                  <span>{spot}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 10/10/10 RULE TEMPORAL LENS */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">
                The 10/10/10 Temporal Lens
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Susie Welch's famous decision framework: How will you feel across time?
            </p>

            <div className="space-y-3">
              {/* 10 Minutes */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                    In 10 Minutes
                  </span>
                  <span className="text-[10px] text-slate-500">Immediate reaction</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {verdict.ruleOf10.tenMinutes}
                </p>
              </div>

              {/* 10 Months */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                    In 10 Months
                  </span>
                  <span className="text-[10px] text-slate-500">Medium-term reality</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {verdict.ruleOf10.tenMonths}
                </p>
              </div>

              {/* 10 Years */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                    In 10 Years
                  </span>
                  <span className="text-[10px] text-slate-500">Long-term legacy</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {verdict.ruleOf10.tenYears}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
