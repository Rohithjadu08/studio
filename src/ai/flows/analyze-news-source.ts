
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
  reliabilityScore: z.number(),
  biasAssessment: z.string(),
  ownershipInformation: z.string(),
  factCheckingReputation: z.string(),
});
export type AnalyzeNewsSourceOutput = z.infer<typeof AnalyzeNewsSourceOutputSchema>;

const analyzeNewsSourcePrompt = ai.definePrompt({
  name: 'analyzeNewsSourcePrompt',
  input: { schema: AnalyzeNewsSourceInputSchema },
  prompt: `Analyze the following news source URL for its reliability, bias, and ownership.
  
  URL: {{{sourceUrl}}}

  IMPORTANT: Return your response ONLY as a raw JSON object. Do not include markdown code blocks.
  Expected JSON structure:
  {
    "reliabilityScore": number (0.0 to 1.0),
    "biasAssessment": "string",
    "ownershipInformation": "string",
    "factCheckingReputation": "string"
  }`,
});

export async function analyzeNewsSource(input: AnalyzeNewsSourceInput): Promise<AnalyzeNewsSourceOutput> {
  const response = await analyzeNewsSourcePrompt(input);
  const rawText = response.text;
  
  try {
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    return JSON.parse(jsonMatch[0]) as AnalyzeNewsSourceOutput;
  } catch (e) {
    console.error("AI returned invalid JSON for source:", rawText);
    throw new Error("Failed to analyze news source. The AI response was not in the expected format.");
  }
}
