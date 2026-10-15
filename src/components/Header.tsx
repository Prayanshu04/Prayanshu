import React from 'react';
import { Scale, History, PlusCircle, Sparkles, BookOpen } from 'lucide-react';

interface HeaderProps {
  onNewDecision: () => void;
  onOpenHistory: () => void;
  onLoadSample: (sampleId: string) => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onNewDecision,
  onOpenHistory,
  onLoadSample,
  savedCount,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onNewDecision}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
            <Scale className="w-5 h-5 text-slate-950 font-black stroke-[2.4]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-amber-300 transition-colors">
                CompareIQ
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                AI Decision Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Pros & Cons • Comparison Matrix • SWOT • Tie-Breaker Verdict
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Demo Demos dropdown */}
          <div className="relative group hidden md:block">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 rounded-lg transition-colors">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Examples</span>
            </button>
            <div className="absolute right-0 mt-1 w-64 p-1.5 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl opacity-0 translate-y-1 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200 z-50">
              <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Sample Decisions
              </div>
              <button
                onClick={() => onLoadSample('sample-startup-vs-bigtech')}
                className="w-full text-left px-2.5 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>Startup Offer vs Big Tech</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Career</span>
              </button>
              <button
                onClick={() => onLoadSample('sample-rent-vs-buy')}
                className="w-full text-left px-2.5 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>Suburban Home vs Renting</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">Life</span>
              </button>
            </div>
          </div>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-700/70 border border-slate-700/60 rounded-lg transition-colors"
            title="View saved decisions"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">History</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {savedCount}
              </span>
            )}
          </button>

          {/* New Decision Button */}
          <button
            onClick={onNewDecision}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>New Decision</span>
          </button>
        </div>
      </div>
    </header>
  );
};
