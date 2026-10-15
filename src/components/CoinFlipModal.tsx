import React, { useState } from 'react';
import { Coins, X, Sparkles, RefreshCw, ThumbsUp, ThumbsDown, Heart } from 'lucide-react';
import { DecisionOption } from '../types/decision';

interface CoinFlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: DecisionOption[];
  onCommitChoice?: (optionId: string) => void;
}

export const CoinFlipModal: React.FC<CoinFlipModalProps> = ({
  isOpen,
  onClose,
  options,
  onCommitChoice,
}) => {
  if (!isOpen) return null;

  const optA = options[0];
  const optB = options[1] || options[0];

  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [rotation, setRotation] = useState(0);
  const [revealedChoice, setRevealedChoice] = useState<DecisionOption | null>(null);

  const flipCoin = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setResult(null);
    setRevealedChoice(null);

    // Random outcome
    const isHeads = Math.random() > 0.5;
    const additionalTurns = 5 + Math.floor(Math.random() * 4); // 5 to 8 full rotations
    const targetDeg = additionalTurns * 360 + (isHeads ? 0 : 180);

    setRotation((prev) => prev + targetDeg);

    setTimeout(() => {
      setIsFlipping(false);
      setResult(isHeads ? 'heads' : 'tails');
      setRevealedChoice(isHeads ? optA : optB);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider mb-2">
            <Coins className="w-3.5 h-3.5" />
            <span>The Subconscious Gut Check</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            The Famous Coin Flip Trick
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            When the coin is in the air, pay attention to what outcome you secretly hope for. When it lands, notice whether you feel <strong>relief</strong> or <strong>disappointment</strong>.
          </p>
        </div>

        {/* Assignments */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-center">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] font-bold uppercase text-amber-400">
              Heads = Option A
            </div>
            <div className="text-xs font-bold text-white mt-0.5 truncate" title={optA.name}>
              {optA.name}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] font-bold uppercase text-amber-400">
              Tails = Option B
            </div>
            <div className="text-xs font-bold text-white mt-0.5 truncate" title={optB.name}>
              {optB.name}
            </div>
          </div>
        </div>

        {/* 3D Coin Animation Area */}
        <div className="flex flex-col items-center justify-center my-6">
          <div
            style={{ perspective: 1000 }}
            className="w-32 h-32 flex items-center justify-center cursor-pointer select-none"
            onClick={flipCoin}
          >
            <div
              style={{
                transform: `rotateY(${rotation}deg)`,
                transition: isFlipping ? 'transform 1.8s cubic-bezier(0.2, 0.8, 0.3, 1)' : 'none',
                transformStyle: 'preserve-3d',
              }}
              className="w-28 h-28 rounded-full relative flex items-center justify-center shadow-2xl shadow-amber-500/20"
            >
              {/* Front Face (Heads) */}
              <div
                style={{ backfaceVisibility: 'hidden' }}
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 border-4 border-amber-300 flex flex-col items-center justify-center shadow-inner text-slate-950 font-black"
              >
                <Coins className="w-8 h-8 stroke-[2.2] mb-0.5" />
                <span className="text-xs tracking-wider uppercase font-extrabold">HEADS</span>
                <span className="text-[9px] font-bold opacity-80">Option A</span>
              </div>

              {/* Back Face (Tails) */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-500 via-amber-500 to-amber-700 border-4 border-amber-300 flex flex-col items-center justify-center shadow-inner text-slate-950 font-black"
              >
                <Sparkles className="w-8 h-8 stroke-[2.2] mb-0.5" />
                <span className="text-xs tracking-wider uppercase font-extrabold">TAILS</span>
                <span className="text-[9px] font-bold opacity-80">Option B</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4">
            {isFlipping ? 'Flipping in the air... Notice what you are hoping for!' : 'Click the coin or button below to flip'}
          </p>
        </div>

        {/* Revealed Outcome & Gut Reaction Prompt */}
        {revealedChoice && !isFlipping && (
          <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-4 text-center animate-in fade-in duration-300 mb-5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              The Coin Landed On:
            </span>
            <h4 className="text-lg font-black text-white mt-0.5">
              {revealedChoice.name}
            </h4>
            <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300">
              <p className="font-semibold text-amber-300 mb-2 flex items-center justify-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span>Gut Check: How did your body react when it landed?</span>
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => {
                    onCommitChoice?.(revealedChoice.id);
                    onClose();
                  }}
                  className="p-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center justify-center gap-1"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>Relief! (I wanted this)</span>
                </button>

                <button
                  onClick={() => {
                    const otherOpt = revealedChoice.id === optA.id ? optB : optA;
                    onCommitChoice?.(otherOpt.id);
                    onClose();
                  }}
                  className="p-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-bold flex items-center justify-center gap-1"
                >
                  <ThumbsDown className="w-3 h-3" />
                  <span>Disappointment! (Pick other)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Flip Action Button */}
        <button
          onClick={flipCoin}
          disabled={isFlipping}
          className="w-full py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <RefreshCw className={`w-4 h-4 ${isFlipping ? 'animate-spin' : ''}`} />
          <span>{isFlipping ? 'Coin is in mid-air...' : 'Flip The Coin Now'}</span>
        </button>
      </div>
    </div>
  );
};
