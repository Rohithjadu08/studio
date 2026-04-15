'use server';

/**
 * @fileOverview Analyzes the source of a news article to provide insights into its reliability and potential bias.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeNewsSourceInputSchema = z.object({
  sourceUrl: z.string().url().describe('The URL of the news source to analyze.'),
});
export type AnalyzeNewsSourceInput = z.infer<typeof AnalyzeNewsSourceInputSchema>;

const AnalyzeNewsSourceOutputSchema = z.object({
  reliabilityScore: z
    .number()
    .min(0)
    .max(1)
    .describe('A score between 0 and 1 indicating the reliability of the news source.'),
  biasAssessment: z.string().describe('Assessment of potential bias.'),
  ownershipInformation: z.string().describe('Information about ownership and funding.'),
  factCheckingReputation: z.string().describe('Overview of the source fact-checking reputation.'),
});
export type AnalyzeNewsSourceOutput = z.infer<typeof AnalyzeNewsSourceOutputSchema>;

const analyzeNewsSourcePrompt = ai.definePrompt({
  name: 'analyzeNewsSourcePrompt',
  input: {schema: AnalyzeNewsSourceInputSchema},
  output: {schema: AnalyzeNewsSourceOutputSchema},
  prompt: `Analyze the following news source URL for its reliability, bias, and ownership.
  
  URL: {{{sourceUrl}}}`,
});

export async function analyzeNewsSource(input: AnalyzeNewsSourceInput): Promise<AnalyzeNewsSourceOutput> {
  const {output} = await analyzeNewsSourcePrompt(input);
  if (!output) {
    throw new Error("The AI failed to generate a source analysis.");
  }
  return output;
}
