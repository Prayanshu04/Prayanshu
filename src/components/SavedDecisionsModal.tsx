import React from 'react';
import { X, History, Trash2, ArrowRight, CheckCircle2, Calendar, Trophy } from 'lucide-react';
import { DecisionAnalysis } from '../types/decision';

interface SavedDecisionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: DecisionAnalysis[];
  onSelectDecision: (decision: DecisionAnalysis) => void;
  onDeleteDecision: (id: string) => void;
}

export const SavedDecisionsModal: React.FC<SavedDecisionsModalProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  onSelectDecision,
  onDeleteDecision,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Saved Decisions History
              </h3>
              <p className="text-xs text-slate-400">
                {savedDecisions.length} decision{savedDecisions.length === 1 ? '' : 's'} stored on this device
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto py-4 space-y-3 flex-1 pr-1">
          {savedDecisions.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <History className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-semibold text-slate-300">
                No saved decisions yet
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Any decision you analyze will automatically save here so you can revisit it anytime.
              </p>
            </div>
          ) : (
            savedDecisions.map((dec) => {
              const winningOpt =
                dec.options.find((o) => o.id === dec.verdict.winnerId) ||
                dec.options[0];
              const userChoice = dec.selectedOptionId
                ? dec.options.find((o) => o.id === dec.selectedOptionId)
                : null;

              return (
                <div
                  key={dec.id}
                  className="p-4 rounded-2xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => {
                      onSelectDecision(dec);
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(dec.createdAt).toLocaleDateString()}</span>
                      </span>

                      {userChoice ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Chose: {userChoice.name}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <Trophy className="w-3 h-3" />
                          <span>Recommended: {winningOpt.name}</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                      {dec.title}
                    </h4>

                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {dec.options.map((o) => o.name).join(' vs ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => {
                        onSelectDecision(dec);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDecision(dec.id);
                      }}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete decision"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
