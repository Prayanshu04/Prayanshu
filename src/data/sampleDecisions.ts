import { DecisionAnalysis } from '../types/decision';

export const SAMPLE_DECISIONS: DecisionAnalysis[] = [
  {
    id: 'sample-startup-vs-bigtech',
    title: 'Senior Dev at Series B FinTech Startup vs Stay as Mid-Level at Big Tech',
    summary: 'A classic trade-off between predictable high liquidity compensation with work-life stability versus massive scope ownership, speed of execution, and equity upside with high variance.',
    userContext: 'Currently 4 years into engineering. Have 8 months of emergency savings. Want to reach Tech Lead / Staff level within 3 years.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    options: [
      {
        id: 'opt-1',
        name: 'Series B Startup (Senior Dev)',
        tagline: 'High equity upside, accelerated leadership velocity, fast-paced ambiguity',
        colorAccent: 'indigo',
        score: 84,
        pros: [
          {
            id: 'p1',
            point: 'Immediate Senior title & technical leadership scope',
            explanation: 'You will own architecture and end-to-end features rather than micro-services.',
            weight: 5,
            category: 'Career Growth'
          },
          {
            id: 'p2',
            point: 'Substantial equity grant with 3x-8x exit potential',
            explanation: 'Stock options grant could be life-changing if company continues 80% YoY revenue growth.',
            weight: 4,
            category: 'Financial'
          },
          {
            id: 'p3',
            point: 'High visibility and direct access to C-suite',
            explanation: 'Zero bureaucracy; ideas can go from whiteboard to production within 48 hours.',
            weight: 4,
            category: 'Autonomy'
          },
          {
            id: 'p4',
            point: 'Steep learning curve across full stack & infrastructure',
            explanation: 'Forces rapid mastery of resilient architectures, CI/CD, and product prioritization.',
            weight: 4,
            category: 'Skill Building'
          }
        ],
        cons: [
          {
            id: 'c1',
            point: 'Lower cash liquid base salary (-15%)',
            explanation: 'Base cash is lower than big tech total compensation until liquidity event.',
            weight: 3,
            category: 'Financial',
            mitigation: 'Budget against base salary alone; treat equity as a bonus lottery multiplier.'
          },
          {
            id: 'c2',
            point: 'Higher stress and fluctuating working hours (45-55 hrs/wk)',
            explanation: 'On-call rotations and sprint deadlines are significantly more intense.',
            weight: 4,
            category: 'Lifestyle',
            mitigation: 'Set hard boundaries on weekend Slack notifications and take compensatory recovery days.'
          },
          {
            id: 'c3',
            point: 'Runway dependency and startup market risk',
            explanation: 'Startup has 22 months of cash runway before requiring next funding round.',
            weight: 4,
            category: 'Risk',
            mitigation: 'Your 8-month emergency fund cushions personal downside; high market demand for senior devs protects hireability.'
          }
        ],
        swot: {
          strengths: [
            'Ownership of critical payment pipelines',
            'Flat hierarchy and zero red tape',
            'Nimble, modern tech stack (Node, Go, React, Kafka)'
          ],
          weaknesses: [
            'Documentation and tooling is sparse',
            'Fragmented on-call coverage across 6 engineers',
            'Fewer internal senior mentors than FAANG'
          ],
          opportunities: [
            'Fast-track to Engineering Manager / Staff in 18 months',
            'Establish reputation in high-growth FinTech niche',
            'Acquire early employee liquidity during secondary sales'
          ],
          threats: [
            'FinTech macro regulatory headwinds and higher interest rates',
            'Possibility of equity dilution in down-rounds',
            'Burnout risk if founder changes direction erratically'
          ]
        }
      },
      {
        id: 'opt-2',
        name: 'Stay at Big Tech (Mid-Level)',
        tagline: 'Top-tier liquid compensation, structured mentorship, predictable 38-hour work weeks',
        colorAccent: 'emerald',
        score: 79,
        pros: [
          {
            id: 'p5',
            point: 'Premium liquid compensation ($185k base + $60k RSUs)',
            explanation: 'Guaranteed public stock vesting every quarter regardless of market pivots.',
            weight: 5,
            category: 'Financial'
          },
          {
            id: 'p6',
            point: 'Outstanding work-life harmony and predictable cadence',
            explanation: 'Rarely exceed 40 hours/week; generous PTO and parental leave policies.',
            weight: 5,
            category: 'Lifestyle'
          },
          {
            id: 'p7',
            point: 'Resilient brand name on resume forever',
            explanation: 'Having 4+ years at a top-tier tech firm establishes baseline credibility.',
            weight: 4,
            category: 'Career Growth'
          },
          {
            id: 'p8',
            point: 'World-class internal infrastructure & dedicated SRE teams',
            explanation: 'Low cognitive load on DevOps; top tooling, linters, and testing suites.',
            weight: 3,
            category: 'Day-to-day'
          }
        ],
        cons: [
          {
            id: 'c4',
            point: 'Slower promotional cadence & committee roadblocks',
            explanation: 'Promo packet requires 3 cross-functional directors and 12-18 month lead time.',
            weight: 4,
            category: 'Career Growth',
            mitigation: 'Identify high-visibility org initiatives and seek an executive sponsor.'
          },
          {
            id: 'c5',
            point: 'Constrained scope on narrow slice of product',
            explanation: 'Work is limited to internal widgets or minor feature iterations.',
            weight: 4,
            category: 'Fulfillment',
            mitigation: 'Build side projects or open-source tools to satisfy creative urge.'
          },
          {
            id: 'c6',
            point: 'Corporate re-org vulnerability & potential phantom layoffs',
            explanation: 'Re-organizations can wipe out projects and delay promo cycles unexpectedly.',
            weight: 3,
            category: 'Risk',
            mitigation: 'Stay close to core profit-generating revenue lines rather than moonshot labs.'
          }
        ],
        swot: {
          strengths: [
            'Deep financial reserves and job stability',
            'Mature engineering standards and elite code review culture',
            'Abundant internal mobility options across 200+ teams'
          ],
          weaknesses: [
            'Analysis paralysis and multi-month consensus building',
            'Legacy internal frameworks that don’t translate outside',
            'Diminishing marginal learning returns'
          ],
          opportunities: [
            'Lateral transfer to high-priority AI/ML infrastructure group',
            'Accumulate substantial investment capital to invest in index funds',
            'Maintain space for personal passions, health, and family'
          ],
          threats: [
            'Golden handcuffs complacency anchoring career trajectory',
            'Surprise departmental budget cuts or hiring freezes',
            'Falling behind modern open-source stack velocity'
          ]
        }
      }
    ],
    criteria: [
      {
        id: 'crit-1',
        name: 'Career Acceleration & Velocity',
        description: 'Speed to reaching Tech Lead / Staff scope and autonomy',
        defaultWeight: 5
      },
      {
        id: 'crit-2',
        name: 'Immediate Financial Security',
        description: 'Predictable cash flow, liquid stock, and safety buffer',
        defaultWeight: 4
      },
      {
        id: 'crit-3',
        name: 'Work-Life Balance & Health',
        description: 'Manageable stress, predictable hours, mental well-being',
        defaultWeight: 3
      },
      {
        id: 'crit-4',
        name: 'Long-term Upside Potential',
        description: 'Outsized equity returns, executive network, brand leverage',
        defaultWeight: 4
      },
      {
        id: 'crit-5',
        name: 'Reversibility of Decision',
        description: 'Ease of returning or pivoting if this path disappoints',
        defaultWeight: 4
      }
    ],
    matrixRatings: {
      'opt-1': {
        'crit-1': { score: 9, rationale: 'Direct trajectory to Senior/Lead title with broad system architecture ownership.' },
        'crit-2': { score: 6, rationale: 'Cash compensation is decent, but unvested private options lack immediate liquidity.' },
        'crit-3': { score: 5, rationale: 'Demanding on-call sprints and startup urgency require tighter stress management.' },
        'crit-4': { score: 9, rationale: 'If the company executes well, equity return and founder network provide immense upside.' },
        'crit-5': { score: 8, rationale: 'Senior title and startup velocity make you easily hireable back into Big Tech as Senior.' }
      },
      'opt-2': {
        'crit-1': { score: 6, rationale: 'Mid-to-Senior promotion committees are notorious for 12-18 month delays.' },
        'crit-2': { score: 10, rationale: 'Top-tier base plus liquid quarterly RSUs provide unmatched certainty.' },
        'crit-3': { score: 9, rationale: 'Predictable 38-hour weeks, low stress, and clear operational boundaries.' },
        'crit-4': { score: 6, rationale: 'Solid steady growth, but strictly capped upside compared to early equity.' },
        'crit-5': { score: 7, rationale: 'Staying is safe, but staying too long at Mid-level can create perceived stagnation.' }
      }
    },
    verdict: {
      winnerId: 'opt-1',
      winnerName: 'Series B Startup (Senior Dev)',
      confidenceLevel: 'decisive',
      bottomLine: 'Take the Startup Offer. Your 8 months of savings and 4 years of solid big-tech experience mean you have already de-risked your baseline. The marginal value of another year as mid-level is far lower than the compounding value of senior ownership.',
      decidingFactor: 'Do you want to optimize for wealth preservation (Big Tech) or career leverage & velocity (Startup)? At your current career stage, ownership compounds fastest.',
      ifThenRules: [
        {
          condition: 'If your primary stress trigger is financial volatility or you have upcoming major obligations within 12 months',
          recommendedOption: 'Stay at Big Tech to lock in liquid RSUs and steady certainty.'
        },
        {
          condition: 'If you feel your learning curve has plateaued and you want to reach Staff/Lead within 3 years',
          recommendedOption: 'Accept the Startup offer immediately to accelerate your ownership.'
        },
        {
          condition: 'If you take the startup and it fails within 18 months',
          recommendedOption: 'You still emerge with a Senior Engineer title and can boomerang back into big tech at an upgraded level.'
        }
      ],
      blindSpots: [
        'Sunk cost fallacy: Staying at your current job feels "free" and low risk, but the hidden cost is 2 years of stunted learning velocity.',
        'Illiquid equity over-optimism: Model your budget assuming the options are worth zero cash today; never count unvested private paper wealth as spendable income.',
        'Asymmetric reversibility: It is far easier to return to Big Tech as an ex-startup Senior Dev than it is to get promoted through internal Big Tech committees.'
      ],
      ruleOf10: {
        tenMinutes: 'You will feel a surge of nervous excitement signing the offer, mixed with brief fear of leaving your comfort zone.',
        tenMonths: 'You will have shipped multiple production microservices, gained noticeable architectural confidence, and established credibility with the leadership team.',
        tenYears: 'Whether the startup achieves an IPO or gets acquired, the leadership muscle and network will have permanently shifted your career ceiling upward.'
      }
    }
  },
  {
    id: 'sample-rent-vs-buy',
    title: 'Buy a $650k Suburban Home vs Continue Renting Urban Apartment & Investing Surplus',
    summary: 'A critical financial and lifestyle crossroads between property ownership, forced equity savings, and stability versus geographical mobility, liquid capital compounding, and zero maintenance friction.',
    userContext: 'Married couple, 32 years old, $140k saved for down payment, remote work flexibility, planning kids in 2-3 years.',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    options: [
      {
        id: 'opt-1',
        name: 'Buy Suburban Home ($650k)',
        tagline: 'Rooted community, physical asset ownership, hedge against inflation',
        colorAccent: 'amber',
        score: 81,
        pros: [
          {
            id: 'p10',
            point: 'Fixed mortgage payment locks in housing expense',
            explanation: 'Protects against rising city rental rates over the next 10-30 years.',
            weight: 4,
            category: 'Financial'
          },
          {
            id: 'p11',
            point: 'Spacious yard, storage, and preparation for family',
            explanation: '3-bedroom layout ready for nursery, home offices, and pets with zero landlord friction.',
            weight: 5,
            category: 'Lifestyle'
          },
          {
            id: 'p12',
            point: 'Forced wealth accumulation via principal paydown',
            explanation: 'Every monthly mortgage installment builds real equity rather than paying landlord debt.',
            weight: 4,
            category: 'Financial'
          }
        ],
        cons: [
          {
            id: 'c10',
            point: 'Liquidity drain: down payment and closing costs consume $130k',
            explanation: 'Leaves only $10k emergency buffer unless aggressively replenished.',
            weight: 5,
            category: 'Financial',
            mitigation: 'Maintain a dedicated home repair line of credit and rebuild cash reserves in year 1.'
          },
          {
            id: 'c11',
            point: 'Hidden ownership costs (property tax, HOA, maintenance 1-2%/yr)',
            explanation: 'Roof, HVAC, lawn maintenance, and insurance add $800-$1,200/mo over base mortgage.',
            weight: 4,
            category: 'Financial',
            mitigation: 'Conduct rigorous home inspection and budget $10k escrow for unexpected repairs.'
          },
          {
            id: 'c12',
            point: 'Geographic lock-in and high transaction friction to sell',
            explanation: 'Selling costs 6-8% in realtor and closing fees; breakeven requires 5-7 years.',
            weight: 3,
            category: 'Mobility',
            mitigation: 'Only buy if fully committed to residing in the area for a minimum 6-year window.'
          }
        ],
        swot: {
          strengths: ['Physical security and autonomy', 'Tax deductions on mortgage interest', 'Ample space for remote offices'],
          weaknesses: ['Substantial cash outlay reduces emergency liquidity', 'Time spent on yard and DIY maintenance', 'Commute distance to urban cultural centers'],
          opportunities: ['Long-term real estate appreciation in top school district', 'Option to convert into rental property in 8 years', 'Building lasting neighborhood friendships'],
          threats: ['Local property tax reassessments increasing escrow', 'Higher interest rate environment', 'Potential drop in home prices if regional market softens']
        }
      },
      {
        id: 'opt-2',
        name: 'Rent & Aggressively Invest Surplus',
        tagline: 'Maximum cash liquidity, geographic freedom, zero maintenance overhead',
        colorAccent: 'cyan',
        score: 77,
        pros: [
          {
            id: 'p13',
            point: 'Peak liquid flexibility and $140k compounding in index funds',
            explanation: 'Invested at 8% average return, $140k grows to $300k+ over 9 years with zero leverage risk.',
            weight: 5,
            category: 'Financial'
          },
          {
            id: 'p14',
            point: 'Zero maintenance headaches or surprise repair bills',
            explanation: 'Leaking pipe or broken appliance is resolved with a single text to building management.',
            weight: 4,
            category: 'Peace of Mind'
          },
          {
            id: 'p15',
            point: 'Walkable urban lifestyle and shorter commute',
            explanation: 'Immediate proximity to cafes, gyms, dining, and cultural events.',
            weight: 4,
            category: 'Lifestyle'
          }
        ],
        cons: [
          {
            id: 'c13',
            point: 'Annual rent inflation and lease renewal instability',
            explanation: 'Landlord can raise rent 5-10% or decide to sell the unit at the end of the lease.',
            weight: 4,
            category: 'Stability',
            mitigation: 'Negotiate 2-year leases or rent in professionally managed institutional buildings.'
          },
          {
            id: 'c14',
            point: 'Suboptimal space constraints for future children',
            explanation: '2-bedroom apartment becomes crowded once a toddler and remote desks collide.',
            weight: 4,
            category: 'Family Planning',
            mitigation: 'Plan to transition to a rental townhouse once child reaches 18 months.'
          }
        ],
        swot: {
          strengths: ['Total liquidity and agile capital allocation', 'Freedom to relocate anytime on 30-day notice', 'Minimal domestic chores'],
          weaknesses: ['Zero equity accumulation from monthly rent check', 'Restrictions on pets, painting, and modifications', 'Suburban school access is harder'],
          opportunities: ['Opportunity to buy during a prospective housing market correction', 'Invest in high-yield dividend/index portfolios', 'Move freely if better career opportunity opens'],
          threats: ['Rising rental market outpacing wages', 'Risk of emotional burnout if feeling unsettled in rental', 'Missing out on property appreciation']
        }
      }
    ],
    criteria: [
      { id: 'crit-1', name: 'Net Wealth in 10 Years', description: 'Projected net worth accounting for equity vs stock market returns', defaultWeight: 5 },
      { id: 'crit-2', name: 'Family & Lifestyle Readiness', description: 'Space, comfort, and readiness for children in 2-3 years', defaultWeight: 5 },
      { id: 'crit-3', name: 'Cash Flow & Emergency Buffer', description: 'Protection against medical, career, or unexpected cash shocks', defaultWeight: 4 },
      { id: 'crit-4', name: 'Peace of Mind & Low Stress', description: 'Absence of home repair burdens vs landlord volatility', defaultWeight: 3 },
      { id: 'crit-5', name: 'Mobility & Optionality', description: 'Ability to pivot or relocate for career or lifestyle', defaultWeight: 3 }
    ],
    matrixRatings: {
      'opt-1': {
        'crit-1': { score: 8, rationale: 'Leveraged property in prime school zone provides solid compounding equity.' },
        'crit-2': { score: 9, rationale: 'Dedicated nursery, private yard, and family-oriented neighborhood.' },
        'crit-3': { score: 6, rationale: 'Closing costs eat down payment, requiring disciplined emergency replenishment.' },
        'crit-4': { score: 7, rationale: 'Freedom from landlord is great, but replacing water heaters is stressful.' },
        'crit-5': { score: 5, rationale: 'Transaction costs mean selling before year 5 guarantees a loss.' }
      },
      'opt-2': {
        'crit-1': { score: 8, rationale: 'Keeping $140k in equity indices with monthly surplus delivers comparable wealth.' },
        'crit-2': { score: 6, rationale: 'Workable today, but will feel tight and noisy once kids arrive.' },
        'crit-3': { score: 9, rationale: 'Full $140k cash cushion preserves extreme financial resilience.' },
        'crit-4': { score: 8, rationale: 'Zero home repair duties, but minor anxiety around lease renewals.' },
        'crit-5': { score: 9, rationale: 'Can move across town or across the country at the end of any lease.' }
      }
    },
    verdict: {
      winnerId: 'opt-1',
      winnerName: 'Buy Suburban Home ($650k)',
      confidenceLevel: 'moderate',
      bottomLine: 'Proceed with the purchase, but negotiate seller credits to preserve at least $25k in liquid emergency savings. Because children are planned within 2-3 years and your horizon is 7+ years, the stability and space premium vastly outweigh the flexibility of renting.',
      decidingFactor: 'Is your planning horizon strictly greater than 5 years? If yes, the suburban home establishes stability before the newborn transition.',
      ifThenRules: [
        { condition: 'If buying leaves you with less than $20k in liquid reserves after closing', recommendedOption: 'Rent for 1 more year to build an extra $25k cash cushion before purchasing.' },
        { condition: 'If you are confident you will stay in this metro area for at least 6 years', recommendedOption: 'Buy now to avoid moving twice during newborn infancy.' }
      ],
      blindSpots: [
        'Moving with an infant is 10x harder than moving while child-free; waiting to buy until baby arrives is notoriously exhausting.',
        'Don’t compare rent directly to mortgage: Add 35% to mortgage for taxes, insurance, and routine replacement capital expenditures.'
      ],
      ruleOf10: {
        tenMinutes: 'Initial hesitation wire-transferring the earnest deposit, followed by excitement decorating.',
        tenMonths: 'Settled into the suburban neighborhood with dedicated home offices and a guest room.',
        tenYears: 'Your child is 7-8 years old in the neighborhood elementary school with significant home equity built up.'
      }
    }
  }
];
