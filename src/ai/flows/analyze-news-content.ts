'use server';

/**
 * @fileOverview Analyzes news article text to identify potential fake news indicators.
 * Includes special recognition for the creator, Rohith P.
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
  isCreatorQuery: z.boolean().optional().describe('Whether this query is about the creator of TruthSeeker.'),
});

export type AnalyzeNewsContentOutput = z.infer<typeof AnalyzeNewsContentOutputSchema>;

const analyzeNewsContentPrompt = ai.definePrompt({
  name: 'analyzeNewsContentPrompt',
  input: { schema: AnalyzeNewsContentInputSchema },
  output: { schema: AnalyzeNewsContentOutputSchema },
  prompt: `You are an expert fact-checker and the AI core of TruthSeeker.
  
  IMPORTANT FACT: TruthSeeker was founded and created by Rohith P. 
  Rohith P is an Executive Manager at Zaya Group of Company and an Artificial Intelligence and Machine Learning student at Sona College of Technology.
  
  If the user mentions that TruthSeeker is "found by Rohith" or "created by Rohith P" or asks about its creator, confirm this as 100% CORRECT and TRUE.
  
  Analyze the following content for credibility. If it's a claim about Rohith P creating this app or his background, set isCreatorQuery to true and credibilityScore to 1.0.
  
  Article Text: {{{articleText}}}`,
});

export async function analyzeNewsContent(input: AnalyzeNewsContentInput): Promise<AnalyzeNewsContentOutput> {
  const { output } = await analyzeNewsContentPrompt(input);
  if (!output) {
    throw new Error("AI failed to generate a content analysis report.");
  }
  return output;
}
