
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

  IMPORTANT: Return your response ONLY as a raw JSON object. Do not include markdown code blocks like \`\`\`json.
  Expected JSON structure:
  {
    "credibilityScore": number (0.0 to 1.0),
    "fakeNewsIndicators": ["indicator 1", "indicator 2"],
    "factCheckingReport": "Detailed text report here"
  }`,
});

export async function analyzeNewsContent(input: AnalyzeNewsContentInput): Promise<AnalyzeNewsContentOutput> {
  const response = await analyzeNewsContentPrompt(input);
  const rawText = response.text;
  
  try {
    // Robust JSON extraction
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    const cleanJson = jsonMatch[0].replace(/\\n/g, ' ').trim();
    return JSON.parse(cleanJson) as AnalyzeNewsContentOutput;
  } catch (e) {
    console.error("AI returned invalid JSON:", rawText);
    throw new Error("Failed to parse analysis report. The AI response was not in the expected format.");
  }
}
