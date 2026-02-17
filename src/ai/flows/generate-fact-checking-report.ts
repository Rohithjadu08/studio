'use server';

/**
 * @fileOverview Generates a detailed fact-checking report for a news article, highlighting any false or misleading information.
 *
 * - generateFactCheckingReport - A function that generates the fact-checking report.
 * - GenerateFactCheckingReportInput - The input type for the generateFactCheckingReport function.
 * - GenerateFactCheckingReportOutput - The return type for the generateFactCheckingReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFactCheckingReportInputSchema = z.object({
  newsArticle: z
    .string()
    .describe('The news article content to be analyzed for fact-checking.'),
});
export type GenerateFactCheckingReportInput = z.infer<
  typeof GenerateFactCheckingReportInputSchema
>;

const GenerateFactCheckingReportOutputSchema = z.object({
  factCheckingReport: z
    .string()
    .describe(
      'A detailed report highlighting any false or misleading information found in the news article.'
    ),
});
export type GenerateFactCheckingReportOutput = z.infer<
  typeof GenerateFactCheckingReportOutputSchema
>;

export async function generateFactCheckingReport(
  input: GenerateFactCheckingReportInput
): Promise<GenerateFactCheckingReportOutput> {
  return generateFactCheckingReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFactCheckingReportPrompt',
  input: {schema: GenerateFactCheckingReportInputSchema},
  prompt: `You are an expert fact-checker. Analyze the following news article and generate a detailed report highlighting any false or misleading information. Be specific and provide evidence for your claims.

News Article:
{{{newsArticle}}}

You MUST respond with a valid JSON object only, without any markdown formatting or other text.`,
});

const generateFactCheckingReportFlow = ai.defineFlow(
  {
    name: 'generateFactCheckingReportFlow',
    inputSchema: GenerateFactCheckingReportInputSchema,
    outputSchema: GenerateFactCheckingReportOutputSchema,
  },
  async input => {
    const response = await prompt(input);
    const rawText = response.text;
    try {
      const jsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(jsonText);
      return GenerateFactCheckingReportOutputSchema.parse(parsed);
    } catch (e) {
      console.error("Failed to parse JSON from model output:", { rawText, error: e });
      throw new Error("The AI returned data in an unexpected format.");
    }
  }
);
