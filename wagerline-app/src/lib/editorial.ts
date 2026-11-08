export const editorial=[
 {slug:'reading-probabilities',title:'Reading match probabilities without false certainty',description:'A practical guide to uncertainty, calibration and model limits.',paragraphs:[
 'A probability is a distribution of possible results, not a promise. A team with the largest win probability can still have less than a fifty percent chance of winning. Compare all outcomes together rather than treating the leading number as a certainty.',
 'A useful forecast must be evaluated on matches that were not used to fit it. WAGERline uses chronological evaluation and a league baseline before publishing its statistical model. Strong results on a small sample may not generalize to a different competition or season.',
 'Model probabilities and market prices answer different questions. Prices may contain a bookmaker margin and reflect a different update time. WAGERline does not fill absent odds with invented numbers; a missing price is not evidence of value.',
 'Use the model version and generation time alongside the fixture record. Schedule changes, missing history and delayed provider corrections can affect what a forecast represents. Keep your own selection separate from the statistical estimate, and review performance over many outcomes rather than one result.'
 ]},
 {slug:'comparing-form',title:'Comparing team form with a fair cutoff',description:'How sample size, fixture timing and score coverage affect form comparisons.',paragraphs:[
 'Start with a fixed cutoff: the scheduled start of the fixture you are analyzing. Results played after that point must not enter its preview. The WAGERline form module selects completed canonical matches before the fixture and leaves out records with missing scores.',
 'A five-match record is a small description of recent outcomes. Three wins against one set of opponents cannot be treated as equivalent to three wins against a different set. Home advantage, travel, competition format and lineup changes are not captured by a simple win-draw-loss summary.',
 'Compare the sample counts before comparing totals. A team with two eligible records should not look weaker merely because its opponent has five. The linked underlying matches let you inspect dates and scores instead of relying on an unexplained form badge.',
 'Scored and conceded totals describe the recorded sample, not season-wide quality. If there is no eligible history, the interface says so. A blank or unavailable sample should never be converted into five defeats or zero lifetime goals.'
 ]},
 {slug:'understanding-source-updates',title:'Scores, missing data and provider corrections',description:'Reading fixture status and freshness without mistaking missing data for zero.',paragraphs:[
 'A fixture, a score and a detailed event timeline can arrive through separate provider requests. A match card may have a confirmed final score while its lineup or player statistics are still unavailable. Those fields should be interpreted independently.',
 'The displayed record update time describes the stored data. It does not promise that the upstream provider observed the event at that exact instant. Pages may use a short cache, and live feeds can be delayed or corrected.',
 'Zero is a value; unavailable is a state. A missing goal count, appearance record or price should not silently become zero. This distinction matters when comparing athletes, calculating form and interpreting model input.',
 'Provider identifiers and verified aliases help prevent the same match or team from being counted twice. Corrections can also change result settlement and reward ledgers. Follow the linked match record and source methodology when a value changes, and consult the original publisher for imported news reporting.'
 ]}
] as const
export const editorialDate='2026-11-07'
