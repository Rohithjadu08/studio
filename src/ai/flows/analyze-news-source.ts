
'use server';

/**
 * @fileOverview Analyzes the source of a news article.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeNewsSourceInputSchema = z.object({
  sourceUrl: z.string().url().describe('The URL of the news source to analyze.'),
});
export type AnalyzeNewsSourceInput = z.infer<typeof AnalyzeNewsSourceInputSchema>;

const AnalyzeNewsSourceOutputSchema = z.object({
  reliabilityScore: z.number().describe('Reliability score from 0.0 to 1.0.'),
  biasAssessment: z.string().describe('Assessment of the sources potential bias.'),
  ownershipInformation: z.string().describe('Information about who owns the source.'),
  factCheckingReputation: z.string().describe('The sources reputation for fact-checking.'),
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
    throw new Error("AI failed to generate a source analysis report.");
  }
  return output;
}
