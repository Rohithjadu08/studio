// src/ai/flows/analyze-news-content.ts
'use server';

/**
 * @fileOverview Analyzes news article text to identify potential fake news indicators.
 *
 * - analyzeNewsContent - A function that analyzes news content.
 * - AnalyzeNewsContentInput - The input type for the analyzeNewsContent function.
 * - AnalyzeNewsContentOutput - The return type for the analyzeNewsContent function.
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
    .describe(
      'A score between 0 and 1 representing the credibility of the news article.  A score of 1 represents perfect credibility and a score of 0 represents no credibility.'
    ),
  fakeNewsIndicators: z
    .array(z.string())
    .describe('A list of potential fake news indicators found in the article.'),
  factCheckingReport: z.string().describe('A detailed fact-checking report of the article.'),
});

export type AnalyzeNewsContentOutput = z.infer<typeof AnalyzeNewsContentOutputSchema>;

export async function analyzeNewsContent(input: AnalyzeNewsContentInput): Promise<AnalyzeNewsContentOutput> {
  return analyzeNewsContentFlow(input);
}

const analyzeNewsContentPrompt = ai.definePrompt({
  name: 'analyzeNewsContentPrompt',
  input: {schema: AnalyzeNewsContentInputSchema},
  prompt: `You are an AI trained to detect fake news.  Analyze the following news article and identify any potential fake news indicators.

Article Text: {{{articleText}}}

Provide a credibility score between 0 and 1. 1 is very credible, 0 is not credible.
List out the fake news indicators.
Create a detailed fact-checking report.

You MUST respond with a valid JSON object only, without any markdown formatting or other text.
`,
});

const analyzeNewsContentFlow = ai.defineFlow(
  {
    name: 'analyzeNewsContentFlow',
    inputSchema: AnalyzeNewsContentInputSchema,
    outputSchema: AnalyzeNewsContentOutputSchema,
  },
  async input => {
    const response = await analyzeNewsContentPrompt(input);
    const rawText = response.text;
    try {
      const jsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(jsonText);
      return AnalyzeNewsContentOutputSchema.parse(parsed);
    } catch (e) {
      console.error("Failed to parse JSON from model output:", { rawText, error: e });
      throw new Error("The AI returned data in an unexpected format.");
    }
  }
);
