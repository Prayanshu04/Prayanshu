import React, { useState } from 'react';
import { 
  Scale, 
  Table, 
  Layers, 
  Trophy, 
  Coins, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  ArrowLeft, 
  CheckCircle2,
  Calendar,
  Zap
} from 'lucide-react';
import { DecisionAnalysis } from '../types/decision';
import { ProsConsView } from './ProsConsView';
import { ComparisonMatrixView } from './ComparisonMatrixView';
import { SwotView } from './SwotView';
import { VerdictView } from './VerdictView';
import { CoinFlipModal } from './CoinFlipModal';
import { WhatIfSandbox } from './WhatIfSandbox';

interface DecisionDashboardProps {
  analysis: DecisionAnalysis;
  onUpdateAnalysis: (updated: DecisionAnalysis) => void;
  onNewDecision: () => void;
}

type TabType = 'proscons' | 'matrix' | 'swot' | 'verdict' | 'whatif';

export const DecisionDashboard: React.FC<DecisionDashboardProps> = ({
  analysis,
  onUpdateAnalysis,
  onNewDecision,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('proscons');
  const [isCoinFlipOpen, setIsCoinFlipOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const winningOption =
    analysis.options.find((o) => o.id === analysis.verdict.winnerId) ||
    analysis.options[0];
  const chosenOption = analysis.selectedOptionId
    ? analysis.options.find((o) => o.id === analysis.selectedOptionId)
    : null;

  const handleSelectFinalOption = (optionId: string) => {
    onUpdateAnalysis({
      ...analysis,
      selectedOptionId: optionId,
    });
  };

  // Generate markdown report for clipboard
  const handleCopyReport = () => {
    let md = `# CompareIQ Decision Report: ${analysis.title}\n\n`;
    md += `> ${analysis.summary}\n\n`;
    if (analysis.userContext) {
      md += `**Context:** ${analysis.userContext}\n\n`;
    }
    md += `## 🏆 Tie-Breaker Verdict\n`;
    md += `**Recommended Option:** ${winningOption.name}\n`;
    md += `**Bottom Line:** ${analysis.verdict.bottomLine}\n\n`;
    md += `**Deciding Factor:** ${analysis.verdict.decidingFactor}\n\n`;

    md += `## ⚖️ Options & Pros/Cons\n`;
    for (const opt of analysis.options) {
      md += `### ${opt.name} (${opt.score}/100 Viability)\n`;
      md += `*Tagline: ${opt.tagline}*\n\n`;
      md += `**Pros:**\n`;
      opt.pros.forEach((p) => {
        md += `- **${p.point}** (Weight: ${p.weight}/5, ${p.category}): ${p.explanation}\n`;
      });
      md += `\n**Cons:**\n`;
      opt.cons.forEach((c) => {
        md += `- **${c.point}** (Severity: ${c.weight}/5, ${c.category}): ${c.explanation}`;
        if (c.mitigation) md += ` | *Mitigation: ${c.mitigation}*`;
        md += `\n`;
      });
      md += `\n`;
    }

    md += `## 🧭 SWOT Highlights\n`;
    for (const opt of analysis.options) {
      md += `### ${opt.name} SWOT\n`;
      md += `- **Strengths:** ${opt.swot.strengths.join('; ')}\n`;
      md += `- **Weaknesses:** ${opt.swot.weaknesses.join('; ')}\n`;
      md += `- **Opportunities:** ${opt.swot.opportunities.join('; ')}\n`;
      md += `- **Threats:** ${opt.swot.threats.join('; ')}\n\n`;
    }

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download JSON
  const handleDownloadJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(analysis, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `compareiq-${analysis.id.slice(0, 12)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onNewDecision}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl transition-colors shrink-0"
            title="Start new decision"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                Decision File
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(analysis.createdAt).toLocaleDateString()}
              </span>
              {chosenOption && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Committed Choice: {chosenOption.name}</span>
                </span>
              )}
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-white mt-1 tracking-tight">
              {analysis.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300/90 mt-1 max-w-3xl leading-relaxed">
              {analysis.summary}
            </p>
          </div>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
          {/* Gut Check Coin Flip button */}
          <button
            onClick={() => setIsCoinFlipOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-all"
            title="Flip coin for intuitive gut check"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Coin Flip</span>
          </button>

          {/* Copy Report */}
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl transition-colors"
            title="Copy Markdown Summary to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Report</span>
              </>
            )}
          </button>

          {/* Download JSON */}
          <button
            onClick={handleDownloadJson}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl transition-colors"
            title="Download JSON report"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('proscons')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'proscons'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Pros & Cons Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'matrix'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Comparison Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('swot')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'swot'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>SWOT Quadrants</span>
        </button>

        <button
          onClick={() => setActiveTab('verdict')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'verdict'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Tie-Breaker Verdict</span>
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        </button>

        <button
          onClick={() => setActiveTab('whatif')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'whatif'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>What-If Sandbox</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="pt-2">
        {activeTab === 'proscons' && (
          <ProsConsView
            analysis={analysis}
            onUpdateAnalysis={onUpdateAnalysis}
          />
        )}

        {activeTab === 'matrix' && (
          <ComparisonMatrixView
            analysis={analysis}
            onUpdateAnalysis={onUpdateAnalysis}
          />
        )}

        {activeTab === 'swot' && <SwotView analysis={analysis} />}

        {activeTab === 'verdict' && (
          <VerdictView
            analysis={analysis}
            onSelectOption={handleSelectFinalOption}
          />
        )}

        {activeTab === 'whatif' && <WhatIfSandbox analysis={analysis} />}
      </div>

      {/* Coin Flip Interactive Modal */}
      <CoinFlipModal
        isOpen={isCoinFlipOpen}
        onClose={() => setIsCoinFlipOpen(false)}
        options={analysis.options}
        onCommitChoice={handleSelectFinalOption}
      />
    </div>
  );
};
