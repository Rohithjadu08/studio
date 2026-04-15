
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
  prompt: `You are an expert fact-checker. Analyze the following news article for credibility.
  
  Identify misinformation indicators (e.g., clickbait, logical fallacies, lack of sources) and provide a detailed report.
  
  Article Text: {{{articleText}}}

  IMPORTANT: Return your response ONLY as a valid JSON object with the following fields:
  - credibilityScore (number, 0 to 1)
  - fakeNewsIndicators (array of strings)
  - factCheckingReport (string)

  Do not include markdown formatting or any other text.`,
});

export async function analyzeNewsContent(input: AnalyzeNewsContentInput): Promise<AnalyzeNewsContentOutput> {
  const response = await analyzeNewsContentPrompt(input);
  const rawText = response.text;
  try {
    const jsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonText) as AnalyzeNewsContentOutput;
  } catch (e) {
    console.error("AI returned invalid JSON:", rawText);
    throw new Error("The AI failed to provide a valid report. Please try again.");
  }
}
