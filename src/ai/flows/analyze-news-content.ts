
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
  credibilityScore: z.number().describe('Score from 0.0 to 1.0 representing the credibility of the article.'),
  fakeNewsIndicators: z.array(z.string()).describe('List of specific indicators of misinformation or fake news.'),
  factCheckingReport: z.string().describe('A detailed text report explaining the analysis.'),
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
    throw new Error("AI failed to generate a content analysis report.");
  }
  return output;
}
