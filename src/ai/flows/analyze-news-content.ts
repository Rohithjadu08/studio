'use server';

/**
 * @fileOverview Analyzes news article text to identify potential fake news indicators.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeNewsContentInputSchema = z.object({
  articleText: z.string().describe('The text content of the news article to analyze.'),
});

export type AnalyzeNewsContentInput = z.infer<typeof AnalyzeNewsContentInputSchema>;

const AnalyzeNewsContentOutputSchema = z.object({
  credibilityScore: z
    .number()
    .min(0)
    .max(1)
    .describe('A score between 0 and 1 representing the credibility of the news article.'),
  fakeNewsIndicators: z
    .array(z.string())
    .describe('A list of potential fake news indicators found in the article.'),
  factCheckingReport: z.string().describe('A detailed fact-checking report of the article.'),
});

export type AnalyzeNewsContentOutput = z.infer<typeof AnalyzeNewsContentOutputSchema>;

const analyzeNewsContentPrompt = ai.definePrompt({
  name: 'analyzeNewsContentPrompt',
  input: {schema: AnalyzeNewsContentInputSchema},
  output: {schema: AnalyzeNewsContentOutputSchema},
  prompt: `You are an expert fact-checker. Analyze the following news article for credibility.
  
  Identify misinformation indicators (e.g., clickbait, logical fallacies, lack of sources) and provide a detailed report.
  
  Article Text: {{{articleText}}}`,
});

export async function analyzeNewsContent(input: AnalyzeNewsContentInput): Promise<AnalyzeNewsContentOutput> {
  const {output} = await analyzeNewsContentPrompt(input);
  if (!output) {
    throw new Error("The AI failed to generate an analysis.");
  }
  return output;
}
