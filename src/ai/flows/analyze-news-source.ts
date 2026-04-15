
'use server';

/**
 * @fileOverview Analyzes the source of a news article to provide insights into its reliability and potential bias.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeNewsSourceInputSchema = z.object({
  sourceUrl: z.string().url().describe('The URL of the news source to analyze.'),
});
export type AnalyzeNewsSourceInput = z.infer<typeof AnalyzeNewsSourceInputSchema>;

const AnalyzeNewsSourceOutputSchema = z.object({
  reliabilityScore: z.number(),
  biasAssessment: z.string(),
  ownershipInformation: z.string(),
  factCheckingReputation: z.string(),
});
export type AnalyzeNewsSourceOutput = z.infer<typeof AnalyzeNewsSourceOutputSchema>;

const analyzeNewsSourcePrompt = ai.definePrompt({
  name: 'analyzeNewsSourcePrompt',
  input: { schema: AnalyzeNewsSourceInputSchema },
  prompt: `Analyze the following news source URL for its reliability, bias, and ownership.
  
  URL: {{{sourceUrl}}}

  IMPORTANT: Return your response ONLY as a valid JSON object with the following fields:
  - reliabilityScore (number, 0 to 1)
  - biasAssessment (string)
  - ownershipInformation (string)
  - factCheckingReputation (string)

  Do not include markdown formatting or any other text.`,
});

export async function analyzeNewsSource(input: AnalyzeNewsSourceInput): Promise<AnalyzeNewsSourceOutput> {
  const response = await analyzeNewsSourcePrompt(input);
  const rawText = response.text;
  try {
    const jsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonText) as AnalyzeNewsSourceOutput;
  } catch (e) {
    console.error("AI returned invalid JSON for source:", rawText);
    throw new Error("The AI failed to analyze the source. Please try again.");
  }
}
