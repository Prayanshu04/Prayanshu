import React, { useState } from 'react';
import { CheckCircle2, XCircle, Plus, ShieldAlert, Sparkles, Filter, ChevronRight, Sliders, ThumbsUp, ThumbsDown } from 'lucide-react';
import { DecisionAnalysis, DecisionOption, ProConItem } from '../types/decision';

interface ProsConsViewProps {
  analysis: DecisionAnalysis;
  onUpdateAnalysis: (updated: DecisionAnalysis) => void;
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({
  analysis,
  onUpdateAnalysis,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newPointOptionId, setNewPointOptionId] = useState<string | null>(null);
  const [newPointType, setNewPointType] = useState<'pro' | 'con'>('pro');
  const [newPointText, setNewPointText] = useState('');
  const [newPointExplanation, setNewPointExplanation] = useState('');
  const [newPointWeight, setNewPointWeight] = useState(3);
  const [newPointCategory, setNewPointCategory] = useState('Personal');

  // Collect all unique categories across all options
  const allCategories = Array.from(
    new Set(
      analysis.options.flatMap((opt) => [
        ...opt.pros.map((p) => p.category),
        ...opt.cons.map((c) => c.category),
      ])
    )
  ).filter(Boolean);

  // Weight adjust handler
  const handleAdjustWeight = (
    optionId: string,
    type: 'pro' | 'con',
    itemId: string,
    delta: number
  ) => {
    const updatedOptions = analysis.options.map((opt) => {
      if (opt.id !== optionId) return opt;
      if (type === 'pro') {
        return {
          ...opt,
          pros: opt.pros.map((p) =>
            p.id === itemId
              ? { ...p, weight: Math.max(1, Math.min(5, p.weight + delta)) }
              : p
          ),
        };
      } else {
        return {
          ...opt,
          cons: opt.cons.map((c) =>
            c.id === itemId
              ? { ...c, weight: Math.max(1, Math.min(5, c.weight + delta)) }
              : c
          ),
        };
      }
    });

    onUpdateAnalysis({
      ...analysis,
      options: updatedOptions,
    });
  };

  // Add custom point handler
  const handleAddPoint = (optionId: string) => {
    if (!newPointText.trim()) return;

    const newItem: ProConItem = {
      id: `custom-${Date.now()}`,
      point: newPointText.trim(),
      explanation: newPointExplanation.trim() || 'Custom factor added by user.',
      weight: newPointWeight,
      category: newPointCategory.trim() || 'General',
    };

    const updatedOptions = analysis.options.map((opt) => {
      if (opt.id !== optionId) return opt;
      if (newPointType === 'pro') {
        return { ...opt, pros: [...opt.pros, newItem] };
      } else {
        return { ...opt, cons: [...opt.cons, newItem] };
      }
    });

    onUpdateAnalysis({
      ...analysis,
      options: updatedOptions,
    });

    // Reset modal
    setNewPointOptionId(null);
    setNewPointText('');
    setNewPointExplanation('');
    setNewPointWeight(3);
  };

  // Calculate weighted totals
  const getOptionStats = (opt: DecisionOption) => {
    const totalProWeight = opt.pros.reduce((acc, p) => acc + p.weight, 0);
    const totalConWeight = opt.cons.reduce((acc, c) => acc + c.weight, 0);
    const netScore = totalProWeight - totalConWeight;
    return { totalProWeight, totalConWeight, netScore };
  };

  return (
    <div className="space-y-6">
      {/* Category Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Filter className="w-3.5 h-3.5 text-amber-400" />
          <span>Filter by Domain:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm shadow-amber-400/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Categories
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm shadow-amber-400/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Options Side-by-Side Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {analysis.options.map((option, optIdx) => {
          const stats = getOptionStats(option);
          const filteredPros =
            selectedCategory === 'all'
              ? option.pros
              : option.pros.filter((p) => p.category === selectedCategory);
          const filteredCons =
            selectedCategory === 'all'
              ? option.cons
              : option.cons.filter((c) => c.category === selectedCategory);

          return (
            <div
              key={option.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 ${
                  optIdx === 0
                    ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
                    : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500'
                }`}
              />

              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <h3 className="text-lg font-bold text-white tracking-tight">
                        {option.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{option.tagline}</p>
                  </div>

                  {/* Net Weighted Score Pill */}
                  <div className="text-right shrink-0">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-500">
                        Net Balance:
                      </span>
                      <span
                        className={`text-xs font-black ${
                          stats.netScore > 0
                            ? 'text-emerald-400'
                            : stats.netScore < 0
                            ? 'text-rose-400'
                            : 'text-slate-300'
                        }`}
                      >
                        {stats.netScore > 0 ? `+${stats.netScore}` : stats.netScore}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score balance bar */}
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden flex mb-6 border border-slate-800">
                  <div
                    style={{
                      width: `${
                        (stats.totalProWeight /
                          (stats.totalProWeight + stats.totalConWeight || 1)) *
                        100
                      }%`,
                    }}
                    className="bg-emerald-500 transition-all duration-300"
                    title={`Pros Weight: ${stats.totalProWeight}`}
                  />
                  <div
                    style={{
                      width: `${
                        (stats.totalConWeight /
                          (stats.totalProWeight + stats.totalConWeight || 1)) *
                        100
                      }%`,
                    }}
                    className="bg-rose-500 transition-all duration-300"
                    title={`Cons Severity: ${stats.totalConWeight}`}
                  />
                </div>

                {/* PROS LIST */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>The Advantages & Upside ({filteredPros.length})</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Total Weight: +{stats.totalProWeight}
                    </span>
                  </div>

                  {filteredPros.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-2">
                      No pros match the "{selectedCategory}" category.
                    </p>
                  ) : (
                    filteredPros.map((pro) => (
                      <div
                        key={pro.id}
                        className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 hover:border-emerald-800/60 transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-xs font-bold text-emerald-200">
                            {pro.point}
                          </h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-900/40 text-emerald-300 border border-emerald-700/30 shrink-0">
                            {pro.category}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300/90 leading-relaxed mb-2">
                          {pro.explanation}
                        </p>

                        {/* Interactive Weight Slider / Stepper */}
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-emerald-900/30 text-slate-400">
                          <span className="flex items-center gap-1 font-medium">
                            <span>Impact:</span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((w) => (
                                <span
                                  key={w}
                                  className={`w-2 h-2 rounded-full ${
                                    w <= pro.weight ? 'bg-emerald-400' : 'bg-slate-700'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-emerald-300 font-bold ml-1">
                              ({pro.weight}/5)
                            </span>
                          </span>

                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() =>
                                handleAdjustWeight(option.id, 'pro', pro.id, -1)
                              }
                              disabled={pro.weight <= 1}
                              className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 flex items-center justify-center font-bold text-xs"
                              title="Decrease importance"
                            >
                              -
                            </button>
                            <button
                              onClick={() =>
                                handleAdjustWeight(option.id, 'pro', pro.id, 1)
                              }
                              disabled={pro.weight >= 5}
                              className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 flex items-center justify-center font-bold text-xs"
                              title="Increase importance"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* CONS LIST */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-400">
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span>The Downsides & Risks ({filteredCons.length})</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Total Severity: -{stats.totalConWeight}
                    </span>
                  </div>

                  {filteredCons.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-2">
                      No cons match the "{selectedCategory}" category.
                    </p>
                  ) : (
                    filteredCons.map((con) => (
                      <div
                        key={con.id}
                        className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 hover:border-rose-800/60 transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-xs font-bold text-rose-200">
                            {con.point}
                          </h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-900/40 text-rose-300 border border-rose-700/30 shrink-0">
                            {con.category}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300/90 leading-relaxed mb-2">
                          {con.explanation}
                        </p>

                        {/* Mitigation tip */}
                        {con.mitigation && (
                          <div className="mb-2 p-2 rounded-lg bg-slate-950/70 border border-amber-500/20 flex items-start gap-1.5 text-[11px] text-amber-300/90 leading-normal">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>
                              <strong>Mitigation:</strong> {con.mitigation}
                            </span>
                          </div>
                        )}

                        {/* Severity weight control */}
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-rose-900/30 text-slate-400">
                          <span className="flex items-center gap-1 font-medium">
                            <span>Severity:</span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((w) => (
                                <span
                                  key={w}
                                  className={`w-2 h-2 rounded-full ${
                                    w <= con.weight ? 'bg-rose-400' : 'bg-slate-700'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-rose-300 font-bold ml-1">
                              ({con.weight}/5)
                            </span>
                          </span>

                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() =>
                                handleAdjustWeight(option.id, 'con', con.id, -1)
                              }
                              disabled={con.weight <= 1}
                              className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 flex items-center justify-center font-bold text-xs"
                              title="Decrease severity"
                            >
                              -
                            </button>
                            <button
                              onClick={() =>
                                handleAdjustWeight(option.id, 'con', con.id, 1)
                              }
                              disabled={con.weight >= 5}
                              className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 flex items-center justify-center font-bold text-xs"
                              title="Increase severity"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add Custom Point Button for this option */}
              <div className="mt-5 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    setNewPointOptionId(option.id);
                    setNewPointType('pro');
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Add Custom Pro or Con to {option.name}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for adding custom factor */}
      {newPointOptionId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-white mb-3">
              Add Factor to{' '}
              {analysis.options.find((o) => o.id === newPointOptionId)?.name}
            </h3>

            {/* Type selector */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setNewPointType('pro')}
                className={`py-2 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                  newPointType === 'pro'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Advantage (Pro)</span>
              </button>
              <button
                type="button"
                onClick={() => setNewPointType('con')}
                className={`py-2 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                  newPointType === 'con'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>Downside (Con)</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Point Headline *
                </label>
                <input
                  type="text"
                  value={newPointText}
                  onChange={(e) => setNewPointText(e.target.value)}
                  placeholder="e.g. Flexible hybrid schedule, High property taxes..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Explanation / Detail
                </label>
                <textarea
                  value={newPointExplanation}
                  onChange={(e) => setNewPointExplanation(e.target.value)}
                  placeholder="Why this factor matters to your specific situation..."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Importance (1-5)
                  </label>
                  <select
                    value={newPointWeight}
                    onChange={(e) => setNewPointWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white outline-none"
                  >
                    <option value={1}>1 - Minor</option>
                    <option value={2}>2 - Moderate</option>
                    <option value={3}>3 - Important</option>
                    <option value={4}>4 - High Impact</option>
                    <option value={5}>5 - Dealbreaker / Essential</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newPointCategory}
                    onChange={(e) => setNewPointCategory(e.target.value)}
                    placeholder="e.g. Financial, Health"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => setNewPointOptionId(null)}
                className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddPoint(newPointOptionId)}
                disabled={!newPointText.trim()}
                className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg shadow transition-colors"
              >
                Save Factor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
