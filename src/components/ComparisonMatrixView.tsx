import React, { useState } from 'react';
import { SlidersHorizontal, Award, Info, RotateCcw, TrendingUp, Check, ChevronRight } from 'lucide-react';
import { DecisionAnalysis, ComparisonCriterion } from '../types/decision';

interface ComparisonMatrixViewProps {
  analysis: DecisionAnalysis;
  onUpdateAnalysis: (updated: DecisionAnalysis) => void;
}

export const ComparisonMatrixView: React.FC<ComparisonMatrixViewProps> = ({
  analysis,
  onUpdateAnalysis,
}) => {
  // Local state for interactive weights (initialized from criteria defaultWeight)
  const [weights, setWeights] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const c of analysis.criteria) {
      init[c.id] = c.defaultWeight;
    }
    return init;
  });

  const [expandedRationale, setExpandedRationale] = useState<string | null>(null);

  // Update a weight slider
  const handleWeightChange = (criterionId: string, newWeight: number) => {
    setWeights((prev) => ({
      ...prev,
      [criterionId]: newWeight,
    }));
  };

  // Reset weights to defaults
  const handleResetWeights = () => {
    const reset: Record<string, number> = {};
    for (const c of analysis.criteria) {
      reset[c.id] = c.defaultWeight;
    }
    setWeights(reset);
  };

  // Calculate weighted composite score for an option
  // Score is scaled to 0-100
  const calculateOptionCompositeScore = (optionId: string) => {
    let totalWeightedScore = 0;
    let sumOfWeights = 0;

    for (const criterion of analysis.criteria) {
      const weight = weights[criterion.id] ?? criterion.defaultWeight;
      const rating = analysis.matrixRatings?.[optionId]?.[criterion.id]?.score ?? 5;
      totalWeightedScore += rating * weight;
      sumOfWeights += weight;
    }

    if (sumOfWeights === 0) return 0;
    // rating is 1-10, so max possible is sumOfWeights * 10
    const percentage = (totalWeightedScore / (sumOfWeights * 10)) * 100;
    return Math.round(percentage);
  };

  // Compute ranking among options
  const optionScores = analysis.options.map((opt) => ({
    id: opt.id,
    name: opt.name,
    score: calculateOptionCompositeScore(opt.id),
  }));

  const sortedScores = [...optionScores].sort((a, b) => b.score - a.score);
  const leadingOption = sortedScores[0];
  const runnerUp = sortedScores[1];
  const scoreGap = leadingOption && runnerUp ? leadingOption.score - runnerUp.score : 0;

  // Rating color helper
  const getRatingBadgeStyle = (score: number) => {
    if (score >= 8) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    if (score >= 6) return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    if (score >= 4) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Weighted Leader Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-400/20">
            <Award className="w-5 h-5 font-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Current Matrix Leader:
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                {leadingOption?.score}% Viability
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">
              {leadingOption?.name}
            </h3>
            {scoreGap > 0 && (
              <p className="text-xs text-slate-400 mt-0.5">
                Leading by <strong>+{scoreGap} points</strong> over{' '}
                <span className="text-slate-300">{runnerUp?.name}</span> based on your weighted priorities.
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleResetWeights}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Weights</span>
        </button>
      </div>

      {/* Weights Tuning Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white">
              Tune Your Decision Weights
            </h4>
          </div>
          <span className="text-xs text-slate-400">
            Adjust what matters most to watch composite scores re-balance live
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {analysis.criteria.map((crit) => {
            const currentWeight = weights[crit.id] ?? crit.defaultWeight;
            return (
              <div
                key={crit.id}
                className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-200 truncate" title={crit.name}>
                    {crit.name}
                  </span>
                  <span className="text-xs font-black text-amber-400">
                    Weight: {currentWeight}x
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1 mb-2" title={crit.description}>
                  {crit.description}
                </p>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={currentWeight}
                  onChange={(e) => handleWeightChange(crit.id, Number(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-500 mt-1">
                  <span>1 (Low)</span>
                  <span>3 (Moderate)</span>
                  <span>5 (Crucial)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80">
                <th className="py-4 px-4 sm:px-6 text-xs font-bold uppercase tracking-wider text-slate-400 w-1/3">
                  Criterion & Priority
                </th>
                {analysis.options.map((option, idx) => {
                  const compScore = calculateOptionCompositeScore(option.id);
                  const isLeader = leadingOption?.id === option.id;

                  return (
                    <th
                      key={option.id}
                      className={`py-4 px-4 sm:px-6 text-left transition-colors ${
                        isLeader ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-5 h-5 rounded bg-slate-800 text-slate-300 font-bold text-[10px] flex items-center justify-center border border-slate-700">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-white">
                          {option.name}
                        </span>
                        {isLeader && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 ml-1">
                            LEADER
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isLeader ? 'bg-amber-400' : 'bg-slate-500'
                            }`}
                            style={{ width: `${compScore}%` }}
                          />
                        </div>
                        <span
                          className={`text-xs font-black ${
                            isLeader ? 'text-amber-400' : 'text-slate-400'
                          }`}
                        >
                          {compScore}%
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {analysis.criteria.map((criterion) => {
                const weight = weights[criterion.id] ?? criterion.defaultWeight;

                return (
                  <tr
                    key={criterion.id}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    {/* Criterion info column */}
                    <td className="py-4 px-4 sm:px-6 align-top">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-200">
                          {criterion.name}
                        </span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700 shrink-0">
                          {weight}x weight
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {criterion.description}
                      </p>
                    </td>

                    {/* Ratings for each option */}
                    {analysis.options.map((option) => {
                      const rating =
                        analysis.matrixRatings?.[option.id]?.[criterion.id] || {
                          score: 5,
                          rationale: 'Evaluated by AI strategist.',
                        };
                      const isLeader = leadingOption?.id === option.id;
                      const cellKey = `${option.id}-${criterion.id}`;
                      const isExpanded = expandedRationale === cellKey;

                      return (
                        <td
                          key={option.id}
                          className={`py-4 px-4 sm:px-6 align-top transition-colors ${
                            isLeader ? 'bg-amber-500/5' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <span
                              className={`px-2 py-0.5 text-xs font-black rounded-md border ${getRatingBadgeStyle(
                                rating.score
                              )}`}
                            >
                              {rating.score} / 10
                            </span>
                            <div className="flex gap-0.5">
                              {Array.from({ length: 10 }).map((_, i) => (
                                <span
                                  key={i}
                                  className={`w-1 h-3 rounded-xs ${
                                    i < rating.score
                                      ? rating.score >= 8
                                      ? 'bg-emerald-400'
                                      : rating.score >= 6
                                      ? 'bg-cyan-400'
                                      : rating.score >= 4
                                      ? 'bg-amber-400'
                                      : 'bg-rose-400'
                                      : 'bg-slate-800'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Rationale description */}
                          <div
                            onClick={() =>
                              setExpandedRationale(isExpanded ? null : cellKey)
                            }
                            className="cursor-pointer group"
                          >
                            <p
                              className={`text-xs text-slate-300 leading-relaxed ${
                                isExpanded ? '' : 'line-clamp-2'
                              } group-hover:text-white transition-colors`}
                            >
                              {rating.rationale}
                            </p>
                            {rating.rationale.length > 80 && (
                              <button className="text-[10px] text-amber-400 hover:underline mt-0.5 font-medium">
                                {isExpanded ? 'Show less' : 'Read full rationale'}
                              </button>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
