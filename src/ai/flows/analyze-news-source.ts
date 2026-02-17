'use server';

/**
 * @fileOverview Analyzes the source of a news article to provide insights into its reliability and potential bias.
 *
 * - analyzeNewsSource - A function that analyzes the source of a news article.
 * - AnalyzeNewsSourceInput - The input type for the analyzeNewsSource function.
 * - AnalyzeNewsSourceOutput - The return type for the analyzeNewsSource function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeNewsSourceInputSchema = z.object({
  sourceUrl: z
    .string()
    .url()
    .describe('The URL of the news source to analyze.'),
});
export type AnalyzeNewsSourceInput = z.infer<typeof AnalyzeNewsSourceInputSchema>;

const AnalyzeNewsSourceOutputSchema = z.object({
  reliabilityScore: z
    .number()
    .min(0)
    .max(1)
    .describe(
      'A score between 0 and 1 indicating the reliability of the news source, where 0 is least reliable and 1 is most reliable.'
    ),
  biasAssessment: z
    .string()
    .describe(
      'An assessment of any potential bias in the news source, including political leaning, funding sources, and history of factual reporting.'
    ),
  ownershipInformation: z
    .string()
    .describe(
      'Information about the ownership and funding of the news source, including parent companies, major investors, and known affiliations.'
    ),
  factCheckingReputation: z
    .string()
    .describe(
      'An overview of the news source fact-checking reputation based on third-party assessments and reports.'
    ),
});
export type AnalyzeNewsSourceOutput = z.infer<typeof AnalyzeNewsSourceOutputSchema>;

export async function analyzeNewsSource(
  input: AnalyzeNewsSourceInput
): Promise<AnalyzeNewsSourceOutput> {
  return analyzeNewsSourceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeNewsSourcePrompt',
  input: {schema: AnalyzeNewsSourceInputSchema},
  prompt: `You are an AI assistant that analyzes the reliability and potential bias of a news source.

  Analyze the following news source URL:
  {{{sourceUrl}}}

  Provide a reliability score between 0 and 1, an assessment of potential bias, ownership information, and the fact-checking reputation of the source.
  
  You MUST respond with a valid JSON object only, without any markdown formatting or other text.
  `,
});

const analyzeNewsSourceFlow = ai.defineFlow(
  {
    name: 'analyzeNewsSourceFlow',
    inputSchema: AnalyzeNewsSourceInputSchema,
    outputSchema: AnalyzeNewsSourceOutputSchema,
  },
  async input => {
    const response = await prompt(input);
    const rawText = response.text;
    try {
      const jsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(jsonText);
      return AnalyzeNewsSourceOutputSchema.parse(parsed);
    } catch (e) {
      console.error("Failed to parse JSON from model output:", { rawText, error: e });
      throw new Error("The AI returned data in an unexpected format.");
    }
  }
);
