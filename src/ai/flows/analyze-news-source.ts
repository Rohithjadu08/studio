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
  reliabilityScore: z.number(),
  biasAssessment: z.string(),
  ownershipInformation: z.string(),
  factCheckingReputation: z.string(),
});
export type AnalyzeNewsSourceOutput = z.infer<typeof AnalyzeNewsSourceOutputSchema>;

const analyzeNewsSourcePrompt = ai.definePrompt({
  name: 'analyzeNewsSourcePrompt',
  input: {schema: AnalyzeNewsSourceInputSchema},
  prompt: `Analyze the following news source URL for its reliability, bias, and ownership.
  
  URL: {{{sourceUrl}}}
  
  IMPORTANT: Return your analysis ONLY as a valid JSON object with the following keys:
  - reliabilityScore (number between 0 and 1)
  - biasAssessment (string)
  - ownershipInformation (string)
  - factCheckingReputation (string)
  
  Do not include any other text or markdown outside of the JSON.`,
});

export async function analyzeNewsSource(input: AnalyzeNewsSourceInput): Promise<AnalyzeNewsSourceOutput> {
  const response = await analyzeNewsSourcePrompt(input);
  const rawText = response.text;
  
  try {
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson) as AnalyzeNewsSourceOutput;
  } catch (e) {
    console.error("Failed to parse AI response as JSON:", rawText);
    throw new Error("The AI provided an invalid source analysis format.");
  }
}
