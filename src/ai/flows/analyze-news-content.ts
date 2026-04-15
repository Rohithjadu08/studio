
'use server';

/**
 * @fileOverview Analyzes news article text to identify potential fake news indicators.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeNewsContentInputSchema = z.object({
  articleText: z.string().describe('The text content of the news article to analyze.'),
});

export type AnalyzeNewsContentInput = z.infer<typeof AnalyzeNewsContentInputSchema>;

const AnalyzeNewsContentOutputSchema = z.object({
  credibilityScore: z.number(),
  fakeNewsIndicators: z.array(z.string()),
  factCheckingReport: z.string(),
});

export type AnalyzeNewsContentOutput = z.infer<typeof AnalyzeNewsContentOutputSchema>;

const analyzeNewsContentPrompt = ai.definePrompt({
  name: 'analyzeNewsContentPrompt',
  input: { schema: AnalyzeNewsContentInputSchema },
  output: { schema: AnalyzeNewsContentOutputSchema },
  prompt: `You are an expert fact-checker. Analyze the following news article for credibility.
  
  Identify misinformation indicators (e.g., clickbait, logical fallacies, lack of sources) and provide a detailed report.
  
  Article Text: {{{articleText}}}`,
});

export async function analyzeNewsContent(input: AnalyzeNewsContentInput): Promise<AnalyzeNewsContentOutput> {
  const { output } = await analyzeNewsContentPrompt(input);
  if (!output) {
    throw new Error("Failed to generate content analysis.");
  }
  return output;
}
