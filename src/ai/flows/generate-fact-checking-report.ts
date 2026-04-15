
'use server';

/**
 * @fileOverview Generates a detailed fact-checking report for a news article.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateFactCheckingReportInputSchema = z.object({
  newsArticle: z.string().describe('The news article content to be analyzed.'),
});
export type GenerateFactCheckingReportInput = z.infer<typeof GenerateFactCheckingReportInputSchema>;

const GenerateFactCheckingReportOutputSchema = z.object({
  factCheckingReport: z.string().describe('A detailed fact-checking report.'),
});
export type GenerateFactCheckingReportOutput = z.infer<typeof GenerateFactCheckingReportOutputSchema>;

const generateFactCheckingReportPrompt = ai.definePrompt({
  name: 'generateFactCheckingReportPrompt',
  input: { schema: GenerateFactCheckingReportInputSchema },
  output: { schema: GenerateFactCheckingReportOutputSchema },
  prompt: `You are an expert fact-checker. Analyze the following news article and generate a detailed report highlighting any false or misleading information. 

News Article:
{{{newsArticle}}}`,
});

export async function generateFactCheckingReport(input: GenerateFactCheckingReportInput): Promise<GenerateFactCheckingReportOutput> {
  const { output } = await generateFactCheckingReportPrompt(input);
  if (!output) {
    throw new Error("AI failed to generate the fact-checking report.");
  }
  return output;
}
