export interface ProConItem {
  id: string;
  point: string;
  explanation: string;
  weight: number; // 1 to 5 scale
  category: string;
  mitigation?: string; // for cons: how it might be addressed
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface DecisionOption {
  id: string;
  name: string;
  tagline: string;
  pros: ProConItem[];
  cons: ProConItem[];
  swot: SwotAnalysis;
  score: number; // 0 - 100
  colorAccent?: string;
}

export interface ComparisonCriterion {
  id: string;
  name: string;
  description: string;
  defaultWeight: number; // 1 - 5
}

export interface OptionCriterionRating {
  score: number; // 1 - 10
  rationale: string;
}

export interface TieBreakerVerdict {
  winnerId: string;
  winnerName: string;
  confidenceLevel: 'decisive' | 'moderate' | 'nuanced';
  bottomLine: string;
  decidingFactor: string;
  ifThenRules: Array<{
    condition: string;
    recommendedOption: string;
  }>;
  blindSpots: string[];
  ruleOf10: {
    tenMinutes: string;
    tenMonths: string;
    tenYears: string;
  };
}

export interface DecisionAnalysis {
  id: string;
  title: string;
  summary: string;
  userContext?: string;
  options: DecisionOption[];
  criteria: ComparisonCriterion[];
  matrixRatings: Record<string, Record<string, OptionCriterionRating>>; // optionId -> criterionId -> rating
  verdict: TieBreakerVerdict;
  createdAt: string;
  selectedOptionId?: string; // If user made a final choice
}

export interface DecisionInput {
  decision: string;
  options?: string[];
  context?: string;
  priorities?: string;
}

export interface WhatIfResponse {
  impactSummary: string;
  updatedVerdictWinnerId?: string;
  updatedVerdictWinnerName?: string;
  keyChanges: string[];
  recommendationShift: string;
}
