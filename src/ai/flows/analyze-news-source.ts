
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
  output: { schema: AnalyzeNewsSourceOutputSchema },
  prompt: `Analyze the following news source URL for its reliability, bias, and ownership.
  
  URL: {{{sourceUrl}}}`,
});

export async function analyzeNewsSource(input: AnalyzeNewsSourceInput): Promise<AnalyzeNewsSourceOutput> {
  const { output } = await analyzeNewsSourcePrompt(input);
  if (!output) {
    throw new Error("Failed to generate source analysis.");
  }
  return output;
}
