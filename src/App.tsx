import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DecisionForm } from './components/DecisionForm';
import { DecisionDashboard } from './components/DecisionDashboard';
import { SavedDecisionsModal } from './components/SavedDecisionsModal';
import { DecisionAnalysis, DecisionInput } from './types/decision';
import { SAMPLE_DECISIONS } from './data/sampleDecisions';
import { AlertCircle, Scale, Sparkles, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'tiebreaker_saved_decisions_v1';

export default function App() {
  const [activeAnalysis, setActiveAnalysis] = useState<DecisionAnalysis | null>(null);
  const [savedDecisions, setSavedDecisions] = useState<DecisionAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load saved decisions from localStorage on initial mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedDecisions(parsed);
          // Set latest saved decision if available
          setActiveAnalysis(parsed[0]);
          return;
        }
      }
      // If nothing saved, default to the sample startup vs big tech for instant visual richness
      setSavedDecisions(SAMPLE_DECISIONS);
      setActiveAnalysis(SAMPLE_DECISIONS[0]);
    } catch (e) {
      console.warn('Failed to load decisions from localStorage:', e);
      setSavedDecisions(SAMPLE_DECISIONS);
      setActiveAnalysis(SAMPLE_DECISIONS[0]);
    }
  }, []);

  // Save to localStorage whenever savedDecisions changes
  const persistDecisions = (updatedList: DecisionAnalysis[]) => {
    setSavedDecisions(updatedList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle new analysis submission to backend API
  const handleAnalyzeDecision = async (input: DecisionInput) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/analyze-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to analyze decision. Please try again.');
      }

      const newAnalysis: DecisionAnalysis = await res.json();
      setActiveAnalysis(newAnalysis);

      // Add to saved history
      const updatedList = [newAnalysis, ...savedDecisions.filter((d) => d.id !== newAnalysis.id)];
      persistDecisions(updatedList);

      showToast('Decision analysis generated successfully!');
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err?.message || 'Failed to process decision with AI.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update existing active analysis
  const handleUpdateActiveAnalysis = (updated: DecisionAnalysis) => {
    setActiveAnalysis(updated);
    const updatedList = savedDecisions.map((d) => (d.id === updated.id ? updated : d));
    // If not in list, add it
    if (!savedDecisions.some((d) => d.id === updated.id)) {
      updatedList.unshift(updated);
    }
    persistDecisions(updatedList);
  };

  // Delete decision
  const handleDeleteDecision = (id: string) => {
    const updatedList = savedDecisions.filter((d) => d.id !== id);
    persistDecisions(updatedList);
    if (activeAnalysis?.id === id) {
      setActiveAnalysis(updatedList[0] || null);
    }
    showToast('Decision removed from history.');
  };

  // Select sample
  const handleSelectSample = (sampleId: string) => {
    const found = SAMPLE_DECISIONS.find((s) => s.id === sampleId) || SAMPLE_DECISIONS[0];
    setActiveAnalysis(found);
    if (!savedDecisions.some((d) => d.id === found.id)) {
      persistDecisions([found, ...savedDecisions]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Header */}
      <Header
        onNewDecision={() => setActiveAnalysis(null)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onLoadSample={handleSelectSample}
        savedCount={savedDecisions.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {errorMessage && (
          <div className="max-w-4xl mx-auto px-4 mt-6">
            <div className="bg-rose-950/40 border border-rose-800/80 rounded-2xl p-4 flex items-start gap-3 text-rose-200">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold">Analysis Request Failed</h4>
                <p className="text-xs text-rose-300 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* View Switcher: Decision Form vs Analysis Dashboard */}
        {activeAnalysis ? (
          <DecisionDashboard
            analysis={activeAnalysis}
            onUpdateAnalysis={handleUpdateActiveAnalysis}
            onNewDecision={() => setActiveAnalysis(null)}
          />
        ) : (
          <DecisionForm
            onSubmit={handleAnalyzeDecision}
            isLoading={isLoading}
            onSelectSample={handleSelectSample}
          />
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-amber-500/40 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Saved Decisions Modal */}
      <SavedDecisionsModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedDecisions={savedDecisions}
        onSelectDecision={(dec) => setActiveAnalysis(dec)}
        onDeleteDecision={handleDeleteDecision}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-slate-300">CompareIQ</span>
            <span>— Multi-Criteria Decision Framework & AI Engine</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Pros & Cons Ledger</span>
            <span>•</span>
            <span>Dynamic Matrix</span>
            <span>•</span>
            <span>SWOT Quadrants</span>
            <span>•</span>
            <span>The 10/10/10 Rule</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
