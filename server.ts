import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side initialization of Gemini client with aistudio-build telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Primary Decision Analysis Endpoint
app.post('/api/analyze-decision', async (req, res) => {
  try {
    const { decision, options, context, priorities } = req.body;

    if (!decision || typeof decision !== 'string' || decision.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide a valid decision question.' });
    }

    const optionsText = options && Array.isArray(options) && options.filter(o => o?.trim()).length > 0
      ? `User provided these options: ${options.filter((o: string) => o.trim()).map((o: string, i: number) => `Option ${i + 1}: "${o}"`).join(', ')}`
      : 'User did not specify options. Identify the 2 to 3 most realistic, distinct and sensible options to compare.';

    const contextText = context?.trim() ? `Additional context & constraints: ${context.trim()}` : 'No extra personal constraints provided.';
    const prioritiesText = priorities?.trim() ? `User values & priorities: ${priorities.trim()}` : 'Standard balanced priorities (balanced risk, growth, satisfaction, and practicality).';

    const prompt = `
You are tasked with conducting a deep, rigorous decision analysis for the following dilemma:

Dilemma: "${decision.trim()}"
${optionsText}
${contextText}
${prioritiesText}

Please produce a comprehensive decision breakdown:
1. Provide 2 to 4 distinct options with ids "opt-1", "opt-2", etc.
2. For EACH option:
   - 3 to 5 clear, high-impact PROS with importance weight (1-5, where 5 is game-changing) and category (e.g. Financial, Career, Lifestyle, Well-being, Simplicity).
   - 3 to 5 realistic, unvarnished CONS with severity weight (1-5, where 5 is critical risk), category, and a practical mitigation tip.
   - Complete SWOT analysis (Internal Strengths, Internal Weaknesses, External Opportunities, External Threats).
   - An initial overall viability score (0-100).
3. 4 to 6 universal comparison CRITERIA relevant to this specific decision (e.g. Long-term Upside, Financial Impact, Peace of Mind, Time Commitment, Reversibility, Alignment with Values) with ids "crit-1", "crit-2", etc., and default weights (1-5).
4. Concrete matrix ratings for EVERY option across EVERY criterion: score 1-10 (10 = outstanding) with a short 1-sentence rationale.
5. The TieBreaker Verdict:
   - Identify the clear winning option or optimal default option id.
   - Confidence level: "decisive", "moderate", or "nuanced".
   - Candid, punchy bottom line.
   - The single deciding factor / question that breaks the tie.
   - 2 to 4 "If/Then" conditional rules for personal situations (e.g., "If you prioritize X, choose Option 1; If you cannot tolerate Y, choose Option 2").
   - 3 crucial blind spots or cognitive biases the user should watch out for.
   - Rule of 10/10/10: How they'll likely feel in 10 minutes, 10 months, and 10 years.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are CompareIQ, an analytical decision strategist, game theorist, and executive coach. Deconstruct dilemmas with crisp objectivity, psychological awareness, and rigorous multi-criteria decision analysis. Be candid, bold, and insightful—never offer generic platitudes.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Short, clean headline of the decision dilemma' },
            summary: { type: Type.STRING, description: '2-3 sentence executive summary of the trade-offs' },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: 'Unique option identifier, e.g. opt-1' },
                  name: { type: Type.STRING, description: 'Clear descriptive name of the option' },
                  tagline: { type: Type.STRING, description: 'Catchy 1-line essence of this path' },
                  pros: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        point: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                        weight: { type: Type.INTEGER, description: '1 to 5 scale of importance' },
                        category: { type: Type.STRING }
                      },
                      required: ['id', 'point', 'explanation', 'weight', 'category']
                    }
                  },
                  cons: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        point: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                        weight: { type: Type.INTEGER, description: '1 to 5 scale of severity' },
                        category: { type: Type.STRING },
                        mitigation: { type: Type.STRING, description: 'Practical way to diminish this downside' }
                      },
                      required: ['id', 'point', 'explanation', 'weight', 'category']
                    }
                  },
                  swot: {
                    type: Type.OBJECT,
                    properties: {
                      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                      opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                      threats: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ['strengths', 'weaknesses', 'opportunities', 'threats']
                  },
                  score: { type: Type.INTEGER, description: 'Viability score from 0 to 100' }
                },
                required: ['id', 'name', 'tagline', 'pros', 'cons', 'swot', 'score']
              }
            },
            criteria: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: 'e.g. crit-1' },
                  name: { type: Type.STRING, description: 'Criterion name, e.g. Long-term Growth' },
                  description: { type: Type.STRING },
                  defaultWeight: { type: Type.INTEGER, description: '1 to 5' }
                },
                required: ['id', 'name', 'description', 'defaultWeight']
              }
            },
            ratingsList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  optionId: { type: Type.STRING },
                  criterionId: { type: Type.STRING },
                  score: { type: Type.INTEGER, description: 'Rating 1 to 10' },
                  rationale: { type: Type.STRING }
                },
                required: ['optionId', 'criterionId', 'score', 'rationale']
              }
            },
            verdict: {
              type: Type.OBJECT,
              properties: {
                winnerId: { type: Type.STRING },
                winnerName: { type: Type.STRING },
                confidenceLevel: { type: Type.STRING, description: 'decisive, moderate, or nuanced' },
                bottomLine: { type: Type.STRING },
                decidingFactor: { type: Type.STRING },
                ifThenRules: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      condition: { type: Type.STRING },
                      recommendedOption: { type: Type.STRING }
                    },
                    required: ['condition', 'recommendedOption']
                  }
                },
                blindSpots: { type: Type.ARRAY, items: { type: Type.STRING } },
                ruleOf10: {
                  type: Type.OBJECT,
                  properties: {
                    tenMinutes: { type: Type.STRING },
                    tenMonths: { type: Type.STRING },
                    tenYears: { type: Type.STRING }
                  },
                  required: ['tenMinutes', 'tenMonths', 'tenYears']
                }
              },
              required: ['winnerId', 'winnerName', 'confidenceLevel', 'bottomLine', 'decidingFactor', 'ifThenRules', 'blindSpots', 'ruleOf10']
            }
          },
          required: ['title', 'summary', 'options', 'criteria', 'ratingsList', 'verdict']
        }
      }
    });

    const rawJson = response.text?.trim() || '{}';
    const parsedData = JSON.parse(rawJson);

    // Color accents for visual distinction
    const colorPalettes = ['emerald', 'indigo', 'amber', 'rose', 'cyan'];

    // Map ratingsList array into matrixRatings record [optionId][criterionId]
    const matrixRatings: Record<string, Record<string, { score: number; rationale: string }>> = {};
    if (Array.isArray(parsedData.ratingsList)) {
      for (const item of parsedData.ratingsList) {
        if (!matrixRatings[item.optionId]) {
          matrixRatings[item.optionId] = {};
        }
        matrixRatings[item.optionId][item.criterionId] = {
          score: Math.min(10, Math.max(1, item.score || 5)),
          rationale: item.rationale || ''
        };
      }
    }

    // Format options with color accent
    const formattedOptions = (parsedData.options || []).map((opt: any, index: number) => ({
      ...opt,
      colorAccent: colorPalettes[index % colorPalettes.length],
      pros: (opt.pros || []).map((p: any, i: number) => ({
        ...p,
        id: p.id || `pro-${index}-${i}`
      })),
      cons: (opt.cons || []).map((c: any, i: number) => ({
        ...c,
        id: c.id || `con-${index}-${i}`
      }))
    }));

    const result = {
      id: `decision-${Date.now()}`,
      title: parsedData.title || decision,
      summary: parsedData.summary || '',
      userContext: context?.trim(),
      options: formattedOptions,
      criteria: parsedData.criteria || [],
      matrixRatings,
      verdict: parsedData.verdict,
      createdAt: new Date().toISOString()
    };

    return res.json(result);
  } catch (error: any) {
    console.error('Error analyzing decision:', error);
    return res.status(500).json({
      error: 'Failed to analyze decision. ' + (error?.message || 'Please check your input and try again.')
    });
  }
});

// Follow-up / What-If Scenario Analysis
app.post('/api/what-if', async (req, res) => {
  try {
    const { decisionTitle, options, currentVerdict, whatIfScenario } = req.body;

    if (!whatIfScenario || typeof whatIfScenario !== 'string' || !whatIfScenario.trim()) {
      return res.status(400).json({ error: 'Please provide a what-if scenario.' });
    }

    const prompt = `
Decision Context: "${decisionTitle}"
Options: ${JSON.stringify((options || []).map((o: any) => ({ id: o.id, name: o.name })))}
Current Verdict: ${currentVerdict?.winnerName || 'N/A'} - "${currentVerdict?.bottomLine || ''}"

Hypothetical Scenario / What-If Change:
"${whatIfScenario.trim()}"

Analyze how this new variable or condition alters the balance:
1. Does it flip or reinforce the winning option?
2. What are the key dynamics that shift?
3. What is the updated practical recommendation?
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are CompareIQ decision engine. Evaluate hypothetical scenarios and pivot points with sharp cause-and-effect reasoning.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            impactSummary: { type: Type.STRING, description: '1-2 sentences on how the balance shifted' },
            updatedVerdictWinnerId: { type: Type.STRING, description: 'The option id that now wins, or existing winner id' },
            updatedVerdictWinnerName: { type: Type.STRING, description: 'Name of the option favored under this scenario' },
            keyChanges: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2 to 4 bullet points of major parameter changes'
            },
            recommendationShift: { type: Type.STRING, description: 'Clear directive on what action to take if this scenario holds true' }
          },
          required: ['impactSummary', 'updatedVerdictWinnerName', 'keyChanges', 'recommendationShift']
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error simulating what-if scenario:', error);
    return res.status(500).json({
      error: 'Failed to evaluate what-if scenario. ' + (error?.message || '')
    });
  }
});

// Production or Vite Dev middleware
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`CompareIQ server running at http://0.0.0.0:${port}`);
});
