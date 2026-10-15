import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, SlidersHorizontal, ChevronDown, ChevronUp, ArrowRight, Lightbulb, Zap } from 'lucide-react';
import { DecisionInput } from '../types/decision';

interface DecisionFormProps {
  onSubmit: (input: DecisionInput) => Promise<void>;
  isLoading: boolean;
  onSelectSample: (sampleId: string) => void;
}

const QUICK_TEMPLATES = [
  {
    title: 'Startup vs Big Tech',
    category: 'Career',
    decision: 'Should I accept a Senior Engineer offer at a high-growth startup or stay at Big Tech?',
    options: ['Join Series B Startup', 'Stay at Big Tech'],
    context: 'Have 8 months of emergency savings. Want to accelerate to tech lead in 3 years.',
    priorities: 'Career velocity, technical leadership, autonomy'
  },
  {
    title: 'Buy vs Rent Home',
    category: 'Finance',
    decision: 'Should we buy a suburban house with a mortgage or keep renting and invest surplus in index funds?',
    options: ['Buy $650k Suburban Home', 'Rent Urban Apartment & Invest'],
    context: 'Married couple, 32yo, $140k saved, planning kids in 2-3 years, remote work.',
    priorities: 'Long-term family stability vs cash liquidity and flexibility'
  },
  {
    title: 'Relocate vs Stay Put',
    category: 'Lifestyle',
    decision: 'Should I move to a new city for a fresh start or remain in my current hometown near established friends?',
    options: ['Move to Austin / Seattle', 'Stay in Current City'],
    context: 'Single, 28yo, craving excitement and larger tech hub, but worried about social reboot.',
    priorities: 'Personal growth, new friendships, lifestyle excitement'
  },
  {
    title: 'Build In-House vs Buy SaaS',
    category: 'Business',
    decision: 'Should our company build a custom internal analytics engine or subscribe to an enterprise SaaS vendor?',
    options: ['Build Custom In-House', 'Subscribe to Enterprise SaaS'],
    context: 'Team of 6 devs, 4-month timeline, specific compliance rules, budget $60k/yr.',
    priorities: 'Speed to deployment, total cost of ownership, engineering maintenance'
  }
];

const LOADING_STEPS = [
  'Deconstructing dilemma & trade-offs...',
  'Analyzing pros & cons with impact weighting...',
  'Drafting 2x2 SWOT quadrant matrix...',
  'Evaluating multi-criteria decision scores...',
  'Synthesizing the TieBreaker verdict & 10/10/10 lens...'
];

export const DecisionForm: React.FC<DecisionFormProps> = ({
  onSubmit,
  isLoading,
  onSelectSample
}) => {
  const [decision, setDecision] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [context, setContext] = useState('');
  const [priorities, setPriorities] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);

  // Rotate loading text
  React.useEffect(() => {
    if (!isLoading) {
      setLoadingStepIdx(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const handleApplyTemplate = (tmpl: typeof QUICK_TEMPLATES[0]) => {
    setDecision(tmpl.decision);
    setOptions(tmpl.options);
    setContext(tmpl.context);
    setPriorities(tmpl.priorities);
    setShowAdvanced(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision.trim()) return;

    await onSubmit({
      decision: decision.trim(),
      options: options.map(o => o.trim()).filter(Boolean),
      context: context.trim() || undefined,
      priorities: priorities.trim() || undefined
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Hero Headline */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Cut Through Analysis Paralysis</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight sm:leading-none mb-4">
          Make Hard Decisions With <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">Total Clarity</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Input your dilemma. AI constructs a rigorous <strong>Pros & Cons ledger</strong>, an interactive <strong>Comparison Table</strong>, a strategic <strong>SWOT analysis</strong>, and delivers an objective <strong>Tie-Breaker Verdict</strong>.
        </p>
      </div>

      {/* Main Input Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-2xl shadow-slate-950/80 backdrop-blur-xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Decision Question */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              What decision do you need to make? <span className="text-amber-400">*</span>
            </label>
            <textarea
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              placeholder="e.g. Should I accept the senior startup offer or stay at big tech? Should I relocate to London? Which EV car should I buy?"
              rows={3}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 bg-slate-950/90 border border-slate-700/80 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl text-slate-100 placeholder-slate-500 text-base leading-relaxed transition-all outline-none resize-none"
            />
            <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
              <span>Tip: State your dilemma clearly. You can compare 2 or more options below.</span>
            </p>
          </div>

          {/* Options Section */}
          <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="text-sm font-semibold text-slate-200">
                  Options to Compare <span className="text-xs font-normal text-slate-400">(Optional - AI can auto-discover if left empty)</span>
                </label>
              </div>
              {options.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddOption}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Option</span>
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-700">
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`e.g. Option ${idx + 1}: ${idx === 0 ? 'Accept the new role' : 'Stay in current position'}`}
                    disabled={isLoading}
                    className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-800 focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/20 rounded-lg text-sm text-slate-200 placeholder-slate-600 outline-none transition-all"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      disabled={isLoading}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Remove option"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Context Accordion */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors select-none"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span>{showAdvanced ? 'Hide personal context & constraints' : 'Add personal context & values (recommends sharper verdict)'}</span>
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showAdvanced && (
              <div className="mt-3.5 pt-3.5 border-t border-slate-800/80 space-y-4 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    What matters most to you in this decision? (Your Core Values & Priorities)
                  </label>
                  <input
                    type="text"
                    value={priorities}
                    onChange={(e) => setPriorities(e.target.value)}
                    placeholder="e.g. Work-life balance, high compensation, low risk, long-term mastery, health, family time..."
                    disabled={isLoading}
                    className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-800 focus:border-amber-400/80 rounded-lg text-sm text-slate-200 placeholder-slate-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Personal Constraints, Timeline & Secret Fears
                  </label>
                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="e.g. I have 6 months of savings; must decide by Friday; partner is also working; hate micromanagement..."
                    rows={2}
                    disabled={isLoading}
                    className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-800 focus:border-amber-400/80 rounded-lg text-sm text-slate-200 placeholder-slate-600 outline-none resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Action Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading || !decision.trim()}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span className="text-slate-900 font-semibold">{LOADING_STEPS[loadingStepIdx]}</span>
                </div>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 stroke-[2.3]" />
                  <span>Break This Tie With CompareIQ</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Sample Decision Starter Templates */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Or explore a popular dilemma template:</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {QUICK_TEMPLATES.map((tmpl, idx) => (
              <div
                key={idx}
                onClick={() => handleApplyTemplate(tmpl)}
                className="group p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors">
                    {tmpl.title}
                  </h4>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                    {tmpl.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  {tmpl.decision}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
